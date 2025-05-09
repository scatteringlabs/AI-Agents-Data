import { tokenIcons } from "@/constants/tokens";
import { chainIdToName } from "@/utils";
import { Box, Typography } from "@mui/material";

interface iChainLogoCard {
  chainId: number | string;
}
const ChainLogoCard = ({ chainId }: iChainLogoCard) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", columnGap: 0.4 }}>
      <Box
        component="img"
        src={tokenIcons?.[chainId?.toString()]}
        sx={{ width: { md: 16, xs: 14 }, height: { md: 16, xs: 14 } }}
      />
      <Typography
        sx={{
          fontSize: 14,
          fontFamily: "Poppins",
          color: "#fff",
        }}
      >
        {chainIdToName(chainId)}
      </Typography>
    </Box>
  );
};

export default ChainLogoCard;
