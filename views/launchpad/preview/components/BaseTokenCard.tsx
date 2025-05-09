import AvatarCard from "@/components/collections/avatar-card";
import { BaseTokenById } from "@/constants/chain";
import { getTokenLogoURL } from "@/utils/token";
import { menuItemStyle, selectStyle } from "@/views/trade/swap/token-input";
import { Box, Stack, Typography } from "@mui/material";
import { ChainId } from "@uniswap/sdk-core";
import { zeroAddress } from "viem";

const BaseTokenCard = () => (
  <Stack flexDirection="row" alignItems="center">
    <Box>
      <AvatarCard
        hasLogo
        symbol={"ETH"}
        logoUrl={getTokenLogoURL({
          chainId: ChainId.BASE,
          address: zeroAddress,
        })}
        chainId={ChainId.BASE}
        size={40}
        mr={1}
      />
    </Box>
    <Typography variant="h4" sx={{ fontSize: { md: 24, xs: 16 } }}>
      {"ETH"}
    </Typography>
  </Stack>
);

export default BaseTokenCard;
