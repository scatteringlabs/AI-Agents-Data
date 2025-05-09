import { getCollections } from "@/services/collections";
import { CollectionsResponse } from "@/types/collection";
import { Box } from "@mui/material";
import {
  UseInfiniteQueryResult,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { NoCollectionSearched } from "../search-not-found/no-collection-searched";
import { TableSkeleton } from "../skeleton/table-skeleton";
import { useDrawerSort } from "@/context/drawer-token-sort-provider";
import { TableDrawerHeader } from "./table-drawer-header";
import { TableDrawerRow } from "./table-drawer-row";
import { useDebounce } from "@/hooks/use-debounce";
import DrawerHeader from "./drawer-header";
import DrawerSearch from "./drawer-search";

export const SortFieldMap: Record<string, string> = {
  Price: "price_in_usd",
  "24h Chg": "price_change",
  "24h Vol": "volume",
};
interface TokensTableProps {
  toggleDrawer?: () => void;
  title: string;
}
interface CollectionsPage {
  pages: CollectionsResponse[];
  nextPage?: number;
}

interface CollectionsParams {
  chainId?: number;
  sortOrder?: string;
  sortedField?: string;
  searchQuery?: string;
}

function useInfiniteCollections({
  chainId = -1,
  sortOrder,
  sortedField,
  searchQuery,
}: CollectionsParams): UseInfiniteQueryResult<CollectionsPage, Error> {
  return useInfiniteQuery({
    queryKey: ["collections", { chainId, sortOrder, sortedField, searchQuery }],
    queryFn: ({ pageParam = 1 }) =>
      getCollections({
        page: pageParam,
        page_size: 10,
        sort_field: SortFieldMap[sortedField || "24h Vol"],
        parent_type_id: 0,
        chain_id: Number(chainId) === -1 ? "" : Number(chainId) || 1,
        sort_direction: sortOrder || "desc",
        name_like: searchQuery,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage.data?.list?.length) return undefined;
      return pages.length + 1;
    },
  });
}
const TokensTable: React.FC<TokensTableProps> = ({ toggleDrawer, title }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedQuery = useDebounce(searchQuery);
  const router = useRouter();
  const { collectionAddress = "", slug } = router.query;
  const { sortOrder = "desc", sortedField = "24h Vol" } = useDrawerSort();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
    error,
  } = useInfiniteCollections({
    sortOrder: sortOrder || "",
    sortedField: sortedField || "",
    searchQuery: debouncedQuery,
  });

  const [sentryRef] = useInfiniteScroll({
    loading: isFetchingNextPage,
    hasNextPage: hasNextPage,
    onLoadMore: fetchNextPage,
    disabled: !!error,
    rootMargin: "0px 0px 400px 0px",
  });

  return (
    <Box
      sx={{
        background: "#0E111C",
        color: "rgba(255, 255, 255,0.6)",
        minHeight: "100%",
        position: "relative",
        // borderRadius: "20px",
        width: 560,
        overflowX: "hidden",
      }}
    >
      {toggleDrawer ? (
        <DrawerHeader title={title} toggleDrawer={toggleDrawer} />
      ) : null}
      <Box>
        <Box
          className="widget-table-ranking"
          sx={{
            position: "sticky",
            left: 0,
            top: 0,
            zIndex: 99,
            background: "#0E111C",
            width: "100%",
            p: 2,
            pb: 0,
            borderBottom: "1px solid rgba(255, 255, 255,0.1)",
          }}
        >
          <DrawerSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <Box sx={{ mt: 1 }}>
            <TableDrawerHeader title={title} />
          </Box>
        </Box>
        <Box
          sx={{
            height: "calc( 100vh - 240px )",
            overflow: "scroll",
          }}
          className="widget-table-ranking"
        >
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <Box
              sx={{ px: 2 }}
              className="table-ranking-content table-token-content"
            >
              {data?.pages?.map((page) => {
                return page?.data?.list?.map((item) => (
                  <TableDrawerRow
                    key={item.rank}
                    item={item}
                    title={title}
                    collectionAddress={
                      collectionAddress?.toString() || slug?.toString() || ""
                    }
                  />
                ));
              })}

              {data?.pages?.[0].data?.list?.length === 0 ? (
                <Box sx={{}}>
                  <NoCollectionSearched />
                </Box>
              ) : null}
              <Box ref={sentryRef}>
                {isFetchingNextPage && !isLoading ? <TableSkeleton /> : null}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default TokensTable;
