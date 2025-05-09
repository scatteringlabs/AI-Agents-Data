import { Box, Skeleton, Stack, Typography } from "@mui/material";
import { useAccount, useBalance, useChainId } from "wagmi";
import { readContract } from "@wagmi/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { erc20Abi, zeroAddress } from "viem";
import { config } from "@/configs/wagmi-config";
import { ChainId, Token } from "@uniswap/sdk-core";
import {
  formatTokenFixedto,
  formatWei,
  formatWeiNoPrecision,
} from "@/utils/format";
import { ethers } from "ethers";
import ChainLogoCard from "./chain-logo-card";
import ChainSelector from "./chain-select-card";
import { useSelectedChain } from "@/store/atoms/hooks/useSelectedChain";
import { useQuery } from "@tanstack/react-query";
import fetchMultipleChainBalanceData from "@/services/multiple-chain/balance";
import { BatchBalanceResult } from "@/services/zora/swap/balance404";
import { formatWeiToToken } from "../erc20z-swap/swap-card";
interface iTokenBalance {
  title: string;
  // balance: string;
  token: Token;
  loading: boolean;
  chainId: number;
  showMax: boolean;
  batchBalance?: BatchBalanceResult;
  handleMaxPayValue?: (a: string) => void;
}
const TokenBalance = ({
  title,
  loading,
  chainId,
  token,
  handleMaxPayValue,
  showMax,
  batchBalance,
}: iTokenBalance) => {
  return (
    <Stack
      flexDirection="row"
      justifyContent="space-between"
      sx={{ px: { md: 2, xs: 0 }, py: { md: 2, xs: 1 } }}
    >
      <Box sx={{ display: "flex", alignItems: "center", columnGap: 1 }}>
        <Typography variant="h5" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
          {title} {token?.symbol?.toUpperCase()}
        </Typography>
        {/* {token?.symbol === "ETH" ? (
          <ChainSelector chainId={chainId} />
        ) : (
        )} */}
        {/* <ChainLogoCard chainId={chainId} /> */}
      </Box>
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
        ) : token?.symbol === "ETH" ? (
          formatWeiToToken(batchBalance?.ethBalance, token?.decimals)
        ) : (
          formatWeiToToken(batchBalance?.erc20Balance, token?.decimals)
        )}
      </Typography>
    </Stack>
  );
};

export default TokenBalance;
