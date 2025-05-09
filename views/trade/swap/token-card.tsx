import { Box, CardContent } from "@mui/material";
import TokenInput from "./token-input";
import PriceInfo from "./price-info";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Token, TradeType } from "@uniswap/sdk-core";
import { useActiveToken } from "@/context/hooks/useActiveToken";
import { debounce } from "lodash";
import { useUniswapQuote } from "@/services/useUniswapQuote";
import { useAccount, useBalance, useChainId, useContractRead } from "wagmi";
import { ethers } from "ethers";
import {
  formatToken,
  formatWei,
  formatWeiNoPrecision,
  safeParseUnits,
} from "@/utils/format";
import { erc20Abi, zeroAddress } from "viem";
import { toast } from "react-toastify";
import Iconify from "@/components/iconify";
import { permit2AndSwap, swapToken, tokenApprove } from "@/utils/trade/swap";
import { ButtonComfirm } from "./button-comfirm";
import FeeInfo from "./fee-info";
import { useQuery } from "@tanstack/react-query";
import { getTokensPrice } from "@/services/tokens";
import { WETH_ADDRESS } from "@uniswap/universal-router-sdk";
import { handleTransactionError } from "@/utils/error-format";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getJupiterSwapTx } from "@/utils/trade/solana-swap";

interface iTokenCard {
  baseTokens: Token[];
  currentToken: any;
  chainId: number;
  type: "Buy" | "Sell";
  symbol: string;
  erc20Address: string;
  logoUrl?: string;
  initFlag: boolean;
  hasLogo: boolean;
  setInitFlag: (b: boolean) => void;
}
const TokenCard = ({
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
}: iTokenCard) => {
  const [payValue, setPayValue] = useState<string>("");
  const { connection } = useConnection();
  const { publicKey, wallet, signTransaction } = useWallet();
  const [receiveDebouncedValue, setReceiveDebouncedValue] =
    useState<string>("");
  const [payDebouncedValue, setPayDebouncedValue] = useState<string>("");
  const [tradeType, setTradeType] = useState<TradeType>(TradeType.EXACT_INPUT);
  const { address } = useAccount();
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
  const {
    data: nativeBalance,
    refetch: refetchNativeBalance,
    isLoading: nativeTokenBalanceLoading,
  } = useBalance({
    address: address as `0x${string}`,
  });
  const {
    data: payTokenBalance,
    refetch: refetchPayTokenBalance,
    isLoading: payTokenBalanceLoading,
  } = useContractRead({
    address: payToken?.address as `0x${string}`,
    abi: erc20Abi,
    args: [address as `0x${string}`],
    functionName: "balanceOf",
  });
  const {
    data: receiveTokenBalance,
    refetch: refetchReceiveTokenBalance,
    isLoading: receiveTokenBalanceLoading,
  } = useContractRead({
    address: receiveToken?.address as `0x${string}`,
    abi: erc20Abi,
    args: [address as `0x${string}`],
    functionName: "balanceOf",
  });

  const payTokenShowBalance = useMemo(
    () =>
      payToken?.address === zeroAddress
        ? formatWei(nativeBalance?.value?.toString())
        : formatWei(payTokenBalance?.toString(), payToken.decimals),
    [nativeBalance, payTokenBalance, payToken],
  );
  const payTokenMaxBalance = useMemo(
    () =>
      payToken?.address === zeroAddress
        ? formatWeiNoPrecision(nativeBalance?.value?.toString())
        : formatWeiNoPrecision(payTokenBalance?.toString(), payToken.decimals),
    [nativeBalance, payTokenBalance, payToken],
  );
  const receiveTokenShowBalance = useMemo(
    () =>
      receiveToken?.address === zeroAddress
        ? formatWei(nativeBalance?.value?.toString())
        : formatWei(receiveTokenBalance?.toString(), receiveToken.decimals),
    [nativeBalance, receiveTokenBalance, receiveToken],
  );

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

  const {
    data,
    refetch,
    isLoading,
    error: quoteError,
  } = useUniswapQuote({
    recipient: address as string,
    tokenIn: payToken?.address,
    chainId,
    tokenOut: receiveToken?.address,
    amount: tradeType === TradeType.EXACT_INPUT ? amountPay : amountReceive,
    type: tradeType,
  });

  const { data: oneTokenData, isLoading: priceLoading } = useUniswapQuote({
    recipient: address as string,
    tokenIn: payToken?.address,
    chainId,
    tokenOut: receiveToken?.address,
    amount: ethers.utils.parseUnits("1", payToken.decimals).toString(),
    permit2Params: undefined,
    type: TradeType.EXACT_INPUT,
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
    refetchNativeBalance();
    refetchPayTokenBalance();
    refetchReceiveTokenBalance();
  }, [
    refetchNativeBalance,
    refetchPayTokenBalance,
    refetchReceiveTokenBalance,
    debouncedPayValidation,
    debouncedReceiveValidation,
  ]);

  const swap = useCallback(async () => {
    try {
      setSwapLoading(true);
      if (payToken?.address === zeroAddress) {
        await swapToken({
          data,
          address,
          callBack: () => {
            setSwapLoading(false);
            refetchAll();
          },
          chainId,
        });
        return;
      }
      const isTokenApprove = await tokenApprove({
        address,
        token: payToken,
        amount: payDebouncedValue,
        chainId,
      });
      if (!isTokenApprove) {
        return;
      }
      await permit2AndSwap({
        chainId,
        data,
        token: payToken,
        address,
        amount: payDebouncedValue,
        amountReceive,
        amountPay,
        receiveToken,
        tradeType,
        callBack: () => {
          setSwapLoading(false);
          refetchAll();
        },
      });
    } catch (error: any) {
      console.error(error);
      setSwapLoading(false);
      handleTransactionError(error);
    }
  }, [
    address,
    chainId,
    data,
    payToken,
    payDebouncedValue,
    amountPay,
    amountReceive,
    tradeType,
    receiveToken,
    refetchAll,
  ]);

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
    if (!data?.quote?.quoteDecimals) {
      return;
    }
    if (tradeType === TradeType.EXACT_INPUT) {
      setReceiveValue(formatToken(data?.quote?.quoteDecimals || ""));
      setReceiveDebouncedValue(formatToken(data?.quote?.quoteDecimals || ""));
    } else {
      setPayValue(formatToken(data?.quote?.quoteDecimals || ""));
      setPayDebouncedValue(formatToken(data?.quote?.quoteDecimals || ""));
    }
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
  // const { priceImpactSeverity, largerPriceImpact } = useMemo(() => {
  //   if (!isClassicTrade(trade)) {
  //     return { priceImpactSeverity: 0, largerPriceImpact: undefined };
  //   }

  //   const marketPriceImpact = trade?.priceImpact
  //     ? computeRealizedPriceImpact(trade)
  //     : undefined;
  //   const largerPriceImpact = largerPercentValue(
  //     marketPriceImpact,
  //     preTaxStablecoinPriceImpact,
  //   );
  //   return {
  //     priceImpactSeverity: warningSeverity(largerPriceImpact),
  //     largerPriceImpact,
  //   };
  // }, [preTaxStablecoinPriceImpact, trade]);
  return (
    <CardContent
      sx={{
        p: { md: 3, xs: 1 },
      }}
    >
      <Box sx={{ opacity: loading ? 0.6 : 1 }}>
        <form noValidate autoComplete="off">
          <Box sx={{ position: "relative" }}>
            <TokenInput
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
              balance={payTokenShowBalance}
              showMax={true}
              symbol={symbol}
            />
            <TokenInput
              hasLogo={hasLogo}
              logoUrl={logoUrl}
              erc20Address={erc20Address}
              inputTitle="Receive"
              chainId={chainId}
              handleInputValueChange={handleReceiveValueChange}
              handleMaxPayValue={handleMaxPayValue}
              inputValue={receiveValue}
              token={receiveToken}
              baseTokens={type === "Buy" ? [] : baseTokens}
              balance={receiveTokenShowBalance}
              showMax={false}
              symbol={symbol}
            />
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

          <PriceInfo
            loading={priceLoading}
            payToken={payToken}
            receiveToken={receiveToken}
            chainId={chainId}
            tokensPrice={tokensPrice}
            oneTokenData={oneTokenData}
          />
          <FeeInfo
            tokensPrice={tokensPrice}
            receiveAmount={receiveValue}
            chainId={chainId}
            receiveToken={receiveToken}
            scrFee={
              oneTokenData?.quote?.portionBips === 0
                ? 0
                : Number((oneTokenData?.quote?.portionBips || 0) / 10000)
            }
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

export default TokenCard;
