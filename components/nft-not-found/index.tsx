import { Box, Stack, Typography } from "@mui/material";
import { useAccount } from "wagmi";
import NeedConnectCard from "../need-connect-card";
interface NFTNotFoundProps {
  title?: string;
  needAddress?: boolean;
}

const NFTNotFound = ({
  title = "Sorry, no relevant NFTs were found at the moment.",
  needAddress = true,
}: NFTNotFoundProps) => {
  const { address } = useAccount();
  if (!needAddress) {
    return (
      <Stack justifyContent="center" alignItems="center" sx={{ m: 4 }}>
        <Box
          src="/assets/images/tokens/no-data.svg"
          component="img"
          sx={{ width: 200, height: 200 }}
        />
        <Typography variant="h5" sx={{ textAlign: "center", opacity: 0.4 }}>
          {title}
        </Typography>
      </Stack>
    );
  }
  return (
    <Stack justifyContent="center" alignItems="center" sx={{ m: 4 }}>
      {address ? (
        <>
          <Box
            src="/assets/images/tokens/no-data.svg"
            component="img"
            sx={{ width: 200, height: 200 }}
          />
          <Typography variant="h5" sx={{ textAlign: "center", opacity: 0.4 }}>
            {title}
          </Typography>
        </>
      ) : (
        <Box sx={{ my: 2 }}>
          <NeedConnectCard />
        </Box>
      )}
    </Stack>
  );
};

export default NFTNotFound;
