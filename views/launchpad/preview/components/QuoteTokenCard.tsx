import AvatarCard from "@/components/collections/avatar-card";
import { Box, Stack, Typography } from "@mui/material";
import { ChainId } from "@uniswap/sdk-core";

const QuoteTokenCard = ({
  tokenSymbol,
  logo,
}: {
  tokenSymbol: string;
  logo: string;
}) => (
  <Stack flexDirection="row" alignItems="center">
    <Box>
      <AvatarCard
        hasLogo
        symbol={tokenSymbol}
        logoUrl={logo}
        chainId={ChainId.BASE}
        size={40}
        mr={1}
      />
    </Box>
    <Typography variant="h4" sx={{ fontSize: { md: 24, xs: 16 } }}>
      {tokenSymbol}
    </Typography>
  </Stack>
);

export default QuoteTokenCard;
