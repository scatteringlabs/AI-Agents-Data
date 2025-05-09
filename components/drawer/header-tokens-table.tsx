import { getCollections } from "@/services/collections";
import { CollectionsResponse } from "@/types/collection";
import { Box, Divider, IconButton, Stack } from "@mui/material";
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
import DrawerSearch from "./drawer-search";
import { TableSearchHeader } from "./table-search-header";
import ChainFilter from "./chain-filter";
import Logo from "../layout/header/Logo";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import CustomConnectButton from "../layout/header/CustomConnectButton";
import Iconify from "../iconify";
import { useChain } from "@/context/chain-provider";
import { useGlobalState } from "@/context/GlobalStateContext";
import { useErc20ZChain } from "@/context/chain-provider-erc20z";

export const SortFieldMap: Record<string, string> = {
  Price: "price_in_usd",
  "24h Chg": "price_change",
  "24h Vol": "volume",
};
interface HeaderTokensTableProps {
  title: string;
  closeDialog: () => void;
}
interface CollectionsPage {
  pages: CollectionsResponse[];
  nextPage?: number;
}

interface CollectionsParams {
  selectedChain?: number | string;
  sortOrder?: string;
  sortedField?: string;
  searchQuery?: string;
}

function useInfiniteCollections({
  selectedChain = -1,
  sortOrder,
  sortedField,
  searchQuery,
}: CollectionsParams): UseInfiniteQueryResult<CollectionsPage, Error> {
  return useInfiniteQuery({
    queryKey: [
      "collections",
      { selectedChain, sortOrder, sortedField, searchQuery },
    ],
    queryFn: ({ pageParam = 1 }) =>
      getCollections({
        page: pageParam,
        page_size: 10,
        sort_field: SortFieldMap[sortedField || "24h Vol"],
        parent_type_id: 0,
        chain_id:
          Number(selectedChain) === -1 ? "" : Number(selectedChain) || 1,
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
const HeaderTokensTable: React.FC<HeaderTokensTableProps> = ({
  title,
  closeDialog,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { selectedOption } = useGlobalState();
  const { chainId, setChainId } = useChain();
  const { chainId: zoraChainId, setChainId: setZoraChainId } = useErc20ZChain();
  const handleChainChange = (newChain: string) => {
    if (selectedOption === "404s") {
      setChainId(Number(newChain));
    } else {
      setZoraChainId(Number(newChain));
    }
  };

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
    selectedChain: chainId?.toString(),
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
        background: "transparent",
        color: "rgba(255, 255, 255,0.6)",
        minHeight: "100%",
        position: "relative",
        width: { md: 720, xs: "100%" },
        overflowX: "hidden",
      }}
    >
      <Box>
        <Box
          sx={{
            position: "sticky",
            left: 0,
            top: 0,
            zIndex: 99,
            background: "#0E111C",
            width: "100%",
            // p: 2,
            mb: 1,
          }}
        >
          <DrawerSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <IconButton
            onClick={closeDialog}
            sx={{
              display: { sm: "none", xs: "inline-block" },
              position: "fixed",
              right: 10,
              top: 10,
            }}
          >
            <Iconify
              icon="solar:close-circle-line-duotone"
              sx={{ color: "#fff", width: "36px", height: "36px" }}
            />
          </IconButton>
        </Box>
        <Box
          sx={{
            border: "1px solid rgb(255 255 255 / 0.1)",
            borderRadius: "6px",
            overflow: "hiden",
          }}
        >
          <Box sx={{ mt: 0 }} className="widget-table-ranking">
            <ChainFilter
              selectedChain={
                selectedOption === "404s"
                  ? chainId?.toString()
                  : zoraChainId?.toString()
              }
              onChainChange={handleChainChange}
            />
            <TableSearchHeader title={title} />
          </Box>
          <Box
            sx={{
              height: "calc( 100vh - 240px )",
              overflow: "scroll",
              background: "#0E111C",
            }}
            className="widget-table-ranking"
          >
            {isLoading ? (
              <TableSkeleton />
            ) : (
              <Box
                sx={{ px: 0, mt: "0px !important" }}
                className="table-ranking-content table-token-content"
              >
                {data?.pages?.map((page) => {
                  return page?.data?.list?.map((item) => (
                    <TableDrawerRow
                      closeDialog={closeDialog}
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
    </Box>
  );
};

export default HeaderTokensTable;
