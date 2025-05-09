import { Box, Card, Grid, Typography, styled } from "@mui/material";

export const CardTitle = styled(Typography)`
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
export const CardValue = styled(Typography)`
  color: #b054ff;
  font-variant-numeric: lining-nums proportional-nums;
  font-family: Poppins;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 26px; /* 108.333% */
  text-transform: uppercase;
  @media (max-width: 600px) {
    font-size: 20px;
  }
`;

export const CardWrapper = styled(Card)`
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: transparent;
  text-align: center;
`;

interface iCardView {
  title: string;
  value: string;
}

const CardView = ({ title, value }: iCardView) => {
  return (
    <Grid item xs={12} sm={12} md={2.7}>
      <CardWrapper sx={{ py: 2 }}>
        <CardTitle sx={{ py: 1 }}>{title}</CardTitle>
        <CardValue sx={{ py: 1 }}>{value}</CardValue>
      </CardWrapper>
    </Grid>
  );
};

export default CardView;
