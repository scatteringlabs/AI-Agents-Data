import { formatUSD } from "@/utils/format";
import { Box, Stack, Typography } from "@mui/material";
import { Token } from "@uniswap/sdk-core";
import { WETH_ADDRESS } from "@uniswap/universal-router-sdk";
import { useMemo } from "react";
import { zeroAddress } from "viem";

const uniFee = 0.0025;
interface iFeeInfo {
  tokensPrice: Record<string, string>;
  receiveAmount: string;
  chainId: number;
  scrFee: number;
  receiveToken: Token;
  isSol?: boolean;
}
const FeeInfo = ({
  tokensPrice,
  receiveToken,
  chainId,
  receiveAmount,
  scrFee = 0,
  isSol = false,
}: iFeeInfo) => {
  const receivePrice = useMemo(
    () =>
      tokensPrice?.[
        receiveToken?.address?.toLowerCase() === zeroAddress
          ? WETH_ADDRESS(chainId)?.toLowerCase()
          : receiveToken?.address?.toLowerCase()
      ] || 0,
    [tokensPrice, receiveToken, chainId],
  );

  const scrFeeUsd = useMemo(
    () => Number(receivePrice) * Number(receiveAmount) * scrFee,
    [receivePrice, receiveAmount, scrFee],
  );
  const uniFeeUsd = useMemo(
    () => Number(receivePrice) * Number(receiveAmount) * uniFee,
    [receivePrice, receiveAmount],
  );
  return (
    <Box sx={{ mt: 2 }}>
      {isSol ? null : (
        <Stack
          sx={{
            background: "rgba(87, 87, 87, 0.1)",
            p: 2,
            borderRadius: 2,
            mt: 2,
          }}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack flexDirection="row" alignItems="center">
            <Box
              component="img"
              sx={{ width: { md: 32, xs: 24 } }}
              src="/assets/images/logo/uniswap-logo.svg"
            />
            <Typography
              variant="h5"
              sx={{
                ml: 0.4,
                textDecoration: "line-through",
                fontSize: { md: 16, xs: 12 },
              }}
            >
              Uniswap
            </Typography>
            <Typography
              variant="body2"
              sx={{ ml: 1, fontSize: 12, textDecoration: "line-through" }}
            >
              Swap Fee: {uniFee * 100}%
            </Typography>
          </Stack>

          <Stack alignItems="center">
            <Typography
              variant="h5"
              sx={{ color: "#17D070", textDecoration: "line-through" }}
            >
              {formatUSD(uniFeeUsd)}
            </Typography>
          </Stack>
        </Stack>
      )}
    </Box>
  );
};

export default FeeInfo;
