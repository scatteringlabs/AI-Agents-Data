import TradingInfoCard from "@/views/trade/pool-info/TradingInfoCard";
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
import { geckoNetworkName, getPoolInfo } from "@/services/tokens";
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
import { CollectionDetails, CollectionDetailsErc20z } from "@/types/collection";
import TradingView from "@/views/trade/trading-view/TradingView";
import PoolInfoCardErc20Z from "./pool-info/PoolInfoCardErc20Z";

interface iTrade {
  collectionDetails?: CollectionDetailsErc20z;
}
const TradePageErc20z = ({ collectionDetails }: iTrade) => {
  const [activeTab2, setActiveTab2] = useState<"trade" | "holder" | "overview">(
    "trade",
  );
  // const { data, isLoading } = useQuery({
  //   queryKey: ["PoolInfo", { chainId, erc20Address }],
  //   queryFn: () =>
  //     getPoolInfo({
  //       chain_id: chainId,
  //       token_contract_address: erc20Address.toString(),
  //     }),
  //   enabled: Boolean(chainId && erc20Address),
  // });

  // if (
  //   !chainId ||
  //   !erc20Address ||
  //   !data?.data?.item ||
  //   !data?.data?.item?.base_asset_address
  // ) {
  //   return null;
  // }
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
            {/* <Stack flexDirection="row" sx={{ mb: 2 }}>
              <TradingInfoCard
                poolInfo={data?.data?.item}
                loading={isLoading}
                priceInUsd={priceInUsd}
              />
            </Stack> */}
            <TradingView
              loading={false}
              poolAddress={collectionDetails?.pool_address || ""}
              chainId={collectionDetails?.chain_id}
              symbol={collectionDetails?.symbol || "symbol"}
              tokenPrice={Number(collectionDetails?.price_in_usd)}
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
                  pb: "16px !important",
                  px: 0,
                }}
              >
                <TableTabs
                  activeTab={activeTab2}
                  setActiveTab={setActiveTab2}
                  statusFlags={2}
                  showHolders
                />
                <TradesTable
                  activeTab={activeTab2}
                  pool={collectionDetails?.pool_address || ""}
                  chainId={Number(collectionDetails?.chain_id)}
                  symbol={collectionDetails?.symbol || "symbol"}
                  network={
                    geckoNetworkName?.[Number(collectionDetails?.chain_id)]
                  }
                  toSymbol="ETH"
                  decimals={18}
                  address={collectionDetails?.ft_address || ""}
                  quoteToken={"token0"}
                />
                <HolderTable
                  activeTab={activeTab2}
                  network={
                    geckoNetworkName?.[Number(collectionDetails?.chain_id)]
                  }
                  address={collectionDetails?.ft_address || ""}
                  chainId={Number(collectionDetails?.chain_id)}
                  total={collectionDetails?.total_supply || ""}
                  price={collectionDetails?.price_in_usd || ""}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={4}>
            <SwapCard
              symbol={collectionDetails?.symbol?.toUpperCase()}
              decimals={18}
              erc20Address={collectionDetails?.ft_address}
              hasLogo={true}
              chainId={Number(collectionDetails?.chain_id)}
              logoUrl={collectionDetails?.logo_url}
            />

            <PoolInfoCardErc20Z collectionDetails={collectionDetails} />
          </Grid>
        </TokenPriceProvider>
      </Grid>
    </Box>
  );
};

export default TradePageErc20z;
