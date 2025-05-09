import { NoCollectionSearched } from "@/components/search-not-found/no-collection-searched";
import { useState } from "react";
import { useSort } from "@/context/erc20z-token-sort-provider";
import { Box } from "@mui/material";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useInfiniteCollections } from "../collections-erc20z/Erc20ZCollectionsTable";
import { ERC20ZTopTableHeader } from "../collections-erc20z/table/table-header";
import { TableSkeleton } from "@/components/skeleton/table-skeleton";
import { useQuery } from "@tanstack/react-query";
import { getLaunchpadList } from "@/services/launchpad";
import { SortFieldMap } from "../collections-erc20z/table-config";
import { AgentTableHeader } from "./AgentTableHeader";
import { AgentTableRow } from "./AgentTableRow";

interface LaunchaPadTableProps {
  chainId: string;
  selectedTime: string;
}

const LaunchaPadTable: React.FC<LaunchaPadTableProps> = ({
  chainId,
  selectedTime,
}) => {
  const [paseSize, setPaseSize] = useState<number>(100);
  const { sortOrder = "desc", sortedField = "1h Chg" } = useSort();

  const { data: launchpadList, isLoading } = useQuery({
    queryKey: ["LaunchpadList", { sortedField, sortOrder, chainId }],
    queryFn: () =>
      getLaunchpadList({
        page: 1,
        page_size: 100,
        sort_field: SortFieldMap[sortedField || "24h Vol"],
        sort_direction: sortOrder || "desc",
        chain_id: Number(chainId) === -1 ? undefined : Number(chainId),
      }),
  });

  return (
    <div className="widget-content-tab pt-2 pb-4">
      <div className="widget-content-inner">
        <div className="widget-table-ranking">
          <AgentTableHeader />
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <div
              className="table-ranking-content"
              style={{ minHeight: "calc(100vh - 240px)" }}
            >
              {launchpadList?.data?.map((item) => (
                <AgentTableRow item={item} key={item.slug} />
              ))}

              {launchpadList?.data?.length === 0 ? (
                <NoCollectionSearched />
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LaunchaPadTable;
