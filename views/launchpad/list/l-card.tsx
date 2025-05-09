import React, { useMemo } from "react";
import { Card, CardContent, Typography, Avatar, Box } from "@mui/material";
import {
  DesText,
  NameText,
  PriceText,
  SymbolText,
  TimeText,
} from "../create/require-text";
import MediaList from "./media-list";
import { formatNumberWithKM, formatTokenFixedto } from "@/utils/format";
import BaseIcon from "../svg-icon/base";
import SunSvg from "../preview/components/svgs/sun";
import DottedProgressBar from "./DottedProgressBar";
import { useQuery } from "@tanstack/react-query";
import { getETHPrice } from "@/services/tokens";

interface CardComponentProps {
  logo: string;
  preview: string;
  imageUrl: string;
  title: string;
  name: string;
  description: string;
  progress: number;
  ethAmount: number;
  percentageIncrease: string;
  userCount: number;
  time: string;
  link: string;
  tag: string; // 新增的属性，用于标签显示，比如 "DN404"
  item: any;
}

const LCard: React.FC<CardComponentProps> = ({
  imageUrl,
  preview,
  logo,
  title,
  name,
  description,
  progress,
  ethAmount,
  percentageIncrease,
  userCount,
  time,
  link,
  tag,
  item,
}) => {
  const { data } = useQuery({
    queryKey: ["getETHPrice"],
    queryFn: () => getETHPrice(),
  });
  const ethPrice = useMemo(() => data?.data?.eth_usd, [data]);
  const marketCapUSD = useMemo(
    () =>
      `$${formatNumberWithKM(
        // @ts-ignore
        Number(1000000000 || 0) * Number(item?.currentPrice || 0) * ethPrice,
      )}`,
    [item, ethPrice],
  );
  const marketCapETH = useMemo(
    () =>
      `$${formatNumberWithKM(
        // @ts-ignore
        Number(item?.pool?.marketCapETH || 0) * ethPrice,
      )}`,
    [item, ethPrice],
  );
  return (
    <Card
      sx={{
        backgroundColor: "transparent",
        color: "#fff",
        position: "relative",
        borderRadius: "6px",
        cursor: "pointer",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-10px)",
        },
      }}
    >
      {item?.is_pinned ? (
        <Box
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
            zIndex: 1,
            height: "20px",
          }}
        >
          <DesText
            sx={{
              background: "#B054FF",
              display: "flex",
              minHeight: 1,
              px: 1,
              opacity: 1,
              fontSize: 14,
              borderRadius: 1,
              p: 1,
              m: 1,
              alignItems: "center",
              columnGap: 0.4,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <g clip-path="url(#clip0_9280_28027)">
                <path
                  d="M9.00012 2.06931L11.2167 4.28585H13.6406L9.60608 0.251343C9.27096 -0.083781 8.72924 -0.083781 8.39411 0.251343L4.3596 4.28585H6.78358L9.00012 2.06931ZM2.14307 5.14297V13.7142L9.00012 17.9999L15.8572 13.7142V5.14297H2.14307ZM11.5715 13.7143L9.00012 12L6.42873 13.7143L7.28584 11.1429L5.57157 9.42863H8.14296L9.00008 6.85724L9.85719 9.42863H12.4286L10.7143 11.1429L11.5715 13.7143Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_9280_28027">
                  <rect width="18" height="18" fill="white" />
                </clipPath>
              </defs>
            </svg>
            Featured
          </DesText>
        </Box>
      ) : null}
      <Box
        sx={{
          height: 154,
          backgroundColor: "#12122C",
          borderRadius: "6px 6px 0px 0px",
          overflow: "hidden",
          position: "relative",
          width: "100%",
          zIndex: 0,
          "&:after": {
            content: '""',
            width: "100%",
            height: "100%",
            borderRadius: "8px 8px 0px 0px",
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 1,
          },
        }}
      >
        {imageUrl || preview ? (
          <Box
            component="img"
            src={imageUrl || preview}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: 216,
              objectFit: "cover",
              background: "#333",
            }}
          />
        )}
      </Box>

      <CardContent
        sx={{
          p: 0,
          background: progress === 100 ? "#1D0341" : "#141416",
          pb: "16px !important",
          border: "1px solid rgba(255, 255, 255, 0.10)",
          borderTop: "none",
          borderRadius: "0 0 6px 6px",
        }}
      >
        <Box sx={{ px: 2, pt: 2 }}>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: "-60px",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                src={logo}
                sx={{
                  width: "60px",
                  height: "60px",
                  borderRadius: 1,
                  border: "1px solid rgba(255, 255, 255, 0.60)",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.6)", // 添加阴影效果
                }}
              />
            </Box>
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 2,
              alignItems: "center",
              height: "36px",
              marginBottom: 0.5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                columnGap: 1,
              }}
            >
              <SymbolText>{title}</SymbolText>
              <NameText
                sx={{
                  marginTop: "5px",
                  maxWidth: "10ch",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                {name}
              </NameText>
            </Box>
            <MediaList item={item} />
          </Box>
          <DesText
            sx={{
              background: "rgba(255,255,255,0.1)",
              display: "inline-block",
              minHeight: 1,
              borderRadius: 1,
              mr: 0.6,
              opacity: 1,
              p: "2px",
            }}
          >
            <BaseIcon />
          </DesText>
          <DesText
            sx={{
              background: "rgba(255,255,255,0.1)",
              display: "inline-block",
              minHeight: 1,
              px: 1,
              borderRadius: 1,
            }}
          >
            {tag}
          </DesText>
          <DesText sx={{ marginTop: 1 }}>{description}</DesText>
        </Box>

        {/* Progress Bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            pt: 2,
            pb: 1,
            mt: 1,
            borderTop: "1px solid rgba(255, 255, 255, 0.10)",
          }}
        >
          {progress === 100 ? null : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <PriceText
                variant="body2"
                color="text.secondary"
                sx={{ color: "#52C41A", fontSize: "14px" }}
              >
                <span style={{ color: "#00B912", paddingRight: "10px" }}>
                  {progress}%
                </span>
              </PriceText>
              <TimeText
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  fontWeight: 600,
                  textTransform: "capitalize",
                }}
              >
                Market cap : {marketCapUSD}
              </TimeText>
            </Box>
          )}
          {progress === 100 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                color: "#fff",
                alignItems: "center",
                columnGap: 2,
              }}
            >
              <TimeText
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: "#AF54FF",
                  textTransform: "capitalize",
                  opacity: 1,
                  fontWeight: 600,
                }}
              >
                Listed on uniswap
              </TimeText>
              {/* <TimeText
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  fontWeight: 600,
                  textTransform: "capitalize",
                }}
              >
                Market cap : {marketCapUSD}
              </TimeText> */}
              <TimeText
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  fontWeight: 600,
                  textTransform: "capitalize",
                }}
              >
                Market cap : {marketCapETH}
              </TimeText>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                color: "#fff",
                alignItems: "center",
                columnGap: 2,
              }}
            >
              <TimeText
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <SunSvg />
                {time}
              </TimeText>
              {/* <TimeText
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <MemberIcon /> {userCount}
              </TimeText> */}
            </Box>
          )}
        </Box>
        <Box sx={{ px: 2 }}>
          <DottedProgressBar progress={progress} />
        </Box>
        {progress === 100 ? (
          <Box
            component="img"
            sx={{
              position: "absolute",
              width: "24px",
              right: 12,
              bottom: 0,
              height: "90px",
              zIndex: 0,
              marginBottom: -2.6,
              marginRight: 0.6,
            }}
            src="/assets/images/launchpad/rocket.gif"
          />
        ) : null}
      </CardContent>
    </Card>
  );
};

export default LCard;
