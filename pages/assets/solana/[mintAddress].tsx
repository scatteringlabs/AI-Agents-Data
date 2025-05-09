import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { getItemDetail } from "@/services/collections";
import { chainIdToName, maskAddress } from "@/utils";
import RarityCard from "@/views/collect/rarity-card/RarityCard";
import styles from "@/styles/nft-detail.module.css";
import RarityTag from "@/views/collect/rarity-tag/RarityTag";
import { tokenIcons } from "@/constants/tokens";
import { Box, IconButton } from "@mui/material";
import NftDetailSkeleton from "@/views/collect/NftDetailSkeleton";
import { formatAddress } from "@/utils/format";
import { SCAN_URL_ID } from "@/constants/url";
import Blockie from "@/components/blockie";
import { IconShare } from "@/components/icons";
import { useMemo, useRef, useState } from "react";
import SharePopover from "@/views/collect/SharePopover";
import { ItemDetail } from "@/types/collection";
import { getProperImageUrl, replaceImageUrl } from "@/utils/image";
import Iconify from "@/components/iconify";
import { ChainNameById } from "@/constants/chain";
import Head from "next/head";
import ContentNotAvailable from "@/views/collect/collection-card/ content-not-available";
import AvatarCard from "@/components/collections/avatar-card";
import {
  fetchCollectionNameAndImage,
  fetchNFTDetails,
} from "@/services/sniper";
import { GetServerSideProps } from "next";

const STANDARD_MAP: Record<number, string> = {
  0: "ERC-721",
  1: "ERC-404",
  2: "ERC1155",
};
const CHAIN_MAP: Record<string, string> = {
  ETH_MAINNET: "Ethereum",
  ARB_MAINNET: "Arbitrum",
  BASE_MAINNET: "Base",
};

const getStandard = (tokenType?: number) => {
  if (tokenType === undefined) return "--";
  return STANDARD_MAP[tokenType];
};

const chainId = 10000;
const isVideo = false;
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { mintAddress } = context.query;

  if (!mintAddress) {
    return {
      notFound: true,
    };
  }

  const itemDetail = await fetchNFTDetails(mintAddress.toString());
  const collectionDetail = await fetchCollectionNameAndImage(
    itemDetail?.symbol || "",
  );

  return {
    props: {
      itemDetail,
      collectionDetail,
    },
  };
};

