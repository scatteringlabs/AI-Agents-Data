import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Typography } from "@mui/material";
import ImageCropperDialog from "../image-cropper-dialog";

interface SingleImageUploadProps {
  onImageUpload: (file: File) => void;
  defalutImage?: string;
  tips?: string;
  tips2?: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
}

const SingleImageUploadCrop: React.FC<SingleImageUploadProps> = ({
  onImageUpload,
  tips = "Size 500x500 JPG, PNG Max 3MB",
  tips2 = "",
  aspectRatio = 1,
  width = 500,
  height = 500,
  defalutImage = "",
}) => {
  const [preview, setPreview] = useState<string | null>(defalutImage);
  const [cfile, setCFile] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [openCropper, setOpenCropper] = useState<boolean>(false); // 控制裁剪对话框的状态

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".svg"],
    },
    maxFiles: 1, // 只允许上传单个文件
    maxSize: 3145728, // 文件大小限制为 3MB
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        setCFile(selectedFile); // 保存文件
        setOpenCropper(true); // 打开裁剪对话框
      }
    },
  });

  // 当 file 发生变化时，生成预览 URL
  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // 在组件卸载时，释放 URL 对象
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  useEffect(() => {
    if (!file && defalutImage) {
      setPreview(defalutImage);
    }
  }, [file, defalutImage]);
  console.log("preview", preview);

  // 裁剪完成的回调
  const handleCrop = (croppedFile: File, croppedImageUrl: string) => {
    setFile(croppedFile); // 使用裁剪后的文件
    setPreview(croppedImageUrl); // 显示裁剪后的预览图
    onImageUpload(croppedFile); // 将裁剪后的图片传递给父组件
    setOpenCropper(false); // 关闭裁剪对话框
  };

  return (
    <>
      <Box
        {...getRootProps()}
        sx={{
          borderRadius: "8px",
          padding: "0px !important",
          textAlign: "center",
          cursor: "pointer",
          height: "100%",
          width: "100%",
        }}
      >
        <input {...getInputProps()} />
        {preview ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
              aspectRatio,
            }}
          >
            <img
              src={preview}
              alt="Uploaded Preview"
              style={{
                height: "100%",
                width: "100%",
                aspectRatio,
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              aspectRatio,
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
            {tips2}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3 5C3 2.79086 4.79086 1 7 1H15.3431C16.404 1 17.4214 1.42143 18.1716 2.17157L19.8284 3.82843C20.5786 4.57857 21 5.59599 21 6.65685V19C21 21.2091 19.2091 23 17 23H7C4.79086 23 3 21.2091 3 19V5ZM19 8V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H14V5C14 6.65685 15.3431 8 17 8H19ZM18.8891 6C18.7909 5.7176 18.6296 5.45808 18.4142 5.24264L16.7574 3.58579C16.5419 3.37035 16.2824 3.20914 16 3.11094V5C16 5.55228 16.4477 6 17 6H18.8891Z"
                fill="#777E91"
              />
              <path
                d="M11.6172 9.07588C11.4993 9.12468 11.3888 9.19702 11.2929 9.29289L8.29289 12.2929C7.90237 12.6834 7.90237 13.3166 8.29289 13.7071C8.68342 14.0976 9.31658 14.0976 9.70711 13.7071L11 12.4142V17C11 17.5523 11.4477 18 12 18C12.5523 18 13 17.5523 13 17V12.4142L14.2929 13.7071C14.6834 14.0976 15.3166 14.0976 15.7071 13.7071C16.0976 13.3166 16.0976 12.6834 15.7071 12.2929L12.7071 9.29289C12.4125 8.99825 11.9797 8.92591 11.6172 9.07588Z"
                fill="#777E91"
              />
            </svg>
            {tips}
          </Box>
        )}
      </Box>

      {/* 裁剪对话框 */}
      <ImageCropperDialog
        open={openCropper}
        setOpen={setOpenCropper}
        onCrop={handleCrop}
        aspectRatio={Number(aspectRatio)} // 传递裁剪的宽高比
        uploadFile={cfile!} // 传递上传的文件
        width={width}
        height={height}
      />
    </>
  );
};

export default SingleImageUploadCrop;
