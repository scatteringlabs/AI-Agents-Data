import { Stack, Typography } from "@mui/material";
import PrivyLogin from "../layout/header/privy-wallet";

const NeedConnectCard = ({
  tips = "Please connect your wallet to view your tokens and NFTs.",
}: {
  type?: string;
  tips?: string;
}) => (
  <Stack
    sx={{ width: "100%", my: 4 }}
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
  >
    <PrivyLogin />
    <Typography variant="h5" sx={{ opacity: 0.4, mt: 2 }}>
      {tips}
    </Typography>
  </Stack>
);

export default NeedConnectCard;
