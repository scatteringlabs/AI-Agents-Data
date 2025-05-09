import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import Tabs from "@/components/tabs/Tabs";
import Iconify from "@/components/iconify";
import TokenInputErc20z from "./token-input-erc20z";
import { ButtonComfirmErc20z } from "./button-comfirm-erc20z";
import { CollectionDetailsErc20z } from "@/types/collection";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useBatchBalanceQuery } from "@/services/zora/swap/balance";
import { useAccount, useChainId } from "wagmi";
import { useUniswapQuote } from "@/services/useUniswapQuote";
import { TradeType } from "@uniswap/sdk-core";
import { callBuy1155 } from "@/services/zora/swap/buy1155";
import { ethers } from "ethers";
import { debounce, get } from "lodash";
import {
  quoteExactInputSingle,
  quoteExactOutputSingle,
} from "@/services/zora/swap/quoter_v2";
import { formatToken, formatTokenFixedto } from "@/utils/format";
import { buyErc20 } from "@/services/zora/swap/buyErc20";
import { sellErc20 } from "@/services/zora/swap/sellErc20";
import BetweenText from "../swap/between-text";
import CustomTooltip from "@/components/tooltip/CustomTooltip";
import { TipText } from "@/views/collect/verified-icon";
import ModeTab from "./mode-tab";
import { callSell1155 } from "@/services/zora/swap/sell1155";
import { WETH_ADDRESS } from "@/services/zora/swap/config";
import { useQuery } from "@tanstack/react-query";
import { getETHPrice } from "@/services/tokens";
import { usePrivy, useWallets } from "@privy-io/react-auth";

const tabs = ["Buy", "Sell"];
export type TabType = "Buy" | "Sell";
export type ModeType = "Token" | "NFT";
interface iSwapCard {
  collectionDetails?: CollectionDetailsErc20z;
}

export const formatWeiToToken = (
  value?: string | number,
  decimals?: number,
) => {
  if (!value || value === "NaN" || isNaN(Number(value))) {
    return "0";
  }
  try {
    const formatted = ethers.utils.formatUnits(
      value.toString(),
      decimals || 18,
    );
    return formatTokenFixedto(formatted);
  } catch (error) {
    console.error("Error formatting value:", error);
    return "0";
  }
};

