import { TokenEntity } from "@/services/graphql/all-token";
import {
  formatAddress,
  formatNumberWithKM,
  formatTokenFixedto,
} from "@/utils/format";
import { Box, Typography } from "@mui/material";
import MediaInfo from "./media-info";
import { BaseSID, ProjectData } from "../../create/tokenService";
import { formatDistanceToNow } from "date-fns";
import SunSvg from "./svgs/sun";
import { getProgress } from "../../card-list";
import Link from "next/link";
import { SCAN_URL_ID } from "@/constants/url";
import { useAccount } from "wagmi";
import { formatTimeDistance } from "@/views/trade/trades-table";
import { useEffect, useState } from "react";
const placeholdImage = "https://placehold.co/150x150/171525/333?text=logo";

const MBTopInfo = ({
  logo,
  tokenSymbol,
  description,
  collectionName,
  tokenAddress,
  info,
  projectDetails,
  banner,
}: {
  logo?: string;
  tokenSymbol?: string;
  banner?: string;
  description?: string;
  collectionName?: string;
  tokenAddress?: string;
  info?: TokenEntity;
  projectDetails?: ProjectData;
}) => {
  const { address } = useAccount();
  const [showPreview, setShowPreview] = useState<string>(placeholdImage);
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setShowPreview(placeholdImage);
  };
  useEffect(() => {
    if (logo) {
      setShowPreview(logo);
    }
  }, [logo]);
  return (
    <Box
      sx={{
        display: { md: "none", xs: "flex" },
        justifyContent: "space-between",
        columnGap: 4,
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-start",
          columnGap: 1,
          mb: 2,
        }}
      >
        <Box
          sx={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            // background: "#aaa",
          }}
          component="img"
          src={showPreview}
          onError={handleImageError}
        />
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              columnGap: 2,
            }}
          >
            <Box
              component="span"
              sx={{
                color: "#fff",
                fontFamily: "Poppins",
                fontSize: "32px",
                fontStyle: "normal",
                fontWeight: "700",
                lineHeight: "140%",
                textTransform: "uppercase",
              }}
            >
              {tokenSymbol}
            </Box>

            <Box
              component="span"
              sx={{
                color: "rgba(255, 255, 255,1)",
                fontFamily: "Poppins",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: "400",
                lineHeight: "140%",
              }}
            >
              {collectionName}
            </Box>
          </Box>
          <MediaInfo info={projectDetails} />
          <Box
            component="span"
            sx={{
              color: "rgba(255, 255, 255,1)",
              fontFamily: "Poppins",
              fontSize: "12px",
              fontStyle: "normal",
              fontWeight: "400",
              lineHeight: "140%",
            }}
          >
            {description}
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          borderRadius: "10px",
          border: "1px solid rgba(255, 255, 255, 0.10)",
          background: "rgba(0, 0, 0, 0.50)",
          padding: "10px",
        }}
      >
        <Typography
          sx={{
            color: "#FFF",
            fontFamily: "Poppins",
            fontSize: "16px",
          }}
        >
          Total:
        </Typography>

        <Box
          sx={{
            opacity: 0.9,
            background: "#0E111C",
            width: "100%",
            borderRadius: "33px",
            height: "14px",
            my: 2,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              borderRadius: "33px 0 0 33px",
              background: "#00B912",
              width: `${getProgress(info?.supply || "0", Number(info?.state)) < 3 ? "3" : getProgress(info?.supply || "0", Number(info?.state))}%`,
              height: "100%",
            }}
          ></Box>
        </Box>
        <Typography sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box
            component="span"
            sx={{
              color: "#00B912",
              fontFamily: "Poppins",
              fontSize: "12px",
              fontStyle: "normal",
              fontWeight: "600",
              lineHeight: "140%" /* 22.4px */,
              textTransform: "capitalize",
            }}
          >
            {getProgress(info?.supply || "0", Number(info?.state))}% Sold{" "}
            {formatTokenFixedto(info?.lockValue)} ETH
          </Box>

          <Box
            component="span"
            sx={{
              color: "#FFF",
              fontFamily: "Poppins",
              fontSize: "12px",
              fontStyle: "normal",
              fontWeight: "500",
              lineHeight: "140%",
            }}
          >
            {formatNumberWithKM(info?.supply)}/800.00M
          </Box>
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            sx={{
              color: "rgba(255, 255, 255,0.6)",
              fontFamily: "Poppins",
              fontSize: "12px",
              mt: 1,
              display: "flex",
              columnGap: 1,
              alignItems: "center",
            }}
          >
            <SunSvg />
            <Typography sx={{ textTransform: "capitalize", fontSize: 12 }}>
              Created by{" "}
              <Link
                href={`${SCAN_URL_ID[BaseSID || "1"]}address/${info?.creator}`}
                target="_blank"
              >
                <span
                  style={{
                    color: "#b054ff",
                    paddingRight: "4px",
                    fontWeight: "bold",
                    textDecoration: "underline",
                  }}
                >
                  {address?.toLowerCase() === info?.creator?.toLowerCase()
                    ? "you"
                    : formatAddress(info?.creator)}
                </span>
              </Link>
              {info?.createTimestamp
                ? formatTimeDistance(
                    new Date(Number(info?.createTimestamp || 0) * 1000),
                  )
                : ""}
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default MBTopInfo;
