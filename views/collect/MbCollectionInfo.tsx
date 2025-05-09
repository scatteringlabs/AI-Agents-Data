import { useMemo } from "react";
import { Box, IconButton, Stack } from "@mui/material";
import CollectionInfoSkeleton from "./CollectionInfoSkeleton";
import AvatarCard from "@/components/collections/avatar-card";
import { CollectionDetails } from "@/types/collection";
import { SecTitle, ShareButton, Title } from "@/components/text";
import ExpandableInfoComponent from "./ ExpandableInfoComponent";
import PriceChangeText from "@/components/collections/price-change-text";
import { formatNumberWithKM } from "@/utils/format";
import TextTruncate from "@/components/text-truncate/TextTruncate";
import InfoText from "./info-text";
import MediaLink from "./MediaLink";
import { SCAN_URL_ID } from "@/constants/url";
import Iconify from "@/components/iconify";
import VerifiedIcon from "./verified-icon";
import VerifyInfoIcon from "./verify-info-icon";
import { useQuery } from "@tanstack/react-query";
import { Collection, fetchCollectionDetails } from "@/services/reservoir";
import { WETH_ADDRESS } from "@uniswap/universal-router-sdk";
import { fetchTokenPrices, TokenPrices } from "@/services/gecko";
import { geckoNetworkName } from "@/services/tokens";
interface CollectionInfoProps {
  slugLoading: boolean;
  collectionDetails?: CollectionDetails;
  handleOpenDialog: () => void;
}

