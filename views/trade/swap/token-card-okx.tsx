import { Box, CardContent, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChainId, Token, TradeType } from "@uniswap/sdk-core";
import { useActiveToken } from "@/context/hooks/useActiveToken";
import { debounce } from "lodash";
import { ethers } from "ethers";
import {
  calculateMinimumReceivedWithSlippage,
  formatToken,
  formatTokenFixedto,
  formatWei,
  formatWeiNoPrecision,
  safeParseUnits,
} from "@/utils/format";
import { erc20Abi, zeroAddress } from "viem";
import Iconify from "@/components/iconify";
import { ButtonComfirm } from "./button-comfirm";
import FeeInfo from "./fee-info";
import { useQuery } from "@tanstack/react-query";
import { getETHPrice, getTokensPrice } from "@/services/tokens";
import { WETH_ADDRESS } from "@uniswap/universal-router-sdk";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Erc20SellContractAddresses,
  saveOrder,
  useOkxQuote,
} from "@/services/okx/useOkxswapQuoteNew";
import { pollTransactionReceipt } from "@/services/launchpad/swap";
import { toast } from "react-toastify";
import TokenInputOkx from "./token-input-okx";
import PriceInfoOkx from "./price-info-okx";
import { useSelectedChain } from "@/store/atoms/hooks/useSelectedChain";
import fetchMultipleChainBalanceData from "@/services/multiple-chain/balance";
import { BatchBalanceResult } from "@/services/zora/swap/balance404";
import { usePrivy, useWallets } from "@privy-io/react-auth";

