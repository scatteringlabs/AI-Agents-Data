"use client";

import "cropperjs/dist/cropper.css";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { useCallback, useEffect, useRef, useState } from "react";

import CropperComponent, { ReactCropperElement } from "./create/image-cropper";
import { Dialog, DialogContent } from "@mui/material";
import { ButtonWrapper } from "./create/require-text";

interface ImageCropperDialogProps {
  width: number;
  height: number;
  aspectRatio: number;
  imageUrl?: string;
  open: boolean;
  uploadFile?: File;
  setOpen: (open: boolean) => void;
  onCrop: (file: File, url: string) => void;
}

function ImageCropperDialog(props: ImageCropperDialogProps) {
  const {
    aspectRatio,
    imageUrl,
    open,
    setOpen,
    onCrop,
    uploadFile,
    width,
    height,
  } = props;
  const cropperReference = useRef<ReactCropperElement>(null);
  const [uploadImageUrl, setUploadImageUrl] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (uploadFile) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          setUploadImageUrl(reader.result as string);
        });
        reader.readAsDataURL(uploadFile);
      }
    }
  }, [uploadFile]);

  const handelClose = () => {
    setOpen(false);
  };

  const getCropData = useCallback(() => {
    if (cropperReference.current?.cropper !== undefined) {
      const dataUrl = cropperReference.current?.cropper
        .getCroppedCanvas({
          width,
          height,
        })
        .toDataURL();
      if (typeof window !== "undefined") {
        fetch(dataUrl)
          .then((response) => response.blob())
          .then((blob) => {
            const time = Date.now();
            const file = new File([blob], `${time}.png`, { type: blob.type });
            onCrop(file, dataUrl as string);
            setOpen(false);
          });
      }
    }
  }, [onCrop, setOpen, width, height]);

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={handelClose}>
      <DialogContent sx={{ p: 4 }}>
        <Grid container spacing={8}>
          <Grid item md={8} xs={12}>
            <CropperComponent
              ref={cropperReference}
              zoomTo={0.1}
              aspectRatio={aspectRatio}
              preview=".img-preview"
              src={uploadImageUrl || imageUrl}
              viewMode={1}
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              background={false}
              responsive={true}
              autoCropArea={1}
              checkOrientation={false}
              guides={true}
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <Box
              sx={{
                width: { md: "100%", xs: "auto" },
                height: { md: 200, xs: "100%" },
              }}
            >
              <Box
                className="img-preview"
                sx={{ width: "100%", height: "100%", overflow: "hidden" }}
              />
              <Box sx={{ mt: 4 }}>
                <ButtonWrapper
                  variant="contained"
                  onClick={getCropData}
                  sx={{ borderRadius: 1, mr: 2, px: 2, py: 0.4 }}
                >
                  Submit
                </ButtonWrapper>
                <ButtonWrapper
                  variant="outlined"
                  onClick={handelClose}
                  sx={{
                    borderRadius: 1,
                    background: "transparent",
                    px: 2,
                    py: 0.4,
                    "&:hover": { background: "transparent", px: 2, py: 0.4 },
                  }}
                >
                  Cancel
                </ButtonWrapper>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default ImageCropperDialog;