function SwapCardErc20z({ collectionDetails }: iSwapCard) {
  const [tradeType, setTradeType] = useState<TradeType>(TradeType.EXACT_INPUT);
  const { user } = usePrivy();
  const address = useMemo(() => user?.wallet?.address, [user]);
  const { wallets } = useWallets();
  const wallet = useMemo(() => wallets?.[0], [wallets]);
  const [activeTab, setActiveTab] = useState<TabType>("Buy");
  const [mode, setMode] = useState<ModeType>("Token");
  const [loading, setLoading] = useState<boolean>(false);
  const [payValue, setPayValue] = useState<string>("");
  const [receiveValue, setReceiveValue] = useState<string>("");
  const { data } = useQuery({
    queryKey: ["getETHPrice"],
    queryFn: () => getETHPrice(),
  });
  const ethPrice = useMemo(() => data?.data?.eth_usd, [data]);
  const [receiveDebouncedValue, setReceiveDebouncedValue] =
    useState<string>("");
  const [payDebouncedValue, setPayDebouncedValue] = useState<string>("");
  const {
    data: batchBalance,
    isLoading,
    error,
    refetch: refectBalance,
  } = useBatchBalanceQuery({
    userAddress: address || "",
    erc20Address: collectionDetails?.ft_address || "",
    erc1155Address: collectionDetails?.mt_address || "",
    nftTokenId: collectionDetails?.token_id || 0,
    chainId: collectionDetails?.chain_id || 0,
  });
  // const batchBalance = {
  //   erc1155Balance: "33", // 模拟 ERC1155 的普通数字余额
  //   erc20Balance: "987654321098765432109876543210", // 模拟 ERC20 的余额，超过18位
  //   ethBalance: "10876543210987654321076543210", // 模拟 ERC20 的余额，超过18位
  // };

  const handlePayValueChange = (newValue: string) => {
    const decimalRegex = new RegExp(`^\\d+(\\.\\d{0,18})?$`);
    if (decimalRegex.test(newValue)) {
      setPayValue(newValue);
      debouncedPayValidation(newValue);
    }

    if (!newValue) {
      setPayValue("");
      setReceiveValue("");
      setPayDebouncedValue("");
      setReceiveDebouncedValue("");
    }
  };

  const handleReceiveValueChange = (newValue: string) => {
    const decimalRegex = new RegExp(`^\\d+(\\.\\d{0,18})?$`);
    if (decimalRegex.test(newValue)) {
      setReceiveValue(newValue);
      debouncedReceiveValidation(newValue);
    }

    if (!newValue) {
      setPayValue("");
      setReceiveValue("");
      setPayDebouncedValue("");
      setReceiveDebouncedValue("");
    }
  };
  const debouncedPayValidation = useCallback(
    debounce((newValue) => {
      setPayDebouncedValue(newValue || "");
      setTradeType(
        activeTab === "Buy" ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT,
      );
    }, 300),
    [setPayDebouncedValue, activeTab],
  );
  const debouncedReceiveValidation = useCallback(
    debounce((newValue) => {
      setReceiveDebouncedValue(newValue || "");
      setTradeType(
        activeTab === "Buy" ? TradeType.EXACT_OUTPUT : TradeType.EXACT_INPUT,
      );
    }, 300),
    [setReceiveDebouncedValue, activeTab],
  );
  const handleMaxPayValue = useCallback(
    (newValue: string) => {
      setPayValue(newValue);
      setPayDebouncedValue(newValue);
      debouncedPayValidation(newValue);
    },
    [setPayDebouncedValue, debouncedPayValidation, setPayValue],
  );
  const handleMaxReceiveValue = useCallback(
    (newValue: string) => {
      setReceiveValue(newValue);
      setReceiveDebouncedValue(newValue);
      debouncedReceiveValidation(newValue);
    },
    [setReceiveDebouncedValue, debouncedReceiveValidation, setReceiveValue],
  );
  const refetchAll = useCallback(async () => {
    setPayValue("");
    setReceiveValue("");
    setPayDebouncedValue("");
    setReceiveDebouncedValue("");
    debouncedPayValidation("");
    debouncedReceiveValidation("");
    refectBalance();
  }, [refectBalance, debouncedPayValidation, debouncedReceiveValidation]);
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
    if (!collectionDetails?.ft_address) {
      return;
    }
    if (!Number(receiveDebouncedValue)) {
      return;
    }
    if (tradeType === TradeType.EXACT_OUTPUT && activeTab === "Buy") {
      setLoading(true);
      quoteExactOutputSingle(
        WETH_ADDRESS,
        collectionDetails?.ft_address,
        ethers.utils.parseUnits(receiveDebouncedValue, 18),
        collectionDetails?.chain_id,
      )
        .then((res) => {
          setPayValue(formatToken(res || ""));
          setPayDebouncedValue(formatToken(res || ""));
        })
        .finally(() => {
          setLoading(false);
        });
    }
    if (tradeType === TradeType.EXACT_INPUT && activeTab === "Sell") {
      setLoading(true);
      quoteExactInputSingle(
        collectionDetails?.ft_address,
        WETH_ADDRESS,
        ethers.utils.parseUnits(receiveDebouncedValue, 18),
        collectionDetails?.chain_id,
      )
        .then((res) => {
          setPayValue(formatToken(res || ""));
          setPayDebouncedValue(formatToken(res || ""));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [receiveDebouncedValue, collectionDetails, tradeType, activeTab]);
  useEffect(() => {
    if (!collectionDetails?.ft_address) {
      return;
    }
    if (!Number(payDebouncedValue)) {
      return;
    }
    if (tradeType === TradeType.EXACT_INPUT && activeTab === "Buy") {
      setLoading(true);
      quoteExactInputSingle(
        WETH_ADDRESS,
        collectionDetails?.ft_address,
        ethers.utils.parseUnits(payDebouncedValue, 18),
        collectionDetails?.chain_id,
      )
        .then((res) => {
          setReceiveValue(formatToken(res || ""));
          setReceiveDebouncedValue(formatToken(res || ""));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [payDebouncedValue, collectionDetails, tradeType, activeTab]);
  console.log("tradeType", tradeType);

  const handleBuy = useCallback(() => {
    if (
      !(
        collectionDetails?.ft_address &&
        address &&
        receiveDebouncedValue &&
        payDebouncedValue
      )
    ) {
      return;
    }
    setLoading(true);
    buyErc20({
      erc20zAddress: collectionDetails?.ft_address,
      recipient: address,
      minErc20Out: ethers.utils.parseUnits(receiveDebouncedValue, 18),
      ethToSpend: ethers.utils.parseUnits(payDebouncedValue, 18),
      chainId: collectionDetails?.chain_id,
      wallet,
    })
      .then(() => {
        refetchAll();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [
    address,
    receiveDebouncedValue,
    payDebouncedValue,
    collectionDetails,
    refetchAll,
    wallet,
  ]);
  const handleBuy1155 = useCallback(() => {
    if (
      !(
        collectionDetails?.ft_address &&
        address &&
        receiveDebouncedValue &&
        payDebouncedValue
      )
    ) {
      return;
    }
    setLoading(true);
    callBuy1155({
      erc20zAddress: collectionDetails?.ft_address || "",
      num1155ToBuy: Number(receiveDebouncedValue),
      recipient: address || "",
      excessRefundRecipient: address || "",
      maxEthToSpend: ethers.utils.parseUnits(payDebouncedValue, 18),
      sqrtPriceLimitX96: 0,
      chainId: collectionDetails?.chain_id,
      wallet,
    })
      .then(() => {
        refetchAll();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [
    address,
    receiveDebouncedValue,
    payDebouncedValue,
    collectionDetails,
    refetchAll,
    wallet,
  ]);
  const handleSell1155 = useCallback(() => {
    if (
      !(
        collectionDetails?.ft_address &&
        address &&
        receiveDebouncedValue &&
        payDebouncedValue
      )
    ) {
      return;
    }
    setLoading(true);
    callSell1155({
      tokenAddress: collectionDetails?.mt_address || "",
      from: address || "",
      tokenId: collectionDetails?.token_id,
      amount: Number(receiveDebouncedValue),
      minEthToAcquire: ethers.utils.parseUnits(payDebouncedValue, 18),
      chainId: collectionDetails?.chain_id,
      wallet,
    })
      .then(() => {
        refetchAll();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [
    address,
    receiveDebouncedValue,
    payDebouncedValue,
    collectionDetails,
    refetchAll,
    wallet,
  ]);
  const handleSell = useCallback(() => {
    if (
      !(
        collectionDetails?.ft_address &&
        address &&
        receiveDebouncedValue &&
        payDebouncedValue
      )
    ) {
      return;
    }
    setLoading(true);
    sellErc20({
      erc20zAddress: collectionDetails?.ft_address,
      recipient: address,
      minEthToAcquire: ethers.utils.parseUnits(payDebouncedValue, 18),
      erc20AmountIn: ethers.utils.parseUnits(receiveDebouncedValue, 18),
      chainId: collectionDetails?.chain_id,
      wallet,
    })
      .then(() => {
        refetchAll();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [
    address,
    receiveDebouncedValue,
    payDebouncedValue,
    collectionDetails,
    refetchAll,
    wallet,
  ]);

  useEffect(() => {
    if (
      mode === "NFT" &&
      activeTab === "Buy" &&
      !Number.isInteger(receiveDebouncedValue)
    ) {
      if (!collectionDetails?.ft_address) {
        return;
      }
      const nftCount = parseInt(receiveDebouncedValue);
      if (!nftCount) {
        setReceiveValue("1");
        debouncedReceiveValidation("1");
        return;
      }
      setReceiveValue(nftCount?.toString());
      debouncedReceiveValidation(nftCount?.toString());
    }
  }, [
    mode,
    receiveDebouncedValue,
    payDebouncedValue,
    activeTab,
    collectionDetails,
    setReceiveValue,
    debouncedReceiveValidation,
  ]);

  const getClickFun = useCallback(() => {
    if (mode === "NFT") {
      if (activeTab === "Buy") {
        return handleBuy1155;
      }
      if (activeTab === "Sell") {
        return handleSell1155;
      }
    }
    if (activeTab === "Buy") {
      return handleBuy;
    }
    if (activeTab === "Sell") {
      return handleSell;
    }
  }, [activeTab, mode, handleSell1155, handleBuy1155, handleSell, handleBuy]);
  return (
    <Card
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        color: "white",
      }}
    >
      <ModeTab
        mode={mode}
        setMode={(val) => {
          setMode(((prevTab: any) => {
            setPayValue("");
            setReceiveValue("");
            setPayDebouncedValue("");
            setReceiveDebouncedValue("");
            debouncedPayValidation("");
            debouncedReceiveValidation("");
            return val;
          }) as any);
          // setMode(val as ModeType);
        }}
        batchBalance={batchBalance}
      />
      <CardHeader
        sx={{ py: 0, pt: 1 }}
        title={
          <Tabs
            widthFull
            items={tabs}
            onChange={(val) => {
              setActiveTab(((prevTab: any) => {
                setPayValue("");
                setReceiveValue("");
                setPayDebouncedValue("");
                setReceiveDebouncedValue("");
                debouncedPayValidation("");
                debouncedReceiveValidation("");
                return val;
              }) as any);
              // setActiveTab(val as TabType);
            }}
          />
        }
      />
      <CardContent
        sx={{
          p: { md: 3, xs: 1 },
        }}
      >
        <Box sx={{ opacity: loading ? 0.6 : 1 }}>
          <form noValidate autoComplete="off">
            <Box sx={{ position: "relative" }}>
              <TokenInputErc20z
                batchBalance={batchBalance}
                collectionDetails={collectionDetails}
                type="Pay"
                showMax={activeTab === "Sell"}
                activeTab={activeTab}
                value={activeTab === "Buy" ? payValue : receiveValue}
                mode={activeTab === "Buy" ? "Token" : mode}
                handleMaxPayValue={
                  activeTab === "Buy"
                    ? handleMaxPayValue
                    : handleMaxReceiveValue
                }
                handleInputValueChange={
                  activeTab === "Buy"
                    ? handlePayValueChange
                    : handleReceiveValueChange
                }
              />
              {/* <TokenInputErc20z
                batchBalance={batchBalance}
                collectionDetails={collectionDetails}
                type="Receive"
                mode={activeTab === "Sell" ? "Token" : mode}
                activeTab={activeTab}
                disabled={activeTab === "Sell"}
                value={activeTab === "Buy" ? receiveValue : payValue}
                handleInputValueChange={
                  activeTab === "Buy" ? handleReceiveValueChange : () => {}
                }
              /> */}
              <Typography
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  px: 1,
                  pt: 1,
                  fontSize: { md: 14, xs: 12 },
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                <span>
                  {activeTab === "Buy" ? `You'll Get` : `You'll Receive`}
                </span>
                <span>
                  {" "}
                  {activeTab === "Buy"
                    ? formatTokenFixedto(receiveValue) || 0
                    : formatTokenFixedto(payValue) || 0}{" "}
                  {activeTab === "Buy"
                    ? collectionDetails?.symbol?.toUpperCase()
                    : "ETH"}{" "}
                  ($
                  {formatTokenFixedto(
                    Number(ethPrice) * Number(payDebouncedValue) * 0.99,
                    2,
                  )}
                  )
                </span>
              </Typography>
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
            {activeTab === "Buy" ? (
              <Stack
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mt: 2, px: 1 }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: 14,
                    color: "rgba(255,255,255,0.6)",
                    fontFamily: "Poppins",
                  }}
                >
                  Total price
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: 14,
                    color: "rgba(255,255,255,0.6)",
                    fontFamily: "Poppins",
                  }}
                >
                  {formatTokenFixedto(
                    (Number(payDebouncedValue) / 0.99) * 1.0098,
                  )}{" "}
                  ETH($
                  {formatTokenFixedto(
                    Number(ethPrice) *
                    (Number(payDebouncedValue) / 0.99) *
                    1.0098,
                    2,
                  )}
                  )
                </Typography>
              </Stack>
            ) : null}
            {activeTab === "Sell" ? (
              <Stack
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mt: 2, px: 1 }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: 14,
                    color: "rgba(255,255,255,0.6)",
                    fontFamily: "Poppins",
                  }}
                >
                  You will receive
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: 14,
                    color: "rgba(255,255,255,0.6)",
                    fontFamily: "Poppins",
                  }}
                >
                  {/* {Number(payDebouncedValue) * 0.99} */}
                  {formatTokenFixedto(Number(payDebouncedValue) * 0.99)} ETH($
                  {formatTokenFixedto(
                    Number(ethPrice) * Number(payDebouncedValue) * 0.99,
                    2,
                  )}
                  )
                </Typography>
              </Stack>
            ) : null}
            <Stack
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mt: 2, px: 1 }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: "Poppins",
                }}
              >
                Max. slippage
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: "Poppins",
                }}
              >
                1%
              </Typography>
            </Stack>
            <ButtonComfirmErc20z
              collectionDetails={collectionDetails}
              type={activeTab}
              payDebouncedValue={
                activeTab === "Buy" ? payDebouncedValue : receiveDebouncedValue
              }
              clickFun={getClickFun}
              batchBalance={batchBalance}
              mode={mode}
            />
          </form>
        </Box>
      </CardContent>
    </Card>
  );
}

export default SwapCardErc20z;
