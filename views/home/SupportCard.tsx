import { Box, Typography, styled } from "@mui/material";
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
  @media (max-width: 600px) {
    font-size: 14px;
  }
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

export interface iSupportCard {
  // item: CryptoAsset;
  // index: number;
}

const SupportCard = () => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Link
      href="https://scattering.medium.com/hybrid-nfts-technical-support-plan-1ae8b36d4347"
      target="_blank"
    >
      <Box
        sx={{
          borderRadius: "10px",
          position: "relative",
          border: "1px solid rgba(255, 255, 255,0.3)",
          cursor: "pointer",
          overflow: "hidden",
          mx: { md: 1, xs: 0.4 },
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Box
          sx={{
            width: "100%",
            transform: isHovered ? "scale(1.2)" : "scale(1)",
            transition: "all 0.5s",
          }}
          component="img"
          src="/assets/images/home/banner/support-new.png"
        />
        <Box
          sx={{
            background: isHovered
              ? "linear-gradient(180deg, rgba(1, 4, 16, 0.00) 0%, rgba(0, 0, 0,0.8) 50%)"
              : "linear-gradient(180deg, rgba(1, 4, 16, 0.0) 0%, rgba(0, 0, 0,1) 93%)",
            width: "100%",
            height: isHovered ? "100%" : "32.22%",
            position: "absolute",
            left: "0px",
            bottom: "0px",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "16px",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Title sx={{ display: "flex", alignItems: "center" }}>
                Technical Support
              </Title>
              <Desc
                sx={
                  isHovered
                    ? {
                        color: "rgba(255, 255, 255, 1)",
                      }
                    : {
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "90%",
                        overflow: "hidden",
                        color: "rgba(255, 255, 255, 0.6)",
                      }
                }
              >
                Contact us for free technical advisory and smart contract
                development for your Hybrid Assets.
              </Desc>
            </Box>
          </Box>
          <ButtonWrapper
            sx={{
              height: isHovered ? "auto" : 0,
              padding: isHovered ? "10px 16px" : 0,
              margin: isHovered ? "10px" : 0,
              mt: 0,
              overflow: "hidden",
              transition: "all 0.5s",
            }}
          >
            Apply Support
          </ButtonWrapper>
        </Box>
      </Box>
    </Link>
  );
};

export default SupportCard;
