import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import {
  fetchTokenAttributes,
  fetchTokenDetails,
  TokenDetails,
} from "@/services/reservoir";
import { chainIdToName, maskAddress } from "@/utils";
import RarityTag from "@/views/collect/rarity-tag/RarityTag";
import styles from "@/styles/nft-detail.module.css";
import { Box, IconButton, Typography } from "@mui/material";
import NftDetailSkeleton from "@/views/collect/NftDetailSkeleton";
import { formatAddress } from "@/utils/format";
import { SCAN_URL_ID } from "@/constants/url";
import Blockie from "@/components/blockie";
import { IconShare } from "@/components/icons";
import { useMemo, useRef, useState } from "react";
import SharePopover from "@/views/collect/SharePopover";
import { getImageUrl, getProperImageUrl } from "@/utils/image";
import Iconify from "@/components/iconify";
import { tokenIcons } from "@/constants/tokens";
import { ChainIdByName, ChainNameById } from "@/constants/chain";
import ContentNotAvailable from "@/views/collect/collection-card/ content-not-available";
import RarityCard from "@/views/collect/rarity-card/RarityCard";
import { getCollectionDetails } from "@/services/collections";

export default function NftDetail() {
  const router = useRouter();
  const { chainName, tokenId, collectionAddress } = router.query;

  const chainId = useMemo(
    () => ChainNameById?.[chainName?.toString() || ""],
    [chainName],
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["tokenDetails", collectionAddress, tokenId],
    queryFn: () =>
      fetchTokenDetails(
        collectionAddress?.toString() || "",
        tokenId?.toString() || "",
        chainId,
      ),
    enabled: Boolean(collectionAddress && tokenId),
  });
  const { data: attributes } = useQuery({
    queryKey: ["tokenAttributes", collectionAddress, tokenId],
    queryFn: () =>
      fetchTokenAttributes(
        collectionAddress?.toString() || "",
        tokenId?.toString() || "",
        chainId,
      ),
    enabled: Boolean(collectionAddress && tokenId),
  });
  console.log("attributes", attributes);

  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shareMenuEl, setShareMenuEl] = useState<HTMLElement | null>(null);
  const itemDetail = data?.tokens?.[0]?.token;
  const isVideo = false;
  const { data: collectionDetails, isLoading: detailsLoading } = useQuery({
    queryKey: ["getCollectionByAddress", { chainId, collectionAddress }],
    queryFn: () =>
      getCollectionDetails({
        chain_id: chainId?.toString(),
        token: collectionAddress?.toString() || "",
      }),
    enabled: Boolean(collectionAddress && chainId),
  });

  const shareBtnClick = (event: React.MouseEvent<HTMLElement>) => {
    setShareMenuEl(event.currentTarget);
  };
  const popoverClose = () => setShareMenuEl(null);

  const traits = useMemo(() => {
    return (
      attributes?.attributes?.map((attr) => ({
        label: attr.key,
        value: attr.value,
        percentage: attr.tokenCount / 100000,
      })) || []
    );
  }, [attributes]);
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
  console.log("itemDetail", itemDetail?.contract);

  if (isLoading) return <NftDetailSkeleton />;
  if (error || !data)
    return (
      <ContentNotAvailable
        symbol=""
        chainId={Number(chainId)}
        address={collectionAddress?.toString() || ""}
        size={300}
        fontSize={16}
      />
    );

  return (
    <>
      <div>
        <div className="tf-section-2 product-detail">
          <div className="themesflat-container">
            <div className="row">
              <div className="col-md-6">
                <div
                  className="wow fadeInLeft tf-card-box style-5"
                  style={{
                    height: "100%",
                    background: "rgba(255, 255, 255, 0.00)",
                    minHeight: 700,
                  }}
                >
                  <div className="card-media mb-0" style={{ height: "100%" }}>
                    {getImageUrl(data?.tokens?.[0]) ? (
                      <Box
                        component={isVideo ? "video" : "img"}
                        src={getImageUrl(data?.tokens?.[0])}
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
                    ) : (
                      <ContentNotAvailable
                        symbol={itemDetail?.name || ""}
                        chainId={Number(chainId) || 1}
                        address={itemDetail?.contract || ""}
                        size={300}
                        fontSize={16}
                      />
                    )}
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
                    {isVideo && (
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
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="wow fadeInRight infor-product">
                  {collectionDetails?.data?.item?.erc20_address ? (
                    <Link
                      href={`/collection/${ChainIdByName[Number(collectionDetails?.data?.item?.chain_id)]}/${collectionDetails?.data?.item?.erc20_address}/market`}
                    >
                      <Box
                        sx={{ fontSize: 16, color: "#AF54FF" }}
                        className="text"
                      >
                        {itemDetail?.collection?.name}
                      </Box>
                    </Link>
                  ) : null}

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
                    {/* <RarityTag rarity={itemDetail?.rarity} /> */}
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
                              ? `${SCAN_URL_ID[Number(chainId).toString()]}address/${itemDetail?.owner}`
                              : ""
                          }
                          target="_blank"
                        >
                          <span className="tf-color">
                            {formatAddress(itemDetail?.owner)}
                          </span>
                        </Link>
                      </h6>
                    </div>
                  </div>
                </div>
                <div
                  className={`wow fadeInRight product-item details ${styles.detailItem}`}
                >
                  <h6>Details</h6>
                  <div className="content">
                    <div className="details-item">
                      <span>Contract Address</span>
                      <Link
                        href={
                          chainId
                            ? `${SCAN_URL_ID[Number(chainId).toString()]}address/${itemDetail?.contract}`
                            : ""
                        }
                        target="_blank"
                      >
                        <span className="tf-color">
                          {maskAddress(itemDetail?.contract)}
                        </span>
                      </Link>
                    </div>
                    <div className="details-item">
                      <span>Token ID</span>
                      <Link
                        href={
                          chainId
                            ? `${SCAN_URL_ID[Number(chainId).toString()]}token/${itemDetail?.contract}?a=${itemDetail?.tokenId}`
                            : ""
                        }
                        target="_blank"
                      >
                        <span className="tf-color">
                          {maskAddress(itemDetail?.tokenId)}
                        </span>
                      </Link>
                    </div>
                    <div className="details-item">
                      <span>Token Standard</span>
                      <span style={{ textTransform: "uppercase" }}>
                        {itemDetail?.kind}
                      </span>
                    </div>
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
                  <RarityCard type="normal" traits={traits} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <SharePopover
          anchorEl={shareMenuEl}
          id="share-menu"
          onClose={popoverClose}
          name={itemDetail?.collection?.name}
        />
      </div>
    </>
  );
}
