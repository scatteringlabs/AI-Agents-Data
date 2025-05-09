import { NoCollectionSearched } from "@/components/search-not-found/no-collection-searched";
import { getCollections } from "@/services/collections-erc20z";
import { CollectionsResponse } from "@/types/collection";
import { Box } from "@mui/material";
import {
  UseInfiniteQueryResult,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { ERC20ZTableHeader } from "./table/table-header";
import { TableSkeleton } from "./table/table-skeleton";
import { Erc20ZTokenTableRow } from "./table/table-row";
import { useSort } from "@/context/erc20z-all-token-sort-provider";
import { SortFieldMap } from "./table-config";
import DynamicTabs from "@/components/tabs/DynamicTabs";
import TimeFilter from "../home/components/hour-filter";
import { useCallback, useState } from "react";
import { getZoraTokenTypes } from "@/services/tokens";
import { useErc20ZChain } from "@/context/chain-provider-erc20z";

interface CollectionsTableProps {
  // chainId: string;
  // selectedTime?: string;
}
interface CollectionsPage {
  pages: CollectionsResponse[];
  nextPage?: number;
}

interface CollectionsParams {
  selectedTabId?: number;
  chainId: number;
  sortOrder?: string;
  sortedField?: string;
}

function useInfiniteCollections({
  selectedTabId,
  chainId,
  sortOrder,
  sortedField,
}: CollectionsParams): UseInfiniteQueryResult<CollectionsPage, Error> {
  return useInfiniteQuery({
    queryKey: [
      "collections",
      { selectedTabId, chainId, sortOrder, sortedField },
    ],
    queryFn: ({ pageParam = 1 }) =>
      getCollections({
        page: pageParam,
        page_size: 10,
        sort_field: SortFieldMap[sortedField || "24h Vol"],
        parent_type_id: selectedTabId,
        chain_id: Number(chainId) === -1 ? "" : Number(chainId) || 1,
        sort_direction: sortOrder || "desc",
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage.data?.list?.length) return undefined;
      return pages.length + 1;
    },
    // enabled: Boolean(selectedTabId && sortOrder),
  });
}
const Erc20ZCollectionsTable: React.FC<CollectionsTableProps> = () => {
  const { chainId } = useErc20ZChain();
  const {
    sortOrder = "desc",
    sortedField = "24h Vol",
    setSortedField,
  } = useSort();
  const [selectedTime, setSelectedTime] = useState<"1h" | "6h" | "24h">("24h");
  const [selectedTabId, setSelectedTabID] = useState<number>(0);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteCollections({
    selectedTabId,
    chainId: Number(chainId),
    sortOrder: sortOrder || "",
    sortedField: sortedField || "",
  });

  const [sentryRef] = useInfiniteScroll({
    loading: isFetchingNextPage,
    hasNextPage: hasNextPage,
    onLoadMore: fetchNextPage,
    disabled: !!error,
    rootMargin: "0px 0px 400px 0px",
  });

  const { data: tokenTypes } = useQuery({
    queryKey: ["getZoraTokenTypes", { chainId }],
    queryFn: () => getZoraTokenTypes(Number(chainId)),
  });

  const handleDynamicTabsChange = useCallback((id: number) => {
    setSelectedTabID(id);
  }, []);
  const handleTimeChange = (time: "1h" | "6h" | "24h") => {
    if (sortedField !== `${time} Vol`) {
      setSelectedTime(time);
      setSortedField(`${time} Vol`);
    }
  };
  return (
    <>
      <div className="widget-content-tab pt-10">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            position: "sticky",
            top: 140,
            zIndex: 999,
            background: "rgba(0,0,0,0.3)",
          }}
        >
          {" "}
          <DynamicTabs
            total={data?.pages?.[0]?.data?.total_count || 0}
            tabs={[{ id: 0, name: "All" }].concat(tokenTypes?.data?.list || [])}
            onChange={handleDynamicTabsChange}
          />
          <TimeFilter value={selectedTime} onChange={handleTimeChange} />
        </Box>
        <div className="widget-content-inner">
          <div className="widget-table-ranking">
            <ERC20ZTableHeader selectedTime={selectedTime} />
            {isLoading ? (
              <TableSkeleton />
            ) : (
              <div
                className="table-ranking-content"
                style={{ minHeight: "500px" }}
              >
                {data?.pages?.map((page) => {
                  return page?.data?.list?.map((item) => (
                    <Erc20ZTokenTableRow
                      item={item}
                      key={item.erc20_address}
                      selectedTime={selectedTime}
                    />
                  ));
                })}

                {data?.pages?.[0].data?.list?.length === 0 ? (
                  <NoCollectionSearched />
                ) : null}
                <Box ref={sentryRef}>
                  {isFetchingNextPage && !isLoading ? <TableSkeleton /> : null}
                </Box>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Erc20ZCollectionsTable;
