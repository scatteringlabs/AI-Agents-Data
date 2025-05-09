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
import Iconify from "@/components/iconify";
import { useState } from "react";
import PopoverSearch from "@/components/drawer/popover-search";
import { TokenDrawer } from "@/components/drawer/token-drawer";
import TradeInfoItem from "../../pool-info/trade-info-item";
import { CollectionDetails } from "@/types/collection";

interface iSolTradingInfoCard {
  loading: boolean;
  isMobile: boolean;
  collectionDetails?: CollectionDetails;
}
function SolTradingInfoCard({
  collectionDetails,
  loading,
  isMobile = false,
}: iSolTradingInfoCard) {
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
        {/* 所有数据已隐藏 */}
      </CardContent>
    </Card>
  );
}

export default SolTradingInfoCard;
