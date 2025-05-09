import { Box, Grid } from "@mui/material";
import Banner from "./components/banner";
import TopInfo from "./components/top-info";
import TabInfo from "./components/tab-info";
import SwapCard from "./components/swap-card";
import ImagesPreviewer from "./components/images-previewer";
import { useAllTokenList } from "@/services/graphql/all-token";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TradingView from "@/views/trade/trading-view/TradingView";
import TradingViewL from "@/views/trade/trading-view-l/TradingView";
import Chart from "../create/chart/Chart";
import { BaseSID, ProjectData } from "../create/tokenService";
import InfoCard from "./components/info-card";
import MyCustomDataFeed from "@/components/tv-chart-container-l/MyCustomDataFeed";
import { useChainId } from "wagmi";
import TradeConfirmDialog from "../trade-confirm-dialog";
import { useQuery } from "@tanstack/react-query";
import { getCollectionBySlug } from "@/services/collections";
import { useRouter } from "next/router";
import MBTopInfo from "./components/mb-top-info";
interface iLaunchpadPreviewPage {
  images: string[];
  banner?: string;
  preview?: string;
  logo?: string;
  tokenSymbol: string;
  collectionName: string;
  description?: string;
  teamInfo?: string;
  tokenAddress?: string;
  overview?: string;
  tokenQuantity: number | string;
  nftQuantity: number | string;
  price: number;
  level?: number;
  projectDetails?: ProjectData;
  type?: string;
  slug?: string;
}
const ProjectPreviewPage = ({
  images,
  tokenAddress,
  banner = "",
  slug = "",
  preview = "",
  logo = "",
  tokenQuantity,
  nftQuantity,
  tokenSymbol,
  collectionName,
  description,
  teamInfo,
  overview,
  price,
  projectDetails,
  type,
  level = 1,
}: iLaunchpadPreviewPage) => {
  const router = useRouter();
  const dataFeedRef = useRef<MyCustomDataFeed>();
  const refreshChartData = useCallback(() => {
    if (
      dataFeedRef.current &&
      typeof dataFeedRef.current.refreshData === "function"
    ) {
      dataFeedRef.current.refreshData();
    }
  }, []);
  const { data: all, refetch, isLoading } = useAllTokenList();

  const info = useMemo(
    () =>
      all?.tokenEntities?.find(
        (i) => i.addr?.toLowerCase() === tokenAddress?.toLowerCase(),
      ),
    [all, tokenAddress],
  );
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const { data: collectionDetails, isLoading: detailsLoading } = useQuery({
    queryKey: ["getCollectionBySlug", { slug, state: info?.state }],
    queryFn: () =>
      getCollectionBySlug({
        slug: slug?.toString(),
      }),
    enabled: Boolean(slug),
    refetchInterval: 2000,
  });
  const handleRefetch = useCallback(() => {
    refetch();
    refreshChartData();
    setRefetchTrigger((prev) => prev + 1);
  }, [refetch, refreshChartData]);
  useEffect(() => {
    if (info?.state === "1") {
      refetch();
    }
  }, [info?.state, refetch]);

  useEffect(() => {
    if (collectionDetails?.data?.item?.status === 1 && type !== "record") {
      setTimeout(() => {
        router.push(`/collection/${slug}`);
      }, 1500);
    }
  }, [collectionDetails, router, slug, type]);
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefetch();
    }, 1000 * 10);

    return () => {
      clearInterval(interval);
    };
  }, [handleRefetch]);

  return (
    <Box>
      {type !== "record" ? (
        <>
          {" "}
          {banner ? <Banner banner={banner} /> : null}
          <TopInfo
            tokenAddress={info?.addr || tokenAddress}
            logo={logo}
            description={description}
            collectionName={info?.name || collectionName}
            tokenSymbol={info?.symbol || tokenSymbol}
            info={info}
            projectDetails={projectDetails}
            banner={banner}
          />
          <MBTopInfo
            tokenAddress={info?.addr || tokenAddress}
            logo={logo}
            description={description}
            collectionName={info?.name || collectionName}
            tokenSymbol={info?.symbol || tokenSymbol}
            info={info}
            projectDetails={projectDetails}
            banner={banner}
          />
        </>
      ) : null}
      <Grid container spacing={2}>
        {type !== "record" ? (
          <Grid item xs={12}>
            <Box
              sx={{
                height: { md: banner ? 400 : 200, xs: 0 },
                borderRadius: "8px",
                overflow: "hidden",
                mb: 4,
              }}
            />
          </Grid>
        ) : null}

        <Grid item xs={12} md={4}>
          <ImagesPreviewer
            images={images}
            preview={preview}
            tokenQuantity={tokenQuantity?.toString()}
            nftQuantity={
              (Number(tokenQuantity) / Number(info?.multiplier))?.toString() ||
              "0"
            }
            contractAddress={tokenAddress || ""}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <InfoCard loading={isLoading} info={info} logo={logo} />
            </Grid>
            <Grid item xs={12}>
              <TradingViewL
                loading={false}
                tokenAddress={info?.addr || tokenAddress}
                symbol={info?.symbol || tokenSymbol}
                chainId={1}
                tokenPrice={price}
                dataFeedRef={dataFeedRef}
              />
            </Grid>
            {tokenAddress && type !== "record" ? (
              <SwapCard
                info={info}
                logo={logo}
                tokenAddress={info?.addr || tokenAddress}
                tokenSymbol={info?.symbol || tokenSymbol}
                refetch={handleRefetch}
                nftQuantity={projectDetails?.nft_quantity || 1}
              />
            ) : null}

            <TabInfo
              info={info}
              teamInfo={teamInfo}
              overview={overview}
              tokenAddress={info?.addr || tokenAddress}
              price={info?.currentPrice}
              tokenSymbol={info?.symbol || tokenSymbol}
              refetchTrigger={refetchTrigger}
              level={level}
            />
          </Grid>
        </Grid>
      </Grid>
      {info?.state === "1" && type !== "record" ? <TradeConfirmDialog /> : null}
    </Box>
  );
};

export default ProjectPreviewPage;
