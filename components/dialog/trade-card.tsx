import { tokenIcons } from "@/constants/tokens";
import { CollectionDetails } from "@/types/collection";
import {
  Box,
  Skeleton,
  Stack,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import PriceChangeText from "../collections/price-change-text";
import { formatIntNumberWithKM, formatNumberWithKM } from "@/utils/format";
import { getColorForLetter, getInitials } from "../collections/avatar-card";
import ActionCard from "./ActionCard";
import DetailBar from "./DetailBar";

const NameText = styled(Typography)`
  color: #fff;
  text-align: center;
  font-family: Poppins;
  font-size: 60px;
  font-style: normal;
  font-weight: 600;
  line-height: 42px;
`;
const SymbolText = styled(Typography)`
  color: #fff;
  text-align: center;
  font-family: Poppins;
  font-size: 40px;
  font-style: normal;
  font-weight: 600;
  line-height: 42px; /* 105% */
  text-transform: uppercase;
  opacity: 0.6;
`;
const LabelText = styled(Typography)`
  color: #888e8f;
  font-family: Poppins;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  text-transform: uppercase;
`;

const width = 946;
const size = 280;
interface iTradeCard {
  collectionDetails?: CollectionDetails;
  dialogRef: React.MutableRefObject<HTMLDivElement | null>;
}
const TradeCard = ({ collectionDetails, dialogRef }: iTradeCard) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageSrc, setImageSrc] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!collectionDetails?.has_logo && collectionDetails?.symbol) {
      const initials = getInitials(collectionDetails?.symbol);
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = size;
        canvas.height = size;
        const context = canvas.getContext("2d");
        if (context) {
          context.fillStyle = getColorForLetter(initials);
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.font = `${size / 2}px Arial`;
          context.fillStyle = "#FFF";
          context.textAlign = "center";
          context.textBaseline = "middle";
          context.fillText(initials, size / 2, size / 2);
          setImageSrc(canvas.toDataURL());
        }
      }
    } else {
      setImageSrc(collectionDetails?.logo_url || "");
    }
  }, [collectionDetails]);
  const priceInfo = useMemo(
    () => [
      {
        label: "24h Volume",
        content: `$${formatNumberWithKM(collectionDetails?.volume)}`,
      },
      {
        label: "Liquidity",
        content: `$${formatNumberWithKM(collectionDetails?.liquidity)}`,
      },
      {
        label: "Market Cap",
        content: `$${formatNumberWithKM(collectionDetails?.market_cap)}`,
      },
      {
        label: "Total Supply",
        content: `${formatIntNumberWithKM(collectionDetails?.total_supply)}`,
      },
    ],
    [collectionDetails],
  );
  return (
    <Box sx={{ borderRadius: "10px", overflow: "hidden" }}>
      <Box
        ref={dialogRef}
        sx={{
          background: "#09051A",
          p: { md: 4, xs: 2 },
          width: { md: width, xs: "100vw" },
          margin: "0 auto",
        }}
      >
        {/* <ActionCard /> */}
        <Box
          component="img"
          sx={{
            position: "absolute",
            width: "100%",
            left: 0,
            top: 0,
            height: "100%",
            zIndex: 0,
          }}
          src="/assets/images/layout-bg.png"
        />
        <Box sx={{ background: "transparent", position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              width: { md: "188px", xs: "94px" },
              height: { md: "60px", xs: "30px" },
              right: { md: "8px", xs: "calc( 50% - 140px )" },
              top: { md: "0px", xs: "unset" },
              bottom: { md: "unset", xs: "10px" },
              zIndex: 1,
              opacity: 0.2,
            }}
            component="img"
            id="logo_header"
            src="/assets/images/logo/logo.png"
            data-retina="/assets/images/logo/logo.png"
          />
          <Stack
            sx={{
              flexDirection: "row",
              border: "none",
            }}
          >
            <Box
              sx={{
                position: "relative",
                mb: { md: 3, xs: 1.4 },
                width: { md: 280, xs: 148 },
                height: { md: 280, xs: 148 },
                border: "none",
              }}
            >
              {!imageLoaded && (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  sx={{
                    aspectRatio: "1 / 1",
                    pb: "100%",
                    position: "absolute",
                    background: "#331f44",
                    left: 0,
                    top: 0,
                    zIndex: 2,
                    width: { md: 280, xs: 148 },
                    height: { md: 280, xs: 148 },
                    borderRadius: { md: "22px", xs: "10px" },
                  }}
                />
              )}
              <Box
                component="img"
                src={imageSrc}
                alt=""
                sx={{
                  width: { md: 280, xs: 148 },
                  height: { md: 280, xs: 148 },
                  borderRadius: { md: "22px", xs: "10px" },
                  position: "absolute",
                  zIndex: 1,
                  opacity: imageLoaded ? 1 : 0,
                }}
                onLoad={() => setImageLoaded(true)}
              />
              <Box
                component="img"
                src={
                  tokenIcons?.[(collectionDetails?.chain_id || 1)?.toString()]
                }
                sx={{
                  width: { md: "24px", xs: "16px" },
                  height: { md: "24px", xs: "16px" },
                  position: "absolute",
                  borderRadius: "50%",
                  top: { md: "16px", xs: "8px" },
                  right: { md: "16px", xs: "8px" },
                  zIndex: 2,
                }}
              />
            </Box>
            <Stack sx={{ ml: { md: 4, xs: 3 }, mt: { md: 2, xs: 0 } }}>
              <Stack
                flexDirection="row"
                justifyContent="flex-start"
                alignItems="flex-end"
              >
                <NameText sx={{ mr: 2, fontSize: { md: 32, xs: 16 } }}>
                  {collectionDetails?.symbol}
                </NameText>
                <SymbolText sx={{ fontSize: { md: 24, xs: 14 } }}>
                  {collectionDetails?.name}
                </SymbolText>
              </Stack>
              <Stack
                flexDirection="row"
                justifyContent="space-between"
                sx={{
                  width: { md: width - 400, xs: "calc( 100vw - 210px )" },
                  mt: { md: 4, xs: 2 },
                  p: { md: 4, xs: 0 },
                }}
              >
                <Stack>
                  <LabelText sx={{ fontSize: { md: 20, xs: 12 } }}>
                    Price
                  </LabelText>
                  <LabelText
                    sx={{
                      color: "#fff",
                      mt: 2,
                      fontSize: { md: 30, xs: 14 },
                      fontWeight: 600,
                    }}
                  >
                    ${Number(collectionDetails?.price_in_usd).toPrecision(5)}
                  </LabelText>
                </Stack>
                <Stack>
                  <LabelText sx={{ fontSize: { md: 20, xs: 12 } }}>
                    24h change
                  </LabelText>
                  <Box sx={{ mt: 2 }}>
                    {" "}
                    <PriceChangeText
                      fontSize={isMobile ? 14 : 30}
                      fontWeight={600}
                      priceChange={Number(collectionDetails?.price_change)}
                    />
                  </Box>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Box>

        <Box
          sx={{
            color: "#fff",
            // width: { md: "100%", xs: 100 },
          }}
        >
          <DetailBar
            data={priceInfo}
            background="rgba(0, 0, 0, 0.10)"
          ></DetailBar>
        </Box>
        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      </Box>
    </Box>
  );
};

export default TradeCard;
