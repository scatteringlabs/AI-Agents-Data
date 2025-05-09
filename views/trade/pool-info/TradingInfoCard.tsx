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
  priceInUsd: string;
  collectionDetails?: CollectionDetails;
}
function TradingInfoCard({
  poolInfo,
  loading,
  priceInUsd,
  collectionDetails,
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
              symbol={poolInfo?.base_asset_symbol || "token"}
              // logoUrl={
              //   // @ts-ignore
              //   Number(collectionDetails.status_flags) === 2
              //     ? collectionDetails?.logo_url || ""
              //     : getTokenLogoURL({
              //         chainId: poolInfo?.chain_id || 1,
              //         address: poolInfo?.base_asset_address,
              //       })
              // }
              chainId={poolInfo?.chain_id}
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
                {poolInfo?.base_asset_symbol || "Unknown Token"}
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
              display: { md: "none", xs: "block" },
              color:
                Number(poolInfo?.price_change || 0) > 0 ? "#00B912" : "#DC2626",
            }}
          >
            {`${Number(poolInfo?.price_change) || 0}%`}
          </Typography>
          <Grid
            container
            spacing={2}
            sx={{ width: "60%", display: { md: "flex", xs: "none" } }}
          >
            <TradeInfoItem
              loading={loading}
              title="24h Change"
              value={`${poolInfo?.price_change || 0}%`}
              color={
                Number(poolInfo?.price_change || 0) > 0 ? "#00B912" : "#DC2626"
              }
            />
            <TradeInfoItem
              loading={loading}
              title="24h Volume"
              value={`$${formatNumberWithKM(poolInfo?.total_volume)}`}
            />
            <TradeInfoItem
              loading={loading}
              title="Liquidity"
              value={`$${formatNumberWithKM(poolInfo?.total_liquidity)}`}
            />
            <TradeInfoItem
              loading={loading}
              title="Market Cap"
              value={`$${formatNumberWithKM(poolInfo?.market_cap)}`}
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
