import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Typography, Grid, IconButton } from "@mui/material";
import ImageCropperDialog from "../image-cropper-dialog"; // Import the cropper dialog
import Upload from "../svg-icon/upload";
import Close from "../svg-icon/close";
import UploadIcon from "../svg-icon/upload-icon";

interface MultiImageUploadProps {
  maxFiles?: number;
  files: File[];
  setFiles: (f: File[]) => void;
  onDeleteExistingImage?: (index: number) => void;
  defalutImages?: string[];
}

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  maxFiles = 4,
  files,
  setFiles,
  defalutImages = [],
  onDeleteExistingImage,
}) => {
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null); // To handle file before cropping
  const [openCropper, setOpenCropper] = useState<boolean>(false); // Cropper dialog control
  const [defaultImageList, setDefaultImageList] = useState<string[]>([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    multiple: false,
    maxFiles: 1, // Only allow one file to be selected at a time
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]); // Set the file for cropping
        setOpenCropper(true); // Open the cropper dialog
      }
    },
  });

  useEffect(() => {
    // If defalutImages changes (e.g., fetched from an API), update the defaultImageList
    if (defalutImages && defalutImages.length > 0) {
      setDefaultImageList(defalutImages);
    }
  }, [defalutImages]);

  useEffect(() => {
    // Generate previews for current files or use default images
    const filePreviews = files.map((file) => URL.createObjectURL(file));
    const combinedPreviews = [...defaultImageList, ...filePreviews];
    setSelectedPreview(combinedPreviews[0] || null);

    // Clean up memory by revoking URLs
    return () => filePreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [files, defaultImageList]);

  const getPreviews = () => {
    const filePreviews = files.map((file) => URL.createObjectURL(file));
    return [...defaultImageList, ...filePreviews];
  };

  const handleSelectPreview = (index: number) => {
    const previews = getPreviews();
    setSelectedPreview(previews[index] || "");
  };

  const handleDeleteFile = (index: number) => {
    if (index < defaultImageList.length) {
      // Delete from default image list
      const updatedDefaultImages = defaultImageList.filter(
        (_, i) => i !== index,
      );
      setDefaultImageList(updatedDefaultImages);
      onDeleteExistingImage?.(index);
    } else {
      // Delete from files
      const fileIndex = index - defaultImageList.length;
      const updatedFiles = files.filter((_, i) => i !== fileIndex);
      setFiles(updatedFiles);
    }
  };

  // Function called after cropping
  const handleCrop = (croppedFile: File, croppedImageUrl: string) => {
    const updatedFiles = [...files, croppedFile].slice(0, maxFiles);
    setFiles(updatedFiles);
    setOpenCropper(false); // Close the cropper dialog
  };
  // const handleCrop = (croppedFile: File, croppedImageUrl: string) => {
  //   // Only keep the current visible files
  //   const visibleFiles = files.filter((_, index) => index < maxFiles);
  //   const updatedFiles = [...visibleFiles, croppedFile].slice(0, maxFiles);
  //   setFiles(updatedFiles);
  //   setOpenCropper(false); // Close the cropper dialog
  // };

  // const handleReplaceFile = (index: number) => {
  //   const input = document.createElement("input");
  //   input.type = "file";
  //   input.accept = "image/*";
  //   input.onchange = (e: any) => {
  //     const file = e.target.files[0];
  //     if (file) {
  //       const newUrl = URL.createObjectURL(file);
  //       if (index < defaultImageList.length) {
  //         // Replace in default image list
  //         const updatedDefaultImages = [...defaultImageList];
  //         updatedDefaultImages[index] = newUrl;
  //         setDefaultImageList(updatedDefaultImages);
  //       } else {
  //         // Replace in files
  //         const fileIndex = index - defaultImageList.length;
  //         const updatedFiles = [...files];
  //         updatedFiles[fileIndex] = file;
  //         setFiles(updatedFiles);
  //       }
  //     }
  //   };
  //   input.click();
  // };

  return (
    <Box sx={{ mt: 2 }}>
      <Box
        {...getRootProps()}
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
          cursor: "pointer",
        }}
      >
        <input {...getInputProps()} />
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
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: "#171525",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              color: "#BBB",
              flexDirection: "column",
              rowGap: 2,
              px: 8,
              lineHeight: "20px",
            }}
          >
            <UploadIcon />
            Size 500X500 JPG, PNG Max 3MB{" "}
          </Box>
        )}
      </Box>

      <Grid container spacing={2} alignItems="center">
        {getPreviews().map((preview, index) => (
          <Grid item xs={3} key={index}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                aspectRatio: "1/1",
                backgroundColor: "#171525",
                border:
                  selectedPreview === preview
                    ? "2px solid #FFF"
                    : "2px solid #3A3A55",
                borderRadius: "8px",
                overflow: "hidden",
                cursor: "pointer",
              }}
              onClick={() => handleSelectPreview(index)}
            >
              <IconButton
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  color: "#ff6b6b",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFile(index);
                }}
              >
                <Close />
              </IconButton>
              {/* <IconButton
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  color: "#ff6b6b",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleReplaceFile(index);
                }}
              >
                <Upload fill="#ff6b6b" />
              </IconButton> */}
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          </Grid>
        ))}

        {/* Display an upload holder if previews are less than maxFiles */}
        {getPreviews().length < maxFiles && (
          <Grid item xs={3}>
            <Box
              {...getRootProps()}
              sx={{
                width: "100%",
                height: "100%",
                aspectRatio: "1/1",
                backgroundColor: "#171525",
                border: "2px dashed #3A3A55",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <input {...getInputProps()} />
              <Typography sx={{ color: "#FFF", fontSize: "24px" }}>
                <Upload />
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Cropper dialog */}
      <ImageCropperDialog
        open={openCropper}
        setOpen={setOpenCropper}
        onCrop={handleCrop}
        aspectRatio={1}
        uploadFile={file!}
        width={500}
        height={500}
      />
    </Box>
  );
};

export default MultiImageUpload;
