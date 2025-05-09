import { useMemo } from "react";
import { Box, IconButton, Stack } from "@mui/material";
import CollectionInfoSkeleton from "../../../collect/CollectionInfoSkeleton";
import AvatarCard from "@/components/collections/avatar-card";
import { CollectionDetails } from "@/types/collection";
import { SecTitle, ShareButton, Title } from "@/components/text";
import { getTokenLogoURL } from "@/utils/token";
import ExpandableInfoComponent from "../../../collect/ ExpandableInfoComponent";
import PriceChangeText from "@/components/collections/price-change-text";
import { formatNumberWithKM } from "@/utils/format";
import TextTruncate from "@/components/text-truncate/TextTruncate";
import InfoText from "../../../collect/info-text";
import MediaLink from "../../../collect/MediaLink";
import { SCAN_URL_ID } from "@/constants/url";
import Iconify from "@/components/iconify";
import VerifiedIcon from "../../../collect/verified-icon";
import VerifyInfoIcon from "../../../collect/verify-info-icon";
import { CollectionStats } from "@/services/sniper";
interface CollectionInfoProps {
  detailsLoading: boolean;
  allVolume: number;
  collectionDetails?: CollectionDetails;
  collectionStat?: CollectionStats;
  handleOpenDialog: () => void;
  setBlinkDialogOpen: (a: boolean) => void;
}

const SolMbCollectionInfo = ({
  detailsLoading,
  collectionDetails,
  handleOpenDialog,
  setBlinkDialogOpen,
  collectionStat,
  allVolume,
}: CollectionInfoProps) => {
  const {
    chain_id: chainId,
    slug,
    has_logo,
    erc20_address,
    name,
    symbol,
  } = collectionDetails || {};
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
        value: collectionStat?.floorPrice
          ? collectionStat?.floorPrice + " SOL"
          : "-",
      },
      {
        label: "24H NFT VOL",
        value: collectionStat?.oneDayVolume
          ? collectionStat?.oneDayVolume + " SOL"
          : "-",
      },
      { label: "NFT LISTED", value: collectionStat?.listedCount || "-" },
      { label: "NFT OWNERS", value: collectionStat?.uniqueHolders || "-" },
      { label: "24H TOTAL VOL", value: `$${formatNumberWithKM(allVolume)}` },
    ],
    [collectionDetails, collectionStat, allVolume],
  );
  if (detailsLoading) {
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
            onClick={() => {
              setBlinkDialogOpen(true);
            }}
            sx={{
              fontSize: { md: 14, xs: 12 },
              padding: "0px",
              mb: 0,
              border: "none",
            }}
          >
            <IconButton sx={{ p: 0.2, pr: 0.6 }}>
              <Iconify icon="material-symbols:share" color="#b054ff" />
            </IconButton>
            Get Blink
          </ShareButton>
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
          nftItems={collectionStat?.supply?.toString() || ""}
          createTime={collectionDetails?.create_time}
          collectionDetails={collectionDetails}
          chainId={chainId}
        />
      </Box>
    </Box>
  );
};

export default SolMbCollectionInfo;
