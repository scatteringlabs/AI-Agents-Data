import AvatarCard from "@/components/collections/avatar-card";
import { getTokenLogoURL } from "@/utils/token";
import { Box, Typography } from "@mui/material";

interface iContentNotAvailable {
  chainId: number;
  address: string;
  symbol: string;
  size?: number;
  fontSize?: number;
}
const ContentNotAvailable = ({
  chainId,
  address,
  symbol,
  size = 120,
  fontSize = 12,
}: iContentNotAvailable) => {
  return (
    <Box
      sx={{
        position: "absolute",
        zIndex: 0,
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        "&::before": {
          backgroundColor: "#000 !important",
          p: "0 !important",
        },
      }}
    >
      <Box
        sx={{
          background: "transparent",
        }}
      >
        <AvatarCard
          logoUrl={getTokenLogoURL({
            chainId,
            address: address,
          })}
          chainId={chainId}
          symbol={symbol}
          size={size}
          showChain={false}
          hasLogo
          mr={0}
        />
      </Box>
      <Typography variant="body2" sx={{ my: 1, color: "#aaa", fontSize }}>
        Content not available yet
      </Typography>
    </Box>
  );
};

export default ContentNotAvailable;
