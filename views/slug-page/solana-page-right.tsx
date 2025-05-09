import { Box } from "@mui/material";
import SolTrade from "@/views/trade/sol-trade-page";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { getBlinkInfo, getCollectionBySlug } from "@/services/collections";
import { useMemo, useState } from "react";
import { fetchCollectionStas } from "@/services/sniper";
import { getTokensPrice } from "@/services/tokens";
import { SolAddress } from "@/constants/tokens";
import SolMbCollectionInfo from "@/views/trade/swap/sol/SolMbCollectionInfo";
import { toast } from "react-toastify";

interface SolanaPageRightProps {
  chain_name?: string;
  slug?: string;
  isMobile?: boolean;
}

export default function SolanaPageRight({
  chain_name,
  slug,
  isMobile = true,
}: SolanaPageRightProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bLinkDialogOpen, setBlinkDialogOpen] = useState(false);

  const { data, isLoading: detailsLoading } = useQuery({
    queryKey: ["getCollectionBySlug", { slug }],
    queryFn: () =>
      getCollectionBySlug({
        slug: slug?.toString(),
      }),
    enabled: Boolean(slug),
  });

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

  const allVolume = useMemo(
    () =>
      solPrice * Number(collectionStat?.oneDayVolume) +
      Number(data?.data?.item?.volume),
    [solPrice, collectionStat?.oneDayVolume, data?.data?.item?.volume],
  );
  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
      }}
    >
      <SolMbCollectionInfo
        detailsLoading={false}
        handleOpenDialog={handleOpenDialog}
        setBlinkDialogOpen={setBlinkDialogOpen}
        collectionDetails={data?.data?.item}
        collectionStat={collectionStat}
        allVolume={allVolume}
        isMobile={isMobile}
      />
      <SolTrade
        collectionDetails={data?.data?.item}
        detailsLoading={false && isLoading}
        isMobile={true}
      />
    </Box>
  );
}
