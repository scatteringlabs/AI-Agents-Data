import { useMemo } from "react";
import { Box, IconButton, Stack } from "@mui/material";
import CollectionInfoSkeleton from "./CollectionInfoSkeleton";
import AvatarCard from "@/components/collections/avatar-card";
import { CollectionDetails, CollectionDetailsErc20z } from "@/types/collection";
import { SecTitle, ShareButton, Title } from "@/components/text";
import { getTokenLogoURL } from "@/utils/token";
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
import {
  Collection,
  fetchCollectionDetails,
  fetchTokensDetails,
  TokenDetails,
} from "@/services/reservoir";
import { WETH_ADDRESS } from "@uniswap/universal-router-sdk";
import { fetchTokenPrices, TokenPrices } from "@/services/gecko";
import { geckoNetworkName } from "@/services/tokens";
import InfoTextErc20Z from "./info-text-erc20z";
interface CollectionInfoProps {
  slugLoading: boolean;
  collectionDetails?: CollectionDetailsErc20z;
  handleOpenDialog: () => void;
}

const MbCollectionInfoZRC20Z = ({
  slugLoading,
  collectionDetails,
  handleOpenDialog,
}: CollectionInfoProps) => {
  const {
    chain_id: chainId,
    logo_url,
    name,
    symbol,
    total_supply,
  } = collectionDetails || {};
  const { data: tokenDetails } = useQuery<TokenDetails[]>({
    queryKey: ["tokenDetails", collectionDetails?.mt_address],
    queryFn: () => {
      return fetchTokensDetails(
        `${collectionDetails?.mt_address}:${collectionDetails?.token_id}`,
        Number(collectionDetails?.chain_id) || 1,
      );
    },
    enabled: Boolean(collectionDetails?.mt_address),
  });

  const infoItems = useMemo(
    () => [
      {
        label: "PRICE",
        value: `$${Number(collectionDetails?.price_in_usd).toPrecision(5)}`,
      },
      {
        label: "1H CHANGE",
        value: (
          <PriceChangeText
            priceChange={Number(collectionDetails?.price_change_in_1hours)}
            fontSize={14}
            fontWeight={600}
          />
        ),
      },
      {
        label: "6H CHANGE",
        value: (
          <PriceChangeText
            priceChange={Number(collectionDetails?.price_change_in_6hours)}
            fontSize={14}
            fontWeight={600}
          />
        ),
      },
      {
        label: "24H CHANGE",
        value: (
          <PriceChangeText
            priceChange={Number(collectionDetails?.price_change_in_24hours)}
            fontSize={14}
            fontWeight={600}
          />
        ),
      },
      {
        label: "1H VOLUME",
        value: `$${formatNumberWithKM(collectionDetails?.total_volume_in_1hours)}`,
      },
      {
        label: "6H VOLUME",
        value: `$${formatNumberWithKM(collectionDetails?.total_volume_in_6hours)}`,
      },
      {
        label: "24H VOLUME",
        value: `$${formatNumberWithKM(collectionDetails?.total_volume_in_24hours)}`,
      },
      {
        label: "LIQUIDITY",
        value: `$${formatNumberWithKM(collectionDetails?.total_liquidity)}`,
      },
      {
        label: "MARKET CAP",
        value: `$${formatNumberWithKM(collectionDetails?.market_cap)}`,
      },
      {
        label: "24h makers",
        value: collectionDetails?.total_makers_count_24hours,
      },
      {
        label: "24h txs",
        value: collectionDetails?.total_tx_count_24hours,
      },
    ],
    [collectionDetails],
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
            md: "auto",
            xs: "auto",
          },
          // background:
          //   "linear-gradient(180deg, rgba(1, 4, 16, 0.00) 0%, #010410 100%)",
        }}
      >
        <Stack
          className="tw-flex tw-items-center"
          flexDirection="row"
          alignItems="center"
        >
          <AvatarCard
            hasLogo
            logoUrl={
              logo_url
                ? logo_url
                : getTokenLogoURL({
                    chainId,
                    address: collectionDetails?.ft_address,
                    size: 250,
                  })
            }
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
              <Title sx={{ fontSize: { md: 20, xs: 16 } }}>{symbol}</Title>
            </Box>
            <SecTitle
              sx={{ fontSize: { md: 16, xs: 14 }, textTransform: "unset" }}
            >
              {name}
            </SecTitle>
          </Stack>
        </Stack>
      </Box>
      <ExpandableInfoComponent infoItems={infoItems} />
      <Box sx={{ mt: 3 }}>
        <TextTruncate text={tokenDetails?.[0]?.token?.description || ""} />
      </Box>
      <Box sx={{ mt: 1 }}>
        <InfoTextErc20Z
          totalSupply={total_supply}
          nftItems={tokenDetails?.[0]?.token?.supply}
          createTime={""}
          // @ts-ignore
          collectionDetails={collectionDetails}
          tokenDetails={tokenDetails?.[0]}
          chainId={chainId}
        />
      </Box>
    </Box>
  );
};

export default MbCollectionInfoZRC20Z;
