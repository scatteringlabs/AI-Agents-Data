import BidModal from "@/components/elements/BidModal";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import CollectionInfo from "@/views/collect/CollectionInfo";
import Tabs from "@/components/tabs/Tabs";
import CollectionFilter from "@/views/collect/CollectionFilter";
import { Box, Drawer, styled } from "@mui/material";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getCollectionByAddress } from "@/services/collections";
import { useRouter } from "next/router";
import CollectionCard from "@/views/collect/collection-card/CollectionCard";
import FilterPanel, { Filters } from "@/views/collect/filter-panel/FilterPanel";
import { useIsPc } from "@/utils";
import { SelectedAttr } from "@/views/collect/traits-filter/TraitsFilter";
import CollectionCardSkeleton from "@/views/collect/collection-card/CollectionCardSkeleton";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useAccount } from "wagmi";
import NFTNotFound from "@/components/nft-not-found";

import { fetchListings } from "@/services/sniper";
import ListingCard from "@/views/collect/collection-card/ListiingCard";
import { convertToNestedTraitFormat, fetchFloorTraits } from "@/services/trait";
import Preloader from "@/components/elements/Preloader";

export const ButtonWrapper = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(143deg, #8e2ce3 -4.18%, #4b00df 92.28%);
  border-radius: 40px;
  text-align: center;
  color: #fff;
  font-family: Poppins;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  cursor: pointer;
  font-weight: bold;
  margin-left: 10px;
`;
const isMyWallet = false;
const convertAttrsToQueryParam = (attributes: any[]): string => {
  const traitsObject: { [key: string]: string[] } = {};

  attributes.forEach((attr) => {
    traitsObject[attr.label] = attr.values;
  });

  const jsonString = JSON.stringify(traitsObject);
  return encodeURIComponent(jsonString);
};
export default function SolMarket({ activeTab }: { activeTab: string }) {
  const [isBidModal, setBidModal] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const handleBidModal = () => setBidModal(!isBidModal);
  const router = useRouter();
  const isPc = useIsPc();

  const [rarityRange, setRarityRange] = useState({ down: 0, top: 0 });
  const [attrs, setAttrs] = useState<SelectedAttr[]>([]);
  const rarityQueryParam = useMemo(
    () => convertAttrsToQueryParam(attrs),
    [attrs],
  );

  const filterChange = (filters: Filters) => {
    const { rarityDown = 0, rarityTop = 0, attrs = [] } = filters;
    setRarityRange({ down: rarityDown, top: rarityTop });
    setAttrs(attrs);
  };
  const { chain, tokenAddress } = router.query;
  const { data: collectionDetails, isLoading: detailsLoading } = useQuery({
    queryKey: ["getCollectionByAddress", { chain, tokenAddress }],
    queryFn: () =>
      getCollectionByAddress({
        chain_name: chain?.toString() || "",
        token: tokenAddress?.toString() || "",
      }),
    enabled: Boolean(tokenAddress && chain),
  });

  const slug = useMemo(
    () => collectionDetails?.data?.item?.slug || "",
    [collectionDetails],
  );
  const chainId = useMemo(
    () => collectionDetails?.data?.item?.chain_id,
    [collectionDetails],
  );
  const collectionAddress = useMemo(
    () => collectionDetails?.data?.item?.erc721_address,
    [collectionDetails],
  );

  const { data } = useQuery({
    queryKey: [
      "collectionAttr",
      {
        collectionAddress,
        chainId,
      },
    ],
    queryFn: () => fetchFloorTraits(slug?.toString()),
    enabled: Boolean(slug),
  });
  const traitData = useMemo(
    () => ({
      data: {
        list: convertToNestedTraitFormat(data),
      },
    }),
    [data],
  );

  const {
    data: itemsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: [
      "items",
      {
        slug,
        rarityQueryParam,
        // attrs,
        // rarityRange,
      },
    ],
    queryFn: ({ pageParam = "" }) => {
      return fetchListings(
        slug?.toString(),
        pageParam?.toString(),
        rarityQueryParam,
      );
    },
    initialPageParam: "",
    getNextPageParam: (lastPage) => {
      return lastPage?.lastToken ?? undefined;
    },
    enabled: Boolean(chainId && collectionAddress && slug),
  });
  useEffect(() => {
    refetch();
  }, [rarityQueryParam, refetch]);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isShowPcMenu, setIsShowPcMenu] = useState(true);
  const pcMenuVisible = useMemo(() => {
    return isPc && isShowPcMenu;
  }, [isPc, isShowPcMenu]);

  // const handleFilterClick = useCallback(() => {
  //   if (!isPc) {
  //     setIsOpenDrawer(true);
  //     return;
  //   }
  //   setIsShowPcMenu(!isShowPcMenu);
  // }, [isPc, isShowPcMenu]);

  const [sentryRef] = useInfiniteScroll({
    loading: isFetchingNextPage,
    hasNextPage,
    onLoadMore: fetchNextPage,
    disabled: isError,
    rootMargin: "0px 0px 100px 0px",
  });
  const skeletonCards = Array.from({ length: 6 }, (_, index) => index + 1).map(
    (item) => <CollectionCardSkeleton key={item} />,
  );

  const cardContent = useMemo(() => {
    const len = itemsData?.pages.reduce((count, arr) => {
      return count + (arr?.result?.length || 0);
    }, 0);
    if ((isLoading || detailsLoading) && !len) {
      return skeletonCards;
    }
    if ((!len && !isLoading && !detailsLoading) || isMyWallet) {
      return (
        <Box sx={{ mx: "auto", py: "100px" }}>
          <NFTNotFound needAddress={false} />
        </Box>
      );
    }
    return (
      <>
        {itemsData?.pages.map((group, idx) => (
          <Fragment key={idx}>
            {group.result?.map((card, carIdx) => (
              <div
                key={carIdx}
                data-wow-delay={`${carIdx % 3}s`}
                className="wow fadeInUp fl-item-1 col-xl-2 col-lg-3 col-md-4 col-sm-6 col-6"
                style={{ padding: "0 6px" }}
              >
                <ListingCard
                  card={card}
                  refetch={refetch}
                  setIsBuying={setIsBuying}
                  name={card.name}
                  rarity={card.ssRarityRank}
                  tokenPrice={card.listingPrice}
                  img={card.image}
                  address={card.mint}
                  tokenId={"tokenId"}
                  chainId={10000}
                  showPrice={false}
                  isMyWallet={isMyWallet}
                  mediaType="image"
                />
              </div>
            ))}
          </Fragment>
        ))}
        <div ref={sentryRef} />
        {isFetchingNextPage || hasNextPage ? skeletonCards : null}
      </>
    );
  }, [
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    itemsData?.pages,
    sentryRef,
    skeletonCards,
    detailsLoading,
    refetch,
  ]);

  return (
    <Box
      sx={{
        opacity: activeTab === "market" ? 1 : 0,
        height: activeTab === "market" ? "100%" : "0px",
        overflow: activeTab === "market" ? "unset" : "hidden",
      }}
    >
      <Box>
        <div className="artwork loadmore-12-item-1">
          <div className="row" style={{ margin: 0 }}>
            {pcMenuVisible && (
              <Box className="col-md-2" sx={{ pl: "0 !important" }}>
                <Box sx={{ position: "sticky", top: "170px" }}>
                  <FilterPanel
                    onChange={filterChange}
                    data={traitData}
                    collectionAddress={
                      collectionDetails?.data?.item?.erc721_address || ""
                    }
                    chainId={collectionDetails?.data?.item?.chain_id || 1}
                    totalSupply={Number(
                      collectionDetails?.data?.item?.total_supply,
                    )}
                    showRankFilter={false}
                  />
                </Box>
              </Box>
            )}
            <div
              className={`col-md-${pcMenuVisible && traitData?.data?.list?.length ? "10" : "12"}`}
              style={{ paddingLeft: "10px", paddingRight: "9px" }}
            >
              <div className="row">{cardContent}</div>
            </div>
            {isBuying ? (
              <Box
                sx={{
                  position: "fixed",
                  left: 0,
                  top: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0.5,
                  zIndex: 999,
                }}
              >
                <Preloader />
              </Box>
            ) : null}
          </div>
        </div>
      </Box>
      <BidModal handleBidModal={handleBidModal} isBidModal={isBidModal} />
      <Drawer
        anchor="bottom"
        open={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
        PaperProps={{ sx: { backgroundColor: "#010410", padding: "20px" } }}
      >
        <FilterPanel
          onChange={filterChange}
          data={traitData}
          collectionAddress={
            collectionDetails?.data?.item?.erc721_address || ""
          }
          chainId={collectionDetails?.data?.item?.chain_id || 1}
          totalSupply={Number(collectionDetails?.data?.item?.total_supply)}
          showRankFilter={false}
        />
      </Drawer>
    </Box>
  );
}
