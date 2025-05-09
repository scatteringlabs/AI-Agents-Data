// app/page.tsx
import { useState } from "react";
import { Box } from "@mui/material";
import TimeFilterTabs from "@/views/framework/TimeFilterTabs";
import { useQuery } from "@tanstack/react-query";
import { getRepoStatsByDuration } from "@/services/framework/list";
import { RepoStatsTable } from "@/views/framework/RepoStatsTable";
import { TableSkeleton } from "@/components/skeleton/table-skeleton";
import { useErc20ZChain } from "@/context/chain-provider-erc20z";
import { ChainIdByName } from "@/constants/chain";
import { NoDataSearched } from "@/components/search-not-found/no-data-searched";
import FrameworkLayout from "../layout";

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
    <FrameworkLayout>
      <Box
        sx={{
          my: 2,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          mt: -4,
        }}
      >
        <TimeFilterTabs value={duration} onChange={setDuration} />
      </Box>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <RepoStatsTable data={data?.data || []} duration={duration} />
      )}
      {!data?.data ? <NoDataSearched /> : null}
    </FrameworkLayout>
  );
}
