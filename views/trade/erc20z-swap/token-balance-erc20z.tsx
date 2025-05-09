import { Skeleton, Stack, Typography } from "@mui/material";
import { useAccount, useBalance, useChainId } from "wagmi";
import { readContract } from "@wagmi/core";
import { useCallback, useEffect, useState } from "react";
import { erc20Abi, zeroAddress } from "viem";
import { config } from "@/configs/wagmi-config";
import { Token } from "@uniswap/sdk-core";
import {
  formatTokenFixedto,
  formatWei,
  formatWeiNoPrecision,
} from "@/utils/format";
import { ethers } from "ethers";

const loading = false;
const balance = "0.00";
const showMax = false;
interface iTokenBalanceErc20z {
  title: string;
  // balance: string;
  token: Token;
  loading: boolean;
  chainId: number;
  showMax: boolean;
  handleMaxPayValue?: (a: string) => void;
}
const TokenBalanceErc20z = () => {
  return (
    <Stack
      flexDirection="row"
      justifyContent="space-between"
      sx={{ px: { md: 2, xs: 0 }, py: { md: 2, xs: 1 } }}
    >
      <Typography variant="h5" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
        title
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
        ) : (
          balance
        )}
        {showMax ? (
          <Typography
            variant="body2"
            onClick={() => {}}
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
        ) : null}
      </Typography>
    </Stack>
  );
};

export default TokenBalanceErc20z;
