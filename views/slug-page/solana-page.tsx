import { Box, Dialog, IconButton } from "@mui/material";
import SolTrade from "@/views/trade/sol-trade-page";
import SolCollectionInfo from "@/views/trade/swap/sol/sol-collection-Info";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import {
  getBlinkInfo,
  getCollectionByAddress,
  getCollectionBySlug,
} from "@/services/collections";
import { useEffect, useMemo, useState } from "react";
import ShareDialog from "@/components/dialog/share-dialog";
import CollectTabs from "@/components/tabs/CollectTabs";
import SolMarket from "@/views/trade/swap/sol/sol-market";
import { fetchCollectionStas } from "@/services/sniper";
import { getTokensPrice } from "@/services/tokens";
import { SolAddress } from "@/constants/tokens";
import SolMbCollectionInfo from "@/views/trade/swap/sol/SolMbCollectionInfo";
import Link from "next/link";
import PreviewComponent from "@/views/trade/swap/sol/PreviewComponent";
import { ButtonWrapper } from "@/components/button/wrapper";
import Iconify from "@/components/iconify";
import { toast } from "react-toastify";
import Head from "next/head";
import { GetServerSideProps } from "next";
import MPL404 from "@/views/trade/swap/sol/MPL404/Exchange";
import WalletPage from "@/views/trade/swap/sol/wallet";
import Libreplex from "@/views/trade/swap/sol/Libreplex/swap";
// import { useDynamicMetatags } from "@/utils/metatags";
// import { Helmet } from "react-helmet-async";
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.query;
  // const data = await getCollectionBySlug({
  //   slug: slug?.toString(),
  // });
  return {
    props: {
      // data,
      slug,
    },
  };
};
export default function Slug({
  chain_name,
  token,
}: {
  chain_name?: string;
  token?: string;
}) {
  const router = useRouter();
  const { tab = "" } = router.query;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bLinkDialogOpen, setBlinkDialogOpen] = useState(false);
  // const ogImageUrl = useMemo(
  //   () =>
  //     typeof window !== "undefined"
  //       ? `${window?.location?.origin}/api/og?title=${encodeURIComponent(slug?.toString())}`
  //       : "",
  //   [slug],
  // );
  // const metaTagProperties = useMemo(
  //   () => ({
  //     title: "asset.name",
  //     image:
  //       typeof window !== "undefined" ? window.location.origin + "/api/og" : "",
  //     url:
  //       typeof window !== "undefined" ? window.location.href + "/api/og" : "",
  //     description:
  //       "View traits, trading activity, descriptions, and other details on your NFTs.",
  //   }),
  //   [],
  // );
  // const metaTags = useDynamicMetatags(metaTagProperties);
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window?.location?.href);
      toast.success("Copied to clipboard");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  const [activeTab, setActiveTab] = useState<string>(
    tab?.toString() || "trade",
  );
  const [currentRoute, setCurrentRoute] = useState(router.asPath);

  const { data: tokensPrice } = useQuery({
    queryKey: ["tokensPrice"],
    queryFn: () =>
      getTokensPrice({
        tokenAddresses: [SolAddress],
        chainId: 10000,
      }),
  });
  const solPrice = useMemo(() => tokensPrice?.[SolAddress] || 0, [tokensPrice]);
  const { data, isLoading: detailsLoading } = useQuery({
    queryKey: ["getCollectionByAddress", { chain_name, token }],
    queryFn: () =>
      getCollectionByAddress({
        chain_name: chain_name?.toString() || "",
        token: token?.toString() || "",
      }),
    enabled: Boolean(token && chain_name),
  });
  const slug = useMemo(() => data?.data?.item?.slug, [data]);
  const { data: collectionStat, isLoading } = useQuery({
    queryKey: [
      "collectionStat",
      {
        slug,
      },
    ],
    queryFn: () => fetchCollectionStas(slug?.toString() || ""),
    enabled: Boolean(slug),
  });

  const { data: blinkInfo } = useQuery({
    queryKey: [
      "getBlinkInfo",
      {
        slug,
      },
    ],
    queryFn: () => getBlinkInfo(slug?.toString() || ""),
    enabled: Boolean(slug),
  });

  // const { data, isLoading: detailsLoading } = useQuery({
  //   queryKey: ["getCollectionBySlug", { slug }],
  //   queryFn: () =>
  //     getCollectionBySlug({
  //       slug: slug?.toString(),
  //     }),
  //   enabled: Boolean(slug),
  // });

  const showLibreplex = useMemo(
    () =>
      data?.data?.item?.deployment_type === 2 ||
      data?.data?.item?.deployment_type === 3,
    [data],
  );
  const tabs = useMemo(
    () => ["trade"], //  "wallet"
    [],
  );
  const walletLoading = useMemo(
    () => isLoading || detailsLoading,
    [isLoading, detailsLoading],
  );
  const allVolume = useMemo(
    () =>
      solPrice * Number(collectionStat?.oneDayVolume) +
      Number(data?.data?.item?.volume),
    [solPrice, collectionStat?.oneDayVolume, data?.data?.item?.volume],
  );
  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
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
    if (tab) {
      setActiveTab(tab?.toString());
    }
  }, [tab]);

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
      <Box>
        <SolCollectionInfo
          detailsLoading={false}
          handleOpenDialog={handleOpenDialog}
          setBlinkDialogOpen={setBlinkDialogOpen}
          collectionDetails={data?.data?.item}
          collectionStat={collectionStat}
          allVolume={allVolume}
        />
        <SolMbCollectionInfo
          detailsLoading={false}
          handleOpenDialog={handleOpenDialog}
          setBlinkDialogOpen={setBlinkDialogOpen}
          collectionDetails={data?.data?.item}
          collectionStat={collectionStat}
          allVolume={allVolume}
        />
        <Box
          sx={{
            position: "sticky",
            top: { md: "60px", xs: "60px" },
            zIndex: 8,
            backgroundColor: "#010410",
            pt: 1,
            pb: "32px",
            overflowX: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "100%",
              mt: { md: 2, xs: 1 },
              position: "relative",
            }}
          >
            <Box sx={{ flexFlow: 1, width: { md: "100%", xs: "auto" } }}>
              <CollectTabs
                activeTab={activeTab}
                items={tabs}
                onChange={handleTabChange}
              />
            </Box>
            {activeTab === "market" ? (
              <Link href="https://www.sniper.xyz/" target="_blank">
                <Box
                  sx={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    height: "54px",
                    lineHeight: "54px",
                    color: "rgba(255, 255, 255,0.6)",
                    pr: 4,
                    fontFamily: "Poppins",
                    fontSize: "14px",
                    fontWeight: 500,
                    display: { md: "flex", xs: "none" },
                    alignItems: "center",
                  }}
                >
                  <Box
                    component="img"
                    src="/assets/images/logo/sniper.png"
                    sx={{ m: 1 }}
                  />
                  Powered by Sniper
                </Box>
              </Link>
            ) : null}
          </Box>
        </Box>
        <SolMarket activeTab={activeTab} />
        {/* {activeTab === "swap" && data?.data?.item?.deployment_type === 1 ? ( */}
        {activeTab === "swap" && showLibreplex ? (
          <Libreplex collectionDetails={data?.data?.item} />
        ) : null}
        {/* {activeTab === "swap" ? (
          <MPL404 slug={slug} collectionDetails={data?.data?.item} />
        ) : null} */}
        {activeTab === "wallet" ? (
          <WalletPage
            // slug={slug}
            setActiveTab={setActiveTab}
            solPrice={solPrice}
            collectionDetails={data?.data?.item}
            collectionStats={collectionStat}
            walletLoading={walletLoading}
          />
        ) : null}
        <Box
          sx={{
            opacity: activeTab === "trade" ? 1 : 0,
            overflow: "hidden",
            height: activeTab === "trade" ? "100%" : "0px",
          }}
        >
          <SolTrade
            collectionDetails={data?.data?.item}
            detailsLoading={false && isLoading}
          />
          <ShareDialog
            open={dialogOpen}
            onClose={handleCloseDialog}
            collectionDetails={data?.data?.item}
          />
          <Dialog
            sx={{
              ".MuiDialog-container": {
                ".MuiPaper-root": {
                  background: "transparent",
                },
              },
              "& .MuiDialog-paper": {
                position: "relative",
                margin: 1,
              },
            }}
            open={bLinkDialogOpen}
            onClose={() => {
              setBlinkDialogOpen(false);
            }}
          >
            <PreviewComponent
              label={blinkInfo?.label || ""}
              title={blinkInfo?.title || ""}
              description={blinkInfo?.description || ""}
              links={blinkInfo?.links || { actions: [] }}
              icon={blinkInfo?.icon || ""}
              symbol={data?.data?.item?.symbol}
              setBlinkDialogOpen={setBlinkDialogOpen}
            />
            <ButtonWrapper
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
              onClick={() => {
                copyToClipboard();
              }}
            >
              <Iconify
                icon="icon-park-outline:copy"
                sx={{ width: 20, height: 20, color: "#fff", mr: 1 }}
              />
              Copy Link
            </ButtonWrapper>
          </Dialog>
        </Box>
      </Box>
    </>
  );
}
