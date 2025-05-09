import Button from "@/components/button/Button";
import VerifiedIcon from "@/components/icons/verified-icon";
import { ChainIdByName } from "@/constants/chain";
import { activeTokenIcons, tokenIcons } from "@/constants/tokens";
import { CryptoAsset } from "@/services/home";
import { formatNumberWithKM } from "@/utils/format";
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
  text-transform: uppercase;
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
  text-transform: uppercase;
  @media (max-width: 600px) {
    font-size: 10px;
  }
`;
export const ButtonWrapper = styled(Box)`
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
  @media (max-width: 600px) {
    font-size: 12px;
  }
`;

export interface iBannerCard {
  item: CryptoAsset;
  index: number;
}

const BannerCard = ({ item, index }: iBannerCard) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Link
      href={`/collection/${ChainIdByName?.[Number(item?.chain_id)]}/${item?.erc20_address}`}
    >
      <Box
        key={item.erc20_address}
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
          src={`${item?.card_image_url}`}
          // src={`https://d2oiecgevbfxbl.cloudfront.net/images/300x300/freeze=false/${item?.card_image_url}`}
        />
        <Box
          sx={{
            width: "24px",
            height: "24px",
            position: "absolute",
            right: "16px",
            top: "16px",
          }}
          component="img"
          src={activeTokenIcons?.[item?.chain_id]}
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
            <Box>
              <Title sx={{ display: "flex", alignItems: "center" }}>
                {" "}
                {item?.is_verified ? (
                  <span style={{ marginRight: "6px" }}>
                    <VerifiedIcon size={18} />
                  </span>
                ) : null}
                {item.symbol}
              </Title>
              <Desc>
                {item.card_type === 1 ? "Top Gainer" : "hot collection"}
              </Desc>
            </Box>
            <Box>
              <Title
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color:
                    item?.card_type === 1
                      ? Number(item?.price_change) > 0
                        ? "#00B912"
                        : "#DC2626"
                      : "#fff",
                  justifyContent: "flex-end",
                  fontSize: 16,
                }}
              >
                {item.card_type === 1
                  ? `${item.price_change}%`
                  : `$${formatNumberWithKM(item?.volume)}`}
              </Title>
              <Desc sx={{ textAlign: "right" }}>
                {item.card_type === 1 ? "24h change" : "24h Volume"}
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
            Explore Collection
          </ButtonWrapper>
        </Box>
      </Box>
    </Link>
  );
};

export default BannerCard;
