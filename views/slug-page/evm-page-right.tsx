import { getCollectionBySlug } from "@/services/collections";
import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import Trade from "@/views/trade/trade-page";
import MbCollectionInfo from "@/views/collect/MbCollectionInfo";
import ShareDialog from "@/components/dialog/share-dialog";
import { usePrivy } from "@privy-io/react-auth";

interface EvmPageRightProps {
  chain_name?: string;
  slug?: string;
  tokenData?: any;
}

export default function EvmPageRight({
  chain_name,
  slug,
  tokenData,
}: EvmPageRightProps) {
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
    initialData: tokenData ? { data: { item: tokenData } } : undefined,
  });

  return (
    <Box
      sx={{
        height: "100%",
        overflow: "auto",
        backgroundColor: "background.paper",
      }}
    >
      <MbCollectionInfo
        slugLoading={detailsLoading}
        handleOpenDialog={handleOpenDialog}
        collectionDetails={collectionDetails?.data?.item}
        isMobile={true}
      />
      <Trade
        chainId={Number(collectionDetails?.data?.item?.chain_id)}
        erc20Address={collectionDetails?.data?.item?.address || ""}
        status={collectionDetails?.data?.item?.status || 2}
        collectionDetails={collectionDetails?.data?.item}
        type={collectionDetails?.data?.item?.collection_type?.name || ""}
        priceInUsd={collectionDetails?.data?.item?.price_in_usd || "0"}
        logoUrl={collectionDetails?.data?.item?.logo_url}
        isMobile={true}
      />
      <ShareDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        collectionDetails={collectionDetails?.data?.item}
      />
    </Box>
  );
}
