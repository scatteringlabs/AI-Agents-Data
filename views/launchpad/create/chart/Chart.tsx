import React, { useEffect, useRef } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  BarData,
} from "lightweight-charts";
import { fetchKlineData } from "@/services/graphql/k-line";

interface ChartProps {
  tokenAddress: string;
  resolution: string;
  pricescale: number;
}

const Chart: React.FC<ChartProps> = ({
  tokenAddress,
  resolution,
  pricescale,
}) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null); // 容器元素的引用
  const chartRef = useRef<IChartApi | null>(null); // 存储图表实例
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null); // 存储 K 线图系列

  // 初始化图表
  useEffect(() => {
    if (!chartRef.current && chartContainerRef.current) {
      chartRef.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
        layout: {
          // background: "#FFFFFF",
          textColor: "#000",
        },
        grid: {
          vertLines: {
            color: "#FF5252",
          },
          horzLines: {
            color: "#FF5252",
          },
        },
        // priceScale: {
        //   borderColor: "#FF5252",
        // },
        timeScale: {
          borderColor: "#FF5252",
        },
      });

      // 创建 K 线图系列
      candleSeriesRef.current = chartRef.current.addCandlestickSeries({
        upColor: "#4CAF50",
        downColor: "#FF5252",
        borderDownColor: "#FF5252",
        borderUpColor: "#4CAF50",
        wickDownColor: "#FF5252",
        wickUpColor: "#4CAF50",
      });
    }

    return () => {
      if (chartRef?.current) {
        chartRef.current?.remove();
      }
    };
  }, []);

  // 根据传入的 resolution 加载数据
  useEffect(() => {
    const fetchData = async () => {
      let priceType: string;

      // 根据 resolution 设置 priceType
      switch (resolution) {
        case "1":
          priceType = "15s";
          break;
        case "5":
        case "15":
          priceType = "1m";
          break;
        case "60":
        case "240":
          priceType = "1h";
          break;
        case "1D":
          priceType = "1d";
          break;
        default:
          priceType = "1m"; // 默认选择 1 分钟
      }

      try {
        const data = await fetchKlineData(tokenAddress, priceType);

        if (data && data.tokenEntities.length > 0) {
          const tokenEntity = data.tokenEntities[0];

          // 转换数据格式用于图表
          const bars = tokenEntity.prices.map((price) => ({
            time: new Date(
              Number(price?.timestamp) * 1000,
            ).toLocaleDateString(), // 使用秒的 Unix 时间戳
            open: Number(price.openPrice),
            high: Number(price.maxPrice),
            low: Number(price.minPrice),
            close: Number(price.closePrice),
          }));
          console.log("bars", bars);

          // 将数据设置到图表中
          if (candleSeriesRef.current) {
            // candleSeriesRef.current.setData(bars);
            candleSeriesRef.current.setData([
              {
                time: "2018-12-22",
                open: 75.16,
                high: 82.84,
                low: 36.16,
                close: 45.72,
              },
              {
                time: "2018-12-23",
                open: 45.12,
                high: 53.9,
                low: 45.12,
                close: 48.09,
              },
              {
                time: "2018-12-24",
                open: 60.71,
                high: 60.71,
                low: 53.39,
                close: 59.29,
              },
              {
                time: "2018-12-25",
                open: 68.26,
                high: 68.26,
                low: 59.04,
                close: 60.5,
              },
              {
                time: "2018-12-26",
                open: 67.71,
                high: 105.85,
                low: 66.67,
                close: 91.04,
              },
              {
                time: "2018-12-27",
                open: 91.04,
                high: 121.4,
                low: 82.7,
                close: 111.4,
              },
              {
                time: "2018-12-28",
                open: 111.51,
                high: 142.83,
                low: 103.34,
                close: 131.25,
              },
              {
                time: "2018-12-29",
                open: 131.33,
                high: 151.17,
                low: 77.68,
                close: 96.43,
              },
              {
                time: "2018-12-30",
                open: 106.33,
                high: 110.2,
                low: 90.39,
                close: 98.1,
              },
              {
                time: "2018-12-31",
                open: 109.87,
                high: 114.69,
                low: 85.66,
                close: 111.26,
              },
            ]);
          }
        }
      } catch (error) {
        console.error("Error fetching K-line data:", error);
      }
    };

    fetchData();
  }, [tokenAddress, resolution]);

  // 处理图表的窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.resize(chartContainerRef.current.clientWidth, 400);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      ref={chartContainerRef}
      style={{ position: "relative", width: "100%" }}
    />
  );
};

export default Chart;
