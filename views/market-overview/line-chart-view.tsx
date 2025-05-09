import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Highcharts, { LegendItemObject, Series } from "highcharts";
import HighchartsReact from "highcharts-react-official";
// import { data } from "./data-mock";
// import label from "@/components/label";
import { use, useMemo, useState } from "react";
import { formatNumberWithKM } from "@/utils/format";
import { useQuery } from "@tanstack/react-query";
import { getMarketChart } from "@/services/market-overview";
export const CardTitle = styled(Typography)`
  color: #fff;
  font-variant-numeric: lining-nums proportional-nums;
  font-family: Poppins;
  font-size: 16px;
  padding: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 26px;
  text-transform: capitalize;
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;
const CardValue = styled(Typography)`
  color: #fff;
  padding: 20px;
  font-variant-numeric: lining-nums proportional-nums;
  font-family: Poppins;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 26px; /* 162.5% */
  text-transform: capitalize;
  cursor: pointer;
  @media (max-width: 600px) {
    font-size: 12px;
    padding: 20px 6px;
  }
`;

export const CardWrapper = styled(Card)`
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: transparent;
  text-align: center;
`;

const dateRange = [
  {
    label: "7D",
    value: 7,
  },
  {
    label: "1M",
    value: 30,
  },
  {
    label: "3M",
    value: 90,
  },
  {
    label: "1Y",
    value: 365,
  },
  {
    label: "All",
    value: 0,
  },
];
const LineChartView = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [range, setRange] = useState<number>(30);
  const { data } = useQuery({
    queryKey: ["marketChart", { range }],
    queryFn: () => getMarketChart(range),
  });

  const categories = data?.data?.map((item) => {
    const date = new Date(item.bucket);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  });
  const marketCapData = useMemo(
    () => data?.data?.map((item) => Number(item.market_cap)),
    [data],
  );
  const volumeData = useMemo(
    () => data?.data?.map((item) => Number(item.volume)),
    [data],
  );
  const latestVolume = useMemo(
    () => volumeData?.[volumeData?.length - 1] || 0,
    [volumeData],
  );
  const latestMarketCap = useMemo(
    () => marketCapData?.[marketCapData?.length - 1] || 0,
    [marketCapData],
  );

  const options = useMemo(
    () => ({
      chart: {
        type: "column",
        backgroundColor: "rgba(0, 0, 0, 0)",
        zoomType: "xy",
        events: {
          load: function (this: Highcharts.Chart) {
            this.renderer
              .image(
                "https://scattering.io/assets/images/logo/logo.png",
                isMobile ? 60 : 120,
                0,
                isMobile ? 94 : 140,
                isMobile ? 30 : 46,
              )
              .attr({ opacity: 0.4 })
              .add();
          },
        },
      },
      title: {
        text: null,
      },
      xAxis: {
        categories: categories,
        crosshair: false,
        labels: {
          style: {
            color: "#A0A0A0",
            fontSize: "14px",
          },
        },
        lineColor: "rgba(0, 0, 0, 0.87)",
        tickColor: "rgba(0, 0, 0, 0.87)",
      },
      yAxis: [
        {
          title: {
            text: " ",
            // text: "Market Cap ($)",
            style: {
              color: "#A0A0A0",
              fontSize: "14px",
            },
          },
          labels: {
            style: {
              color: "#A0A0A0",
              fontSize: "12px",
            },
          },
          opposite: true,
          gridLineColor: "transparent",
          lineColor: "rgba(0, 0, 0, 0.87)",
          tickColor: "rgba(0, 0, 0, 0.87)",
          visible: false,
          height: "70%",
          top: "0%",
        },
        {
          title: {
            // text: "Volume ($) ",
            text: " ",
            style: {
              color: "#A0A0A0",
              fontSize: "14px",
            },
          },
          height: "80%",
          top: "20%",
          labels: {
            style: {
              color: "#A0A0A0",
              fontSize: "12px",
            },
          },
          opposite: false,
          gridLineColor: "transparent",
          lineColor: "rgba(0, 0, 0, 0.87)",
          tickColor: "rgba(0, 0, 0, 0.87)",
        },
      ],
      legend: {
        itemStyle: {
          color: "#E0E0E0",
          fontSize: "16px",
        },
        itemHoverStyle: {
          color: "#E0E0E0",
        },
        // symbolHeight: 12,
        // symbolWidth: 12,
        // symbolRadius: 6,
        useHTML: true,
        symbol: "circle",
        labelFormatter: function (this: Series): string {
          if (this.name === "Volume") {
            return `Volume: <span class="chart-text"> $${formatNumberWithKM(latestVolume)}</span>`;
          }
          if (this.name === "Market Cap") {
            return `Market Cap: <span  class="chart-text"> $${formatNumberWithKM(latestMarketCap)}</span>`;
          }
          return "";
        },
      },
      plotOptions: {
        series: {
          marker: {
            symbol: "circle",
          },
        },
        column: {
          maxPointWidth: 40,
          borderWidth: 0, // Remove white borders
          shadow: false, // Remove shadow
        },
      },
      series: [
        {
          name: "Volume",
          data: volumeData,
          yAxis: 1,
          type: "column",
          color: "#965FF3",
          borderWidth: 0,
          groupPadding: 0,
          // zIndex: 1,
          states: {
            hover: {
              enabled: true,
              brightness: 0.1,
            },
          },
          marker: {
            radius: 8,
            symbol: "circle",
          },
          tooltip: {
            pointFormat: "Volume: ${point.yFormatted}<br>",
          },
        },
        {
          name: "Market Cap",
          data: marketCapData,
          type: "spline",
          color: "#5451FF",
          borderWidth: 0,
          // opposite: true,
          yAxis: 0,
          // zIndex: 2,
          states: {
            hover: {
              enabled: true,
              brightness: 1,
            },
          },
          marker: {
            radius: 8,
            symbol: "circle",
          },
          tooltip: {
            pointFormat: "Market Cap: ${point.yFormatted}<br>",
          },
        },
      ],
      tooltip: {
        shared: true,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        style: {
          color: "#F0F0F0",
          fontSize: "16px",
        },
        headerFormat: "<b>{point.key}</b><br>",
        formatter: function (
          this: Highcharts.TooltipFormatterContextObject,
        ): string {
          const points = this.points
            ? this.points
                .map((point) => {
                  const seriesName = point.series.name;
                  const valueFormatted = formatNumberWithKM(
                    Number(point.y || 0),
                  );
                  return `<span style="color:${point.color}">\u25CF</span> ${seriesName}: <b>$${valueFormatted}</b><br/>`;
                })
                .join("")
            : "";
          return `<b>${this.x}</b><br/>${points}`;
        },
      },
      credits: {
        enabled: false,
      },
    }),
    [
      categories,
      marketCapData,
      volumeData,
      latestVolume,
      latestMarketCap,
      isMobile,
    ],
  );

  return (
    <Grid item xs={12} sm={12} md={12} sx={{ mt: 2 }}>
      <CardWrapper>
        <Stack
          sx={{
            flexDirection: { md: "row", xs: "column" },
            justifyContent: { md: "space-between", xs: "flex-start" },
          }}
        >
          <CardTitle sx={{ padding: { md: "20px", xs: "10px" } }}>
            Overall Market Cap / Volume
          </CardTitle>
          <Stack flexDirection="row" justifyContent="space-between">
            {dateRange?.map(({ label, value }) => (
              <CardValue
                key={value}
                onClick={() => {
                  setRange(value);
                }}
                sx={
                  value === range
                    ? {
                        color: "#965FF3",
                        fontWeight: 700,
                        padding: { md: "20px", xs: "6px 20px" },
                      }
                    : { padding: { md: "20px", xs: "6px 20px" } }
                }
              >
                {label}
              </CardValue>
            ))}
          </Stack>
        </Stack>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </CardWrapper>
    </Grid>
  );
};

export default LineChartView;
