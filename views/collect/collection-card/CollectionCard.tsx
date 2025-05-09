import styles from "./collection-card.module.css";
import Checkbox from "@mui/material/Checkbox";
import HoverButton from "../HoverButton";
import RarityTag from "../rarity-tag/RarityTag";
import RarityCard from "../rarity-card/RarityCard";
import { Box, IconButton, Popover, Typography } from "@mui/material";
import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import Iconify from "@/components/iconify/iconify";
import { ChainIdByName } from "@/constants/chain";
import AvatarCard from "@/components/collections/avatar-card";
import { getTokenLogoURL } from "@/utils/token";
import ContentNotAvailable from "./ content-not-available";
import { IconLightning } from "@/components/icons";
import { useBalance } from "wagmi";
import {
  getClient,
  Execute,
  createClient,
  reservoirChains,
} from "@reservoir0x/reservoir-sdk";
import { createWalletClient, custom } from "viem";
import { formatWeiFixed } from "@/utils/format";
import { toast } from "react-toastify";
import { mainnet, arbitrum, base } from "viem/chains";
import { useEthersSigner } from "@/hooks/use-evm-signer";
import { ethers } from "ethers";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { usePrivy, useWallets } from "@privy-io/react-auth";

interface CardProps {
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
  setTransactionLoading?: any;
}

export default function CollectionCard({
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
  setTransactionLoading,
}: CardProps) {
  const { openConnectModal } = useConnectModal();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const { wallets } = useWallets();
  const wallet = useMemo(() => wallets?.[0], [wallets]);

  const { user, login } = usePrivy();
  const userAddress = useMemo(() => user?.wallet?.address, [user]);
  const currentChainId = useMemo(
    () => wallet?.chainId?.split(":")?.[1],
    [wallet],
  );
  // const { data: walletClient } = useWalletClient();
  const videoRef = useRef<HTMLVideoElement>(null);
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const goDetail = () => {
    router.push(
      `/assets/${ChainIdByName?.[Number(chainId || 1)]}/${address}/${tokenId}`,
    );
  };
  const isVideo = useMemo(() => mediaType === "video", [mediaType]);
  const ethBalance = useBalance({
    address: userAddress as `0x${string}`,
    chainId: Number(chainId),
  });
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
    try {
      setTransactionLoading?.(true);
      if (!userAddress) {
        // toast.warn("Please connect your wallet.");
        openConnectModal?.();
        return;
      }

      const requiredChainId = Number(chainId);
      let chainConfig;

      switch (requiredChainId) {
        case mainnet.id:
          chainConfig = mainnet;
          break;
        case arbitrum.id:
          chainConfig = arbitrum;
          break;
        case base.id:
          chainConfig = base;
          break;
        default:
          toast.error("Unsupported network.");
          return;
      }

      if (Number(requiredChainId) !== Number(currentChainId)) {
        toast.warn("Please switch to the correct network.");
        await wallet.switchChain(`0x${requiredChainId?.toString(16)}`);
      }

      const ethBalanceFormatted = formatWeiFixed(
        ethBalance?.data?.value.toString() || "0",
        18,
      );
      if (Number(ethBalanceFormatted) < Number(tokenPrice)) {
        toast.warn("Insufficient balance.");
        return;
      }
      const reservoirChainMap = {
        [mainnet.id]: reservoirChains.mainnet,
        [base.id]: reservoirChains.base,
        [arbitrum.id]: reservoirChains.arbitrum,
      };
      const reservoirClient = createClient({
        chains: [
          {
            // @ts-ignore
            ...reservoirChainMap?.[chainId],
            active: true,
          },
        ],
        apiKey: "3f0b87ea-73b5-56e1-b1d4-d40bc7c11dcd",
      });
      const provider = await wallet?.getEthersProvider();
      const signer = provider?.getSigner();
      await reservoirClient.actions
        .buyToken({
          items: [
            {
              token: `${address}:${tokenId}`,
              quantity: 1,
            },
          ],
          //@ts-ignore
          wallet: signer,
          onProgress: (steps: Execute["steps"]) => {
            if (!steps) {
              return;
            }
            steps.forEach((step) => {
              if (step.error) {
                // toast.error("error");
                return;
              }
            });
          },
        })
        .then(() => {
          toast.success("Success");
        })
        .catch((error: Error) => {
          if (error.message?.includes("User rejected the request")) {
            toast.error("User rejected the request");
            return;
          }
          if (error.message?.includes("The current chain of the wallet")) {
            toast.error("User rejected the request");
            return;
          }
          toast.error(`Error: ${error.message}`);
        });

      // toast.success("NFT purchase successful!");
    } catch (error: any) {
      console.error("Buy token error", error);
      // toast.error(`Error: ${error.message || "An unknown error occurred."}`);
    } finally {
      setTransactionLoading?.(false);
    }
  }, [
    userAddress,
    tokenId,
    address,
    chainId,
    ethBalance,
    tokenPrice,
    currentChainId,
    setTransactionLoading,
    wallet,
    openConnectModal,
  ]);

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
              src={img}
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
          {/* {isMyNFT ? null : (
            <Box className={styles.buyButton}>
              <HoverButton type={isMyWallet ? "sell" : "buy"} />
            </div>
          )} */}
          {/* {tokenPrice ? (
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
                  {userAddress ? (
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
          ) : null} */}
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
            fontSize: 12,
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
        <div
        // onMouseEnter={handlePopoverOpen}
        // onMouseLeave={handlePopoverClose}
        >
          {rarity ? (
            <RarityTag
              aria-owns={open ? "mouse-over-popover" : undefined}
              rarity={rarity}
            />
          ) : null}
        </div>
      </h5>
      {isMyNFT || !showPrice ? null : (
        <div className="meta-info flex items-center justify-between">
          <div>
            <span className={styles.priceLabel}>PRICE</span>
            <h6 className="price gem">
              <div className={styles.priceContent}>
                <span className={styles.tokenPrice}>{tokenPrice} ETH</span>
                {usdPrice && (
                  <span className={styles.usdPrice}>${usdPrice}</span>
                )}
              </div>
            </h6>
          </div>
        </div>
      )}
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: "none",
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableScrollLock
        slotProps={{ paper: { sx: { backgroundColor: "transparent" } } }}
      >
        <RarityCard
          type="popover"
          address={address}
          tokenId={tokenId}
          chainId={chainId}
        />
      </Popover>
    </div>
  );
}
