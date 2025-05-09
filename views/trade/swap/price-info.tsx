import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Skeleton,
  Typography,
} from "@mui/material";
import Iconify from "@/components/iconify";
import { Token } from "@uniswap/sdk-core";
import { formatToken, formatUSD } from "@/utils/format";
import BetweenText from "./between-text";
import { zeroAddress } from "viem";
import { WETH_ADDRESS } from "@uniswap/universal-router-sdk";
import { QuoteResponse } from "@/types/token";
interface iPriceInfo {
  payToken: Token;
  receiveToken: Token;
  chainId: number;
  loading?: boolean;
  oneTokenData?: QuoteResponse;
  tokensPrice: Record<string, string>;
}
const PriceInfo = ({
  payToken,
  receiveToken,
  chainId,
  tokensPrice,
  oneTokenData,
  loading = true,
}: iPriceInfo) => {
  return (
    <Accordion
      sx={{
        boxShadow: "none",
        background: "transparent",
        ".MuiAccordionSummary-root": {
          px: 0,
        },
        ".MuiAccordionSummary-content": {
          margin: 0,
          padding: 0,
        },
      }}
    >
      <AccordionSummary
        expandIcon={
          <Iconify
            icon="ri:arrow-drop-down-line"
            sx={{
              color: "#fff",
              p: 0,
            }}
          />
        }
        aria-controls="panel2-content"
        id="panel2-header"
      >
        <Typography
          variant="h5"
          sx={{
            color: "#fff",
            display: "flex",
            alignItems: "center",
            fontSize: { md: 14, xs: 10 },
          }}
        >
          Exchange Price: 1 {payToken.symbol} ={" "}
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
          ) : (
            formatToken(oneTokenData?.quote?.quoteDecimals || "")
          )}{" "}
          {receiveToken?.symbol}
          <Typography
            sx={{
              display: "inline-block",
              fontSize: { md: 12, xs: 10 },
              paddingLeft: 1,
            }}
            variant="body2"
          >
            (
            {formatUSD(
              tokensPrice?.[
                (payToken.address === zeroAddress
                  ? WETH_ADDRESS(chainId)
                  : payToken.address
                ).toLowerCase()
              ],
            )}
            )
          </Typography>
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 0 }}>
        <BetweenText
          lText="Max. slippage"
          rText={`${oneTokenData?.quote?.slippage || 0.5}%`}
        />
        {/* <BetweenText lText="Fee" rText="0.1%" /> */}
        {/* <BetweenText
          lText="Network fee"
          rText={formatUSD(oneTokenData?.quote?.gasUseEstimateUSD || "")}
        /> */}
        <BetweenText
          lText="Order routing"
          rText="Scattering API"
          tip={oneTokenData?.quote?.routeString}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default PriceInfo;
