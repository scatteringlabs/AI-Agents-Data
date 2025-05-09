import {
  Box,
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import AvatarCard from "@/components/collections/avatar-card";
import { Token } from "@uniswap/sdk-core";
import { ChangeEventHandler, useCallback, useMemo } from "react";
import { InputWrapper } from "../swap/wrapper";
import TokenBalanceErc20z from "./token-balance-erc20z";
import { CollectionDetailsErc20z } from "@/types/collection";
import { getTokenLogoURL } from "@/utils/token";
import { zeroAddress } from "viem";
import { BatchBalanceResult } from "@/services/zora/swap/balance";
import { ethers } from "ethers";
import { formatTokenFixedto } from "@/utils/format";
import { formatWeiToToken, ModeType } from "./swap-card";
const loading = false;
const balance = "0.00";
const showMax = false;
type ActiveTab = "Buy" | "Sell";
type Type = "Pay" | "Receive";
interface iTokenInput {
  collectionDetails?: CollectionDetailsErc20z;
  type: Type;
  activeTab: ActiveTab;
  batchBalance?: BatchBalanceResult;
  // chainId: number;
  value: string;
  mode: ModeType;
  disabled?: boolean;
  // erc20Address: string;
  // token: Token;
  // baseTokens?: Token[];
  showMax?: boolean;
  // hasLogo?: boolean;
  // tokenBalanceLoading?: boolean;
  // inputTitle: string;
  // balance: string;
  // symbol: string;
  // logoUrl?: string;
  handleMaxPayValue?: (value: string) => void;
  handleInputValueChange?: (value: string) => void;
}
const percentages = [25, 50, 75, 100];
const TokenInputErc20z = ({
  collectionDetails,
  type,
  activeTab,
  batchBalance,
  value,
  mode,
  handleInputValueChange,
  disabled = false,
  showMax = false,
  handleMaxPayValue,
}: iTokenInput) => {
  const mappingSymbol: Record<ActiveTab, Record<Type, string>> = useMemo(
    () => ({
      Buy: {
        Pay: "ETH",
        Receive: collectionDetails?.symbol || "",
      },
      Sell: {
        Pay: collectionDetails?.symbol || "",
        Receive: "ETH",
      },
    }),
    [collectionDetails],
  );
  const handlePercentageClick = useCallback(
    (percentage: number) => {
      const erc20BalanceWei =
        mappingSymbol?.[activeTab]?.[type] === "ETH"
          ? batchBalance?.ethBalance || 0
          : batchBalance?.erc20Balance || 0;
      const balance = ethers.BigNumber.from(erc20BalanceWei)
        .mul(percentage)
        .div(100);

      handleMaxPayValue?.(ethers.utils.formatUnits(balance, 18) || "0");
    },
    [batchBalance, handleMaxPayValue, activeTab, type, mappingSymbol],
  );

  return (
    <InputWrapper
      sx={{
        position: "relative",
        padding: { md: "0px 0px 10px 0px", xs: "10px" },
        pb: 2,
        cursor: disabled ? "not-allowed" : "auto",
      }}
    >
      <Stack
        flexDirection="row"
        justifyContent="space-between"
        sx={{ px: { md: 2, xs: 0 }, py: { md: 2, xs: 1 } }}
      >
        <Typography variant="h5" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
          {type} {mappingSymbol?.[activeTab]?.[type] || ""}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: "rgba(255, 255, 255, 0.6)",
            display: "flex",
            alignItems: "center",
            fontSize: { md: 14, xs: 12 },
          }}
        >
          Balance:{" "}
          {loading ? (
            <Skeleton
              sx={{
                background: "#331f44",
                borderRadius: 2,
                ml: 1,
              }}
              variant="rectangular"
              height={20}
              width={60}
            />
          ) : mappingSymbol?.[activeTab]?.[type] === "ETH" ? (
            formatWeiToToken(batchBalance?.ethBalance)
          ) : mode === "NFT" ? (
            batchBalance?.erc1155Balance
          ) : (
            formatWeiToToken(batchBalance?.erc20Balance)
          )}
          {/* {showMax ? (
            <Typography
              variant="body2"
              onClick={() => {
                handleMaxPayValue?.(
                  mappingSymbol?.[activeTab]?.[type] === "ETH"
                    ? ethers.utils
                        .formatUnits(
                          batchBalance?.ethBalance?.toString() || "0",
                        )
                        ?.toString() || "0"
                    : mode === "NFT"
                      ? batchBalance?.erc1155Balance?.toString() || "0"
                      : ethers.utils
                          .formatUnits(
                            batchBalance?.erc20Balance?.toString() || "0",
                          )
                          ?.toString() || "0",
                );
              }}
              sx={{
                display: "inline-block",
                color: "#AF54FF",
                fontSize: { md: 14, xs: 12 },
                ml: 1,
                cursor: "pointer",
              }}
            >
              max
            </Typography>
          ) : null} */}
        </Typography>
      </Stack>
      {mode === "NFT" && type === "Pay" ? null : (
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: { md: 1, xs: 0 }, pt: 0, columnGap: "10px !important" }}
        >
          {percentages.map((percentage) => (
            <Typography
              key={percentage}
              variant="body2"
              onClick={() => handlePercentageClick(percentage)}
              sx={{
                display: "inline-block",
                color: "#AF54FF", // 可根据设计调整颜色
                fontSize: { md: 10, xs: 8 },
                ml: { md: 1, xs: 0 },
                cursor: "pointer",
                border: "1px solid #AF54FF",
                px: { md: 1, xs: 0.6 },
                py: 0.6,
                borderRadius: 1,
              }}
            >
              {percentage}%
            </Typography>
          ))}
          {/* <Typography
            variant="body2"
            sx={{
              display: "inline-block",
              color: "#AF54FF", // 可根据设计调整颜色
              fontSize: { md: 10, xs: 8 },
              ml: { md: 1, xs: 0 },
              cursor: "pointer",
              border: "1px solid #AF54FF",
              px: { md: 1, xs: 0.6 },
              py: 0.6,
              borderRadius: 1,
            }}
            onClick={() => {
              // handle1NFTChange?.();
            }}
          >
            NFT(1M)
          </Typography> */}
        </Box>
      )}
      <Stack
        flexDirection="row"
        justifyContent="space-between"
        sx={{
          px: { md: 2, xs: 0 },
          pt: { md: 2, xs: 1 },
        }}
      >
        <FormControl>
          <OutlinedInput
            disabled={disabled}
            placeholder="0"
            className="swap-input"
            value={value}
            // inputProps={{ min: "0" }}
            inputProps={{
              min: mode === "NFT" ? "1" : "0",
              step: mode === "NFT" ? "1" : "any", // 1155 模式限制只能输入整数
              type: "number", // 设为数字类型
            }}
            onChange={(e) => {
              let inputValue = e.target.value;

              if (mode === "NFT" && inputValue !== "") {
                // 只在非空时处理最小值和整数逻辑
                const parsedValue = Math.max(
                  1,
                  Math.floor(Number(inputValue) || 0),
                );
                inputValue = parsedValue.toString();
              }

              // 回调处理
              handleInputValueChange?.(inputValue);
            }}
            sx={{
              input: {
                width: {
                  md: "300px !important",
                  xs: "calc(100vw - 300px) !important",
                },
                fontSize: { md: "30px !important", xs: "20px !important" },
              },
            }}
          />
        </FormControl>
        <Box sx={{ display: "flex", alignItems: "center", columnGap: 1 }}>
          {mappingSymbol?.[activeTab]?.[type] === collectionDetails?.symbol ? (
            <AvatarCard
              hasLogo={!!collectionDetails?.logo_url}
              symbol={collectionDetails?.symbol}
              logoUrl={
                collectionDetails?.logo_url ? collectionDetails?.logo_url : ""
              }
              chainId={collectionDetails?.chain_id}
              size={32}
              mr={0}
            />
          ) : (
            <AvatarCard
              hasLogo
              symbol="ETH"
              logoUrl={getTokenLogoURL({
                address: zeroAddress,
                chainId: 1,
                size: 100,
              })}
              chainId={collectionDetails?.chain_id}
              size={32}
              mr={0}
            />
          )}
          <Typography
            variant="h4"
            sx={{
              fontSize: { md: 20, xs: 16 },
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100px",
              overflow: "hidden",
              textTransform: "uppercase",
            }}
          >
            {mappingSymbol?.[activeTab]?.[type]}
          </Typography>
        </Box>
      </Stack>
    </InputWrapper>
  );
};

export default TokenInputErc20z;
