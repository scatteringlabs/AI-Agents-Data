import { Box, Card, Grid, Stack, Typography, styled } from "@mui/material";
import CustomProgressBar from "./custom-progress-bar";
import { useMemo } from "react";

const CardTitle = styled(Typography)`
  color: #fff;
  font-variant-numeric: lining-nums proportional-nums;
  font-family: Poppins;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 26px;
  text-transform: capitalize;
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;
const CardDesc = styled(Typography)`
  color: #fff;
  font-variant-numeric: lining-nums proportional-nums;
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 26px; /* 185.714% */
  text-transform: capitalize;
  @media (max-width: 600px) {
    font-size: 12px;
  }
`;

const CardWrapper = styled(Card)`
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: transparent;
  text-align: center;
`;

interface iCardVSView {
  title: string;
  increaseCount: number;
  decreaseCount: number;
}

const CardVSView = ({ title, decreaseCount, increaseCount }: iCardVSView) => {
  const percent = useMemo(() => {
    const temp = (increaseCount / (decreaseCount + increaseCount)) * 100;
    if (temp < 6) {
      return 6;
    }
    if (temp > 94) {
      return 94;
    }
    return temp;
  }, [decreaseCount, increaseCount]);
  return (
    <Grid item xs={12} sm={12} md={3}>
      <CardWrapper sx={{ py: 2 }}>
        <CardTitle sx={{ py: 1 }}>{title}</CardTitle>
        <Stack
          sx={{ px: 2, pb: 0.4 }}
          flexDirection="row"
          justifyContent="space-between"
        >
          <CardDesc>{increaseCount} up</CardDesc>
          <CardDesc>{decreaseCount} down</CardDesc>
        </Stack>
        <CustomProgressBar percent={percent} />
      </CardWrapper>
    </Grid>
  );
};

export default CardVSView;
