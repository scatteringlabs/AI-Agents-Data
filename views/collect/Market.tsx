import BidModal from "@/components/elements/BidModal";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Box, CircularProgress, Drawer, styled } from "@mui/material";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  GetCollectionsItems,
  getCollectionAttr,
  getCollectionByAddress,
  getCollectionBySlug,
  getCollectionsItems,
} from "@/services/collections";
import { useRouter } from "next/router";
import CollectionCard from "@/views/collect/collection-card/CollectionCard";
import FilterPanel, { Filters } from "@/views/collect/filter-panel/FilterPanel";
import { useIsPc } from "@/utils";
import { SelectedAttr } from "@/views/collect/traits-filter/TraitsFilter";
import CollectionCardSkeleton from "@/views/collect/collection-card/CollectionCardSkeleton";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useAccount } from "wagmi";
import { getProperImageUrl } from "@/utils/image";
import { fetchNFTList, fetchOrders } from "@/services/reservoir";
import NFTNotFound from "@/components/nft-not-found";
import LoadingCard from "../home/LoadingCard";

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
const activeTab = "Market";
const isMyWallet = false;

export default function Market({
  islug,
  preview,
}: {
  islug?: string;
  preview?: File | null;
}) {
  const [isBidModal, setBidModal] = useState(false);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const handleBidModal = () => setBidModal(!isBidModal);
  const router = useRouter();
  const isPc = useIsPc();
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
  const [rarityRange, setRarityRange] = useState({ down: 0, top: 0 });
  const [attrs, setAttrs] = useState<SelectedAttr[]>([]);
  const filterChange = (filters: Filters) => {
    const { rarityDown = 0, rarityTop = 0, attrs = [] } = filters;
    setRarityRange({ down: rarityDown, top: rarityTop });
    setAttrs(attrs);
  };
  // const { data: collectionDetails, isLoading: detailsLoading } = useQuery({
  //   queryKey: ["getCollectionBySlug", { slug }],
  //   queryFn: () =>
  //     getCollectionBySlug({
  //       slug: slug?.toString(),
  //     }),
  //   enabled: Boolean(slug),
  // });

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
    queryFn: () =>
      getCollectionAttr({
        chainId: Number(chainId),
        address: collectionAddress?.toString(),
      }),
    enabled: Boolean(collectionAddress && chainId !== undefined),
  });

  const {
    data: itemsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["nft", { chainId, collectionAddress, attrs, rarityRange }],
    queryFn: ({ pageParam = "" }) => {
      return fetchNFTList({
        continuation: pageParam,
        chainId,
        collection: collectionAddress,
        sortBy: "floorAskPrice",
        sortDirection: "asc",
        includeDynamicPricing: true,
        includeQuantity: true,
        includeLastSale: true,
        normalizeRoyalties: false,
      });
    },
    initialPageParam: "",
    getNextPageParam: (lastPage) => {
      return lastPage?.continuation || undefined;
    },
    enabled: Boolean(chainId && collectionAddress),
  });

  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isShowPcMenu, setIsShowPcMenu] = useState(true);
  const pcMenuVisible = useMemo(() => {
    return false;
    // return isPc && isShowPcMenu && activeTab === "Market";
  }, []);

  const handleFilterClick = useCallback(() => {
    if (!isPc) {
      setIsOpenDrawer(true);
      return;
    }
    setIsShowPcMenu(!isShowPcMenu);
  }, [isPc, isShowPcMenu]);

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
      return count + (arr?.tokens?.length || 0);
    }, 0);
    if ((isLoading || detailsLoading) && !len) {
      return skeletonCards;
    }
    if (!len && !isLoading && !detailsLoading) {
      return (
        <Box sx={{ mx: "auto", py: "100px" }}>
          <NFTNotFound
            needAddress={false}
            title={
              collectionDetails?.data?.item?.collection_type?.name ===
                "ERC20i" ||
              collectionDetails?.data?.item?.collection_type?.name === "ERC11"
                ? "Coming Soon"
                : ""
            }
          />
        </Box>
      );
    }
    return (
      <>
        {itemsData?.pages.map((group, idx) => (
          <Fragment key={idx}>
            {group?.tokens?.map((card, carIdx) => (
              <div
                key={carIdx}
                data-wow-delay={`${carIdx % 3}s`}
                className={
                  preview
                    ? "wow fadeInUp fl-item-1 col-xl-3 col-lg-3 col-md-4 col-sm-4 col-4"
                    : "wow fadeInUp fl-item-1 col-xl-2 col-lg-3 col-md-4 col-sm-6 col-6"
                }
                style={{ padding: "0 6px" }}
              >
                <CollectionCard
                  name={
                    preview
                      ? `preview #${carIdx + 1}`
                      : `${card?.token?.name || collectionDetails?.data?.item?.symbol + " #" + card?.token?.tokenId}`
                  }
                  // name={`${collectionDetails?.data?.item?.symbol} #${card?.token?.tokenId}`}
                  rarity={card?.token?.rarityRank}
                  tokenPrice={card?.market?.floorAsk?.price?.amount?.native}
                  img={
                    preview ? URL.createObjectURL(preview) : card?.token?.image
                  }
                  address={card?.token?.contract}
                  tokenId={card?.token?.tokenId}
                  chainId={card?.token?.chainId}
                  setTransactionLoading={setTransactionLoading}
                  showPrice={Boolean(
                    card?.market?.floorAsk?.price?.amount?.native,
                  )}
                  isMyWallet={isMyWallet}
                  mediaType="image"
                />
              </div>
            ))}
          </Fragment>
        ))}
        <div ref={sentryRef} />
        {transactionLoading ? (
          <Box
            sx={{
              position: "fixed",
              width: "100vw",
              height: "100vh",
              left: 0,
              top: 0,
              zIndex: 999,
              background: "#000",
              opacity: 0.5,
              backdropFilter: "blur(24px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress sx={{ color: "rgb(175, 84, 255)" }} />
          </Box>
        ) : null}
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
    collectionDetails,
    transactionLoading,
    preview,
  ]);

  return (
    <>
      <Box>
        <div className="artwork loadmore-12-item-1">
          <div className="row" style={{ margin: 0 }}>
            {pcMenuVisible && (
              <Box className="col-md-2" sx={{ pl: "0 !important" }}>
                <Box sx={{ position: "sticky", top: "170px" }}>
                  <FilterPanel
                    onChange={filterChange}
                    data={data}
                    collectionAddress={
                      collectionDetails?.data?.item?.erc721_address || ""
                    }
                    chainId={collectionDetails?.data?.item?.chain_id || 1}
                    totalSupply={Number(
                      collectionDetails?.data?.item?.total_supply,
                    )}
                  />
                </Box>
              </Box>
            )}
            <div
              className={`col-md-${pcMenuVisible && data?.data?.list?.length ? "10" : "12"}`}
              style={{ paddingLeft: "10px", paddingRight: "9px" }}
            >
              <div className="row">{cardContent}</div>
            </div>
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
          data={data}
          collectionAddress={
            collectionDetails?.data?.item?.erc721_address || ""
          }
          chainId={collectionDetails?.data?.item?.chain_id || 1}
          totalSupply={Number(collectionDetails?.data?.item?.total_supply)}
        />
      </Drawer>
    </>
  );
}
