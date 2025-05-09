import styles from "./collection-card.module.css";
import Checkbox from "@mui/material/Checkbox";
import HoverButton from "../HoverButton";
import RarityTag from "../rarity-tag/RarityTag";
import RarityCard from "../rarity-card/RarityCard";
import { Box, IconButton, Popover, Typography } from "@mui/material";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/router";
import Iconify from "@/components/iconify/iconify";
import { ChainIdByName } from "@/constants/chain";
import AvatarCard from "@/components/collections/avatar-card";
import { getTokenLogoURL } from "@/utils/token";
import ContentNotAvailable from "./ content-not-available";
import { ListingItem, buyNFT } from "@/services/sniper";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as bs58 from "bs58";
import { VersionedTransaction } from "@solana/web3.js";
import { toast } from "react-toastify";
import {
  sleep,
  txConfirmationCheck,
} from "@/views/trade/swap/sol/sol-token-card";
import axios from "axios";
import { IconLightning } from "@/components/icons";
interface CardProps {
  card: ListingItem;
  setIsBuying: Dispatch<SetStateAction<boolean>>;
  name?: string;
  rarity?: string | number;
  tokenPrice?: string | number;
  usdPrice?: string;
  img?: string;
  address?: string;
  tokenId?: string;
  isMyNFT?: boolean;
  chainId?: string | number;
  showCheckbox?: boolean;
  showPrice?: boolean;
  isMyWallet?: boolean;
  mediaType?: string;
  refetch: () => void;
}

export default function ListingCard({
  name,
  rarity,
  tokenPrice,
  usdPrice,
  img,
  address,
  tokenId,
  chainId,
  isMyNFT = false,
  showCheckbox,
  showPrice,
  mediaType = "image",
  isMyWallet = false,
  card,
  refetch,
  setIsBuying,
}: CardProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const { publicKey, wallet, signTransaction } = useWallet();
  const { connection } = useConnection();
  const videoRef = useRef<HTMLVideoElement>(null);
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const goDetail = () => {
    router.push(`/assets/${ChainIdByName?.[Number(chainId || 1)]}/${address}`);
  };
  const isVideo = useMemo(() => mediaType === "video", [mediaType]);

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

  const handleBuy = useCallback(async () => {
    if (!publicKey?.toString()) {
      // setModalVisible(true);
      return;
    }
    try {
      setIsBuying(true);
      const result = await buyNFT(
        publicKey?.toString(),
        card?.signature,
        card?.blocktime,
      );
      const swapTransaction = JSON.parse(result)?.tx;
      const swapTransactionBuf = bs58.decode(swapTransaction);
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
      const signedTransaction = await signTransaction?.(transaction);
      if (signedTransaction) {
        const { blockhash, lastValidBlockHeight } =
          await connection.getLatestBlockhash();
        const rawTransaction = signedTransaction?.serialize();
        const encodedTx = bs58.encode(rawTransaction);
        const jitoURL =
          "https://mainnet.block-engine.jito.wtf/api/v1/transactions";
        const payload = {
          jsonrpc: "2.0",
          id: 1,
          method: "sendTransaction",
          params: [encodedTx],
        };
        let txSig: string;
        try {
          const response = await axios.post(jitoURL, payload, {
            headers: { "Content-Type": "application/json" },
          });
          // setSwapLoading(false);
          // toast.success("Transaction confirmed.");
          // refetchAll();
          txSig = response.data.result;
        } catch (error) {
          console.error("Error:", error);
          throw new Error("Jito Bundle Error: cannot send.");
        }
        let currentBlockHeight = await connection.getBlockHeight(
          connection.commitment,
        );

        while (currentBlockHeight < lastValidBlockHeight) {
          // Keep resending to maximise the chance of confirmation
          await connection.sendRawTransaction(rawTransaction, {
            skipPreflight: true,
            preflightCommitment: connection.commitment,
            maxRetries: 0,
          });

          let status = await connection.getSignatureStatus(txSig);

          currentBlockHeight = await connection.getBlockHeight(
            connection.commitment,
          );

          if (status.value != null) {
            if (status.value.err != null) {
              throw new Error(`Transaction failed: ${status.value.err}`);
            }
            if (
              txConfirmationCheck(
                "confirmed",
                status?.value?.confirmationStatus || "",
              )
            ) {
              setIsBuying(false);
              refetch();
              toast.success("Transaction confirmed.");
              return txSig;
            }
          }
          await sleep(500);
        }
        toast.error("Transaction was not confirmed");
        throw Error(`Transaction ${txSig} was not confirmed`);
      }
    } catch (error: any) {
      console.log("error", error);
      console.log("error", error?.message);
      toast?.error(error?.message || "Transaction error.");
    } finally {
      setIsBuying(false);
    }
  }, [card, publicKey, signTransaction, setIsBuying, connection, refetch]);

  return (
    <div className={`tf-card-box style-4 ${styles.card}`} onClick={goDetail}>
      <div className={`card-media ${styles.cardMedia}`}>
        <Box
          className={styles.imgWrapper}
          sx={{
            "&::before": {
              backgroundColor: "#000 !important",
            },
          }}
        >
          {img ? (
            <Box
              component={isVideo ? "video" : "img"}
              src={`https://d3jhw9qabh9uvj.cloudfront.net/${card?.mint}_lg`}
              className={styles.img}
              ref={isVideo ? videoRef : undefined}
            />
          ) : (
            <ContentNotAvailable
              symbol={name || ""}
              chainId={Number(chainId) || 1}
              address={address || ""}
            />
          )}
          {tokenPrice ? (
            <Box
              className={styles.buyButton}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleBuy();
              }}
            >
              <div className="button-place-bid">
                <a
                  href="#"
                  className="tf-button"
                  style={{ backgroundColor: "#AF54FF" }}
                >
                  {publicKey?.toString() ? (
                    <>
                      {" "}
                      <IconLightning />
                      <span>buy</span>
                    </>
                  ) : (
                    <span> connect</span>
                  )}
                </a>
              </div>
            </Box>
          ) : null}
        </Box>
        {showCheckbox && (
          <div className={styles.cardCheckBox}>
            <div className="tw-relative">
              <Checkbox />
            </div>
          </div>
        )}
        {isVideo ? (
          <IconButton
            onClick={toggleVideoPlay}
            sx={{
              position: "absolute",
              right: 0,
              bottom: 0,
              width: 40,
              height: 40,
            }}
          >
            <Iconify
              icon={isPlaying ? "heroicons:stop-20-solid" : "solar:play-bold"}
              sx={{ color: "#fff" }}
            />
          </IconButton>
        ) : null}
      </div>
      <h5 className={styles.cardIntro}>
        <span
          style={{
            fontSize: 14,
            fontFamily: "Poppins",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "100%",
            overflow: "hidden",
          }}
          className={styles.name}
        >
          {name}
        </span>
        <div onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
          {rarity ? (
            <RarityTag
              aria-owns={open ? "mouse-over-popover" : undefined}
              rarity={rarity}
            />
          ) : null}
        </div>
      </h5>
      <div className="meta-info flex items-center justify-between">
        {tokenPrice ? (
          <div>
            <span className={styles.priceLabel}>PRICE</span>
            <h6 className="price gem">
              <div className={styles.priceContent}>
                <span className={styles.tokenPrice}>{tokenPrice}</span>
                {usdPrice && (
                  <span className={styles.usdPrice}>${usdPrice}</span>
                )}
                Sol
              </div>
            </h6>
          </div>
        ) : (
          <div>
            <span className={styles.priceLabel}>Unlisted</span>
          </div>
        )}
      </div>
    </div>
  );
}
