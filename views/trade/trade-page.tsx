import TradingInfoCard from "@/views/trade/pool-info/TradingInfoCard";
import TradingView from "@/views/trade/trading-view/TradingView";
import {
  Grid,
  Box,
  Stack,
  Typography,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SwapCard from "@/views/trade/SwapCard";
import { useQuery } from "@tanstack/react-query";
import { geckoNetworkName } from "@/services/tokens";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import { ChainNameById } from "@/constants/chain";
import TokenPriceProvider from "@/context/token-price-provider";
import PoolInfoCard from "@/views/trade/pool-info/PoolInfoCard";
import Link from "next/link";
import TradesTable from "./trades-table";
import HolderTable from "./okx-stat/position-table";
import { ButtonWrapper } from "@/components/button/wrapper";
import TableTabs from "./table-tabs";
import { PreviewDesc, PreviewTitle } from "../launchpad/create/require-text";
import OverviewItem from "./overview-item";
import { CollectionDetails } from "@/types/collection";
import AISummary from "./components/AI-Summary";
import Announcement from "./components/Announcement";

interface iTrade {
  chainId: number;
  status: number;
  erc20Address: string;
  collectionDetails?: CollectionDetails;
  type: string;
  priceInUsd: string;
  logoUrl?: string;
  isMobile?: boolean;
}
const Trade = ({
  chainId,
  erc20Address,
  status,
  collectionDetails,
  type,
  priceInUsd,
  logoUrl,
  isMobile = false,
}: iTrade) => {
  const theme = useTheme();

  const isMd = useMediaQuery(theme.breakpoints.down(750)) || isMobile;

  const [activeTab, setActiveTab] = useState<
    "trade" | "holder" | "overview" | "AI Summary" | "Announcement"
  >("AI Summary");
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
            {status === 1 ? (
              <>
                <Stack flexDirection="row" sx={{ mb: 2 }}>
                  {/* <TradingInfoCard
                    loading={false}
                    priceInUsd={priceInUsd}
                    collectionDetails={collectionDetails}
                    isMobile={isMobile}
                  /> */}
                </Stack>
                <TradingView
                  loading={false}
                  poolAddress={collectionDetails?.pool_address}
                  chainId={chainId}
                  symbol={collectionDetails?.base_asset_symbol}
                  tokenPrice={Number(collectionDetails?.price_in_usd)}
                />
                {!isMd ? (
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
                        // overflowX: { xs: "scroll", md: "initial" },
                        pb: "16px !important",
                        px: 0,
                      }}
                    >
                      <TableTabs
                        activeTab={activeTab}
                        // @ts-ignore
                        setActiveTab={setActiveTab}
                        statusFlags={collectionDetails?.status_flags}
                      />
                      {activeTab === "AI Summary" ? (
                        <AISummary collectionDetails={collectionDetails} />
                      ) : null}
                      {activeTab === "Announcement" ? (
                        <Announcement collectionDetails={collectionDetails} />
                      ) : null}
                      <TradesTable
                        activeTab={activeTab}
                        pool={collectionDetails?.pool_address || ""}
                        network={geckoNetworkName?.[chainId]}
                        chainId={chainId}
                        symbol={collectionDetails?.base_asset_symbol || ""}
                        toSymbol={collectionDetails?.quote_asset_symbol || ""}
                        decimals={collectionDetails?.base_asset_decimals || 18}
                        address={collectionDetails?.base_asset_address || ""}
                      />
                      <HolderTable
                        activeTab={activeTab}
                        network={geckoNetworkName?.[chainId]}
                        address={collectionDetails?.base_asset_address || ""}
                        chainId={chainId}
                        total={collectionDetails?.total_supply || "0"}
                        price={collectionDetails?.price_in_usd || "0"}
                      />
                    </CardContent>
                    {activeTab === "overview" ? (
                      <>
                        {" "}
                        <OverviewItem
                          title="Collection Story"
                          value={collectionDetails?.collection_story || "-"}
                        />
                        <OverviewItem
                          title="NFT Info"
                          value={collectionDetails?.nft_info || "-"}
                        />
                      </>
                    ) : null}
                  </Card>
                ) : null}
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
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={isMobile ? 12 : 4}>
            {collectionDetails?.address ? (
              <SwapCard
                symbol={collectionDetails?.base_asset_symbol?.toUpperCase()}
                decimals={collectionDetails?.base_asset_decimals || 18}
                erc20Address={collectionDetails?.address}
                hasLogo={collectionDetails?.has_logo || false}
                chainId={chainId}
                logoUrl={logoUrl}
              />
            ) : null}
            {isMd ? (
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
                    // overflowX: { xs: "scroll", md: "initial" },
                    pb: "16px !important",
                    px: 0,
                  }}
                >
                  {" "}
                  <TableTabs
                    activeTab={activeTab}
                    // @ts-ignore
                    setActiveTab={setActiveTab}
                    statusFlags={collectionDetails?.status_flags}
                  />
                  {activeTab === "AI Summary" ? (
                    <AISummary collectionDetails={collectionDetails} />
                  ) : null}
                  {activeTab === "Announcement" ? (
                    <Announcement collectionDetails={collectionDetails} />
                  ) : null}
                  <TradesTable
                    activeTab={activeTab}
                    pool={collectionDetails?.pool_address || ""}
                    network={geckoNetworkName?.[chainId]}
                    chainId={chainId}
                    symbol={collectionDetails?.base_asset_symbol || ""}
                    toSymbol={collectionDetails?.quote_asset_symbol || ""}
                    decimals={collectionDetails?.base_asset_decimals || 18}
                    address={collectionDetails?.base_asset_address || ""}
                  />
                  <HolderTable
                    activeTab={activeTab}
                    network={geckoNetworkName?.[chainId]}
                    address={collectionDetails?.base_asset_address || ""}
                    chainId={chainId}
                    total={collectionDetails?.total_supply || "0"}
                    price={collectionDetails?.price_in_usd || "0"}
                  />
                </CardContent>
              </Card>
            ) : null}
            <PoolInfoCard
              // poolInfo={data?.data?.item}
              // @ts-ignore
              collectionDetails={collectionDetails}
              chainId={chainId}
              status={status}
              collectionAddress={erc20Address}
              type={type}
              conversionRatio={collectionDetails?.conversion_ratio || 0}
            />
          </Grid>
        </TokenPriceProvider>
      </Grid>
    </Box>
  );
};

export default Trade;
