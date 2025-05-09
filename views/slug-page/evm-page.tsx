import { getCollectionBySlug } from "@/services/collections";
import CollectionInfo from "@/views/collect/CollectionInfo";
import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import Trade from "@/views/trade/trade-page";
import CollectTabs from "@/components/tabs/CollectTabs";
import MbCollectionInfo from "@/views/collect/MbCollectionInfo";
import ShareDialog from "@/components/dialog/share-dialog";
import { usePrivy } from "@privy-io/react-auth";

interface EvmSlugProps {
  chain_name?: string;
  slug?: string;
  isMobile?: boolean;
}

export default function EvmSlug({
  chain_name,
  slug,
  isMobile = false,
}: EvmSlugProps) {
  const router = useRouter();
  const { user } = usePrivy();

  const [dialogOpen, setDialogOpen] = useState(false);
  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const { data: collectionDetails, isLoading: detailsLoading } = useQuery({
    queryKey: ["getCollectionBySlug", { slug }],
    queryFn: () =>
      getCollectionBySlug({
        slug: slug?.toString(),
      }),
    enabled: Boolean(slug),
  });

  return (
    <Box
      sx={{
        px: { md: 4, xs: "16px !important" },
        py: 0,
        pt: collectionDetails?.data?.item?.banner_url ? "0px" : "80px",
      }}
    >
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
      {isMobile ? (
        <MbCollectionInfo
          slugLoading={detailsLoading}
          handleOpenDialog={handleOpenDialog}
          collectionDetails={collectionDetails?.data?.item}
        />
      ) : (
        <CollectionInfo
          slugLoading={detailsLoading}
          handleOpenDialog={handleOpenDialog}
          collectionDetails={collectionDetails?.data?.item}
        />
      )}
      <Trade
        chainId={Number(collectionDetails?.data?.item?.chain_id)}
        erc20Address={collectionDetails?.data?.item?.address || ""}
        status={collectionDetails?.data?.item?.status || 2}
        collectionDetails={collectionDetails?.data?.item}
        type={collectionDetails?.data?.item?.collection_type?.name || ""}
        priceInUsd={collectionDetails?.data?.item?.price_in_usd || "0"}
        logoUrl={collectionDetails?.data?.item?.logo_url}
      />
      <ShareDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        collectionDetails={collectionDetails?.data?.item}
      />
    </Box>
  );
}
