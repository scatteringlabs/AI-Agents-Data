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
import { useSort } from "@/context/erc20z-all-token-sort-provider";
import { SortFieldMap, tableColumns } from "./table-config";
import DynamicTabs from "@/components/tabs/DynamicTabs";
import TimeFilter from "../home/components/hour-filter";
import { useCallback, useState } from "react";
import { getZoraTokenTypes } from "@/services/tokens";
import { useErc20ZChain } from "@/context/chain-provider-erc20z";
import Erc20ZTokenTableRow from "./table/table-row";

interface CollectionsTableProps {
  // chainId: string;
  // selectedTime?: string;
}
interface CollectionsPage {
  pages: CollectionsResponse[];
  nextPage?: number;
}

interface CollectionsParams {
  selectedTabName?: string;
  chainId: number;
  sortOrder?: string;
  sortedField?: string;
}

export function useInfiniteCollections({
  selectedTabName,
  chainId,
  sortOrder,
  sortedField,
}: CollectionsParams): UseInfiniteQueryResult<CollectionsPage, Error> {
  // 处理特殊的排序字段
  let sortField = SortFieldMap[sortedField || "1h Chg"];

  // 确保 Twitter Score 使用正确的排序字段
  if (sortedField === "Twitter Score") {
    sortField = "index_collections.twitter_score";
  }

  // 添加更详细的日志
  console.log("Current sortedField:", sortedField);
  console.log("Mapped sortField:", sortField);
  console.log("Sort order:", sortOrder);
  console.log("SortFieldMap:", SortFieldMap);

  // 构建查询参数
  const queryParams = {
    page: 1,
    page_size: 10,
    type_name: selectedTabName === "All" ? "" : selectedTabName,
    sort_field: sortField,
    chain_id: Number(chainId) === -1 ? "" : Number(chainId) || 1,
    sort_direction: sortOrder || "desc",
  };

  // 如果是 Twitter Score，添加特殊处理
  if (sortedField === "Twitter Score") {
    queryParams.sort_field = "twitter_score"; // 尝试使用不带前缀的字段名
  }

  console.log("Query params:", queryParams);

  return useInfiniteQuery({
    queryKey: [
      "collections",
      { selectedTabName, chainId, sortOrder, sortedField },
    ],
    queryFn: ({ pageParam = 1 }) =>
      getCollections({
        ...queryParams,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage.data?.list?.length) return undefined;
      return pages.length + 1;
    },
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
  const [selectedTabName, setSelectedTabName] = useState<string>("");
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteCollections({
    selectedTabName,
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
    queryKey: ["getZoraTokenTypes"],
    queryFn: () => getZoraTokenTypes(),
  });

  const handleDynamicTabsChange = useCallback((id: number, name: string) => {
    setSelectedTabName(name);
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
            tabs={[{ rank: 0, name: "All" }].concat(
              tokenTypes?.data?.list || [],
            )}
            onChange={handleDynamicTabsChange}
          />
          <TimeFilter value={selectedTime} onChange={handleTimeChange} />
        </Box>
        <div
          className="widget-content-inner"
          style={{
            overflowX: "auto",
            width: "100%",
            minWidth: "1700px",
          }}
        >
          <div className="widget-table-ranking">
            <ERC20ZTableHeader selectedTime={selectedTime} />
            {isLoading ? (
              <TableSkeleton />
            ) : (
              <div
                className="table-ranking-content"
                style={{
                  minHeight: "500px",
                  width: "100%",
                }}
              >
                <div
                  className="table-ranking-header"
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "80px 2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
                    padding: "12px",
                    background: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "8px",
                    marginBottom: "8px",
                    minWidth: "1700px",
                    overflowX: "auto",
                  }}
                >
                  {tableColumns.map((column, index) => (
                    <div
                      key={index}
                      className="table-ranking-header-item"
                      style={{
                        color: "rgba(255, 255, 255, 0.8)",
                        fontSize: "12px",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        ...(column.key === "twitter_score"
                          ? {
                            minWidth: "120px",
                            maxWidth: "120px",
                            textAlign: "center",
                          }
                          : {}),
                      }}
                    >
                      {column.title}
                    </div>
                  ))}
                </div>
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
