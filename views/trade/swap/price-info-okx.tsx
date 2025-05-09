import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Skeleton,
  Typography,
} from "@mui/material";
import Iconify from "@/components/iconify";
import { Token } from "@uniswap/sdk-core";
import { formatToken, formatTokenFixedto, formatUSD } from "@/utils/format";
import BetweenText from "./between-text";
import { zeroAddress } from "viem";
import { WETH_ADDRESS } from "@uniswap/universal-router-sdk";
import { QuoteResponse } from "@/types/token";
import { CrossSwapResponse } from "@/services/okx/useOkxswapQuoteNew";
interface iPriceInfoOkx {
  payToken: Token;
  receiveToken: Token;
  chainId: number;
  loading?: boolean;
  oneTokenData?: CrossSwapResponse;
  tokensPrice: Record<string, string>;
}
const PriceInfoOkx = ({
  payToken,
  receiveToken,
  chainId,
  tokensPrice,
  oneTokenData,
  loading = true,
}: iPriceInfoOkx) => {
  return (
    <Box sx={{}}>
      {/* <AccordionSummary
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
      > */}
      <Typography
        variant="h5"
        sx={{
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: { md: 14, xs: 10 },
        }}
      >
        Exchange Price
        <Typography
          sx={{
            display: "inline-block",
            fontSize: { md: 14, xs: 10 },
            paddingLeft: 1,
            color: "#fff",
          }}
          variant="body2"
        >
          1 {payToken.symbol} ={" "}
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
            formatTokenFixedto(
              oneTokenData?.data?.singleChainSwapInfo?.receiveAmount || "",
            )
          )}{" "}
          {receiveToken?.symbol}(
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
      {/* </AccordionSummary>
      <AccordionDetails sx={{ px: 0 }}> */}
      {/* <BetweenText
        lText="Est network fee"
        rText={
          // @ts-ignore
          `$${formatTokenFixedto(oneTokenData?.data?.singleChainSwapInfo?.quoteNetWorkFeeOfMoney, 2)}(${formatTokenFixedto(oneTokenData?.data?.singleChainSwapInfo?.networkFeeOfNativeToken)} ETH)`
        }
        // tip={oneTokenData?.quote?.routeString}
      /> */}
      <BetweenText
        lText="Slippage Auto"
        // @ts-ignore
        rText={`${oneTokenData?.data?.singleChainSwapInfo?.autoSlippageInfo?.autoSlippage * 100}%`}
      />
      {/* <BetweenText lText="Fee" rText="0.1%" /> */}
      {/* <BetweenText
          lText="Network fee"
          rText={formatUSD(oneTokenData?.quote?.gasUseEstimateUSD || "")}
        /> */}
      {/* <BetweenText
          lText="Order routing"
          rText="Scattering API"
          // tip={oneTokenData?.quote?.routeString}
        /> */}
      {/* </AccordionDetails> */}
    </Box>
  );
};

export default PriceInfoOkx;
