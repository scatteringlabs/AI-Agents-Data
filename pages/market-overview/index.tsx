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
    <Box sx={{ py: { md: 3, xs: 4 } }}>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={6} md={3}>
          <CardWrapper sx={{ py: 2 }}>
            <CardTitle sx={{ py: 1 }}>Total Market Value</CardTitle>
            <CardValue sx={{ py: 1 }}>
              ${formatNumberWithKM(data?.data?.item?.total_market_cap)}
            </CardValue>
          </CardWrapper>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <CardWrapper sx={{ py: 2 }}>
            <CardTitle sx={{ py: 1 }}>Collection Amount</CardTitle>
            <CardValue sx={{ py: 1 }}>
              {data?.data?.item?.collection_count}
            </CardValue>
          </CardWrapper>
        </Grid>
        <Grid item xs={12} sm={12} md={3}>
          <CardWrapper sx={{ py: 2 }}>
            <CardTitle sx={{ py: 1 }}>24H Volume In Token Trading</CardTitle>
            <CardValue sx={{ py: 1 }}>
              {" "}
              ${formatNumberWithKM(data?.data?.item?.total_volume_24h)}
            </CardValue>
          </CardWrapper>
        </Grid>
        {/* <Grid item xs={12} sm={12} md={2.4}>
          <CardWrapper sx={{ py: 2 }}>
            <CardTitle sx={{ py: 1 }}>24H New Collections</CardTitle>
            <CardValue sx={{ py: 1 }}>
              {data?.data?.item?.new_collection_count}
            </CardValue>
          </CardWrapper>
        </Grid> */}
        <CardVSView
          title="24H hybrid assets Up/Down"
          decreaseCount={data?.data?.item?.decrease_24h_count || 0}
          increaseCount={data?.data?.item?.increase_24h_count || 0}
        />
      </Grid>
      <LineChartView />
      <ChainViewTable list={data?.data?.item?.market_token_list || []} />
    </Box>
  );
};

export default MarketOverview;
