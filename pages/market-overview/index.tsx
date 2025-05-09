import { getMarketChart, getMarketStats } from "@/services/market-overview";
import { formatNumberWithKM } from "@/utils/format";
import CardView, {
  CardTitle,
  CardValue,
  CardWrapper,
} from "@/views/market-overview/card-view";
import CardVSView from "@/views/market-overview/card-vs-view";
import ChainViewTable from "@/views/market-overview/chain-view-table";
import LineChartView from "@/views/market-overview/line-chart-view";
import { Box, Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
const MarketOverview = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["marketStats"],
    queryFn: () => getMarketStats(),
  });

  return (
    <Box
      sx={{
        p: { md: 4, xs: "16px !important" },
        mt: 8,
        height: "calc(100vh - 64px)",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-track": {
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "rgba(255, 255, 255, 0.2)",
          borderRadius: "4px",
          "&:hover": {
            background: "rgba(255, 255, 255, 0.3)",
          },
        },
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={6} sm={6} md={4}>
          <CardWrapper sx={{ py: 2 }}>
            <CardTitle sx={{ py: 1 }}>Total Market Value</CardTitle>
            <CardValue sx={{ py: 1 }}>
              ${formatNumberWithKM(data?.data?.item?.total_market_cap)}
            </CardValue>
          </CardWrapper>
        </Grid>
        <Grid item xs={6} sm={6} md={4}>
          <CardWrapper sx={{ py: 2 }}>
            <CardTitle sx={{ py: 1 }}>Project Amount</CardTitle>
            <CardValue sx={{ py: 1 }}>
              {data?.data?.item?.collection_count}
            </CardValue>
          </CardWrapper>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <CardWrapper sx={{ py: 2 }}>
            <CardTitle sx={{ py: 1 }}>24H Volume In Token Trading</CardTitle>
            <CardValue sx={{ py: 1 }}>
              ${formatNumberWithKM(data?.data?.item?.total_volume_24h)}
            </CardValue>
          </CardWrapper>
        </Grid>
      </Grid>
      <LineChartView />
      <ChainViewTable list={data?.data?.item?.market_token_list || []} />
    </Box>
  );
};

export default MarketOverview;
