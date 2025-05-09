import Button from "@/components/button/Button";
import CardCountdown from "@/components/elements/CardCountdown";
import VerifiedIcon from "@/components/icons/verified-icon";
import { CollectionTypeColor } from "@/constants/color";
import { activeTokenIcons, tokenIcons } from "@/constants/tokens";
import { Box, IconButton, Typography, styled } from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import { base } from "viem/chains";
import CustomTooltip from "../collect/CustomTooltip";
import { TipText } from "../collect/verified-icon";

const Title = styled(Typography)`
  color: #fff;
  font-variant-numeric: lining-nums proportional-nums;
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 26px; /* 130% */

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

export interface iUpcomingCard {
  link: string;
  xlink?: string;
  scrlnk?: string;
  tglink?: string;
  detailsLink?: string;
  discordlink?: string;
  src: string;
  name: string;
  tag: string;
  PFPtag: string;
  price: string;
  supply: string;
  tokenSupply: string;
  tip: string;
  noStartTime?: string;
  startTime?: number;
}

const UpcomingCard = ({
  link,
  src,
  name,
  tag,
  PFPtag,
  price,
  xlink,
  tglink,
  detailsLink,
  discordlink,
  supply,
  tokenSupply,
  startTime,
  noStartTime,
  tip,
  scrlnk,
}: iUpcomingCard) => {
  const [isHovered, setIsHovered] = useState(false);
  const currentTime = new Date().getTime();
  return (
    <Link href={scrlnk || link} target={scrlnk ? "" : "_blank"}>
      <Box
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
            // maxHeight: "50%",
            transform: isHovered ? "scale(1.08)" : "scale(1)",
            transition: "all 0.5s",
            // marginTop: "-20%",
            // paddingBottom: "20%",
          }}
          component="img"
          src={src}
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
          src={activeTokenIcons?.[base.id]}
        />
        <Box
          sx={{
            // position: "absolute",
            // left: 0,
            // bottom: 0,
            width: "100%",
            background: "rgba(176, 84, 255, 0.05)",
            overflow: "hidden",
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
                {name}
              </Title>
            </Box>
            <Box>
              <Typography
                sx={{
                  border: "1px solid",
                  fontSize: "12px",
                  padding: "4px 8px",
                  borderColor: CollectionTypeColor?.["ERC404 V1"],
                  borderRadius: "6px",
                  color: CollectionTypeColor?.["ERC404 V1"],
                }}
              >
                {tag}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              // justifyContent: "space-between",
              px: { md: 2, xs: 1 },
              mt: { md: 0.4, xs: 1 },
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                border: "1px solid rgba(176, 84, 255,0.4)",
                fontSize: "14px",
                padding: "2px 8px",
                borderRadius: "14px",
                // mt: 1,
                color: CollectionTypeColor?.["ERC404 V1"],
                mr: 1,
              }}
            >
              {PFPtag}
            </Typography>
            <div className="tw-inline-block">
              <div
                className={`tw-flex tw-justify-between tw-py-2 md:tw-py-4 tw-gap-1 md:tw-gap-2 tw-rounded-full`}
              >
                <Link href={link} target="_blank">
                  <Box
                    component="img"
                    src={`/assets/images/media/website.svg`}
                    alt=""
                    sx={{
                      width: { md: 24, xs: 20 },
                      height: { md: 24, xs: 20 },
                    }}
                  />
                </Link>
                {xlink ? (
                  <Link href={xlink} target="_blank">
                    <Box
                      component="img"
                      src={`/assets/images/media/x.svg`}
                      alt=""
                      sx={{
                        width: { md: 24, xs: 20 },
                        height: { md: 24, xs: 20 },
                      }}
                    />
                  </Link>
                ) : null}
                {tglink ? (
                  <Link href={tglink} target="_blank">
                    <Box
                      component="img"
                      src={`/assets/images/media/telegram.svg`}
                      alt=""
                      sx={{
                        width: { md: 24, xs: 20 },
                        height: { md: 24, xs: 20 },
                      }}
                    />
                  </Link>
                ) : null}
                {discordlink ? (
                  <Link href={discordlink} target="_blank">
                    <Box
                      component="img"
                      src={`/assets/images/media/discord.svg`}
                      alt=""
                      sx={{
                        width: { md: 24, xs: 20 },
                        height: { md: 24, xs: 20 },
                      }}
                    />
                  </Link>
                ) : null}
              </div>
            </div>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: { md: "4px 16px", xs: "8px" },
              py: "0px !important",
            }}
          >
            <Desc sx={{ textAlign: "left", textTransform: "uppercase" }}>
              mint price
            </Desc>
            <Title
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              {price}
            </Title>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: { md: "4px 16px", xs: "8px" },
              py: "0px !important",
            }}
          >
            <Desc sx={{ textAlign: "left", textTransform: "uppercase" }}>
              nft Supply
            </Desc>
            <Title
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              {supply}
            </Title>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: { md: "4px 16px", xs: "8px" },
              py: "0px !important",
            }}
          >
            <Desc sx={{ textAlign: "left", textTransform: "uppercase" }}>
              Token Supply
            </Desc>
            <Title
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <CustomTooltip
                title={<TipText>{tip}</TipText>}
                arrow
                placement="right-end"
              >
                <Box sx={{ mr: 0.6 }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M5.99922 0.300781C2.85122 0.300781 0.299218 2.85278 0.299218 6.00078C0.299218 9.14878 2.85122 11.7008 5.99922 11.7008C9.14722 11.7008 11.6992 9.14878 11.6992 6.00078C11.6992 2.85278 9.14722 0.300781 5.99922 0.300781ZM5.99922 1.20078C8.65022 1.20078 10.7992 3.34978 10.7992 6.00078C10.7992 8.65178 8.65022 10.8008 5.99922 10.8008C3.34822 10.8008 1.19922 8.65178 1.19922 6.00078C1.19922 3.34978 3.34822 1.20078 5.99922 1.20078ZM5.99922 7.50078C5.83346 7.50078 5.67449 7.56663 5.55728 7.68384C5.44007 7.80105 5.37422 7.96002 5.37422 8.12578C5.37422 8.29154 5.44007 8.45051 5.55728 8.56772C5.67449 8.68493 5.83346 8.75078 5.99922 8.75078C6.16498 8.75078 6.32395 8.68493 6.44116 8.56772C6.55837 8.45051 6.62422 8.29154 6.62422 8.12578C6.62422 7.96002 6.55837 7.80105 6.44116 7.68384C6.32395 7.56663 6.16498 7.50078 5.99922 7.50078ZM5.54922 3.00078V7.00078H6.44922V3.00078H5.54922Z"
                      fill="rgba(255, 255, 255,0.4)"
                    />
                  </svg>
                </Box>
              </CustomTooltip>
              {tokenSupply}
            </Title>
          </Box>
          <Link
            href={scrlnk || detailsLink || link}
            target={scrlnk ? "" : "_blank"}
          >
            <ButtonWrapper
              sx={{
                height: "auto",
                padding: "10px 16px",
                margin: "10px",
                mt: 1,
                overflow: "hidden",
                transition: "all 0.5s",
                background: isHovered
                  ? "rgba(176, 84, 255,1)"
                  : "rgba(176, 84, 255,0.2)",
              }}
            >
              {isHovered ? (
                "Check details"
              ) : startTime && Number(startTime) <= currentTime ? (
                "Ended"
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      display: "inline",
                      fontSize: "12px",
                      mr: 1,
                    }}
                  >
                    {`Starts: `}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "#fff",
                    }}
                  >
                    {" "}
                    {noStartTime ? noStartTime : ""}
                    {startTime ? <CardCountdown endDateTime={startTime} /> : ""}
                  </Typography>
                </Box>
              )}
            </ButtonWrapper>
          </Link>
        </Box>
      </Box>
    </Link>
  );
};

export default UpcomingCard;
