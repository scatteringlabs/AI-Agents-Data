import styles from "@/views/collect/collect.module.css";
import { chainIdToName, useIsPc } from "@/utils";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Box, Dialog, IconButton, Stack, Typography } from "@mui/material";
import AvatarCard from "@/components/collections/avatar-card";
import { SCAN_URL_ID } from "@/constants/url";
import { CollectionDetails } from "@/types/collection";
import PriceChangeText from "@/components/collections/price-change-text";
import { formatIntNumberWithKM, formatNumberWithKM } from "@/utils/format";
import TextTruncate from "@/components/text-truncate/TextTruncate";
import {
  DesBoldText,
  DesText,
  SecTitle,
  ShareButton,
  Title,
} from "@/components/text";
import { getTokenLogoURL } from "@/utils/token";
import ShareDialog from "@/components/dialog/share-dialog";
import Iconify from "@/components/iconify";
import VerifiedIcon from "@/views/collect/verified-icon";
import VerifyInfoIcon from "@/views/collect/verify-info-icon";
import InfoText from "@/views/collect/info-text";
import CollectionInfoSkeleton from "@/views/collect/CollectionInfoSkeleton";
import MediaLink from "@/views/collect/MediaLink";
import DetailBar from "@/views/collect/DetailBar";
import { getCollectionBySlug } from "@/services/collections";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { CollectionStats } from "@/services/sniper";
import PreviewComponent from "./PreviewComponent";
import { ButtonWrapper } from "@/components/button/wrapper";
import { toast } from "react-toastify";
import PriceInfoCard from "@/views/collect/zora/price-info-card";
interface SolCollectionInfoProps {
  detailsLoading: boolean;
  allVolume: number;
  collectionDetails?: CollectionDetails;
  collectionStat?: CollectionStats;
  handleOpenDialog: () => void;
  setBlinkDialogOpen: (a: boolean) => void;
}

