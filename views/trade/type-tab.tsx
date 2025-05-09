import { Box, Button, ButtonGroup, Stack, Typography } from "@mui/material";
import { BatchBalanceResult } from "@/services/zora/swap/balance404";
import { ethers } from "ethers";
import { formatTokenFixedto } from "@/utils/format";
import { TabType } from "./SwapCard";

export function calculateTotalBalance(
  batchBalance: BatchBalanceResult,
  decimals: number,
): string {
  const erc20Balance = ethers.BigNumber.from(batchBalance?.erc20Balance || "0");
  return ethers.utils.formatUnits(erc20Balance, decimals);
}

interface iTypeTab {
  decimals: number;
  mode: TabType;
  setMode: (mode: TabType) => void;
  batchBalance?: BatchBalanceResult;
}
const TypeTab = ({ mode, setMode, batchBalance, decimals }: iTypeTab) => {
  return (
    <Stack
      sx={{ m: 2, mt: 3 }}
      flexDirection="row"
      justifyContent="space-between"
    >
      <Box>
        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            columnGap: 1,
            fontSize: 14,
            fontWeight: 400,
            color: "#fff",
            mt: 2,
          }}
        >
          Your Balance: 
          {batchBalance
            ? formatTokenFixedto(calculateTotalBalance(batchBalance, decimals))
            : "0"}
        </Typography>
      </Box>
      <ButtonGroup variant="text">
        {["Buy", "Sell"].map((m) => (
          <Button
            key={m}
            onClick={() => setMode(m as TabType)}
            sx={{
              color: mode === m ? "#fff" : "#b0b0b0",
              backgroundColor:
                mode === m ? "#9b51e0" : "rgba(255, 255, 255, 0.10)",
              fontWeight: 600,
              textTransform: "none",
              border: "none",
              padding: "8px 20px",
              fontFamily: "Poppins",
              borderRight: "1px solid #0f071c !important",
              borderLeft: "1px solid #0f071c !important",
              borderRadius: 2,
              fontSize: 14,
              "&:hover": {
                backgroundColor: mode === m ? "#9b51e0" : "#333333",
              },
            }}
          >
            {m}
          </Button>
        ))}
      </ButtonGroup>
    </Stack>
  );
};

export default TypeTab;
