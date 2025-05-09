import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Skeleton } from "@mui/material";

interface ImagePreviewerProps {
  images: string[];
  preview?: string;
}

const ImagePreviewer: React.FC<ImagePreviewerProps> = ({ images, preview }) => {
  const [selectedPreview, setSelectedPreview] = useState<string>(images?.[0]);

  const handleSelectPreview = (index: number) => {
    setSelectedPreview(images[index]);
  };

  useEffect(() => {
    if (images?.length) {
      setSelectedPreview(images?.[0]);
    } else {
      setSelectedPreview("");
    }
  }, [images]);
  if (!images?.length) {
    return null;
  }
  return (
    <Box sx={{ padding: 2 }}>
      {/* 上方大图预览部分 */}
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
          marginBottom: 2,
          overflow: "hidden",
        }}
      >
        {selectedPreview ? (
          <img
            src={selectedPreview}
            alt="Selected Preview"
            style={{
              height: "100%",
              width: "100%",
              aspectRatio: "1/1",
              borderRadius: "8px",
              objectFit: "cover",
            }}
          />
        ) : (
          <Skeleton
            sx={{
              background: "#331f44",
              borderRadius: 2,
              width: "400px",
              height: "400px",
            }}
          />
        )}
      </Box>
      {/* 下方缩略图部分 */}
      {images?.length ? (
        <Grid
          container
          spacing={2}
          justifyContent="flex-start"
          alignItems="center"
        >
          {images.map((image, index) =>
            image ? (
              <Grid item key={index} xs={3}>
                <Box
                  onClick={() => handleSelectPreview(index)}
                  sx={{
                    width: "100%",
                    height: "100%",
                    aspectRatio: "1/1",
                    backgroundColor: "#171525",
                    border:
                      selectedPreview === image
                        ? "2px solid #FFF"
                        : "2px solid #3A3A55",
                    borderRadius: "12px",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              </Grid>
            ) : null,
          )}
        </Grid>
      ) : null}
    </Box>
  );
};

export default ImagePreviewer;