const SolCollectionInfo = ({
  collectionDetails,
  detailsLoading,
  collectionStat,
  handleOpenDialog,
  setBlinkDialogOpen,
  allVolume,
}: SolCollectionInfoProps) => {
  const {
    chain_id: chainId,
    erc721_address,
    has_logo,
    logo_url,
    twitter_username,
    project_url,
    telegram_url,
    description,
    discord_url,
    address,
    volume,
    price_change,
    name,
    symbol,
    total_supply,
    nft_items,
    create_time,
    price_in_usd,
    banner_url,
    liquidity,
    market_cap,
    nft_owners,
  } = collectionDetails || {};
  const showBaner = useMemo(() => !!banner_url, [banner_url]);

  const mediaCfg = useMemo(
    () => [
      { filename: "website", link: project_url },
      {
        filename: "sol-scan",
        link: `${SCAN_URL_ID[Number(chainId)?.toString()]}token/${address}`,
      },
      { filename: "discord", link: discord_url },
      ...(collectionDetails?.creator_x_username ? [{
        filename: "dev2",
        link: `https://twitter.com/${collectionDetails.creator_x_username}`,
        isDevIcon: true
      }] : []),
      ...(twitter_username ? [{
        filename: "x",
        link: `https://x.com/${twitter_username}`,
      }] : []),
      {
        filename: "telegram",
        link: telegram_url,
      },
    ],
    [chainId, project_url, telegram_url, discord_url, address, twitter_username, collectionDetails?.creator_x_username],
  );
  const priceInfo = useMemo(
    () => [
      {
        label: "Price",
        content: `$${Number(price_in_usd).toPrecision(5)}`,
      },
      {
        label: "24h Change",
        content: <PriceChangeText priceChange={Number(price_change)} />,
      },
      {
        label: "24h Volume",
        content: `$${formatNumberWithKM(volume)}`,
      },
      {
        label: "Liquidity",
        content: `$${formatNumberWithKM(liquidity)}`,
      },
      {
        label: "Market Cap",
        content: `$${formatNumberWithKM(market_cap)}`,
      },
    ],
    [price_in_usd, price_change, volume, liquidity, market_cap],
  );
  const nftInfo = useMemo(
    () => [
      {
        label: "Floor Price",
        content: collectionStat?.floorPrice
          ? collectionStat?.floorPrice + " SOL"
          : "-",
      },
      {
        label: "24h NFT VOL",
        content: collectionStat?.oneDayVolume
          ? collectionStat?.oneDayVolume + " SOL"
          : "0",
      },
      {
        label: "nft Listed",
        content: collectionStat?.listedCount || "-",
      },
      { label: "nft Owners", content: collectionStat?.uniqueHolders || "-" },
    ],
    [collectionStat],
  );
  const totalInfo = useMemo(
    () => [
      {
        label: "24h total vol",
        content: `$${formatNumberWithKM(allVolume)}`,
      },
    ],
    [allVolume],
  );
  const isPc = useIsPc();
  if (detailsLoading) {
    return (
      <Box sx={{ display: { md: "block", xs: "none" } }}>
        <CollectionInfoSkeleton />
      </Box>
    );
  }

  return (
    <Box sx={{ display: { md: "block", xs: "none" } }}>
      <Box
        className="tw-mt-16"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          pb: 4,
          height: {
            md: showBaner ? 400 : "auto",
            xs: showBaner ? 200 : "auto",
          },
        }}
      >
        {showBaner ? (
          <Box
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              zIndex: -1,
              width: "100%",
              height: "auto",
              pt: { md: "80px", xs: "60px" },
              "&:after": {
                content: '""',
                width: "100%",
                height: "100%",
                position: "absolute",
                left: 0,
                top: 0,
                zIndex: 1,
                background:
                  "linear-gradient(180deg, rgba(1, 4, 16, 0.00) 0%, #010410 100%)",
              },
            }}
          >
            <Box
              component="img"
              sx={{
                width: "100%",
                height: "auto",
                zIndex: -1,
              }}
              src={banner_url}
            />
          </Box>
        ) : null}
        <Box className="tw-flex tw-items-start">
          <Box className="tw-flex-shrink-0  tw-overflow-hidden">
            <Box sx={{ width: "100%" }}>
              <AvatarCard
                hasLogo={!!collectionDetails?.logo_url}
                // logoUrl={getTokenLogoURL({
                //   chainId,
                //   address: address,
                //   size: 250,
                // })}
                logoUrl={collectionDetails?.logo_url || ""}
                chainId={chainId}
                symbol={symbol || ""}
                size={152}
                showChain={false}
                mr={0}
              />
            </Box>
          </Box>
          <Box className="tw-ml-4 md:tw-ml-12 tw-pt-2 md:tw-pt-7">
            <Stack flexDirection="row" alignItems="center" sx={{ mb: 1 }}>
              <Box sx={{ mr: 1 }}>
                <VerifiedIcon collectionDetails={collectionDetails} />
              </Box>
              <Title>{symbol}</Title>
              <SecTitle sx={{ ml: 1, textTransform: "unset" }}>{name}</SecTitle>
            </Stack>
            <Box className="tw-flex tw-items-center tw-gap-10">
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {/* <ShareButton
                  onClick={() => {
                    setBlinkDialogOpen(true);
                  }}
                  sx={{ background: "#b054ff", color: "#fff", fontWeight: 600 }}
                >
                  <IconButton>
                    <Iconify icon="material-symbols:share" color="#fff" />
                  </IconButton>
                  Get Blink
                </ShareButton> */}
                <ShareButton onClick={handleOpenDialog}>
                  <IconButton>
                    <Iconify
                      icon="grommet-icons:share-rounded"
                      color="#b054ff"
                    />
                  </IconButton>
                  Share Stats
                </ShareButton>
                <MediaLink
                  mediaCfg={mediaCfg}
                  collectionDetails={collectionDetails}
                />
                <VerifyInfoIcon collectionDetails={collectionDetails} />
              </Box>
            </Box>
            <Box sx={{ mt: 1, maxWidth: { md: 500 } }}>
              <TextTruncate text={description || ""} />
            </Box>
            <InfoText
              totalSupply={total_supply}
              nftItems={collectionStat?.supply?.toString() || ""}
              createTime={create_time}
              collectionDetails={collectionDetails}
              chainId={chainId}
            />
          </Box>
        </Box>

        {collectionDetails ? (
          <PriceInfoCard collectionDetails={collectionDetails as any} />
        ) : null}
        {/* <Box
          sx={{
            flexDirection: "column",
            display: { md: "flex !important", xs: "none !important" },
          }}
          className={`tw-overflow-x-scroll tw-flex tw-gap-4 tw-overflow-y-hidden ${styles.hideScrollbar}`}
        >
          <DetailBar data={priceInfo}></DetailBar>
          <Stack flexDirection="row">
            <DetailBar data={nftInfo}></DetailBar>
            <Box sx={{ ml: 1.2 }}>
              <DetailBar data={totalInfo}></DetailBar>
            </Box>
          </Stack>
        </Box> */}
      </Box>
    </Box>
  );
};

export default SolCollectionInfo;
