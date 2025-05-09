import { ethers } from "ethers";
import { toast } from "react-toastify";
import { SecondarySwapABI } from "../abi/sec";
import { pollTransactionReceipt } from "@/services/launchpad/swap";
import { SecondarySwapAddress } from "./config";
import { ConnectedWallet } from "@privy-io/react-auth";

interface CallBuy1155Params {
  erc20zAddress: string; // ERC20Z 合约地址
  num1155ToBuy: number; // 要购买的 1155 数量
  chainId: number;
  recipient: string; // 接收代币的地址
  excessRefundRecipient: string; // 多余资金退款地址
  maxEthToSpend: ethers.BigNumberish; // 最大支付的 ETH 数量
  sqrtPriceLimitX96: ethers.BigNumberish; // 价格限制
  wallet: ConnectedWallet;
}

export const callBuy1155 = async ({
  erc20zAddress,
  num1155ToBuy,
  recipient,
  excessRefundRecipient,
  maxEthToSpend,
  sqrtPriceLimitX96,
  chainId,
  wallet,
}: CallBuy1155Params) => {
  if (!wallet?.isConnected) {
    toast.error("No wallet connected.");
    return;
  }

  try {
    const provider = await wallet?.getEthersProvider();

    // 请求用户授权连接钱包
    const accounts = await provider.send("eth_requestAccounts", []);
    if (!accounts.length) {
      console.error("No accounts found");
      toast.error("No Ethereum accounts found");
      return;
    }
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      SecondarySwapAddress,
      SecondarySwapABI,
      signer,
    );
    const maxEthToSpendS = ethers.BigNumber.from(maxEthToSpend)
      .mul(103)
      .div(100);
    console.log(
      erc20zAddress,
      num1155ToBuy,
      recipient,
      excessRefundRecipient,
      maxEthToSpendS?.toString(),
      sqrtPriceLimitX96,
    );

    const tx = await contract.buy1155(
      erc20zAddress,
      num1155ToBuy,
      recipient,
      excessRefundRecipient,
      maxEthToSpendS,
      sqrtPriceLimitX96,
      {
        value: ethers.BigNumber.from(maxEthToSpendS), // 指定支付的 ETH 金额
      },
    );

    console.log("Transaction sent:", tx.hash);
    toast.info("Transaction sent. Waiting for confirmation...");

    // 等待交易确认
    const receipt = await pollTransactionReceipt(tx.hash, chainId, 1000);
    console.log("Transaction Successful:", receipt);
    toast.success("1155 tokens purchased successfully");

    return receipt;
  } catch (err) {
    const errorMessage = (err as any)?.reason || (err as Error).message;
    console.error("Error executing buy1155:", errorMessage);
    toast.error(errorMessage);
  }
};
