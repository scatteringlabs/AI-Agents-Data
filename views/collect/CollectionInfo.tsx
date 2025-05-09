import styles from "./collect.module.css";
import DetailBar from "./DetailBar";
import { chainIdToName, useIsPc } from "@/utils";
import { useMemo, useState } from "react";
import MediaLink, { MediaItem } from "./MediaLink";
import { format } from "date-fns";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import CollectionInfoSkeleton from "./CollectionInfoSkeleton";
import AvatarCard from "@/components/collections/avatar-card";
import { SCAN_URL_ID } from "@/constants/url";
import { CollectionDetails } from "@/types/collection";
import PriceChangeText from "@/components/collections/price-change-text";
import {
  formatIntNumberWithKM,
  formatNumberWithKM,
  formatTokenFixedto,
} from "@/utils/format";
import TextTruncate from "@/components/text-truncate/TextTruncate";
import {
  DesBoldText,
  DesText,
  SecTitle,
  ShareButton,
  Title,
} from "@/components/text";
import InfoText from "./info-text";
import ShareDialog from "@/components/dialog/share-dialog";
import Iconify from "@/components/iconify";
import VerifiedIcon from "./verified-icon";
import VerifyInfoIcon from "./verify-info-icon";
import { useQuery } from "@tanstack/react-query";
import {
  Collection,
  fetchCollectionDetails,
  fetchCollectionStats,
  fetchDailyVolumes,
} from "@/services/reservoir";
import { fetchTokenPrices, TokenPrices } from "@/services/gecko";
import { ChainIdByName } from "@/constants/chain";
import { geckoNetworkName } from "@/services/tokens";
import { WETH_ADDRESS } from "@uniswap/universal-router-sdk";
interface CollectionInfoProps {
  slugLoading: boolean;
  collectionDetails?: CollectionDetails;
  handleOpenDialog: () => void;
}
const CollectionInfo = ({
  slugLoading,
  collectionDetails,
  handleOpenDialog,
}: CollectionInfoProps) => {
  const {
    chain_id: chainId,
    erc721_address,
    slug,
    has_logo,
    logo_url,
    twitter_username,
    project_url,
    telegram_url,
    description,
    discord_url,
    erc20_address,
    volume,
    price_change,
    name,
    symbol,
    total_supply,
    nft_items,
    create_time,
    price_in_usd,
  } = collectionDetails || {};
  console.log("collectionDetails", collectionDetails);

  const { data: collections } = useQuery<Collection[]>({
    queryKey: ["collectionDetails", collectionDetails?.erc721_address],
    queryFn: () =>
      fetchCollectionDetails(
        collectionDetails?.erc721_address || "",
        Number(collectionDetails?.chain_id) || 1,
      ),
    enabled: Boolean(collectionDetails?.erc721_address),
  });
  const wethAddress = useMemo(
    () => WETH_ADDRESS(Number(collectionDetails?.chain_id) || 1).toLowerCase(),
    [collectionDetails?.chain_id],
  );
  const { data: tokenPrices } = useQuery<TokenPrices>({
    queryKey: ["tokenPrices"],
    queryFn: () =>
      fetchTokenPrices(
        geckoNetworkName[Number(collectionDetails?.chain_id) || 1],
        wethAddress,
      ),
  });
  const ethPrice = useMemo(
    () => Number(tokenPrices?.[wethAddress]),
    [wethAddress, tokenPrices],
  );
  const nftVolume = useMemo(() => {
    return collections?.[0]?.volume?.["1day"] || 0;
  }, [collections]);
  const totalVolume = useMemo(
    () =>
      formatNumberWithKM(
        (nftVolume * ethPrice || 0) + Number(collectionDetails?.volume),
      ),
    [nftVolume, ethPrice, collectionDetails?.volume],
  );
  const showBaner = useMemo(
    () => !!collectionDetails?.banner_url,
    [collectionDetails],
  );
  const mediaCfg = useMemo(
    () => [
      { filename: "website", link: project_url },
      {
        filename: "scan",
        link: `${SCAN_URL_ID[Number(chainId)?.toString()]}token/${erc20_address}`,
      },
      { filename: "discord", link: discord_url },
      { filename: "x", link: twitter_username },
      {
        filename: "telegram",
        link: telegram_url,
      },
    ],
    [
      chainId,
      project_url,
      telegram_url,
      discord_url,
      erc20_address,
      twitter_username,
    ],
  );
  const priceInfo = useMemo(
    () => [
      {
        label: "Price",
        content: `$${formatTokenFixedto(collectionDetails?.price_in_usd)}`,
      },
      {
        label: "24h Change",
        content: (
          <PriceChangeText
            priceChange={Number(collectionDetails?.price_change)}
          />
        ),
      },
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
    ],
    [collectionDetails],
  );
  const nftInfo = useMemo(
    () => [
      {
        label: "Floor Price",
        content: collections?.[0]?.floorAsk?.price?.amount?.decimal
          ? `${collections?.[0]?.floorAsk?.price?.amount?.decimal} ETH`
          : "-",
      },
      {
        label: "24h NFT VOL",
        content: nftVolume ? `${nftVolume} ETH` : "0",
      },
      {
        label: "nft Listed",
        content: collections?.[0]?.onSaleCount || "-",
      },
      {
        label: "nft Owners",
        content: collections?.[0]?.ownerCount || collectionDetails?.nft_owners,
      },
    ],
    [collectionDetails, collections, nftVolume],
  );
  const totalInfo = useMemo(
    () => [
      {
        label: "24h total vol",
        content: `$${totalVolume}`,
      },
    ],
    [totalVolume],
  );
  const isPc = useIsPc();
  if (slugLoading) {
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
              src={collectionDetails?.banner_url}
            />
          </Box>
        ) : null}
        <Box className="tw-flex tw-items-start">
          <Box className="tw-flex-shrink-0  tw-overflow-hidden">
            <Box sx={{ width: "100%" }}>
              {collectionDetails?.logo_url ? (
                <Box
                  component="img"
                  src={collectionDetails?.logo_url}
                  alt=""
                  className="avatar"
                  sx={{
                    width: { md: 152, xs: 152 * 0.6 },
                    height: { md: 152, xs: 152 * 0.6 },
                    borderRadius: "50%",
                    position: "relative",
                    zIndex: 1,
                  }}
                />
              ) : (
                <AvatarCard
                  hasLogo={has_logo}
                  logoUrl={collectionDetails?.logo_url || ""}
                  chainId={chainId}
                  symbol={collectionDetails?.symbol || ""}
                  size={152}
                  showChain={false}
                  mr={0}
                />
              )}
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
              <TextTruncate text={collectionDetails?.description || ""} />
            </Box>
            <InfoText
              totalSupply={total_supply}
              nftItems={collections?.[0]?.tokenCount || nft_items}
              createTime={create_time}
              collectionDetails={collectionDetails}
              chainId={chainId}
            />
          </Box>
        </Box>

        <Box
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
        </Box>
      </Box>
    </Box>
  );
};

export default CollectionInfo;
