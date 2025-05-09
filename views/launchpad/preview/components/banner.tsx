import { Box } from "@mui/material";
import { useEffect, useState } from "react";
const placeholdImage = "https://placehold.co/1400x400/171525/333?text=banner";

const Banner = ({ banner }: { banner: string }) => {
  const [showPreview, setShowPreview] = useState<string>(placeholdImage);
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setShowPreview(placeholdImage);
  };
  useEffect(() => {
    if (banner) {
      setShowPreview(banner);
    }
  }, [banner]);
  return (
    <>
      <Box
        sx={{
          height: { md: 478, xs: 400 },
          backgroundColor: "#12122C",
          borderRadius: "8px",
          overflow: "hidden",
          position: "absolute",
          width: "100%",
          left: 0,
          top: 60,
          zIndex: { md: 0, xs: -1 },
          "&:after": {
            content: '""',
            width: "100%",
            height: "100%",
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 1,
            background:
              "linear-gradient(180deg, rgba(1, 4, 16, 0.00) 0%, #010410 100%)",
          },
        }}
      >
        <Box
          component="img"
          src={showPreview}
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={handleImageError}
        />
      </Box>
    </>
  );
};

export default Banner;
