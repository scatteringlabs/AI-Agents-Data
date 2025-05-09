import { Box, Stack } from "@mui/material";
import CollectionInfoSkeleton from "./CollectionInfoSkeleton";
import AvatarCard from "@/components/collections/avatar-card";
import { CollectionDetailsErc20z } from "@/types/collection";
import TextTruncate from "@/components/text-truncate/TextTruncate";
import { SecTitle, Title } from "@/components/text";
import { getTokenLogoURL } from "@/utils/token";
import { useQuery } from "@tanstack/react-query";
import { fetchTokensDetails, TokenDetails } from "@/services/reservoir";
import InfoTextErc20Z from "./info-text-erc20z";
import PriceInfoCard from "./zora/price-info-card";
interface CollectionInfoProps {
  slugLoading: boolean;
  collectionDetails?: CollectionDetailsErc20z;
  handleOpenDialog: () => void;
}
const CollectionInfoERC20Z = ({
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
            md: "auto",
            xs: "auto",
          },
        }}
      >
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
              <Title>{symbol}</Title>
              <SecTitle sx={{ ml: 1, textTransform: "unset" }}>{name}</SecTitle>
            </Stack>
            <Box sx={{ mt: 1, maxWidth: { md: 500 } }}>
              <TextTruncate
                text={tokenDetails?.[0]?.token?.description || ""}
              />
            </Box>
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
        <PriceInfoCard collectionDetails={collectionDetails} />
      </Box>
    </Box>
  );
};

export default CollectionInfoERC20Z;
