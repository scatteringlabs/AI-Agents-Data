import BidModal from "@/components/elements/BidModal";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Box, CircularProgress, Drawer, styled } from "@mui/material";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getCollectionAttr } from "@/services/collections";
import { useRouter } from "next/router";
import CollectionCard from "@/views/collect/collection-card/CollectionCard";
import { useIsPc } from "@/utils";
import { SelectedAttr } from "@/views/collect/traits-filter/TraitsFilter";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { fetchNFTList, fetchOrders } from "@/services/reservoir";
import NFTNotFound from "@/components/nft-not-found";
import { BaseSID } from "../launchpad/create/tokenService";
import { TokenEntity } from "@/services/graphql/all-token";
import LCollectionCardSkeleton from "./collection-card/LCollectionCardSkeleton";

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

export default function LMarket({ info }: { info?: TokenEntity }) {
  const [isBidModal, setBidModal] = useState(false);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const handleBidModal = () => setBidModal(!isBidModal);
  const router = useRouter();
  const isPc = useIsPc();
  const [rarityRange, setRarityRange] = useState({ down: 0, top: 0 });
  const [attrs, setAttrs] = useState<SelectedAttr[]>([]);

  const chainId = BaseSID;
  const collectionAddress = info?.addr;
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
      console.log(lastPage?.continuation);
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
  const skeletonCards = Array.from({ length: 4 }, (_, index) => index + 1).map(
    (item) => <LCollectionCardSkeleton key={item} />,
  );

  const cardContent = useMemo(() => {
    const len = itemsData?.pages.reduce((count, arr) => {
      return count + (arr?.tokens?.length || 0);
    }, 0);
    if (isLoading && !len) {
      return skeletonCards;
    }
    if (!len && !isLoading) {
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
            {group?.tokens?.map((card, carIdx) => (
              <div
                key={carIdx}
                data-wow-delay={`${carIdx % 3}s`}
                className='"wow fadeInUp fl-item-1 col-xl-3 col-lg-3 col-md-4 col-sm-4 col-4"'
                style={{ padding: "0 6px" }}
              >
                <CollectionCard
                  name={`${card?.token.name}`}
                  rarity={card?.token?.rarityRank}
                  tokenPrice={card?.market?.floorAsk?.price?.amount?.native}
                  img={card?.token?.image}
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
        <div
          ref={sentryRef}
          style={{ height: "1px", width: "100%", background: "#000" }}
        />
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
    transactionLoading,
  ]);

  return (
    <>
      <Box>
        <div className="artwork loadmore-12-item-1">
          <div className="row" style={{ margin: 0 }}>
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
    </>
  );
}
