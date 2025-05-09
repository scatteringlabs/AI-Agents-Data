import TradingView from "@/views/trade/trading-view/TradingView";
import {
  Grid,
  Box,
  Card,
  CardContent,
  Stack,
  Button,
  Typography,
  Link,
} from "@mui/material";
import { geckoNetworkName } from "@/services/tokens";
import { use, useCallback, useEffect, useState } from "react";
import TokenPriceProvider from "@/context/token-price-provider";
import SolSwapCard from "./SolSwapCard";
import TableTabs from "./table-tabs";
import TradesTable from "./trades-table";
import { CollectionDetails } from "@/types/collection";
import SolTradingInfoCard from "./swap/sol/SolTradingInfoCard";
import SolPoolInfoCard from "./swap/sol/SolPoolInfoCard";
import HolderTable from "./okx-stat/position-table";
import AISummary from "./components/AI-Summary";
import Announcement from "./components/Announcement";

interface iSolTrade {
  collectionDetails?: CollectionDetails;
  detailsLoading: boolean;
  isMobile?: boolean;
}

const SolTrade = ({
  collectionDetails,
  detailsLoading,
  isMobile = false,
}: iSolTrade) => {
  const [activeTab, setActiveTab] = useState<
    "trade" | "holder" | "overview" | "AI Summary" | "Announcement"
  >("AI Summary");
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
            lg={isMobile ? 12 : 8}
            // sx={{ position: "sticky", top: "170px" }}
          >
            {collectionDetails?.status === 1 ? (
              <>
                {" "}
                {/* <Stack flexDirection="row" sx={{ mb: 2 }}>
                  <SolTradingInfoCard
                    collectionDetails={collectionDetails}
                    loading={detailsLoading}
                    isMobile={isMobile}
                  />
                </Stack> */}
                {/* <TradingView
                  loading={detailsLoading}
                  poolAddress={collectionDetails?.pool_address || ""}
                  chainId={10000}
                  symbol={collectionDetails?.symbol}
                  tokenPrice={Number(collectionDetails?.price_in_usd)}
                /> */}
                <Box
                  sx={{
                    width: "100%",
                    height: "510px",
                    border: "none",
                    overflow: "hidden",
                  }}
                >
                  <iframe
                    src={`https://www.gmgn.cc/kline/sol/${collectionDetails?.address}?interval=15`}
                    width="100%"
                    height="100%"
                    style={{
                      border: "none",
                      display: "block",
                    }}
                    loading="lazy"
                  ></iframe>
                </Box>
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
                  display: { xs: "none", md: isMobile ? "none" : "block" },
                }}
              >
                <TableTabs
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  isMobile={isMobile}
                  // showHolders={false}
                />
                {activeTab === "AI Summary" ? (
                  <AISummary collectionDetails={collectionDetails} />
                ) : null}
                {activeTab === "Announcement" ? (
                  <Announcement collectionDetails={collectionDetails} />
                ) : null}
                <TradesTable
                  activeTab={activeTab}
                  network={geckoNetworkName?.[10000]}
                  chainId={10000}
                  pool={collectionDetails?.pool_address || ""}
                  symbol={collectionDetails?.base_asset_symbol || ""}
                  toSymbol={collectionDetails?.quote_asset_symbol || ""}
                  decimals={collectionDetails?.base_asset_decimals || 18}
                  address={collectionDetails?.address || ""}
                  quoteToken=""
                />
                <HolderTable
                  activeTab={activeTab}
                  network={geckoNetworkName?.[10000]}
                  address={collectionDetails.address}
                  chainId={10000}
                  total={collectionDetails?.total_supply}
                  price={collectionDetails?.price_in_usd}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={isMobile ? 12 : 4}>
            <SolSwapCard
              symbol={collectionDetails?.base_asset_symbol || ""}
              decimals={collectionDetails?.base_asset_decimals}
              erc20Address={collectionDetails?.address}
              logo_url={collectionDetails?.logo_url}
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
                  display: { xs: "block", md: isMobile ? "block" : "none" },
                }}
              >
                <TableTabs
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  // showHolders={false}
                />
                {activeTab === "AI Summary" ? (
                  <AISummary collectionDetails={collectionDetails} />
                ) : null}
                {activeTab === "Announcement" ? (
                  <Announcement collectionDetails={collectionDetails} />
                ) : null}
                <TradesTable
                  activeTab={activeTab}
                  network={geckoNetworkName?.[10000]}
                  chainId={10000}
                  pool={collectionDetails?.pool_address || ""}
                  symbol={collectionDetails?.base_asset_symbol || ""}
                  toSymbol={collectionDetails?.quote_asset_symbol || ""}
                  decimals={collectionDetails?.base_asset_decimals || 18}
                  address={collectionDetails?.address || ""}
                  quoteToken=""
                />
                <HolderTable
                  activeTab={activeTab}
                  network={geckoNetworkName?.[10000]}
                  address={collectionDetails.address}
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
              collectionAddress={collectionDetails?.address || ""}
              escrowAddress={collectionDetails?.escrow_address || ""}
            />
          </Grid>
        </TokenPriceProvider>
      </Grid>
    </Box>
  );
};

export default SolTrade;
