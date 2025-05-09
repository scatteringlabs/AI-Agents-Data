import Button from "@/components/button/Button";
import VerifiedIcon from "@/components/icons/verified-icon";
import { ChainIdByName } from "@/constants/chain";
import { CollectionTypeColor } from "@/constants/color";
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
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 26px; /* 130% */
  text-transform: uppercase;
  @media (max-width: 600px) {
    font-size: 12px;
  }
`;
const Desc = styled(Typography)`
  color: rgba(255, 255, 255, 0.6);

  font-variant-numeric: lining-nums proportional-nums;
  font-family: Poppins;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  text-transform: capitalize;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  @media (max-width: 600px) {
    font-size: 10px;
  }
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

export interface iSpotlightCard {
  item: CryptoAsset;
}

const SpotlightCard = ({ item }: iSpotlightCard) => {
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
          border: "1px solid rgba(255, 255, 255, 0.10)",
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
            maxHeight: "50%",
            transform: isHovered ? "scale(1.2)" : "scale(1)",
            transition: "all 0.5s",
            marginTop: "-20%",
            paddingBottom: "20%",
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
            left: "16px",
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
            background: "#0a091c",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: { md: "16px", xs: "8px" },
              paddingBottom: "0px !important",
            }}
          >
            <Box>
              <Title
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 600,
                  fontSize: { md: 18, xs: 16 },
                }}
              >
                {" "}
                {item?.is_verified ? (
                  <span style={{ marginRight: "6px" }}>
                    <VerifiedIcon size={18} />
                  </span>
                ) : null}
                {item.symbol}
              </Title>
              <Desc>{item?.name} </Desc>
            </Box>
            <Box>
              <Typography
                sx={{
                  border: "1px solid",
                  fontSize: "12px",
                  padding: "4px 8px",
                  borderColor: item.collection_type.color,
                  borderRadius: "6px",
                  color: item.collection_type.color,
                }}
              >
                {item?.collection_type?.name || ""}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: { md: "10px 16px", xs: "8px" },
              pt: "0px",
            }}
          >
            <Box
              sx={{
                pr: { md: 1, xs: 0.4 },
                borderRight: "1px solid rgba(255,255,255, 0.1)",
                width: "100%",
              }}
            >
              <Title
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                ${Number(item?.price_in_usd).toPrecision(5)}
              </Title>
              <Desc sx={{ textAlign: "left", textTransform: "uppercase" }}>
                price
              </Desc>
            </Box>
            <Box
              sx={{
                borderRight: "1px solid rgba(255,255,255, 0.1)",
                width: "100%",
                px: { md: 1, xs: 0.4 },
              }}
            >
              <Title
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: Number(item?.price_change) > 0 ? "#00B912" : "#DC2626",
                  justifyContent: "center",
                }}
              >
                {item.price_change}%
              </Title>
              <Desc sx={{ textAlign: "center", textTransform: "uppercase" }}>
                24h change
              </Desc>
            </Box>
            <Box sx={{ width: "100%", pl: { md: 1, xs: 0.4 } }}>
              <Title
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                ${formatNumberWithKM(item?.volume)}
              </Title>
              <Desc sx={{ textAlign: "right", textTransform: "uppercase" }}>
                24h volume
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

export default SpotlightCard;
