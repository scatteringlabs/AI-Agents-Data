import Head from "next/head";
import dynamic from "next/dynamic";
import { MutableRefObject, useState } from "react";
import Script from "next/script";

import {
  ChartingLibraryWidgetOptions,
  ResolutionString,
} from "@/public/static/charting_library/charting_library";
import { Box, Skeleton, Typography } from "@mui/material";
import Preloader from "@/components/elements/Preloader";
import { calculatePriceScale } from "@/utils/format";
import MyCustomDataFeed from "@/components/tv-chart-container-l/MyCustomDataFeed";

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
    import("@/components/tv-chart-container-l").then(
      (mod) => mod.TVChartContainerL,
    ),
  { ssr: false },
);
interface iTradingView {
  tokenAddress?: string;
  chainId?: number;
  tokenPrice?: number;
  symbol?: string;
  loading: boolean;
  dataFeedRef: MutableRefObject<MyCustomDataFeed | undefined>;
}
export default function TradingViewL({
  tokenAddress,
  chainId,
  symbol,
  tokenPrice = 0,
  loading = true,
  dataFeedRef,
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
      {isScriptReady && (
        <TVChartContainer
          config={defaultWidgetProps}
          tokenAddress={tokenAddress}
          chainId={chainId}
          dataFeedRef={dataFeedRef}
          symbol={symbol || "S"}
          setTradingViewLoading={setTradingViewLoading}
          pricescale={calculatePriceScale(tokenPrice)}
        />
      )}
    </>
  );
}
