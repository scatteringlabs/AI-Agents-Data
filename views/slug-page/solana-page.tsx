import { Box, Dialog, IconButton } from "@mui/material";
import SolTrade from "@/views/trade/sol-trade-page";
import SolCollectionInfo from "@/views/trade/swap/sol/sol-collection-Info";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { getBlinkInfo, getCollectionBySlug } from "@/services/collections";
import { useEffect, useMemo, useState } from "react";
import ShareDialog from "@/components/dialog/share-dialog";
import CollectTabs from "@/components/tabs/CollectTabs";
import { fetchCollectionStas } from "@/services/sniper";
import { getTokensPrice } from "@/services/tokens";
import { SolAddress } from "@/constants/tokens";
import SolMbCollectionInfo from "@/views/trade/swap/sol/SolMbCollectionInfo";
import PreviewComponent from "@/views/trade/swap/sol/PreviewComponent";
import { ButtonWrapper } from "@/components/button/wrapper";
import Iconify from "@/components/iconify";
import { toast } from "react-toastify";

interface SolanaSlugProps {
  chain_name?: string;
  slug?: string;
  isMobile?: boolean;
}

export default function SolanaSlug({
  chain_name,
  slug,
  isMobile = false,
}: SolanaSlugProps) {
  const router = useRouter();
  const { tab = "" } = router.query;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bLinkDialogOpen, setBlinkDialogOpen] = useState(false);
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

  const { data, isLoading: detailsLoading } = useQuery({
    queryKey: ["getCollectionBySlug", { slug }],
    queryFn: () =>
      getCollectionBySlug({
        slug: slug?.toString(),
      }),
    enabled: Boolean(slug),
  });
  console.log("dataSlug", slug);
  const { data: tokensPrice } = useQuery({
    queryKey: ["tokensPrice"],
    queryFn: () =>
      getTokensPrice({
        tokenAddresses: [SolAddress],
        chainId: 10000,
      }),
  });
  const solPrice = useMemo(() => tokensPrice?.[SolAddress] || 0, [tokensPrice]);

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

  return (
    <>
      {/* <Head>
        <meta
          content={`https://scattering.io/api/og?token=${token}&chain=${chain_name}&timestamp=${new Date().getTime()}`}
          name="twitter:image:src"
        ></meta>
        <meta
          content={`https://scattering.io/api/og?token=${token}&chain=${chain_name}&timestamp=${new Date().getTime()}`}
          property="og:image"
        />
      </Head> */}
      <Box
        sx={{
          px: { md: 4, xs: "16px !important" },
          pt: data?.data?.item?.banner_url ? "0px" : "80px",
        }}
      >
        {isMobile ? (
          <SolMbCollectionInfo
            detailsLoading={false}
            handleOpenDialog={handleOpenDialog}
            setBlinkDialogOpen={setBlinkDialogOpen}
            collectionDetails={data?.data?.item}
            collectionStat={collectionStat}
            allVolume={allVolume}
          />
        ) : (
          <SolCollectionInfo
            detailsLoading={false}
            handleOpenDialog={handleOpenDialog}
            setBlinkDialogOpen={setBlinkDialogOpen}
            collectionDetails={data?.data?.item}
            collectionStat={collectionStat}
            allVolume={allVolume}
          />
        )}
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
