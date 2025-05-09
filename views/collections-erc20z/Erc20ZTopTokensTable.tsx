import { NoCollectionSearched } from "@/components/search-not-found/no-collection-searched";
import { getCollections } from "@/services/collections-erc20z";
import { useQuery } from "@tanstack/react-query";
import {
  useCallback,
  useState,
  Suspense,
  startTransition,
  useEffect,
} from "react";
import { useSort } from "@/context/erc20z-token-sort-provider";
import { ERC20ZTopTableHeader } from "./table/table-header";
import { TableSkeleton } from "./table/table-skeleton";
import Erc20ZTokenTableRow from "./table/table-row";
import DynamicTabs from "@/components/tabs/DynamicTabs";
import { getZoraTokenTypes } from "@/services/tokens";
import { Box } from "@mui/material";
import { useInfiniteCollections } from "./Erc20ZCollectionsTable";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { Collection } from "@/types/collection";
import { useRouter } from "next/router";
import DynamicTabsNew from "@/components/tabs/DynamicTabsNew";

interface Erc20ZTopTokensTableProps {
  chainId: string;
  selectedTime: string;
  onTokenClick?: (slug: string, chain: number) => void;
  data?: Collection[];
  showDate?: boolean;
  isRightPanelCollapsed?: boolean;
}

const Erc20ZTopTokensTable: React.FC<Erc20ZTopTokensTableProps> = ({
  chainId,
  selectedTime,
  onTokenClick,
  data,
  showDate = false,
  isRightPanelCollapsed = false,
}) => {
  const router = useRouter();
  const [paseSize, setPaseSize] = useState<number>(100);
  const { sortOrder = "desc", sortedField = "1h Chg" } = useSort();
  const [selectedTabName, setSelectedTabName] = useState<string>("All");
  const [hasSelectedFirstToken, setHasSelectedFirstToken] = useState(false);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  const { data: tokenTypes } = useQuery({
    queryKey: ["getZoraTokenTypes"],
    queryFn: () => getZoraTokenTypes(),
  });

  // 从 URL 参数初始化状态
  useEffect(() => {
    const { tab, sortField } = router.query;
    if (tab && typeof tab === "string" && tokenTypes?.data?.list) {
      // 检查 tab 是否在可用的选项中
      const availableTabs = ["All", ...tokenTypes.data.list.map((t) => t.name)];

      if (availableTabs.includes(tab)) {
        console.log("setSelectedTabName", tab);

        setSelectedTabName(tab);
      }
    }
    // if (sortField && typeof sortField === "string") {
    //   setSortedField(sortField);
    // }
  }, [router.query, tokenTypes?.data?.list]);

  // 监听过滤条件变化
  useEffect(() => {
    setHasSelectedFirstToken(false);
  }, [selectedTabName, chainId, sortOrder, sortedField]);

  const {
    data: collectionsData,
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

  const handleDynamicTabsChange = useCallback(
    (id: number, name: string) => {
      startTransition(() => {
        setSelectedTabName(name);
        // 更新 URL 参数
        router.push(
          {
            pathname: router.pathname,
            query: { ...router.query, tab: name },
          },
          undefined,
          { shallow: true },
        );
      });
    },
    [router],
  );

  // 默认选中第一行数据
  useEffect(() => {
    if (
      !hasSelectedFirstToken &&
      collectionsData?.pages?.[0]?.data?.list?.[0] &&
      onTokenClick
    ) {
      const firstToken = collectionsData.pages[0].data.list[0];
      setSelectedRow(firstToken.rank);
      onTokenClick(firstToken.slug, Number(firstToken.chain_id));
      setHasSelectedFirstToken(true);
    }
  }, [collectionsData?.pages, hasSelectedFirstToken, onTokenClick]);

  const handleRowClick = (rank: number, slug: string, chainId: number) => {
    setSelectedRow(selectedRow === rank ? null : rank);
    if (onTokenClick) {
      onTokenClick(slug, chainId);
    }
  };

  // const handleSortChange = (field: string, order: "asc" | "desc") => {
  //   setSortedField(field);
  //   // 更新 URL 参数
  //   router.push(
  //     {
  //       pathname: router.pathname,
  //       query: { ...router.query, sortField: field, sortOrder: order },
  //     },
  //     undefined,
  //     { shallow: true },
  //   );
  // };

  return (
    <Suspense fallback={<TableSkeleton />}>
      <div
        className="widget-content-tab pt-2 pb-4"
        style={{
          overflowX: "auto",
          width: "100%",
          minWidth: "1700px",
          marginRight: isRightPanelCollapsed ? "20px" : "280px",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        <DynamicTabsNew
          total={collectionsData?.pages?.[0]?.data?.total_count || 0}
          tabs={[{ rank: 0, name: "All" }].concat(tokenTypes?.data?.list || [])}
          onChange={handleDynamicTabsChange}
          activeName={selectedTabName}
        />
        <div
          className="widget-content-inner"
          style={{
            minWidth: "1700px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            flexShrink: 0,
          }}
        >
          <div className="widget-table-ranking">
            <ERC20ZTopTableHeader selectedTime={selectedTime} />
            {isLoading ? (
              <TableSkeleton />
            ) : (
              <Box
                className="table-ranking-content"
                sx={{
                  width: "100%",
                  overflowX: "auto",
                }}
              >
                {collectionsData?.pages?.map((page) => {
                  return page?.data?.list?.map((item) => (
                    <Erc20ZTokenTableRow
                      key={item.slug}
                      item={item}
                      showDate={showDate}
                      selectedTime={selectedTime}
                      onClick={() =>
                        handleRowClick(
                          item.rank,
                          item.slug,
                          Number(item.chain_id),
                        )
                      }
                      isSelected={selectedRow === item.rank}
                    />
                  ));
                })}

                {collectionsData?.pages?.[0].data?.list?.length === 0 ? (
                  <NoCollectionSearched />
                ) : null}
                <Box ref={sentryRef} sx={{ height: "10px" }}>
                  {isFetchingNextPage && !isLoading ? <TableSkeleton /> : null}
                </Box>
              </Box>
            )}
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Erc20ZTopTokensTable;
