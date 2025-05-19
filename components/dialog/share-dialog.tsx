import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Typography,
  Stack,
  ListItemButton,
  IconButton,
  styled,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { toPng } from "html-to-image";
import download from "downloadjs";
import { getTokenLogoURLWithoutCrop } from "@/utils/token";
import { CollectionDetails } from "@/types/collection";
import { tokenIcons } from "@/constants/tokens";
import Link from "next/link";
import Iconify from "../iconify";
import { useCopyToClipboard } from "react-use";
import MarketCard, { NameText } from "./market-card";
import TradeCard from "./trade-card";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

type ShareDialogProps = {
  open: boolean;
  onClose: () => void;
  collectionDetails?: CollectionDetails;
};

const BoxButton = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 4px 20px;
  color: #b054ff;
  border-radius: 10px;
  border: 1px solid #b054ff;
  font-family: Poppins;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
`;

const ShareDialog: React.FC<ShareDialogProps> = ({
  open,
  onClose,
  collectionDetails,
}) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [fullUrl, setFullUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [copyState, copyToClipboard] = useCopyToClipboard();
  const [value, setValue] = useState("trade");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };
  // useEffect(() => {
  //   if (copyState.value) {
  //     toast.success("Copied to clipboard");
  //   }
  // }, [copyState]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setFullUrl(window.location.href);
    }
  }, []);
  // const copyLink = () => {
  //   if (typeof window !== "undefined") {
  //     // setFullUrl(window.location.href);
  //     copyToClipboard(window.location.href);
  //   }
  // };

  useEffect(() => {
    const imageUrl = getTokenLogoURLWithoutCrop({
      chainId: collectionDetails?.chain_id || 1,
      address: collectionDetails?.erc20_address,
    });

    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageBase64(reader.result as string);
        };
        reader.readAsDataURL(blob);
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
      });
  }, [collectionDetails]);

  // 添加图片预加载状态检查
  const checkImagesLoaded = async () => {
    if (!dialogRef.current) return;
    const images = dialogRef.current.getElementsByTagName("img");
    const imagePromises = Array.from(images).map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) {
            resolve(null);
          } else {
            img.onload = () => resolve(null);
            img.onerror = () => resolve(null); // 即使加载失败也继续
          }
        }),
    );
    await Promise.all(imagePromises);
  };

  const copyImageToClipboard = async () => {
    if (dialogRef.current) {
      try {
        setIsLoading(true);
        await checkImagesLoaded();
        const dataUrl = await toPng(dialogRef.current!, {
          quality: 1.0,
          pixelRatio: 2,
          skipAutoScale: true,
          skipFonts: true,
          filter: (node) => {
            const className = node.className || "";
            return !className.includes("MuiBox-root");
          },
        });
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const clipboardItem = new ClipboardItem({ [blob.type]: blob });

        await navigator.clipboard.write([clipboardItem]);
        toast.success("Image copied to clipboard");
      } catch (error) {
        console.error("Error converting dialog content to image:", error);
        toast.error("Failed to copy image to clipboard");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSaveImage = () => {
    if (dialogRef.current) {
      setIsLoading(true);
      checkImagesLoaded()
        .then(() => {
          return toPng(dialogRef.current!, {
            quality: 1.0,
            pixelRatio: 2,
            skipAutoScale: true,
            skipFonts: true,
            filter: (node) => {
              const className = node.className || "";
              return !className.includes("MuiBox-root");
            },
          });
        })
        .then((dataUrl) => {
          download(dataUrl, "share-content.png");
        })
        .catch((error) => {
          console.error("Error converting dialog content to image:", error);
          toast.error("Failed to save image");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        ".MuiDialog-container": {
          width: "100%",
          ".MuiPaper-root": {
            background: "transparent",
            width: "100%",
            minWidth: { md: "946px", xs: "100vw" },
          },
        },
      }}
      slotProps={{
        backdrop: {
          style: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          },
        },
      }}
    >
      <DialogContent
        sx={{
          position: "relative",
          p: 0,
          width: "100%",
        }}
      >
        {isLoading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <Box
          sx={{
            background: "#09051A",
            mb: 1,
            display: "flex",
            justifyContent: "space-between",
            position: "relative",
            alignItems: "center",
            zIndex: 1,
            py: { md: 2, xs: 0 },
            borderRadius: "10px",
          }}
        >
          <NameText sx={{ color: "#fff", fontSize: { md: 20, xs: 14 }, pl: 2 }}>
            Share Collection Stats
          </NameText>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: "#fff",
              mr: 2,
            }}
          >
            <Iconify
              icon="iconamoon:close"
              sx={{ width: 30, height: 30 }}
              color="#fff"
            />
          </IconButton>
        </Box>
        <TradeCard
          dialogRef={dialogRef}
          collectionDetails={collectionDetails}
        />
        <Box
          sx={{
            background: "#09051A",
            mt: 1,
            display: "flex",
            justifyContent: "space-between",
            position: "relative",
            flexDirection: { md: "row", xs: "column" },
            zIndex: 1,
            py: 2,
            px: 4,
            borderRadius: "10px",
          }}
        >
          <BoxButton
            sx={{
              width: { md: "30%", xs: "100%" },
              mb: { md: 0, xs: 1 },
              fontSize: { md: 16, xs: 12 },
            }}
            onClick={handleSaveImage}
          >
            <IconButton>
              <Iconify icon="game-icons:save-arrow" color="#b054ff" />
            </IconButton>
            Save as Image
          </BoxButton>
          <BoxButton
            sx={{
              width: { md: "30%", xs: "100%" },
              mb: { md: 0, xs: 1 },
              fontSize: { md: 16, xs: 12 },
            }}
            onClick={copyImageToClipboard}
          >
            <IconButton>
              <Iconify icon="ph:copy" color="#b054ff" />
            </IconButton>
            Copy Image
          </BoxButton>{" "}
          <BoxButton
            sx={{
              width: { md: "30%", xs: "100%" },
              mb: { md: 0, xs: 1 },
              fontSize: { md: 16, xs: 12 },
            }}
          >
            <Link
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out the ${collectionDetails?.name} NFT collection on @scattering_io`)} &url=${encodeURIComponent(fullUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#b054ff", fontFamily: "Poppins" }}
            >
              <IconButton>
                <Iconify icon="fa6-brands:x-twitter" color="#b054ff" />
              </IconButton>
              X/Twitter
            </Link>
          </BoxButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