interface iTokenCardOkx {
  baseTokens: Token[];
  currentToken: any;
  chainId: number;
  type: "Buy" | "Sell";
  symbol: string;
  erc20Address: string;
  logoUrl?: string;
  initFlag: boolean;
  hasLogo: boolean;
  batchBalance?: BatchBalanceResult;
  setInitFlag: (b: boolean) => void;
}
const TokenCardOkx = ({
  baseTokens,
  currentToken,
  chainId,
  type,
  initFlag,
  setInitFlag,
  symbol,
  erc20Address,
  hasLogo,
  logoUrl,
  batchBalance,
}: iTokenCardOkx) => {
  const { user } = usePrivy();
  const address = useMemo(() => user?.wallet?.address, [user]);
  const { wallets } = useWallets();
  const wallet = useMemo(() => wallets?.[0], [wallets]);
  const [payValue, setPayValue] = useState<string>("");

  const [receiveDebouncedValue, setReceiveDebouncedValue] =
    useState<string>("");
  const [payDebouncedValue, setPayDebouncedValue] = useState<string>("");
  const [tradeType, setTradeType] = useState<TradeType>(TradeType.EXACT_INPUT);
  const [receiveValue, setReceiveValue] = useState<string>("");
  const { activeToken } = useActiveToken(); // Buy => payToken  Sell => receiveToken
  const payToken = useMemo(
    () => (type === "Buy" ? activeToken : currentToken),
    [type, activeToken, currentToken],
  );
  const receiveToken = useMemo(
    () => (type === "Buy" ? currentToken : activeToken),
    [type, activeToken, currentToken],
  );

  const [swapLoading, setSwapLoading] = useState<boolean>(false);

  // const payTokenShowBalance = useMemo(
  //   () =>
  //     payToken?.address === zeroAddress
  //       ? formatWei(nativeBalance)
  //       : formatWei(payTokenBalance?.toString(), payToken.decimals),
  //   [nativeBalance, payTokenBalance, payToken],
  // );
  const payTokenMaxBalance = useMemo(
    () =>
      payToken?.address === zeroAddress
        ? formatWeiNoPrecision(batchBalance?.ethBalance)
        : formatWeiNoPrecision(batchBalance?.erc20Balance, payToken.decimals),
    [batchBalance, payToken],
  );
  // const receiveTokenShowBalance = useMemo(
  //   () =>
  //     receiveToken?.address === zeroAddress
  //       ? formatWei(nativeBalance)
  //       : formatWei(receiveTokenBalance?.toString(), receiveToken.decimals),
  //   [nativeBalance, receiveTokenBalance, receiveToken],
  // );

  const amountPay = useMemo(
    () =>
      safeParseUnits(payDebouncedValue, payToken?.decimals || 18)?.toString(),
    [payDebouncedValue, payToken],
  );
  const amountReceive = useMemo(
    () =>
      safeParseUnits(
        receiveDebouncedValue,
        receiveToken?.decimals || 18,
      )?.toString(),
    [receiveDebouncedValue, receiveToken],
  );
  const { data: tokensPrice } = useQuery({
    queryKey: ["tokensPrice"],
    queryFn: () =>
      getTokensPrice({
        tokenAddresses: [
          payToken.address === zeroAddress
            ? WETH_ADDRESS(chainId)
            : payToken.address,
          receiveToken.address === zeroAddress
            ? WETH_ADDRESS(chainId)
            : receiveToken.address,
        ],
        chainId,
      }),
    enabled: Boolean(chainId),
  });
  const { data: dataPrice } = useQuery({
    queryKey: ["getETHPrice"],
    queryFn: () => getETHPrice(),
  });
  const ethPrice = useMemo(() => dataPrice?.data?.eth_usd, [dataPrice]);
  const {
    data,
    refetch,
    isLoading,
    error: quoteError,
  } = useOkxQuote({
    chainId,
    toChainId: chainId,
    amount: tradeType === TradeType.EXACT_INPUT ? amountPay : amountReceive,
    fromTokenAddress:
      payToken?.address === zeroAddress
        ? "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
        : payToken?.address,
    toTokenAddress:
      receiveToken?.address === zeroAddress
        ? "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
        : receiveToken?.address,
    userWalletAddress: address as string,
    decimals: payToken?.decimals,
  });
  // const {
  //   data: crossData,
  //   // refetch,
  //   // isLoading,
  //   // error: quoteError,
  // } = useBridgeSwapQuote({
  //   chainId,
  //   toChainId: chainId,
  //   amount: tradeType === TradeType.EXACT_INPUT ? amountPay : amountReceive,
  //   fromTokenAddress:
  //     payToken?.address === zeroAddress
  //       ? "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
  //       : payToken?.address,
  //   toTokenAddress:
  //     receiveToken?.address === zeroAddress
  //       ? "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
  //       : receiveToken?.address,
  //   userWalletAddress: address as string,
  // });
  // console.log("crossData", crossData);

  const payload = useMemo(() => {
    if (!data) return null;
    let minimumReceived =
      // @ts-ignore
      data?.data?.singleChainSwapInfo?.minimumReceived || "0";
    let slippage =
      // @ts-ignore
      data?.data?.singleChainSwapInfo?.autoSlippageInfo?.autoSlippage;

    const decimals = data?.data?.commonDexInfo?.toToken?.decimals;

    const minimumReceivedWithSlippageFormatted =
      calculateMinimumReceivedWithSlippage(minimumReceived, slippage, decimals);

    return {
      chainId,
      fromAmount: data?.data?.commonDexInfo?.fromTokenAmount || "0",
      fromTokenAddress:
        data?.data?.commonDexInfo?.fromToken?.tokenContractAddress ||
        "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      fromTokenDecimal: data?.data?.commonDexInfo?.fromToken?.decimals || "18",
      toAmount: calculateMinimumReceivedWithSlippage(
        data?.data?.singleChainSwapInfo?.receiveAmount || "0",
        slippage,
        decimals,
      ),
      toTokenAddress:
        data?.data?.commonDexInfo?.toToken?.tokenContractAddress ||
        "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      toTokenDecimal: data?.data?.commonDexInfo?.toToken?.decimals || "18",
      userWalletAddress: address as string,
      estimateGasFee: data?.data?.singleChainSwapInfo?.estimateGasFee || "0",
      pmm: "1", // Example static value, you can change this dynamically
      gasDropType: 0,
      // @ts-ignore
      minimumReceived: minimumReceivedWithSlippageFormatted,
      // minimumReceived: data?.data?.singleChainSwapInfo?.minimumReceived || "0",
      openMev: false,
      toChainId: chainId, // Adjust this based on your actual logic
      slippage: "0.01",
      // @ts-ignore
      referredAmount: data?.data?.commonDexInfo?.referredAmount || "0",
      feePercent: 1,
      referrerAddress: "0xa975ea5f814b274f77d8335c4024ad3711ef75e4",
      autoSlippageInfo: {
        autoSlippage: "0.01",
      },
      // @ts-ignore
      dexRouterList: data?.data?.singleChainSwapInfo?.dexRouterList || [],
      originDexRouterList:
        // @ts-ignore
        data?.data?.singleChainSwapInfo?.originDexRouterList || [],
    };
  }, [data, chainId, address]);
  const { data: oneTokenData, isLoading: priceLoading } = useOkxQuote({
    chainId,
    toChainId: chainId,
    amount: ethers.utils.parseUnits("1", payToken.decimals).toString(),
    fromTokenAddress:
      payToken?.address === zeroAddress
        ? "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
        : payToken?.address,
    toTokenAddress:
      receiveToken?.address === zeroAddress
        ? "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
        : receiveToken?.address,
    userWalletAddress: address as string,
    decimals: payToken?.decimals,
  });
  const debouncedPayValidation = useCallback(
    debounce((newValue) => {
      setPayDebouncedValue(newValue || "");
      setTradeType(TradeType.EXACT_INPUT);
    }, 300),
    [setPayDebouncedValue],
  );
  const debouncedReceiveValidation = useCallback(
    debounce((newValue) => {
      setReceiveDebouncedValue(newValue || "");
      setTradeType(TradeType.EXACT_OUTPUT);
    }, 300),
    [setReceiveDebouncedValue],
  );
  const refetchAll = useCallback(async () => {
    await setPayValue("");
    await setReceiveValue("");
    await setPayDebouncedValue("");
    await setReceiveDebouncedValue("");
    await debouncedPayValidation("");
    await debouncedReceiveValidation("");
  }, [debouncedPayValidation, debouncedReceiveValidation]);

  const swap = useCallback(async () => {
    try {
      setSwapLoading(true);

      // @ts-ignore
      const swapData = await saveOrder(payload);

      if (swapData.code === 0) {
        const { data } = swapData;
        const { callData } = data;
        const contractAddress = Erc20SellContractAddresses[chainId];

        const provider = await wallet?.getEthersProvider();
        // const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(
          erc20Address,
          [
            "function allowance(address owner, address spender) view returns (uint256)",
          ],
          signer,
        );

        if (type === "Sell") {
          const allowance = await tokenContract.allowance(
            await signer.getAddress(),
            contractAddress,
          );

          // Check if allowance is sufficient
          if (allowance.lt(ethers.BigNumber.from(amountPay))) {
            // If not, approve the maximum amount
            const tokenApproveContract = new ethers.Contract(
              erc20Address,
              [
                "function approve(address spender, uint256 amount) public returns (bool)",
              ],
              signer,
            );

            const approveTx = await tokenApproveContract.approve(
              contractAddress,
              ethers.constants.MaxUint256,
            );

            await pollTransactionReceipt(approveTx.hash, chainId, 1000);

            // Standardized toast message
            toast.success("Token approval successful");
          }
        }

        // Proceed with the swap transaction
        const transaction = {
          to: callData.to,
          from: callData.from,
          data: callData.data,
          value: ethers.BigNumber.from(callData.value), // 转换为BigNumber
          gasLimit: ethers.BigNumber.from(callData.gas),
        };

        const txResponse = await signer.sendTransaction(transaction);
        const res = await pollTransactionReceipt(
          txResponse.hash,
          chainId,
          1000,
        );
        if (res.status === "0x1") {
          toast.success("Token swap successful");
        } else {
          toast.success("Token swap failed");
        }
        refetchAll();
        setInitFlag(true);
        console.log("pollTransactionReceipt", res);

        // Standardized toast message
      } else {
        console.error("Failed to retrieve swap data:", swapData.msg);
        toast.error(`Swap failed: ${swapData.msg}`);
      }
    } catch (error) {
      console.error("Error during swap:", error);
      toast.error(
        "An error occurred during the swap process. Please try again.",
      );
    } finally {
      setSwapLoading(false);
    }
  }, [payload, amountPay, erc20Address, type, chainId, refetchAll, wallet]);

  const handlePayValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    const decimalRegex = new RegExp(`^\\d+(\\.\\d{0,${payToken.decimals}})?$`);
    if (decimalRegex.test(newValue)) {
      setPayValue(newValue);
      setPayDebouncedValue(newValue);
      debouncedPayValidation(newValue);
    }

    if (!newValue) {
      setPayValue("");
      setReceiveValue("");
      setPayDebouncedValue("");
      setReceiveDebouncedValue("");
    }
  };
  const handleMaxPayValue = useCallback(
    (newValue: string) => {
      setPayValue(newValue);
      setPayDebouncedValue(newValue);
      debouncedPayValidation(newValue);
    },
    [setPayDebouncedValue, debouncedPayValidation, setPayValue],
  );

  const handleReceiveValueChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newValue = event.target.value;
    const decimalRegex = new RegExp(
      `^\\d+(\\.\\d{0,${receiveToken.decimals}})?$`,
    );
    if (decimalRegex.test(newValue)) {
      setReceiveValue(newValue);
      setReceiveDebouncedValue(newValue);
      debouncedReceiveValidation(newValue);
    }

    if (!newValue) {
      setPayValue("");
      setReceiveValue("");
      setPayDebouncedValue("");
      setReceiveDebouncedValue("");
    }
  };

  useEffect(() => {
    return () => {
      debouncedPayValidation.cancel();
    };
  }, [debouncedPayValidation]);
  useEffect(() => {
    return () => {
      debouncedReceiveValidation.cancel();
    };
  }, [debouncedReceiveValidation]);
  useEffect(() => {
    if (!data?.data?.singleChainSwapInfo?.receiveAmount) {
      return;
    }
    setReceiveValue(
      formatToken(data?.data?.singleChainSwapInfo?.receiveAmount || ""),
    );
    setReceiveDebouncedValue(
      formatToken(data?.data?.singleChainSwapInfo?.receiveAmount || ""),
    );
  }, [data, tradeType]);
  useEffect(() => {
    if (initFlag) {
      setInitFlag(false);
      refetchAll();
    }
  }, [initFlag, setInitFlag, refetchAll]);
  useEffect(() => {
    if (activeToken) {
      refetchAll();
    }
  }, [activeToken, refetchAll]);

  const loading = useMemo(
    () => isLoading || swapLoading,
    [isLoading, swapLoading],
  );
  return (
    <CardContent
      sx={{
        p: { md: 3, xs: 1 },
      }}
    >
      <Box sx={{ opacity: loading ? 0.6 : 1 }}>
        <form noValidate autoComplete="off">
          <Box sx={{ position: "relative" }}>
            <TokenInputOkx
              hasLogo={hasLogo}
              logoUrl={logoUrl}
              erc20Address={erc20Address}
              inputTitle={"Pay"}
              chainId={chainId}
              handleInputValueChange={handlePayValueChange}
              inputValue={payValue}
              token={payToken}
              baseTokens={type === "Buy" ? baseTokens : []}
              handleMaxPayValue={handleMaxPayValue}
              // balance={payTokenShowBalance}
              showMax={true}
              symbol={symbol}
              batchBalance={batchBalance}
            />
            <Typography
              sx={{
                display: "flex",
                justifyContent: "space-between",
                // px: 1,
                py: 1,
                fontSize: { md: 14, xs: 12 },
                color: "rgba(255,255,255,1)",
              }}
            >
              <span>{type === "Buy" ? `You'll Get` : `You'll Receive`}</span>
              <span>
                {" "}
                {type === "Buy"
                  ? formatTokenFixedto(receiveValue) || 0
                  : formatTokenFixedto(receiveValue) || 0}{" "}
                {type === "Buy" ? symbol : "ETH"} ($
                {formatTokenFixedto(
                  Number(ethPrice) *
                    Number(type === "Buy" ? payValue : receiveValue) *
                    0.99,
                  2,
                )}
                )
              </span>
            </Typography>
            {/* <Typography>{payValue}</Typography>
            <Typography>{receiveValue}</Typography> */}
            {/* <TokenInputOkx
              hasLogo={hasLogo}
              logoUrl={logoUrl}
              erc20Address={erc20Address}
              inputTitle="To"
              chainId={chainId}
              handleInputValueChange={handleReceiveValueChange}
              handleMaxPayValue={handleMaxPayValue}
              inputValue={receiveValue}
              token={receiveToken}
              baseTokens={type === "Buy" ? [] : baseTokens}
              balance={receiveTokenShowBalance}
              showMax={false}
              symbol={symbol}
              disable
            /> */}
            {loading ? (
              <Box
                sx={{
                  position: "absolute",
                  left: "calc( 50% - 20px )",
                  top: "calc( 50% - 20px )",
                }}
              >
                <Iconify
                  icon="eos-icons:bubble-loading"
                  sx={{ color: "#af54ff", width: 40, height: 40 }}
                />
              </Box>
            ) : null}
          </Box>

          <PriceInfoOkx
            loading={priceLoading}
            payToken={payToken}
            receiveToken={receiveToken}
            chainId={chainId}
            tokensPrice={tokensPrice}
            oneTokenData={oneTokenData}
          />

          <ButtonComfirm
            quoteError={quoteError}
            loading={loading}
            type={type}
            chainId={chainId}
            payToken={payToken}
            swap={swap}
            payDebouncedValue={payDebouncedValue}
            payTokenShowBalance={payTokenMaxBalance}
            receiveToken={receiveToken}
          />
        </form>
      </Box>
    </CardContent>
  );
};

export default TokenCardOkx;
