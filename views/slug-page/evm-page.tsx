import { getCollectionByAddress } from "@/services/collections";
import CollectionInfo from "@/views/collect/CollectionInfo";
import SlugPage from "@/views/collect/Market";
import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import Tabs from "@/components/tabs/Tabs";
import { useEffect, useMemo, useState } from "react";
import Trade from "@/views/trade/trade-page";
import Market from "@/views/collect/Market";
import CollectTabs from "@/components/tabs/CollectTabs";
import MbCollectionInfo from "@/views/collect/MbCollectionInfo";
import ShareDialog from "@/components/dialog/share-dialog";
import {
  useWalletConnectButton,
  useWalletMultiButton,
} from "@solana/wallet-adapter-base-ui";
import Head from "next/head";
import { GetServerSideProps } from "next";
import WalletPage from "@/views/trade/evm/wallet/WalletPage";
import NeedConnectCard from "@/components/need-connect-card";
import ProjectPage from "@/views/collect/ProjectPage";
import { usePrivy } from "@privy-io/react-auth";

const tabs = ["trade", "market", "wallet"];

export default function EvmSlug({
  chain_name,
  token,
}: {
  chain_name?: string;
  token?: string;
}) {
  const router = useRouter();
  const { user } = usePrivy();

  const [dialogOpen, setDialogOpen] = useState(false);
  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const [activeTab, setActiveTab] = useState<string>("trade");

  const { data: collectionDetails, isLoading: detailsLoading } = useQuery({
    queryKey: ["getCollectionByAddress", { chain_name, token }],
    queryFn: () =>
      getCollectionByAddress({
        chain_name: chain_name?.toString() || "",
        token: token?.toString() || "",
      }),
    enabled: Boolean(token && chain_name),
  });
  const showTabs = useMemo(
    () =>
      collectionDetails?.data?.item?.status_flags === 1
        ? tabs.concat(["record"])
        : tabs,
    [collectionDetails?.data?.item?.status_flags],
  );

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    let newUrl = "";
    if (newTab !== "trade") {
      newUrl = `/collection/${chain_name}/${token}/${newTab}`;
    } else {
      newUrl = `/collection/${chain_name}/${token}`;
    }
    router.push(newUrl, undefined, { shallow: true });
  };
  useEffect(() => {
    if (
      router?.query?.tab &&
      showTabs.includes(router?.query?.tab?.toString())
    ) {
      setActiveTab(router.query.tab?.toString());
    } else {
      setActiveTab("trade");
    }
  }, [router?.query?.tab, showTabs]);

  return (
    <>
      <Head>
        <meta
          content={`https://scattering.io/api/og?token=${token}&chain=${chain_name}&timestamp=${new Date().getTime()}`}
          name="twitter:image:src"
        ></meta>
        <meta
          content={`https://scattering.io/api/og?token=${token}&chain=${chain_name}&timestamp=${new Date().getTime()}`}
          property="og:image"
        />
      </Head>
      <CollectionInfo
        slugLoading={detailsLoading}
        handleOpenDialog={handleOpenDialog}
        collectionDetails={collectionDetails?.data?.item}
      />
      <MbCollectionInfo
        slugLoading={detailsLoading}
        handleOpenDialog={handleOpenDialog}
        collectionDetails={collectionDetails?.data?.item}
      />
      <Box
        sx={{
          position: "sticky",
          top: { md: "60px", xs: "60px" },
          zIndex: 8,
          backgroundColor: "#010410",
          pt: 1,
          pb: "32px",
        }}
      >
        <Box sx={{ display: "flex", width: "100%", mt: { md: 2, xs: 1 } }}>
          <Box sx={{ flexFlow: 1, width: { md: "100%", xs: "auto" } }}>
            <CollectTabs
              activeTab={activeTab}
              items={showTabs}
              onChange={handleTabChange}
            />
          </Box>
        </Box>
      </Box>
      {activeTab === "trade" ? (
        <Trade
          chainId={Number(collectionDetails?.data?.item?.chain_id)}
          erc20Address={collectionDetails?.data?.item?.erc20_address || ""}
          status={collectionDetails?.data?.item?.status || 2}
          collectionDetails={collectionDetails?.data?.item}
          type={collectionDetails?.data?.item?.collection_type?.name || ""}
          priceInUsd={collectionDetails?.data?.item?.price_in_usd || "0"}
          logoUrl={collectionDetails?.data?.item?.logo_url}
        />
      ) : null}
      {activeTab === "market" ? <Market /> : null}
      {activeTab === "wallet" ? (
        user?.wallet?.address ? (
          <WalletPage
            setActiveTab={setActiveTab}
            collectionDetails={collectionDetails?.data?.item}
          />
        ) : (
          <NeedConnectCard />
        )
      ) : null}
      {activeTab === "record" ? (
        <ProjectPage
          tokenAddress={collectionDetails?.data?.item?.erc20_address || ""}
          level={2}
        />
      ) : null}
      <ShareDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        collectionDetails={collectionDetails?.data?.item}
      />
    </>
  );
}