const MbCollectionInfo = ({
  slugLoading,
  collectionDetails,
  handleOpenDialog,
}: CollectionInfoProps) => {
  const {
    chain_id: chainId,
    slug,
    has_logo,
    erc20_address,
    name,
    symbol,
  } = collectionDetails || {};
  const { data: collections } = useQuery<Collection[]>({
    queryKey: ["collectionDetails", collectionDetails?.erc721_address],
    queryFn: () =>
      fetchCollectionDetails(
        collectionDetails?.erc721_address || "",
        Number(collectionDetails?.chain_id) || 1,
      ),
    enabled: Boolean(collectionDetails?.erc721_address),
  });
  // const wethAddress = useMemo(
  //   () => WETH_ADDRESS(Number(collectionDetails?.chain_id) || 1).toLowerCase(),
  //   [collectionDetails?.chain_id],
  // );
  // const { data: tokenPrices } = useQuery<TokenPrices>({
  //   queryKey: ["tokenPrices"],
  //   queryFn: () =>
  //     fetchTokenPrices(
  //       geckoNetworkName[Number(collectionDetails?.chain_id) || 1],
  //       wethAddress,
  //     ),
  // });
  // const ethPrice = useMemo(
  //   () => Number(tokenPrices?.[wethAddress]),
  //   [wethAddress, tokenPrices],
  // );
  const nftVolume = useMemo(() => {
    return collections?.[0]?.volume?.["1day"] || 0;
  }, [collections]);
  const totalVolume = useMemo(() => 0, []);
  const showBaner = useMemo(
    () => !!collectionDetails?.mobile_banner_url,
    [collectionDetails],
  );
  const mediaCfg = useMemo(
    () => [
      { filename: "website", link: collectionDetails?.project_url },
      {
        filename: "scan",
        link: `${SCAN_URL_ID[Number(chainId)?.toString()]}token/${erc20_address}`,
      },
      { filename: "discord", link: collectionDetails?.discord_url },
      { filename: "x", link: collectionDetails?.twitter_username },
      {
        filename: "telegram",
        link: collectionDetails?.telegram_url,
      },
    ],
    [chainId, collectionDetails, erc20_address],
  );
  const infoItems = useMemo(
    () => [
      {
        label: "PRICE",
        value: `$${Number(collectionDetails?.price_in_usd).toPrecision(5)}`,
      },
      {
        label: "24H CHANGE",
        value: (
          <PriceChangeText
            priceChange={Number(collectionDetails?.price_change)}
            fontSize={14}
            fontWeight={600}
          />
        ),
      },
      {
        label: "24H VOLUME",
        value: `$${formatNumberWithKM(collectionDetails?.volume)}`,
      },
      {
        label: "LIQUIDITY",
        value: `$${formatNumberWithKM(collectionDetails?.liquidity)}`,
      },
      {
        label: "MARKET CAP",
        value: `$${formatNumberWithKM(collectionDetails?.market_cap)}`,
      },
      {
        label: "FLOOR PRICE",
        value: collections?.[0]?.floorAsk?.price?.amount?.decimal
          ? `${collections?.[0]?.floorAsk?.price?.amount?.decimal} ETH`
          : "-",
      },
      { label: "24H NFT VOL", value: nftVolume ? `${nftVolume} ETH` : "-" },
      { label: "NFT LISTED", value: collections?.[0]?.onSaleCount || "-" },
      { label: "NFT OWNERS", value: collectionDetails?.nft_owners },
      { label: "24H TOTAL VOL", value: totalVolume ? `$${totalVolume}` : "-" },
    ],
    [collectionDetails, totalVolume, collections, nftVolume],
  );
  if (slugLoading) {
    return (
      <Box sx={{ display: { md: "none", xs: "block" } }}>
        <CollectionInfoSkeleton />
      </Box>
    );
  }

  return (
    <Box sx={{ display: { md: "none", xs: "block" } }}>
      <Box
        // className={showBaner ? "tw-mt-32" : ""}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          pb: 2,
          height: {
            md: showBaner ? 400 : "auto",
            xs: showBaner ? 200 : "auto",
          },
          // background:
          //   "linear-gradient(180deg, rgba(1, 4, 16, 0.00) 0%, #010410 100%)",
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
              src={collectionDetails?.mobile_banner_url}
            />
          </Box>
        ) : null}
        <Stack
          className="tw-flex tw-items-center"
          flexDirection="row"
          alignItems="center"
        >
          <AvatarCard
            hasLogo={has_logo}
            // logoUrl={getTokenLogoURL({
            //   chainId,
            //   address: erc20_address,
            //   size: 250,
            // })}
            logoUrl={collectionDetails?.logo_url || ""}
            chainId={chainId}
            symbol={collectionDetails?.symbol || ""}
            size={90}
            showChain={false}
            mr={0}
          />
          <Stack flexDirection="column" alignItems="flex-start" sx={{ ml: 1 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Box sx={{ mr: 1 }}>
                <VerifiedIcon collectionDetails={collectionDetails} />
              </Box>
              <Title sx={{ fontSize: { md: 20, xs: 16 } }}>{symbol}</Title>
            </Box>
            <SecTitle
              sx={{ fontSize: { md: 16, xs: 14 }, textTransform: "unset" }}
            >
              {name}
            </SecTitle>
          </Stack>
        </Stack>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            flexDirection: "column",
          }}
        >
          <ShareButton
            onClick={handleOpenDialog}
            sx={{
              fontSize: { md: 14, xs: 12 },
              padding: "0px",
              mb: 0,
              border: "none",
            }}
          >
            <IconButton sx={{ p: 0.2, pr: 0.6 }}>
              <Iconify icon="grommet-icons:share-rounded" color="#b054ff" />
            </IconButton>
            Share Stats
          </ShareButton>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <MediaLink
              mediaCfg={mediaCfg}
              collectionDetails={collectionDetails}
            />
            <VerifyInfoIcon collectionDetails={collectionDetails} />
          </Box>
        </Box>
      </Box>
      <ExpandableInfoComponent infoItems={infoItems} />
      <Box sx={{ mt: 3 }}>
        <TextTruncate text={collectionDetails?.description || ""} />
      </Box>
      <Box sx={{ mt: 1 }}>
        <InfoText
          totalSupply={collectionDetails?.total_supply}
          nftItems={collectionDetails?.nft_items}
          createTime={collectionDetails?.create_time}
          collectionDetails={collectionDetails}
          chainId={chainId}
        />
      </Box>
    </Box>
  );
};

export default MbCollectionInfo;
