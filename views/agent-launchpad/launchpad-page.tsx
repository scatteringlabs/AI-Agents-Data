import { Box } from "@mui/material";
import { useErc20ZChain } from "@/context/chain-provider-erc20z";
import LaunchaPadTable from "./LaunchaPadTable";

export default function LaunchpadPage() {
  const { chainId } = useErc20ZChain();

  return (
    <Box
      sx={{
        p: { md: 0, xs: "16px !important" },
        width: { md: "calc( 100% - 32px )" },
        mt: 0,
      }}
    >
      <Box
        className="col-12"
        sx={{
          px: { md: "10px", xs: "0 !important" },
          marginTop: { md: "0px !important", xs: "20px !important" },
        }}
      >
        <div className="widget-tabs relative">
          <LaunchaPadTable chainId={chainId?.toString()} selectedTime="1h" />
        </div>
      </Box>
    </Box>
  );
}
