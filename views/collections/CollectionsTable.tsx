import SortIcon from "@/components/button/sort-icon-button";
import AvatarCard from "@/components/collections/avatar-card";
import LabelPriceText from "@/components/collections/label-price-text";
import PriceChangeText from "@/components/collections/price-change-text";
import VerifiedIcon from "@/components/icons/verified-icon";
import { NoCollectionSearched } from "@/components/search-not-found/no-collection-searched";
import DynamicTabs from "@/components/tabs/DynamicTabs";
import MenuTabs from "@/components/tabs/MenuTabs";
import SortText from "@/components/text/sort-text";
import { ChainIdByName } from "@/constants/chain";
import { DC } from "@/constants/mediaInfo";
import { SortProvider, useSort } from "@/context/token-sort-provider";
import { getCollections } from "@/services/collections";
import { getTokenTypes } from "@/services/tokens";
import {
  Collection,
  CollectionItem,
  CollectionsResponse,
} from "@/types/collection";
import {
  formatIntNumberWithKM,
  formatNumberWithKM,
  formatUSD,
} from "@/utils/format";
import { getTokenLogoURL } from "@/utils/token";
import { Box, Skeleton, Stack, Tooltip, Typography } from "@mui/material";
import {
  UseInfiniteQueryResult,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
const SortFieldMap: Record<string, string> = {
  Price: "price_in_usd",
  "Market Cap": "market_cap",
  Liquidity: "liquidity",
  "24h Chg": "price_change",
  "24h Vol": "volume",
};

interface CollectionsTableProps {
  chainId: string;
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

function useInfiniteCollections({
  selectedTabName,
  chainId,
  sortOrder,
  sortedField,
}: CollectionsParams): UseInfiniteQueryResult<CollectionsPage, Error> {
  return useInfiniteQuery({
    queryKey: [
      "collections",
      { selectedTabName, chainId, sortOrder, sortedField },
    ],
    queryFn: ({ pageParam = 1 }) =>
      getCollections({
        page: pageParam,
        page_size: 10,
        sort_field: SortFieldMap[sortedField || "24h Vol"],
        type_name: selectedTabName,
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
const CollectionsTable: React.FC<CollectionsTableProps> = ({ chainId }) => {
  const [selectedTab, setSelectedTab] = useState<string>("All");
  const [selectedTabName, setSelectedTabName] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const router = useRouter();
  const { sortOrder = "desc", sortedField = "24h Vol" } = useSort();
  const handleClick = useCallback(
    ({
      erc20_address,
      chain_id,
    }: {
      erc20_address: string;
      chain_id: number;
    }) => {
      router.push(
        `/collection/${ChainIdByName?.[Number(chain_id)]}/${erc20_address}`,
      );
    },
    [router],
  );
  const { data: tokenTypes } = useQuery({
    queryKey: ["tokenTypes", { chainId }],
    queryFn: () => getTokenTypes(Number(chainId)),
  });

  const handleTabChange = useCallback((key: string) => {
    setSelectedTab(key);
  }, []);
  const handleDynamicTabsChange = useCallback((rank: number, name: string) => {
    setSelectedTabName(name);
  }, []);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
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

  return (
    <>
      <DynamicTabs
        total={data?.pages?.[0]?.data?.total_count || 0}
        tabs={[{ rank: 0, name: "All" }].concat(tokenTypes?.data?.list || [])}
        onChange={handleDynamicTabsChange}
      />
      <div className="widget-content-tab pt-10">
        <div className="widget-content-inner">
          <div className="widget-table-ranking">
            <div
              data-wow-delay="0s"
              className="wow fadeInUp table-ranking-heading"
            >
              <div className="column1">
                <h3>Tokens</h3>
              </div>
              <div className="column2">
                <SortText title="Price" />
              </div>
              <div className="column">
                <SortText title="24h Chg" />
              </div>
              <div className="column">
                <SortText title="24h Vol" />
              </div>
              <div className="column">
                <SortText title="Liquidity" />
              </div>
              <div className="column">
                <SortText title="Market Cap" />
              </div>
            </div>
            {isLoading ? (
              <Box>
                {Array.from({ length: 10 }, (_, index) => index + 1).map(
                  (item) => (
                    <Skeleton
                      key={item}
                      sx={{
                        background: "#331f44",
                        borderRadius: 2,
                        height: 100,
                      }}
                    />
                  ),
                )}
              </Box>
            ) : (
              <div
                className="table-ranking-content"
                style={{ minHeight: "500px" }}
              >
                {data?.pages?.map((page) => {
                  return page?.data?.list?.map((item) => (
                    <Box
                      key={item.rank}
                      data-wow-delay="0s"
                      className="wow fadeInUp fl-row-ranking"
                      sx={{
                        cursor: "pointer",
                        "&:hover": {
                          background: "rgba(255, 255, 255, 0.05)",
                          borderRadius: "6px !important",
                        },
                      }}
                      onClick={() =>
                        handleClick({
                          erc20_address: item.erc20_address,
                          chain_id: item.chain_id,
                        })
                      }
                    >
                      <div className="td1">
                        <div className="item-rank">{item.rank}. </div>
                        <AvatarCard
                          // logoUrl={
                          //   Number(item.status_flags) === 2
                          //     ? item?.logo_url
                          //     : getTokenLogoURL({
                          //         chainId: item?.chain_id || 1,
                          //         address: item?.erc20_address,
                          //       })
                          // }
                          hasLogo={true}
                          logoUrl={item?.logo_url}
                          symbol={item.symbol}
                          chainId={item.chain_id}
                          size={60}
                        />
                        <Box>
                          <div
                            className="item-name"
                            style={{
                              marginBottom: "6px",
                              fontSize: 16,
                              padding: "6px 0px",
                              display: "flex",
                              alignItems: "center",
                              textTransform: "uppercase",
                            }}
                          >
                            {item?.is_verified ? (
                              <span style={{ marginRight: "6px" }}>
                                <VerifiedIcon size={16} />
                              </span>
                            ) : null}
                            {item.symbol}
                          </div>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: 12,
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: "200px",
                              overflow: "hidden",
                            }}
                          >
                            {item.name}
                          </Typography>
                        </Box>
                        <Typography
                          sx={{
                            border: "1px solid",
                            fontSize: "12px",
                            padding: "4px 8px",
                            borderColor: item?.collection_type?.color,
                            borderRadius: "6px",
                            color: item?.collection_type?.color,
                          }}
                        >
                          {item?.collection_type?.name || ""}
                        </Typography>
                      </div>
                      <div className="td2">
                        <h6 className="price gem">
                          {/* <i className="icon-gem" /> */}
                          {formatUSD(item.price_in_usd)}
                        </h6>
                      </div>
                      <div
                        className={`td3 ${Number(item.price_change) < 0 ? "danger" : "success"}`}
                      >
                        <PriceChangeText priceChange={item.price_change} />
                      </div>
                      <div
                        className={`td4 ${item.volume_change ? "danger" : "success"}`}
                      >
                        <h6>{formatNumberWithKM(item.volume, "$")}</h6>
                      </div>
                      <div className="td5">
                        <h6>{formatNumberWithKM(item.liquidity, "$")}</h6>
                      </div>
                      <div className="td6">
                        <h6>{formatNumberWithKM(item.market_cap, "$")}</h6>
                      </div>
                    </Box>
                  ));
                })}

                {data?.pages?.[0].data?.list?.length === 0 ? (
                  <NoCollectionSearched />
                ) : null}
                <Box ref={sentryRef}>
                  {isFetchingNextPage && !isLoading ? (
                    <Box>
                      {Array.from({ length: 10 }, (_, index) => index + 1).map(
                        (item) => (
                          <Skeleton
                            key={item}
                            sx={{
                              background: "#331f44",
                              borderRadius: 2,
                              height: 100,
                            }}
                          />
                        ),
                      )}
                    </Box>
                  ) : null}
                </Box>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CollectionsTable;
