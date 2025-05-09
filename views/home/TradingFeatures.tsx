import { Box, Grid, Typography } from "@mui/material";

const items = [
  {
    id: 1,
    image: "assets/images/home/diamond.svg",
    text: "Trade like a pro",
  },
  {
    id: 2,
    image: "assets/images/home/tradedata.svg",
    text: "Trade and collect in one portal",
  },
  {
    id: 3,
    image: "assets/images/home/collection.svg",
    text: "Multi-chain aggregator",
  },
  {
    id: 4,
    image: "assets/images/home/coin.svg",
    text: "Earn more with your 404s tokens",
  },
];

const TradingFeatures = () => {
  return (
    <Grid container spacing={2} sx={{ mt: 8 }}>
      {items.map((item) => (
        <Grid
          item
          className="tw-font-poppins tw-text-lg"
          xs={6}
          md={6}
          xl={3}
          lg={6}
          key={item.id}
        >
          <Box
            sx={{
              border: "1px solid rgba(255, 255, 255, 0.10)",
              padding: "20px 0px",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <img
              src={item.image}
              alt=""
              className="tw-mr-2"
              style={{ opacity: 0.6, width: 24, height: 24 }}
            />
            <Typography
              sx={{
                textAlign: "center",
                color: "rgba(255, 255, 255, 0.60)",
                fontSize: { xs: 16, sm: 20 },
              }}
            >
              {item.text}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default TradingFeatures;
