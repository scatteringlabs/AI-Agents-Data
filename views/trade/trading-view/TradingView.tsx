import Head from "next/head";
import dynamic from "next/dynamic";
import { useState } from "react";
import Script from "next/script";

import {
  ChartingLibraryWidgetOptions,
  ResolutionString,
} from "@/public/static/charting_library/charting_library";
import { Box, Skeleton, Typography } from "@mui/material";
import Preloader from "@/components/elements/Preloader";
import { calculatePriceScale } from "@/utils/format";
import TokenPriceProvider from "@/context/token-price-provider";

const defaultWidgetProps: Partial<ChartingLibraryWidgetOptions> = {
  symbol: "symbol",
  interval: "1D" as ResolutionString,
  library_path: "/static/charting_library/",
  locale: "en",
  charts_storage_url: "https://saveload.tradingview.com",
  charts_storage_api_version: "1.1",
  client_id: "tradingview.com",
  user_id: "public_user_id",
  fullscreen: false,
  autosize: true,
};

const TVChartContainer = dynamic(
  () =>
    import("@/components/tv-chart-container").then(
      (mod) => mod.TVChartContainer,
    ),
  { ssr: false },
);
interface iTradingView {
  poolAddress?: string;
  chainId?: number;
  tokenPrice?: number;
  symbol?: string;
  loading: boolean;
}
export default function TradingView({
  poolAddress,
  chainId,
  symbol,
  tokenPrice = 0,
  loading = true,
}: iTradingView) {
  const [tradingViewLoading, setTradingViewLoading] = useState(false);
  const [isScriptReady, setIsScriptReady] = useState(false);
  if (loading) {
    return (
      <Box>
        <Skeleton
          variant="rectangular"
          sx={{
            width: "100%",
            height: "450px",
            background: "#331f44",
            borderRadius: 1,
          }}
        />
      </Box>
    );
  }
  return (
    <>
      <Head>
        <title>Scattering | Trade {symbol}</title>
      </Head>
      <Script
        src="/static/datafeeds/udf/dist/bundle.js"
        strategy="lazyOnload"
        onReady={() => {
          setIsScriptReady(true);
        }}
      />
      <TokenPriceProvider>
        {isScriptReady && (
          <TVChartContainer
            config={defaultWidgetProps}
            poolAddress={poolAddress}
            chainId={chainId}
            symbol={symbol}
            setTradingViewLoading={setTradingViewLoading}
            pricescale={calculatePriceScale(tokenPrice)}
          />
        )}
      </TokenPriceProvider>
    </>
  );
}
