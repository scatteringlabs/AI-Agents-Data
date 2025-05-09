import styles from "./index.module.css";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import {
  ChartingLibraryWidgetOptions,
  LanguageCode,
  ResolutionString,
  widget,
} from "@/public/static/charting_library";
import { Card } from "@mui/material";
import MyCustomDataFeed from "./MyCustomDataFeed";
// import { useTradeTokenPrice } from "@/context/hooks/useTradeTokenPrice";
import { geckoNetworkName } from "@/services/tokens";
interface iTVChartContainer {
  config: Partial<ChartingLibraryWidgetOptions>;
  tokenAddress?: string;
  chainId?: number;
  pricescale: number;
  symbol?: string;
  dataFeedRef: MutableRefObject<MyCustomDataFeed | undefined>;
  setTradingViewLoading: (a: boolean) => void;
}
export const TVChartContainerL = ({
  config,
  tokenAddress,
  chainId = 1,
  symbol = "symbol",
  setTradingViewLoading,
  pricescale,
  dataFeedRef,
}: iTVChartContainer) => {
  const chartContainerRef =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  // const { setTokenPrice, currency, setCurrency } = useTradeTokenPrice();

  useEffect(() => {
    const customDataFeed = new MyCustomDataFeed(
      tokenAddress,
      geckoNetworkName?.[chainId],
      // setTokenPrice,
      // currency,
      setTradingViewLoading,
      pricescale,
    );
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol,
      // BEWARE: no trailing slash is expected in feed URL
      // @ts-ignore
      datafeed: customDataFeed,
      // datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(
      //   "https://demo_feed.tradingview.com",
      //   undefined,
      //   {
      //     maxResponseLength: 1000,
      //     expectedOrder: "latestFirst",
      //   },
      // ),
      // interval: config.interval as ResolutionString,
      interval: "15" as ResolutionString,
      container: chartContainerRef.current,
      library_path: config.library_path,
      locale: config.locale as LanguageCode,
      disabled_features: ["use_localstorage_for_settings"],
      enabled_features: ["study_templates"],
      charts_storage_url: config.charts_storage_url,
      charts_storage_api_version: config.charts_storage_api_version,
      client_id: config.client_id,
      user_id: config.user_id,
      fullscreen: config.fullscreen,
      autosize: config.autosize,
      theme: "Dark",
      overrides: {
        "mainSeriesProperties.candleStyle.upColor": "#00B912",
        "mainSeriesProperties.candleStyle.downColor": "#DC2626",
        "paneProperties.background": "#0f111c",
        "paneProperties.vertGridProperties.color": "#252C40",
        "paneProperties.backgroundType": "solid",
        "paneProperties.horzGridProperties.color": "#252C40",
        "scalesProperties.textColor": "#AAA",
      },
    };
    dataFeedRef.current = customDataFeed;
    const tvWidget = new widget(widgetOptions);

    tvWidget.onChartReady(() => {
      tvWidget.headerReady().then(() => {
        // const button = tvWidget.createButton();
        // button.setAttribute("title", "Click to switch token price");
        // button.classList.add("apply-common-tooltip");
        // button.addEventListener("click", () => {
        //   if (currency === "token") {
        //     setCurrency("usd");
        //     return;
        //   }
        //   setCurrency("token");
        // });
        // button.innerHTML = `Switch to ${currency === "usd" ? "WETH" : "USDT"}`;
      });
    });

    return () => {
      tvWidget.remove();
    };
  }, [
    config,
    tokenAddress,
    chainId,
    symbol,
    // currency,
    // setCurrency,
    // setTokenPrice,
    setTradingViewLoading,
    pricescale,
    dataFeedRef,
  ]);

  return (
    <Card
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        color: "white",
      }}
    >
      <div ref={chartContainerRef} className={styles.TVChartContainer} />
    </Card>
  );
};
