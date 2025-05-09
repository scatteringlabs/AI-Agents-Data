// app/page.tsx
import { useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import TimeFilterTabs from "@/views/framework/TimeFilterTabs";
import { useQuery } from "@tanstack/react-query";
import { getRepoStatsByDuration } from "@/services/framework/list";
import { RepoStatsTable } from "@/views/framework/RepoStatsTable";
import { TableSkeleton } from "@/components/skeleton/table-skeleton";
import { useErc20ZChain } from "@/context/chain-provider-erc20z";
import { ChainIdByName } from "@/constants/chain";
import { NoCollectionSearched } from "@/components/search-not-found/no-collection-searched";
import { NoDataSearched } from "@/components/search-not-found/no-data-searched";

export default function FrameworkPage() {
  const { chainId } = useErc20ZChain();
  console.log("chainId", chainId);

  const [duration, setDuration] = useState<"1d" | "3d" | "7d" | "30d">("30d");
  const { data, isLoading } = useQuery({
    queryKey: ["repoStats", duration, chainId],
    queryFn: () =>
      getRepoStatsByDuration({
        duration,
        page: 1,
        page_size: 100,
        chain:
          Number(chainId) === -1
            ? undefined
            : ChainIdByName?.[chainId]?.toLowerCase(),
      }),
  });

  return (
    <Box sx={{ mt: 12, p: 4, minHeight: "calc(100vh - 140px)" }}>
      <Box
        sx={{
          my: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          GitHub Repo Stats
        </Typography>
        <TimeFilterTabs value={duration} onChange={setDuration} />
      </Box>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <RepoStatsTable data={data?.data || []} duration={duration} />
      )}
      {!data?.data ? <NoDataSearched /> : null}
    </Box>
  );
}
