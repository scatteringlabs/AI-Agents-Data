import { Box, Grid, IconButton, Tooltip } from "@mui/material";
import { useState, useMemo, useEffect } from "react";
import ImagePreviewer from "../image-previewer";
import {
  DisplayLabel,
  DisplayValue,
  PreviewTitle,
} from "../../create/require-text";
import BaseInfo from "./svgs/base-info";
import Iconify from "@/components/iconify";
import {
  formatAddress,
  formatNumberToString,
  formatNumberToStringInt,
} from "@/utils/format";
import CopyToClipboardButton from "@/components/button/CopyToClipboardButton";
import { BaseSID } from "../../create/tokenService";
import { chainIdToName } from "@/utils";

const placeholdImage = "https://placehold.co/400x400/171525/333?text=preview";

const ImagesPreviewer = ({
  images,
  preview,
  nftQuantity,
  tokenQuantity,
  contractAddress,
  // tokenStandard,
  // chain,
}: {
  images: string[];
  preview: string;
  nftQuantity: string;
  tokenQuantity: string;
  contractAddress: string;
  // tokenStandard: string;
  // chain: string;
}) => {
  const [copySuccess, setCopySuccess] = useState("");
  const [previewError, setPreviewError] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<string>(placeholdImage);
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess("Copied!");
      setTimeout(() => setCopySuccess(""), 2000); // Reset after 2 seconds
    });
  };

  const conversionRatio = useMemo(() => {
    return Number(nftQuantity) > 0
      ? Math.floor(Number(tokenQuantity) / Number(nftQuantity))
      : 0;
  }, [nftQuantity, tokenQuantity]);

  const infoList = useMemo(
    () => [
      {
        label: "Token Quantity",
        value: formatNumberToStringInt(tokenQuantity),
      },
      { label: "NFT Quantity", value: formatNumberToStringInt(nftQuantity) },
      {
        label: "Conversion Ratio (1NFT = How Many Tokens)",
        value: formatNumberToStringInt(conversionRatio),
      },
      {
        label: "Tokens for Sale",
        value: formatNumberToStringInt(Number(tokenQuantity) * 0.8),
      },
      {
        label: "Tokens for DEX LP",
        value: formatNumberToStringInt(Number(tokenQuantity) * 0.2),
      },
      { label: "Contract Address", value: contractAddress, type: "address" },
      { label: "Token Standard", value: "Hybrid Meme" },
      { label: "Chain", value: chainIdToName(BaseSID?.toString()) },
    ],
    [tokenQuantity, nftQuantity, conversionRatio, contractAddress],
  );

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setShowPreview(placeholdImage);
  };

  useEffect(() => {
    if (preview) {
      setShowPreview(preview);
    }
  }, [preview]);
  return (
    <Grid container>
      <Grid item xs={12}>
        <Box
          sx={{
            backgroundColor: "#171525",
            borderRadius: "8px",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ImagePreviewer images={images} preview={preview} />
        </Box>
      </Grid>
      {!images?.length ? (
        <Grid item xs={12}>
          <Box
            sx={{
              backgroundColor: "#171525",
              borderRadius: "8px",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                aspectRatio: "1/1",
                backgroundColor: "#171525",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
              }}
            >
              <img
                src={showPreview}
                alt="Preview 1"
                style={{
                  height: "100%",
                  width: "100%",
                  aspectRatio: "1/1",
                  borderRadius: "8px",
                  objectFit: "cover",
                }}
                onError={handleImageError}
              />
            </Box>
          </Box>
        </Grid>
      ) : null}
      <Grid item xs={12}>
        <PreviewTitle
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            columnGap: 1,
            my: 2,
            pl: 1,
          }}
        >
          <BaseInfo />
          Basic Information
        </PreviewTitle>
        <Box
          sx={{
            backgroundColor: "#171525",
            borderRadius: "8px",
            border: "1px solid rgba(255, 255, 255, 0.10)",
          }}
        >
          {infoList?.map((i) => (
            <Box
              key={i.label}
              display="flex"
              justifyContent="space-between"
              sx={{
                borderBottom: "1px solid rgba(255, 255, 255, 0.10)",
                p: 2,
              }}
            >
              <DisplayLabel>{i.label}</DisplayLabel>
              {i?.type === "address" ? (
                <DisplayValue>
                  {formatAddress(i.value)}
                  <CopyToClipboardButton textToCopy={i.value} size={12} />
                </DisplayValue>
              ) : (
                <DisplayValue>{i.value}</DisplayValue>
              )}
            </Box>
          ))}
        </Box>
      </Grid>
    </Grid>
  );
};

export default ImagesPreviewer;
