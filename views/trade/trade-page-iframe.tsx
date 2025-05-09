import { Grid, Box, Stack } from "@mui/material";
import SwapCard from "@/views/trade/SwapCard";
import { useMemo, useState } from "react";
import TokenPriceProvider from "@/context/token-price-provider";
import { CollectionDetailsErc20z } from "@/types/collection";
import { geckoNetworkName } from "@/services/tokens";
import TradingInfoCard from "./pool-info/TradingInfoCard";
import TradingInfoCardErc20Z from "./pool-info/TradingInfoCardErc20Z";
import PoolInfoCardErc20Z from "./pool-info/PoolInfoCardErc20Z";
import SwapCardErc20z from "./erc20z-swap/swap-card";

interface iTrade {
  collectionDetails?: CollectionDetailsErc20z;
}
const TradeIFrame = ({ collectionDetails }: iTrade) => {
  const url = useMemo(
    () =>
      `https://www.geckoterminal.com/${geckoNetworkName?.[Number(collectionDetails?.chain_id)]}/pools/${collectionDetails?.pool_address}?embed=1&info=0&swaps=1&grayscale=1`,
    [collectionDetails],
  );
  return (
    <Box sx={{ flexGrow: 1, padding: 0, mb: 2 }}>
      <Grid container spacing={2}>
        <TokenPriceProvider>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={4}
            sx={{ display: { md: "none", xs: "block" } }}
          >
            <Stack flexDirection="row" sx={{ mb: 2 }}>
              <TradingInfoCardErc20Z
                loading={false}
                collectionDetails={collectionDetails}
              />
            </Stack>
            <SwapCardErc20z collectionDetails={collectionDetails} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={8}>
            <Stack
              flexDirection="row"
              sx={{ mb: 2, display: { md: "block", xs: "none" } }}
            >
              <TradingInfoCardErc20Z
                loading={false}
                collectionDetails={collectionDetails}
              />
            </Stack>
            <Box
              sx={{
                width: "100%",
                height: "800px",
                border: "none",
                overflow: "hidden",
              }}
            >
              {collectionDetails?.pool_address ? (
                <iframe
                  src={url}
                  width="100%"
                  height="100%"
                  style={{
                    border: "none",
                    display: "block",
                  }}
                  loading="lazy"
                ></iframe>
              ) : null}
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={4}
            sx={{ display: { md: "block", xs: "none" } }}
          >
            <SwapCardErc20z collectionDetails={collectionDetails} />

            <PoolInfoCardErc20Z collectionDetails={collectionDetails} />
          </Grid>
        </TokenPriceProvider>
      </Grid>
    </Box>
  );
};

export default TradeIFrame;
