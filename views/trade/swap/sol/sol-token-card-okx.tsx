import { Box, CardContent, Typography } from "@mui/material";
import PriceInfo from "../price-info";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Token, TradeType } from "@uniswap/sdk-core";
import { useSolActiveToken } from "@/context/hooks/useSolActiveToken";
import { debounce } from "lodash";
import { useAccount, useBalance, useChainId, useContractRead } from "wagmi";
import { ethers, utils } from "ethers";
import {
  calculateMinimumReceivedWithSlippage,
  formatToken,
  formatTokenFixedto,
  formatUSD,
  formatWei,
  formatWeiNoPrecision,
  safeParseUnits,
} from "@/utils/format";
import { erc20Abi, zeroAddress } from "viem";
import { toast } from "react-toastify";
import Iconify from "@/components/iconify";
import { useQuery } from "@tanstack/react-query";
import { getTokensPrice } from "@/services/tokens";
import { WETH_ADDRESS } from "@uniswap/universal-router-sdk";
import { handleTransactionError } from "@/utils/error-format";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getJupiterSwapTx } from "@/utils/trade/solana-swap";
import { useSolBalance } from "@/hooks/sol/useSolanaBalance";
import TokenInput from "./sol-token-input";
import { useJupiterQuote } from "@/services/useJupiterQuote";
import { NATIVE_MINT } from "@solana/spl-token";
import { ButtonWrapper } from "@/components/button/wrapper";
import { SolButtonComfirm } from "./sol-button-comfirm";
import SolPriceInfo from "./sol-price-info";
import { useTokenBalance } from "@/hooks/sol/SolTokenBalanceChecker";
import useSolTokenBalance from "@/hooks/sol/useTokenBalance";
import * as bs58 from "bs58";
import axios from "axios";
import FeeInfo from "../fee-info";
import { WarnText } from "@/components/text";
import CustomTooltip from "@/components/tooltip/CustomTooltip";
import { TipText } from "@/views/collect/verified-icon";
import { SolAddress } from "@/constants/tokens";
import { saveOrder, useOkxQuote } from "@/services/okx/useOkxswapQuoteNew";
import { usePrivy } from "@privy-io/react-auth";
import {
  clusterApiUrl,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { Connection } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import { SystemProgram } from "@solana/web3.js";
const BLOCKHASH_TTL = 150; // 150 seconds, approximate TTL for blockhash
interface iSolTokenCard {
  baseTokens: Token[];
  currentToken: any;
  chainId: number;
  type: "Buy" | "Sell";
  symbol: string;
  erc20Address: string;
  initFlag: boolean;
  hasLogo: boolean;
  isSol: boolean;
  setInitFlag: (b: boolean) => void;
}
export const sleep = async (ms: number) => {
  return new Promise((r) => setTimeout(r, ms));
};
export function txConfirmationCheck(
  expectedLevel: string,
  currentLevel: string,
) {
  const levels = ["processed", "confirmed", "finalized"];

  if (levels.indexOf(expectedLevel) == -1) {
    throw Error(
      "Please use commitment level 'processed', 'confirmed' or 'finalized'",
    );
  }

  if (levels.indexOf(currentLevel) >= levels.indexOf(expectedLevel)) {
    return true;
  }
  return false;
}

const SolTokenCard = ({
  baseTokens,
  currentToken,
  chainId,
  type,
  initFlag,
  setInitFlag,
  symbol,
  erc20Address,
  hasLogo,
}: iSolTokenCard) => {
  const [payValue, setPayValue] = useState<string>("");
  const { ready, authenticated, user, logout, login } = usePrivy();
  const address = useMemo(() => user?.wallet?.address, [user]);
  const chainType = useMemo(() => user?.wallet?.chainType, [user]);
  const { balance: solBalance, refresh: refreshSolBalance } = useSolBalance();
  const { balances, refetch: refetchTokenBalance } =
    useSolTokenBalance(erc20Address);
  const tokenBalance = useMemo(() => balances?.[0]?.balance, [balances]);

  const { activeToken } = useSolActiveToken(); // Buy => payToken  Sell => receiveToken
  const { balances: activeTokenBalances, refetch: refetchActiveTokenBalance } =
    useSolTokenBalance(activeToken?.address);
  const activeTokenBalance = useMemo(
    () => activeTokenBalances?.[0]?.balance,
    [activeTokenBalances],
  );
  // const { tokenBalance } = useTokenBalance(erc20Address);
  const [receiveDebouncedValue, setReceiveDebouncedValue] =
    useState<string>("");
  const [payDebouncedValue, setPayDebouncedValue] = useState<string>("");
  const [tradeType, setTradeType] = useState<TradeType>(TradeType.EXACT_INPUT);
  const [receiveValue, setReceiveValue] = useState<string>("");
  const payToken = useMemo(
    () => (type === "Buy" ? activeToken : currentToken),
    [type, activeToken, currentToken],
  );
  const receiveToken = useMemo(
    () => (type === "Buy" ? currentToken : activeToken),
    [type, activeToken, currentToken],
  );

  const [swapLoading, setSwapLoading] = useState<boolean>(false);

  const amountPay = useMemo(
    () =>
      safeParseUnits(payDebouncedValue, payToken?.decimals || 9)?.toString(),
    [payDebouncedValue, payToken],
  );
  const amountReceive = useMemo(
    () =>
      safeParseUnits(
        receiveDebouncedValue,
        receiveToken?.decimals || 9,
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
    data: okxSwapData,
    isLoading,
    error,
  } = useOkxQuote({
    chainId: 501,
    toChainId: 501,
    amount: tradeType === TradeType.EXACT_INPUT ? amountPay : amountReceive,
    fromTokenAddress: type === "Buy" ? activeToken.address : erc20Address,
    toTokenAddress: type === "Buy" ? erc20Address : activeToken.address,
    decimals: payToken?.decimals,
  });

  const { data: oneTokenData, isLoading: priceLoading } = useOkxQuote({
    chainId: 501,
    toChainId: 501,
    amount: activeToken?.decimals === 9 ? "1000000000" : "1000000",
    fromTokenAddress: type === "Buy" ? activeToken.address : erc20Address,
    toTokenAddress: type === "Buy" ? erc20Address : activeToken.address,
    decimals: payToken?.decimals,
  });

  const showExactOutTip = useMemo(() => {
    if (isLoading) {
      return false;
    }
    if (Number(amountReceive) && error) {
      return tradeType === TradeType.EXACT_OUTPUT;
    }
    if (Number(amountPay) && Number(amountReceive)) {
      return tradeType === TradeType.EXACT_OUTPUT;
    }
    return false;
  }, [tradeType, amountReceive, amountPay, isLoading, error]);
  // const priceImpact = useMemo(
  //   () => (Number(okxSwapData?.priceImpactPct || 0) * 100)?.toFixed(2),
  //   [okxSwapData],
  // );
  const slippage = useMemo(
    () =>
      // @ts-ignore
      oneTokenData?.data?.singleChainSwapInfo?.autoSlippageInfo?.autoSlippage *
      100,
    [oneTokenData],
  );
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
    refreshSolBalance();
    refetchTokenBalance();
    refetchActiveTokenBalance();
  }, [
    refreshSolBalance,
    debouncedPayValidation,
    debouncedReceiveValidation,
    refetchTokenBalance,
    refetchActiveTokenBalance,
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
    if (!okxSwapData?.data?.singleChainSwapInfo?.receiveAmount) {
      return;
    }
    if (tradeType === TradeType.EXACT_INPUT) {
      setReceiveValue(
        formatToken(okxSwapData?.data?.singleChainSwapInfo?.receiveAmount),
      );
      setReceiveDebouncedValue(
        okxSwapData?.data?.singleChainSwapInfo?.receiveAmount,
      );
    } else {
      setPayValue(
        formatToken(okxSwapData?.data?.singleChainSwapInfo?.payAmount),
      );
      setPayDebouncedValue(
        formatToken(okxSwapData?.data?.singleChainSwapInfo?.payAmount),
      );
    }
  }, [okxSwapData, tradeType]);
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
  const payload = useMemo(() => {
    if (!okxSwapData) return null;
    let minimumReceived =
      // @ts-ignore
      okxSwapData?.data?.singleChainSwapInfo?.minimumReceived || "0";
    let slippage =
      // @ts-ignore
      okxSwapData?.data?.singleChainSwapInfo?.autoSlippageInfo?.autoSlippage;

    const decimals = okxSwapData?.data?.commonDexInfo?.toToken?.decimals;

    const minimumReceivedWithSlippageFormatted =
      calculateMinimumReceivedWithSlippage(minimumReceived, slippage, decimals);

    return {
      chainId: 501,
      fromAmount: okxSwapData?.data?.commonDexInfo?.fromTokenAmount || "0",
      fromTokenAddress:
        okxSwapData?.data?.commonDexInfo?.fromToken?.tokenContractAddress ||
        "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      fromTokenDecimal:
        okxSwapData?.data?.commonDexInfo?.fromToken?.decimals || "18",
      toAmount: calculateMinimumReceivedWithSlippage(
        okxSwapData?.data?.singleChainSwapInfo?.receiveAmount || "0",
        slippage,
        decimals,
      ),
      toTokenAddress:
        okxSwapData?.data?.commonDexInfo?.toToken?.tokenContractAddress ||
        "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      toTokenDecimal:
        okxSwapData?.data?.commonDexInfo?.toToken?.decimals || "18",
      userWalletAddress: address,
      estimateGasFee:
        okxSwapData?.data?.singleChainSwapInfo?.estimateGasFee || "0",
      pmm: "1", // Example static value, you can change this dynamically
      gasDropType: 0,
      // @ts-ignore
      minimumReceived: minimumReceivedWithSlippageFormatted,
      // minimumReceived: okxSwapData?.data?.singleChainSwapInfo?.minimumReceived || "0",
      openMev: false,
      toChainId: 501, // Adjust this based on your actual logic
      slippage: "0.01",
      // @ts-ignore
      referredAmount: okxSwapData?.data?.commonDexInfo?.referredAmount || "0",
      feePercent: 1,
      referrerAddress: "BhCtoLk2jZPdniMp4tupr6XH47x11BDwQ91TZkcMEk6u",
      autoSlippageInfo: {
        autoSlippage: "0.01",
      },
      dexRouterList:
        // @ts-ignore
        okxSwapData?.data?.singleChainSwapInfo?.dexRouterList || [],
      originDexRouterList:
        // @ts-ignore
        okxSwapData?.data?.singleChainSwapInfo?.originDexRouterList || [],
      tradeMode: 2,
    };
  }, [okxSwapData, address]);

  const handleSwap = async () => {
    console.log("handleSwap", 0);

    const connection = new Connection(
      "https://mainnet.helius-rpc.com/?api-key=c6323c63-ef25-4c90-acd3-3a81fb798c45",
      "confirmed",
    );
    console.log("handleSwap", 1);

    if (!connection) {
      console.error("Connection not initialized!");
      return;
    }
    console.log("handleSwap", 2);
    if (!address) {
      return;
    }
    console.log("handleSwap", 2);

    if (!okxSwapData) {
      return;
    }
    console.log("handleSwap", 3);

    try {
      // setSwapLoading(true);
      // @ts-ignore
      const swapData = await saveOrder(payload, "sol");
      console.log("swapData", swapData);
      const { unsignedTx } = swapData?.data;
      const transactionInfo = JSON.parse(unsignedTx);
      const rawTransaction = bs58.decode(transactionInfo?.data);

      const txHash = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        preflightCommitment: "confirmed",
      });
      setSwapLoading(false);
    } catch (error) {
      setSwapLoading(false);
      console.log("error", error);
    }

    // try {
    //   const transactions = unsignedTxObj.array.map(
    //     async (tx: any, index: number) => {
    //       console.log("test1", tx.data);
    //       const rawTransaction = Buffer.from(tx.data, "base64");
    //       console.log(
    //         "Decoded transaction (hex):",
    //         rawTransaction.toString("hex"),
    //       );
    //       const txHash = await connection.sendRawTransaction(rawTransaction, {
    //         skipPreflight: false,
    //         preflightCommitment: "confirmed",
    //       });
    //       return "";
    //     },
    //   );
    //   console.log("transactions", transactions);
    //   setSwapLoading(false);
    // } catch (error) {
    //   console.log("error", error);

    //   setSwapLoading(false);
    // }
    // if (swapData?.data?.jitoData.jitoUnsignedTx2) {
    //   console.log("11");

    //   let interval;
    //   try {
    //     console.log("22");
    //     const { blockhash, lastValidBlockHeight } =
    //       await connection.getLatestBlockhash();
    //     // const signedTransaction = await signTransaction(
    //     //   swapData?.data?.jitoData.jitoUnsignedTx,
    //     // );
    //     console.log("33", signedTransaction);
    //     const rawTransaction = signedTransaction.serialize();
    //     const encodedTx = bs58.encode(rawTransaction);
    //     // const encodedTx = swapData?.unsignedTx;
    //     const jitoURL =
    //       "https://mainnet.block-engine.jito.wtf/api/v1/transactions";
    //     const payload = {
    //       jsonrpc: "2.0",
    //       id: 1,
    //       method: "sendTransaction",
    //       params: [encodedTx],
    //     };
    //     // let txOpts = {
    //     //   skipPreflight: true,
    //     //   preflightCommitment: "singleGossip",
    //     //   commitment: "confirmed",
    //     //   maxRetries: 0,
    //     // };
    //     let txSig: string;
    //     try {
    //       console.log("44");
    //       const response = await axios.post(jitoURL, payload, {
    //         headers: { "Content-Type": "application/json" },
    //       });
    //       // setSwapLoading(false);
    //       // toast.success("Transaction confirmed.");
    //       // refetchAll();
    //       txSig = response.data.result;
    //     } catch (error) {
    //       console.error("Error:", error);
    //       throw new Error("Jito Bundle Error: cannot send.");
    //     }
    //     let currentBlockHeight = await connection.getBlockHeight(
    //       connection.commitment,
    //     );

    //     while (currentBlockHeight < lastValidBlockHeight) {
    //       // Keep resending to maximise the chance of confirmation
    //       await connection.sendRawTransaction(rawTransaction, {
    //         skipPreflight: true,
    //         preflightCommitment: connection.commitment,
    //         maxRetries: 0,
    //       });
    //       console.log("55");
    //       let status = await connection.getSignatureStatus(txSig);

    //       currentBlockHeight = await connection.getBlockHeight(
    //         connection.commitment,
    //       );

    //       if (status.value != null) {
    //         if (status.value.err != null) {
    //           // Gets caught and parsed in the later catch
    //           // let err = parseInt(
    //           //   status.value.err["InstructionError"][1]["Custom"],
    //           // );
    //           // let parsedErr = parseError(err);
    //           // throw parsedErr;
    //           toast.error(status.value.err?.toString());
    //         }
    //         if (
    //           txConfirmationCheck(
    //             "confirmed",
    //             status?.value?.confirmationStatus || "",
    //           )
    //         ) {
    //           setSwapLoading(false);
    //           toast.success("Transaction confirmed.");
    //           refetchAll();
    //           return txSig;
    //         }
    //       }
    //       await sleep(500); // Don't spam the RPC
    //     }
    //     toast.error("Transaction was not confirmed");
    //     throw Error(`Transaction ${txSig} was not confirmed`);
    //   } catch (error) {
    //     clearInterval(interval);
    //     console.log("error", error);
    //     setSwapLoading(false);
    //   }
    // } else {
    //   setSwapLoading(false);
    // }
  };

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
              erc20Address={erc20Address}
              inputTitle="From"
              chainId={chainId}
              handleInputValueChange={handlePayValueChange}
              inputValue={payValue}
              token={payToken}
              baseTokens={type === "Buy" ? baseTokens : []}
              handleMaxPayValue={handleMaxPayValue}
              showMax={true}
              symbol={symbol}
              solBalance={solBalance}
              tokenBalance={tokenBalance}
              activeTokenBalance={activeTokenBalance}
              isNative={type === "Buy" ? true : false}
            />
            <Typography
              sx={{
                display: "flex",
                justifyContent: "space-between",
                px: 1,
                pt: 1,
                fontSize: { md: 14, xs: 12 },
                color: "rgba(255,255,255,1)",
              }}
            >
              <span>{type === "Buy" ? `You'll Get` : `You'll Receive`}</span>
              <span>
                {" "}
                {type === "Buy"
                  ? formatTokenFixedto(receiveValue) || 0
                  : formatTokenFixedto(payValue) || 0}{" "}
                {type === "Buy" ? symbol : "Sol"}
                {/* ( {formatUSD(tokensPrice?.[payToken.address])}) */}
                {/* ($
                {formatTokenFixedto(
                  Number(ethPrice) * Number(payDebouncedValue) * 0.99,
                  2,
                )}
                ) */}
              </span>
            </Typography>
            {/* <TokenInput
              hasLogo={hasLogo}
              erc20Address={erc20Address}
              inputTitle="To"
              chainId={chainId}
              handleInputValueChange={handleReceiveValueChange}
              handleMaxPayValue={handleMaxPayValue}
              inputValue={receiveValue}
              token={receiveToken}
              baseTokens={type === "Buy" ? [] : baseTokens}
              showMax={false}
              symbol={symbol}
              solBalance={solBalance}
              tokenBalance={tokenBalance}
              activeTokenBalance={activeTokenBalance}
              isNative={type === "Buy" ? false : true}
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

          <SolPriceInfo
            loading={priceLoading}
            payToken={payToken}
            receiveToken={receiveToken}
            chainId={chainId}
            symbol={symbol}
            tokensPrice={tokensPrice}
            oneTokenData={oneTokenData as any}
            priceImpact={0}
            slippage={slippage}
          />

          <FeeInfo
            tokensPrice={tokensPrice}
            receiveAmount={receiveValue}
            chainId={chainId}
            receiveToken={receiveToken}
            scrFee={0}
            isSol
          />
          {showExactOutTip ? (
            <Box
              sx={{
                borderRadius: "4px",
                border: "1px solid rgba(255,255,255, 0.30)",
                opacity: 0.6,
                background: "rgba(255,255,255, 0.10)",
                padding: "14px 20px",
                mt: 2,
              }}
            >
              <WarnText>
                ExactOut swap supports less liquidity venues and less routes. It
                might also offer a worse price. Slippage is only applied on
                input amount, not output amount.
              </WarnText>
            </Box>
          ) : null}
          {/* {Number(priceImpact) >= 15 ? (
            <CustomTooltip
              title={
                <TipText sx={{ fontSize: 12 }}>
                  A swap of this size may have a high price impact, given the
                  current liquidity in the pool. There may be a large difference
                  between the amount of your input token and what you will
                  receive in the output token
                </TipText>
              }
            >
              <Box
                sx={{
                  borderRadius: "4px",
                  border: "1px solid rgba(220, 38, 38, 0.30)",
                  background: "rgba(220, 38, 38,0.1)",
                  padding: "14px 20px",
                  mt: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <WarnText sx={{ color: "#fff" }}>Price impact warning</WarnText>
                <WarnText sx={{ color: "#DC2626" }}>{priceImpact}%</WarnText>
              </Box>
            </CustomTooltip>
          ) : null} */}
          <SolButtonComfirm
            swap={handleSwap}
            chainId={10000}
            loading={loading}
            payDebouncedValue={payDebouncedValue}
            payTokenShowBalance={
              type === "Buy"
                ? activeToken?.address === SolAddress
                  ? solBalance?.toString() || "0"
                  : activeTokenBalance?.toString() || "0"
                : tokenBalance?.toString() || "0"
            }
            type={type}
            symbol={symbol}
            paySymbol={type === "Buy" ? "Sol" : symbol}
            quoteError={error}
          />
        </form>
      </Box>
    </CardContent>
  );
};

export default SolTokenCard;
