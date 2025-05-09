import { Box, Stack, Typography } from "@mui/material";
import DetailBar from "../DetailBar";
import styles from "../collect.module.css";
import { CollectionDetailsErc20z } from "@/types/collection";
import { useMemo } from "react";
import PriceChangeText from "@/components/collections/price-change-text";
import { formatNumberWithKM, formatTokenFixedto } from "@/utils/format";
const PriceInfoCardMB = ({
  collectionDetails,
  isMobile = false,
}: {
  collectionDetails?: CollectionDetailsErc20z;
  isMobile?: boolean;
}) => {
  // const priceInfo = useMemo(
  //   () => [
  //     {
  //       label: "1h change",
  //       content: (
  //         <PriceChangeText
  //           priceChange={Number(collectionDetails?.price_change_in_1hours)}
  //         />
  //       ),
  //     },
  //     {
  //       label: "6h Change",
  //       content: (
  //         <PriceChangeText
  //           priceChange={Number(collectionDetails?.price_change_in_6hours)}
  //         />
  //       ),
  //     },
  //     {
  //       label: "24h change",
  //       content: (
  //         <PriceChangeText
  //           priceChange={Number(collectionDetails?.price_change_in_24hours)}
  //         />
  //       ),
  //     },
  //   ],
  //   [collectionDetails],
  // );
  const nftInfo = useMemo(
    () => [
      {
        label: "1h Volume",
        content: `$${formatNumberWithKM(collectionDetails?.total_volume_in_1hours)}`,
      },
      {
        label: "6h Volume",
        content: `$${formatNumberWithKM(collectionDetails?.total_volume_in_6hours)}`,
      },
      {
        label: "24h Volume",
        content: `$${formatNumberWithKM(collectionDetails?.total_volume_in_24hours)}`,
      },
    ],
    [collectionDetails],
  );
  const totalInfo = useMemo(
    () => [
      {
        label: "24h makers",
        content: (
          <Box>
            <Typography
              sx={{
                fontSize: { md: 16, xs: 12 },
                fontWeight: 700,
                fontFamily: "Poppins",
                display: "flex",
                columnGap: 0.4,
                color: "#fff",
              }}
            >
              {collectionDetails?.total_makers_count_24hours}
              <Typography
                sx={{
                  fontSize: { md: 16, xs: 12 },
                  fontWeight: 700,
                  fontFamily: "Poppins",
                }}
              >
                (
              </Typography>
              <Typography
                sx={{
                  fontSize: { md: 16, xs: 12 },
                  fontWeight: 700,
                  fontFamily: "Poppins",
                  color: "#00B912",
                }}
              >
                {collectionDetails?.total_buyer_count_24hours}
              </Typography>
              <Typography
                sx={{
                  fontSize: { md: 16, xs: 12 },
                  fontWeight: 700,
                  fontFamily: "Poppins",
                }}
              >
                /
              </Typography>
              <Typography
                sx={{
                  fontSize: { md: 16, xs: 12 },
                  fontWeight: 700,
                  fontFamily: "Poppins",
                  color: "#DC2626",
                }}
              >
                {collectionDetails?.total_seller_count_24hours}
              </Typography>
              <Typography
                sx={{
                  fontSize: { md: 16, xs: 12 },
                  fontWeight: 700,
                  fontFamily: "Poppins",
                }}
              >
                )
              </Typography>
            </Typography>
          </Box>
        ),
      },
    ],
    [collectionDetails],
  );
  const totalInfo2 = useMemo(
    () => [
      {
        label: "24h txs",
        content: (
          <Box>
            <Typography
              sx={{
                fontSize: { md: 16, xs: 12 },
                fontWeight: 700,
                fontFamily: "Poppins",
                display: "flex",
                columnGap: 0.4,
                color: "#fff",
              }}
            >
              {collectionDetails?.total_tx_count_24hours}
              <Typography
                sx={{
                  fontSize: { md: 16, xs: 12 },
                  fontWeight: 700,
                  fontFamily: "Poppins",
                }}
              >
                (
              </Typography>
              <Typography
                sx={{
                  fontSize: { md: 16, xs: 12 },
                  fontWeight: 700,
                  fontFamily: "Poppins",
                  color: "#00B912",
                }}
              >
                {collectionDetails?.total_buy_count_24hours}
              </Typography>
              <Typography
                sx={{
                  fontSize: { md: 16, xs: 12 },
                  fontWeight: 700,
                  fontFamily: "Poppins",
                }}
              >
                /
              </Typography>
              <Typography
                sx={{
                  fontSize: { md: 16, xs: 12 },
                  fontWeight: 700,
                  fontFamily: "Poppins",
                  color: "#DC2626",
                }}
              >
                {collectionDetails?.total_sell_count_24hours}
              </Typography>
              <Typography
                sx={{
                  fontSize: { md: 16, xs: 12 },
                  fontWeight: 700,
                  fontFamily: "Poppins",
                }}
              >
                )
              </Typography>
            </Typography>
          </Box>
        ),
      },
    ],
    [collectionDetails],
  );
  return (
    <Box
      sx={{
        flexDirection: "column",
        display: {
          md: "none !important",
          xs: "flex !important",
        },
      }}
      className={`tw-overflow-x-scroll tw-flex tw-gap-4 tw-overflow-y-hidden ${styles.hideScrollbar}`}
    >
      <Stack flexDirection="row" columnGap={1}>
        <Box sx={{ width: 200 }}>
          <DetailBar data={totalInfo2} justifyContent="center"></DetailBar>
        </Box>
      </Stack>
      <Stack flexDirection="row" columnGap={1}>
        <Box sx={{ width: 400 }}>
          <DetailBar data={nftInfo}></DetailBar>
        </Box>
        <Box sx={{ width: 200 }}>
          <DetailBar data={totalInfo} justifyContent="center"></DetailBar>
        </Box>
      </Stack>
    </Box>
  );
};

export default PriceInfoCardMB;
