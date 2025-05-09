import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import Iconify from "@/components/iconify";
import { Token } from "@uniswap/sdk-core";
import { formatToken, formatUSD } from "@/utils/format";
import BetweenText from "../between-text";
import { zeroAddress } from "viem";
import { WETH_ADDRESS } from "@uniswap/universal-router-sdk";
import { QuoteResponse } from "@/types/token";
import { JupQuoteResponse } from "@/services/useJupiterQuote";
import { utils } from "ethers";
import { useEffect, useState } from "react";
interface iSolPriceInfo {
  payToken: Token;
  receiveToken: Token;
  chainId: number;
  priceImpact: number;
  slippage: number;
  loading?: boolean;
  symbol: string;
  oneTokenData?: JupQuoteResponse;
  tokensPrice: Record<string, string>;
}
const SolPriceInfo = ({
  payToken,
  receiveToken,
  chainId,
  tokensPrice,
  symbol,
  priceImpact,
  oneTokenData,
  loading = true,
  slippage,
}: iSolPriceInfo) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const handleChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };
  useEffect(() => {
    if (Number(priceImpact) > 0) {
      setExpanded(Number(priceImpact) > 0);
    }
  }, [priceImpact]);
  return (
    <Box sx={{ px: 1 }}>
      <Box aria-controls="panel2-content" id="panel2-header" sx={{ pt: 1 }}>
        <Typography
          variant="h5"
          sx={{
            color: "#fff",
            display: "flex",
            alignItems: "center",
            fontSize: { md: 14, xs: 10 },
            justifyContent: "space-between",
          }}
        >
          Exchange Price
          {/* {receiveToken.symbol} */}
          <Typography
            sx={{
              display: "inline-block",
              fontSize: { md: 12, xs: 10 },
              paddingLeft: 1,
              color: "white",
            }}
            variant="body2"
          >
            1 {payToken.symbol} =
            {loading ? (
              <Skeleton
                variant="text"
                width={80}
                height={40}
                sx={{
                  background: "#331f44",
                  mx: 1,
                }}
              />
            ) : oneTokenData?.outAmount ? (
              formatToken(
                utils.formatUnits(
                  oneTokenData?.outAmount || "",
                  receiveToken?.decimals,
                ),
              )
            ) : (
              ""
            )}{" "}
            {receiveToken.symbol} ({formatUSD(tokensPrice?.[payToken.address])})
          </Typography>
        </Typography>
      </Box>
      <Box sx={{ px: 0 }}>
        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ my: 1 }}
        >
          <Typography variant="h5" color="white">
            Slippage
          </Typography>
          <Typography
            variant="h5"
            sx={{
              background:
                slippage > 3 ? "rgb(226, 118, 37)" : "rgba(255,255,255,0.1)",
              py: 0.4,
              px: 1.2,
              color: "white",
              borderRadius: "10px",
            }}
          >
            {`Auto ${slippage}%`}
          </Typography>
        </Stack>
        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ my: 1 }}
        >
          <Typography variant="h5" color="white">
            Price impact
          </Typography>
          <Typography
            variant="h5"
            color={
              priceImpact >= 5
                ? "#DC2626"
                : priceImpact >= 2
                  ? "rgb(226, 118, 37)"
                  : "#00B912"
            }
          >
            ~{priceImpact}%
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default SolPriceInfo;
