import { tokenIcons } from "@/constants/tokens";
import { Box, styled } from "@mui/material";
import { useCallback, useState, useRef, useEffect } from "react";

interface iAvatarCard {
  logoUrl: string;
  chainId?: number;
  size?: number;
  mr?: number;
  symbol: string;
  showChain?: boolean;
  hasLogo?: boolean;
}

export const getInitials = (name: string) => {
  return name?.[0]?.toUpperCase();
};

export const getColorForLetter = (letter: string) => {
  const colors = [
    "#14463e",
    "#4a4b4d",
    "#2d80a7",
    "#b5ced4",
    "#dab965",
    "#c34122",
    "#d7cebe",
    "#1D2B53",
    "#009473",
    "#5f4b8b",
  ];
  const index =
    (letter?.toUpperCase()?.charCodeAt(0) - "A".charCodeAt(0)) % colors?.length;
  return colors?.[index];
};

const AvatarCard = ({
  logoUrl,
  chainId,
  size = 80,
  mr = 2,
  symbol,
  showChain = true,
  hasLogo = false,
}: iAvatarCard) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageSrc, setImageSrc] = useState(logoUrl);
  useEffect(() => {
    if (!hasLogo && symbol) {
      const initials = getInitials(symbol);
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = size;
        canvas.height = size;
        const context = canvas.getContext("2d");
        if (context) {
          context.fillStyle = getColorForLetter(initials);
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.font = `${size / 2}px Arial`;
          context.fillStyle = "#FFF";
          context.textAlign = "center";
          context.textBaseline = "middle";
          context.fillText(initials, size / 2, size / 2);
          setImageSrc(canvas.toDataURL());
        }
      }
    } else {
      setImageSrc(logoUrl); // Reset to original logoUrl when hasLogo is true
    }
  }, [symbol, size, hasLogo, logoUrl]);
  const handleImgError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      if (!symbol) {
        return;
      }
      const initials = getInitials(symbol);
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = size;
        canvas.height = size;
        const context = canvas.getContext("2d");
        if (context) {
          context.fillStyle = getColorForLetter(initials);
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.font = `${size / 2}px Arial`;
          context.fillStyle = "#FFF";
          context.textAlign = "center";
          context.textBaseline = "middle";
          context.fillText(initials, size / 2, size / 2);
          setImageSrc(canvas.toDataURL());
        }
      }
    },
    [symbol, size],
  );
  return (
    <Box
      sx={{
        position: "relative",
        mr,
        borderRadius: "50%",
      }}
    >
      {symbol && (
        <Box
          component="img"
          src={imageSrc}
          alt=""
          className="avatar"
          onError={handleImgError}
          sx={{
            minWidth: { md: size, xs: size * 0.6 },
            width: { md: size, xs: size * 0.6 },
            height: { md: size, xs: size * 0.6 },
            borderRadius: "50%",
            position: "relative",
            zIndex: 1,
          }}
        />
      )}

      {chainId && showChain && (
        <Box
          component="img"
          src={tokenIcons?.[chainId?.toString()]}
          alt=""
          className="avatar"
          sx={{
            minWidth: { md: size * 0.3, xs: size * 0.2 },
            width: { md: size * 0.3, xs: size * 0.2 },
            height: { md: size * 0.3, xs: size * 0.2 },
            position: "absolute",
            borderRadius: "50%",
            bottom: 0,
            right: 0,
            // background: "#fff",
            zIndex: 2,
          }}
        />
      )}

      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </Box>
  );
};

export default AvatarCard;
