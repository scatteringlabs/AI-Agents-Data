import { Skeleton, Stack, Typography } from "@mui/material";
import { useAccount, useBalance, useChainId } from "wagmi";
import { readContract } from "@wagmi/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { erc20Abi, zeroAddress } from "viem";
import { config } from "@/configs/wagmi-config";
import { Token } from "@uniswap/sdk-core";
import {
  formatToken,
  formatTokenFixedto,
  formatWei,
  formatWeiNoPrecision,
} from "@/utils/format";
import { useSolBalance } from "@/hooks/sol/useSolanaBalance";
import { useTokenBalance } from "@/hooks/sol/SolTokenBalanceChecker";
import { useSolActiveToken } from "@/context/hooks/useSolActiveToken";
interface iSolTokenBalance {
  title: string;
  erc20Address: string;
  solBalance: string | number | null;
  tokenBalance: string | number | null;
  activeTokenBalance: string | number | null;
  // balance: string;
  // token: Token;
  loading: boolean;
  // chainId: number;
  showMax: boolean;
  isNative: boolean;
  handleMaxPayValue?: (a: string) => void;
}
const SolTokenBalance = ({
  title,
  loading,
  handleMaxPayValue,
  showMax,
  erc20Address,
  isNative,
  solBalance,
  tokenBalance,
  activeTokenBalance,
}: iSolTokenBalance) => {
  const { activeToken } = useSolActiveToken();
  const maxBalance = useMemo(
    () =>
      isNative
        ? activeToken?.address === "So11111111111111111111111111111111111111112"
          ? solBalance
          : activeTokenBalance
        : tokenBalance,
    [isNative, activeToken, solBalance, activeTokenBalance, tokenBalance],
  );
  return (
    <Stack
      flexDirection="row"
      justifyContent="space-between"
      sx={{ px: { md: 2, xs: 0 }, py: { md: 2, xs: 1 } }}
    >
      <Typography variant="h5" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
        {title}
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
        ) : isNative ? (
          activeToken?.address ===
          "So11111111111111111111111111111111111111112" ? (
            formatTokenFixedto(Number(solBalance))
          ) : (
            formatTokenFixedto(Number(activeTokenBalance))
          )
        ) : (
          formatTokenFixedto(Number(tokenBalance))
        )}
        {/* {showMax ? (
          <Typography
            variant="body2"
            onClick={() =>
              handleMaxPayValue?.(Number(maxBalance || 0).toString())
            }
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
  );
};

export default SolTokenBalance;
