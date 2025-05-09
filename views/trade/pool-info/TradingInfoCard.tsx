import AvatarCard from "@/components/collections/avatar-card";
import { useTradeTokenPrice } from "@/context/hooks/useTradeTokenPrice";
import { PoolInfo } from "@/services/tokens";
import {
  formatNumberWithKM,
  formatTokenFixedto,
  formatUSD,
} from "@/utils/format";
import { getTokenLogoURL } from "@/utils/token";
import { Card, CardContent, Typography, Grid, Stack, Box } from "@mui/material";
import TradeInfoItem from "./trade-info-item";
import Iconify from "@/components/iconify";
import { useState } from "react";
import PopoverSearch from "@/components/drawer/popover-search";
import { TokenDrawer } from "@/components/drawer/token-drawer";
import { CollectionDetails } from "@/types/collection";

interface iTradingInfoCard {
  poolInfo?: PoolInfo;
  loading: boolean;
  isMobile?: boolean;
  priceInUsd: string;
  collectionDetails?: CollectionDetails;
}
function TradingInfoCard({
  loading,
  priceInUsd,
  collectionDetails,
  isMobile = false,
}: iTradingInfoCard) {
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
              hasLogo={true}
              logoUrl={collectionDetails?.logo_url || ""}
              symbol={collectionDetails?.base_asset_symbol || "token"}
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
                }}
              >
                {collectionDetails?.base_asset_symbol || "Unknown Token"}
              </Typography>
            </Stack>
            <Typography
              variant="h4"
              sx={{ ml: 2, fontSize: { md: 20, xs: 16 } }}
            >
              $
              {priceInUsd
                ? formatTokenFixedto(priceInUsd)
                : `${formatTokenFixedto(tokenPrice)}`}
            </Typography>
          </Stack>
          <Typography
            variant="h4"
            sx={{
              ml: 2,
              fontSize: { md: 20, xs: 16 },
              display: { md: isMobile ? "block" : "none", xs: "block" },
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
            sx={{
              width: "60%",
              display: { md: isMobile ? "none" : "flex", xs: "none" },
            }}
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
              value={`$${formatNumberWithKM(collectionDetails?.liquidity)}`}
            />
            <TradeInfoItem
              loading={loading}
              title="Market Cap"
              value={`$${formatNumberWithKM(collectionDetails?.market_cap)}`}
            />
          </Grid>
        </Box>
      </CardContent>
      {/* <TokenDrawer
        open={open}
        toggleDrawer={toggleDrawer(false)}
        title="TRADE"
      /> */}
      {/* <PopoverSearch
        title="TRADE"
        setAnchorEl={setAnchorEl}
        anchorEl={anchorEl}
      /> */}
    </Card>
  );
}

export default TradingInfoCard;
