import { Grid, Skeleton, Typography } from "@mui/material";

interface iTradeInfoItem {
  title: string;
  value: string;
  color?: string;
  textAlign?: string;
  loading?: boolean;
}
const TradeInfoItem = ({
  title,
  value,
  color,
  textAlign = "left",
  loading = false,
}: iTradeInfoItem) => {
  return (
    <Grid item xs={3}>
      <Typography variant="h6" sx={{ opacity: 0.6, fontSize: 14, textAlign }}>
        {title}
      </Typography>
      {loading ? (
        <Skeleton
          variant="text"
          width="100%"
          height={30}
          sx={{
            background: "#331f44",
          }}
        />
      ) : (
        // @ts-ignore
        <Typography variant="h6" sx={{ fontSize: 16, color, textAlign }}>
          {value}
        </Typography>
      )}
    </Grid>
  );
};

export default TradeInfoItem;
