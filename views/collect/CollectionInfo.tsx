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
import { Collection, CollectionDetails } from "@/types/collection";
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
  fetchCollectionDetails,
  fetchCollectionStats,
  fetchDailyVolumes,
} from "@/services/reservoir";
import { fetchTokenPrices, TokenPrices } from "@/services/gecko";
import { ChainIdByName } from "@/constants/chain";
import { geckoNetworkName } from "@/services/tokens";
import { WETH_ADDRESS } from "@uniswap/universal-router-sdk";
import PriceInfoCard from "./zora/price-info-card";
import { useFavorites } from "@/hooks/useFavorites";
import { toast } from "react-toastify";

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
    address,
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
  const showBaner = useMemo(
    () => !!collectionDetails?.banner_url,
    [collectionDetails],
  );
  const mediaCfg = useMemo(
    () => [
      { filename: "website", link: project_url },
      {
        filename: "scan",
        link: `${SCAN_URL_ID[Number(chainId)?.toString()]}token/${address}`,
      },
      { filename: "discord", link: discord_url },
      ...(collectionDetails?.creator_x_username ? [{
        filename: "dev2",
        link: `https://twitter.com/${collectionDetails.creator_x_username}`,
        isDevIcon: true,
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
    [
      chainId,
      project_url,
      telegram_url,
      discord_url,
      address,
      twitter_username,
      collectionDetails?.creator_x_username,
    ],
  );
  const { isFavorite, toggleFavorite } = useFavorites();

  const collectionForFavorites = useMemo(() => {
    if (!collectionDetails) return null;

    const collection: Collection = {
      chain_id: collectionDetails.chain_id,
      address: collectionDetails.address,
      project_url: collectionDetails.project_url,
      erc20_address: collectionDetails.erc20_address,
      erc721_address: collectionDetails.erc721_address,
      total_mints: "0",
      name: collectionDetails.name,
      status_flags: collectionDetails.status_flags,
      price_in_usd: collectionDetails.price_in_usd,
      logo_url: collectionDetails.logo_url,
      volume: collectionDetails.volume,
      volume_change: "0",
      price_change: collectionDetails.price_change,
      total_supply: collectionDetails.total_supply,
      market_cap: collectionDetails.market_cap,
      created_timestamp: 0,
      launch_timestamp: 0,
      liquidity: collectionDetails.liquidity,
      total_liquidity: collectionDetails.total_liquidity,
      slug: collectionDetails.slug,
      symbol: collectionDetails.symbol,
      has_logo: collectionDetails.has_logo,
      is_verified: collectionDetails.is_verified,
      type_id: 0,
      zora_coin_type: collectionDetails.collection_type,
      collection_type: collectionDetails.collection_type,
      rank: 0,
      creation_date: collectionDetails.create_time,
      twitter_username: collectionDetails.twitter_username,
      creator_x_username: collectionDetails.creator_x_username,
      tags: collectionDetails.tags || [],
    };

    return collection;
  }, [collectionDetails]);

  const handleFavoriteClick = () => {
    if (collectionForFavorites) {
      toggleFavorite(collectionForFavorites);
      toast.success(
        isFavorite(collectionForFavorites)
          ? "Removed from favorites"
          : "Added to favorites"
      );
    }
  };

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
                <IconButton
                  onClick={handleFavoriteClick}
                  sx={{
                    color: collectionForFavorites && isFavorite(collectionForFavorites) ? "#B054FF" : "white",
                    mr: 1,
                    border: '1px solid',
                    borderColor: collectionForFavorites && isFavorite(collectionForFavorites) ? "#B054FF" : "rgba(255,255,255,0.3)",
                    '&:hover': {
                      borderColor: "#B054FF",
                      backgroundColor: 'rgba(176, 84, 255, 0.1)'
                    }
                  }}
                >
                  <Iconify
                    icon={
                      collectionForFavorites && isFavorite(collectionForFavorites)
                        ? "material-symbols-light:star"
                        : "material-symbols-light:star-outline"
                    }
                    sx={{ width: "28px", height: "28px" }}
                  />
                </IconButton>
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
              nftItems={"0"}
              createTime={create_time}
              collectionDetails={collectionDetails}
              chainId={chainId}
            />
          </Box>
        </Box>
        {collectionDetails ? (
          <PriceInfoCard collectionDetails={collectionDetails as any} />
        ) : null}
      </Box>
    </Box>
  );
};

export default CollectionInfo;
