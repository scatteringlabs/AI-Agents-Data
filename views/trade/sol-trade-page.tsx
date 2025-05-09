import TradingView from "@/views/trade/trading-view/TradingView";
import { Grid, Box, Card, CardContent, Stack, Button } from "@mui/material";
import { geckoNetworkName, getPoolInfo } from "@/services/tokens";
import { use, useCallback, useEffect, useState } from "react";
import TokenPriceProvider from "@/context/token-price-provider";
import SolSwapCard from "./SolSwapCard";
import TableTabs from "./table-tabs";
import TradesTable from "./trades-table";
import { CollectionDetails } from "@/types/collection";
import SolTradingInfoCard from "./swap/sol/SolTradingInfoCard";
import SolPoolInfoCard from "./swap/sol/SolPoolInfoCard";
import HolderTable from "./okx-stat/position-table";
interface iSolTrade {
  collectionDetails?: CollectionDetails;
  detailsLoading: boolean;
}

const SolTrade = ({ collectionDetails, detailsLoading }: iSolTrade) => {
  const [activeTab, setActiveTab] = useState<"trade" | "holder" | "overview">(
    "trade",
  );
  if (!collectionDetails?.status) {
    return null;
  }
  return (
    <Box sx={{ flexGrow: 1, padding: 0, mb: 2 }}>
      <Grid container spacing={2}>
        <TokenPriceProvider>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={8}
            // sx={{ position: "sticky", top: "170px" }}
          >
            {collectionDetails?.status === 1 ? (
              <>
                {" "}
                <Stack flexDirection="row" sx={{ mb: 2 }}>
                  <SolTradingInfoCard
                    collectionDetails={collectionDetails}
                    loading={detailsLoading}
                  />
                </Stack>
                <TradingView
                  loading={detailsLoading}
                  poolAddress={collectionDetails?.pool_address || ""}
                  chainId={10000}
                  symbol={collectionDetails?.symbol}
                  tokenPrice={Number(collectionDetails?.price_in_usd)}
                />
              </>
            ) : (
              <Card
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  color: "white",
                  height: { md: 736, xs: 300 },
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  component="img"
                  sx={{ maxWidth: { md: 560, xs: "50%" } }}
                  src="/assets/images/trade/no-data.png"
                />
              </Card>
            )}
            <Card
              sx={{
                background: "rgba(255, 255, 255, 0)",
                color: "white",
                flexGrow: 1,
                mt: 1,
              }}
            >
              <CardContent
                sx={{
                  overflowX: { xs: "scroll", md: "initial" },
                  pb: "16px !important",
                  px: 0,
                  display: { xs: "none", md: "block" },
                }}
              >
                <TableTabs
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  // showHolders={false}
                />
                <TradesTable
                  activeTab={activeTab}
                  network={geckoNetworkName?.[10000]}
                  chainId={10000}
                  pool={collectionDetails?.pool_address || ""}
                  symbol={collectionDetails?.base_asset_symbol || ""}
                  toSymbol={collectionDetails?.quote_asset_symbol || ""}
                  decimals={collectionDetails?.base_asset_decimals || 18}
                  address={collectionDetails?.erc20_address || ""}
                  quoteToken={
                    collectionDetails?.erc20_address >
                    "So11111111111111111111111111111111111111112"
                      ? "token0"
                      : "token1"
                  }
                />
                <HolderTable
                  activeTab={activeTab}
                  network={geckoNetworkName?.[10000]}
                  address={collectionDetails.erc20_address}
                  chainId={10000}
                  total={collectionDetails?.total_supply}
                  price={collectionDetails?.price_in_usd}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={4}>
            <SolSwapCard
              symbol={collectionDetails?.base_asset_symbol || ""}
              decimals={collectionDetails?.base_asset_decimals}
              erc20Address={collectionDetails?.erc20_address}
              hasLogo={!!collectionDetails?.has_logo}
              chainId={10000}
            />
            <Card
              sx={{
                background: "rgba(255, 255, 255, 0)",
                color: "white",
                flexGrow: 1,
                mt: 1,
              }}
            >
              <CardContent
                sx={{
                  overflowX: { xs: "scroll", md: "initial" },
                  pb: "16px !important",
                  px: 0,
                  display: { xs: "block", md: "none" },
                }}
              >
                <TableTabs
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  // showHolders={false}
                />
                <TradesTable
                  activeTab={activeTab}
                  network={geckoNetworkName?.[10000]}
                  chainId={10000}
                  pool={collectionDetails?.pool_address || ""}
                  symbol={collectionDetails?.base_asset_symbol || ""}
                  toSymbol={collectionDetails?.quote_asset_symbol || ""}
                  decimals={collectionDetails?.base_asset_decimals || 18}
                  address={collectionDetails?.erc20_address || ""}
                  quoteToken={
                    collectionDetails?.erc20_address >
                    "So11111111111111111111111111111111111111112"
                      ? "token0"
                      : "token1"
                  }
                />
                <HolderTable
                  activeTab={activeTab}
                  network={geckoNetworkName?.[10000]}
                  address={collectionDetails.erc20_address}
                  chainId={10000}
                  total={collectionDetails?.total_supply}
                  price={collectionDetails?.price_in_usd}
                />
              </CardContent>
            </Card>
            <SolPoolInfoCard
              poolInfo={collectionDetails}
              chainId={10000}
              status={collectionDetails?.status || 0}
              collectionAddress={collectionDetails?.erc20_address || ""}
              escrowAddress={collectionDetails?.escrow_address || ""}
            />
          </Grid>
        </TokenPriceProvider>
      </Grid>
    </Box>
  );
};

export default SolTrade;
