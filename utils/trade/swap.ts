import { QuoteResponse } from "@/types/token";
import { BigNumber, ethers } from "ethers";
import { toast } from "react-toastify";
import { getProvider, getSigner } from "../chain";
import { ChainId, Token, TradeType } from "@uniswap/sdk-core";
import { erc20Abi, maxUint160 } from "viem";
import {
  AllowanceProvider,
  AllowanceTransfer,
  PERMIT2_ADDRESS,
} from "@uniswap/permit2-sdk";
import { UNIVERSAL_ROUTER_ADDRESS } from "@uniswap/universal-router-sdk";
import {
  currentTimeInSeconds,
  getPermitStruct,
} from "@/hooks/data/usePermit2Signature";
import { fetchUniswapQuote } from "@/services/useUniswapQuote";
import { pollTransactionReceipt } from "@/services/launchpad/swap";

type Address = string | `0x${string}` | undefined;

interface SwapTokenProps {
  address: Address;
  data?: QuoteResponse;
  callBack?: () => void;
  chainId: number;
}
export const swapToken = async ({
  address,
  data,
  callBack,
  chainId,
}: SwapTokenProps) => {
  const { calldata, to, value } = data?.quote?.methodParameters || {};

  const signer = getSigner();

  const baseEstimatedGas = await signer.estimateGas({
    from: address,
    to,
    data: calldata,
    value,
  });

  const gasLimit = baseEstimatedGas.add(baseEstimatedGas.mul(20).div(100));

  const tx = await signer.sendTransaction({
    from: address,
    to,
    data: calldata,
    value,
    gasLimit,
  });
  // const txRes = await tx.wait();
  const txRes = await pollTransactionReceipt(tx.hash, chainId, 1000);
  if (txRes?.status) {
    toast.success("Swap successful!");
    callBack?.();
  }
};

interface TokenApproveProps {
  token: Token;
  address: Address;
  amount: string;
  chainId: number;
}

export const tokenApprove = async ({
  token,
  address,
  amount,
  chainId,
}: TokenApproveProps) => {
  try {
    const signer = getSigner();
    const tokenContract = new ethers.Contract(token.address, erc20Abi, signer);

    const allowance = await tokenContract.allowance(address, PERMIT2_ADDRESS);
    if (allowance.lt(ethers.utils.parseUnits(amount, token.decimals))) {
      const tx = await tokenContract.approve(
        PERMIT2_ADDRESS,
        ethers.constants.MaxUint256,
      );
      // const res = await tx.wait();
      const receiptApprove = await pollTransactionReceipt(
        tx.hash,
        chainId,
        1000,
      );
      if (receiptApprove.status) {
        toast.success("Approved!");
        return true;
      }
    }
    return true;
  } catch (error) {
    return false;
  }
};

interface Permit2Props {
  token: Token;
  receiveToken: Token;
  chainId: number;
  address: Address;
  amount: string;
  amountPay: string;
  amountReceive: string;
  tradeType: TradeType;
  callBack?: () => void;
  data?: QuoteResponse;
}

export const permit2AndSwap = async ({
  chainId,
  token,
  address,
  amount,
  amountReceive,
  amountPay,
  receiveToken,
  tradeType,
  callBack,
  data,
}: Permit2Props) => {
  const provider = getProvider();
  const signer = provider.getSigner();
  const allowanceProvider = new AllowanceProvider(provider, PERMIT2_ADDRESS);
  const universalRouterAddress = UNIVERSAL_ROUTER_ADDRESS(chainId);
  const {
    amount: permitAmount,
    expiration,
    nonce,
  } = await allowanceProvider.getAllowanceData(
    token.address,
    address as string,
    universalRouterAddress,
  );
  if (
    !(
      amount &&
      !permitAmount.lt(ethers.utils.parseUnits(amount, token.decimals)) &&
      expiration > currentTimeInSeconds()
    )
  ) {
    const permitMessage = getPermitStruct(
      token.address,
      nonce,
      universalRouterAddress,
    );
    const { domain, types, values } = AllowanceTransfer.getPermitData(
      permitMessage,
      PERMIT2_ADDRESS,
      chainId,
    );
    const signature = await signer._signTypedData(domain, types, {
      ...values,
    });
    if (signature) {
      toast.success("Signed!");
    }
    const params = {
      permitSignature: signature,
      permitAmount: BigNumber.from(maxUint160).toString(),
      permitExpiration: BigNumber.from(
        // @ts-ignore
        values?.details?.expiration,
      ).toString(),
      permitSigDeadline: BigNumber.from(values?.sigDeadline).toString(),
      permitNonce: BigNumber.from(nonce).toString(),
    };
    const res = await fetchUniswapQuote({
      recipient: address as string,
      tokenIn: token?.address,
      chainId,
      tokenOut: receiveToken?.address,
      amount: tradeType === TradeType.EXACT_INPUT ? amountPay : amountReceive,
      permit2Params: params,
      type: tradeType,
    });
    await swapToken({
      data: res,
      address,
      callBack,
      chainId,
    });
    return;
  }
  await swapToken({
    data,
    address,
    callBack,
    chainId,
  });
};