export default function SolNftDetail({
  itemDetail,
  collectionDetail,
}: {
  itemDetail: any;
  collectionDetail: any;
}) {
  // const router = useRouter();
  // const { mintAddress } = router.query;
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // const {
  //   data: itemDetail,
  //   isLoading,
  //   error,
  // } = useQuery({
  //   queryKey: [
  //     "itemDetail",
  //     {
  //       mintAddress,
  //     },
  //   ],
  //   queryFn: () => fetchNFTDetails(mintAddress?.toString() || ""),
  //   enabled: Boolean(mintAddress),
  // });
  // const { data: collectionDetail } = useQuery({
  //   queryKey: [
  //     "itemDetail",
  //     {
  //       itemDetail,
  //     },
  //   ],
  //   queryFn: () => fetchCollectionNameAndImage(itemDetail?.symbol || ""),
  //   enabled: Boolean(itemDetail?.symbol),
  // });

  const [shareMenuEl, setShareMenuEl] = useState<HTMLElement | null>(null);

  const shareBtnClick = (event: React.MouseEvent<HTMLElement>) => {
    setShareMenuEl(event.currentTarget);
  };
  const popoverClose = () => {
    setShareMenuEl(null);
  };
  const toggleVideoPlay = (event: any) => {
    event?.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  if (!itemDetail) {
    return <NftDetailSkeleton />;
  }

  return (
    <>
      <Head>
        <title>{itemDetail?.name}</title>
        <meta content={itemDetail?.image} key="og:image" property="og:image" />
        <meta
          content={itemDetail?.image}
          key="twitter:image:src"
          name="twitter:image:src"
        />
        <meta name="twitter:image:alt" content={itemDetail?.symbol} />
      </Head>
      <div>
        <div className="tf-section-2 product-detail">
          <div className="themesflat-container">
            <div className="row">
              <div className="col-md-6">
                <div
                  style={{
                    height: "100%",
                    background: "rgba(255, 255, 255, 0.00)",
                    minHeight: 700,
                  }}
                  data-wow-delay="0s"
                  className="wow fadeInLeft tf-card-box style-5"
                >
                  <div style={{ height: "100%" }} className="card-media mb-0">
                    <Box
                      component={"img"}
                      src={itemDetail?.image}
                      className={styles.img}
                      ref={isVideo ? videoRef : undefined}
                      sx={{
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                        minHeight: 700,
                        borderRadius: "20px",
                      }}
                    />
                    <Box
                      component="img"
                      sx={{
                        width: "40px !important",
                        height: "40px !important",
                        borderRadius: "50%",
                        right: 20,
                        top: 20,
                        position: "absolute",
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                      }}
                      src={chainId ? tokenIcons[chainId.toString()] : ""}
                    />
                    {isVideo ? (
                      <IconButton
                        onClick={toggleVideoPlay}
                        sx={{
                          position: "absolute",
                          right: 10,
                          bottom: 10,
                          width: 50,
                          height: 50,
                        }}
                      >
                        <Iconify
                          icon={
                            isPlaying
                              ? "heroicons:stop-20-solid"
                              : "solar:play-bold"
                          }
                          sx={{ color: "#fff", width: 50, height: 50 }}
                        />
                      </IconButton>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div
                  data-wow-delay="0s"
                  className="wow fadeInRight infor-product"
                >
                  <Link href={`/collection/sol/${itemDetail?.symbol}/market`}>
                    <Box
                      sx={{ fontSize: 16, color: "#AF54FF" }}
                      className="text"
                    >
                      {collectionDetail?.name}
                    </Box>
                  </Link>
                  <div
                    className="menu_card"
                    style={{ cursor: "pointer", zIndex: "1 !important" }}
                    onClick={shareBtnClick}
                  >
                    <IconShare aria-describedby="share-menu" />
                  </div>
                  <div className={styles.title}>
                    <h2 className={styles.name}>
                      {maskAddress(itemDetail?.name)}
                    </h2>
                    {/* <RarityTag rarity={itemDetail?.traits} /> */}
                  </div>
                  <div className="author flex items-center mb-30">
                    <div className="avatar">
                      <Blockie address={itemDetail?.owner} />
                    </div>
                    <div className="info">
                      <span>Owned by:</span>
                      <h6>
                        <Link
                          href={
                            chainId
                              ? `${SCAN_URL_ID[Number(chainId)?.toString()]}address/${itemDetail?.owner}`
                              : ""
                          }
                          target="_blank"
                        >
                          <span className="tf-color">
                            {formatAddress(itemDetail?.owner)}
                          </span>
                        </Link>{" "}
                      </h6>
                    </div>
                  </div>
                </div>
                <div
                  data-wow-delay="0s"
                  className={`wow fadeInRight product-item details ${styles.detailItem}`}
                >
                  <h6>
                    <i className="icon-description" />
                    Details
                  </h6>
                  <div className="content">
                    <div className="details-item">
                      <span>Mint Address</span>
                      <Link
                        href={
                          chainId
                            ? `${SCAN_URL_ID[Number(chainId)?.toString()]}address/${itemDetail?.mintAddress}`
                            : ""
                        }
                        target="_blank"
                      >
                        <span className="tf-color">
                          {maskAddress(itemDetail?.mintAddress)}
                        </span>
                      </Link>
                    </div>

                    {/* <div className="details-item">
                      <span>Token Standard</span>
                      <span>{itemDetail?.token2022Standard}</span>
                    </div> */}
                    <div className="details-item">
                      <span>Chain</span>
                      <span>{chainIdToName(chainId?.toString())}</span>
                    </div>
                  </div>
                </div>
                <div
                  data-wow-delay="0s"
                  className={`wow fadeInRight product-item traits ${styles.detailItem}`}
                >
                  <h6>
                    <i className="icon-description" />
                    Traits
                  </h6>
                  <RarityCard
                    type="normal"
                    traits={itemDetail?.traits?.map((item: any) => ({
                      percentage: (item.rarity / 100)?.toString(),
                      label: item.trait_type,
                      value: item.value?.toString(),
                      type: "item.trait_type",
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <SharePopover
          anchorEl={shareMenuEl}
          id="share-menu"
          onClose={popoverClose}
          name={itemDetail?.name}
        />
      </div>
    </>
  );
}
