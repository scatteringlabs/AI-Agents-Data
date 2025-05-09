import { Box, Skeleton, Typography, styled } from "@mui/material";
import Link from "next/link";
import { useState } from "react";

const Title = styled(Typography)`
  color: #fff;
  font-variant-numeric: lining-nums proportional-nums;
  font-family: Poppins;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 26px; /* 130% */
  text-transform: capitalize;
`;
const Desc = styled(Typography)`
  color: rgba(255, 255, 255, 0.6);
  font-variant-numeric: lining-nums proportional-nums;
  font-family: Poppins;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 166.667% */
`;
const ButtonWrapper = styled(Box)`
  border-radius: 10px;
  background: #b054ff;
  margin: 10px 16px;
  padding: 10px;
  color: #fff;
  margin-top: 0;
  font-variant-numeric: lining-nums proportional-nums;
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
  text-align: center;
`;

export interface iLoadingCard {
  // item: CryptoAsset;
  // index: number;
}

const LoadingCard = () => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Box
      sx={{
        borderRadius: "10px",
        position: "relative",
        border: "1px solid rgba(255, 255, 255,0.3)",
        overflow: "hidden",
        mx: { md: 1, xs: 0.4 },
      }}
    >
      <Box
        sx={{
          visibility: "hidden",
        }}
        component="img"
        src="/assets/images/home/banner/support-new.png"
      />
      <Skeleton
        variant="rectangular"
        sx={{
          background: "#331f44",
          position: "absolute",
          zIndex: 1,
          padding: 0,
          width: "100%",
          height: "100%",
          left: 0,
          top: 0,
          m: 0,
        }}
      />
    </Box>
  );
};

export default LoadingCard;
