import AvatarCard from "@/components/collections/avatar-card";
import { useTradeTokenPrice } from "@/context/hooks/useTradeTokenPrice";
import { formatNumberWithKM, formatTokenFixedto } from "@/utils/format";
import { getTokenLogoURL } from "@/utils/token";
import { Card, CardContent, Typography, Grid, Stack, Box } from "@mui/material";
import TradeInfoItem from "./trade-info-item";
import { CollectionDetailsErc20z } from "@/types/collection";

interface iTradingInfoCardErc20Z {
  collectionDetails?: CollectionDetailsErc20z;
  loading: boolean;
}
function TradingInfoCardErc20Z({
  collectionDetails,
  loading,
}: iTradingInfoCardErc20Z) {
  const { tokenPrice } = useTradeTokenPrice();

  return (
    <Card
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        color: "white",
        flexGrow: 1,
      }}
    >
      <CardContent
        sx={{
          overflowX: { xs: "scroll", md: "initial" },
          pb: { md: "16px !important", xs: "8px !important" },
          p: { md: "16px !important", xs: "8px !important" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Stack flexDirection="row" alignItems="center">
            <AvatarCard
              hasLogo={!!collectionDetails?.logo_url}
              symbol={collectionDetails?.symbol || "token"}
              logoUrl={
                collectionDetails?.logo_url
                  ? collectionDetails?.logo_url
                  : getTokenLogoURL({
                      chainId: collectionDetails?.chain_id || 1,
                      address: collectionDetails?.mt_address,
                    })
              }
              chainId={collectionDetails?.chain_id}
              size={40}
            />
            <Stack flexDirection="row" alignItems="center">
              <Typography
                variant="h4"
                component="div"
                sx={{
                  fontSize: { md: 20, xs: 16 },
                  textTransform: "uppercase",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "160px",
                  overflow: "hidden",
                }}
              >
                {collectionDetails?.symbol || "Unknown Token"}
              </Typography>
            </Stack>
            <Typography
              variant="h4"
              sx={{ ml: 2, fontSize: { md: 20, xs: 16 } }}
            >
              $
              {collectionDetails?.price_in_usd
                ? formatTokenFixedto(collectionDetails?.price_in_usd)
                : `${formatTokenFixedto(tokenPrice)}`}
            </Typography>
          </Stack>
          <Typography
            variant="h4"
            sx={{
              ml: 2,
              fontSize: { md: 20, xs: 16 },
              display: { md: "none", xs: "block" },
              color:
                Number(collectionDetails?.price_change_in_24hours || 0) > 0
                  ? "#00B912"
                  : "#DC2626",
            }}
          >
            {`${Number(collectionDetails?.price_change_in_24hours) || 0}%`}
          </Typography>
          <Grid
            container
            spacing={2}
            sx={{ width: "60%", display: { md: "flex", xs: "none" } }}
          >
            <TradeInfoItem
              loading={loading}
              title="24h Change"
              value={`${collectionDetails?.price_change_in_24hours || 0}%`}
              color={
                Number(collectionDetails?.price_change_in_24hours || 0) > 0
                  ? "#00B912"
                  : "#DC2626"
              }
            />
            <TradeInfoItem
              loading={loading}
              title="24h Volume"
              value={`$${formatNumberWithKM(collectionDetails?.total_volume_in_24hours)}`}
            />
            <TradeInfoItem
              loading={loading}
              title="Liquidity"
              value={`$${formatNumberWithKM(collectionDetails?.total_liquidity)}`}
            />
            <TradeInfoItem
              loading={loading}
              title="Market Cap"
              value={`$${formatNumberWithKM(collectionDetails?.market_cap)}`}
            />
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}

export default TradingInfoCardErc20Z;
