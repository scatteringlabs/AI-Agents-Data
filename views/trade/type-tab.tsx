import { Box, Button, ButtonGroup, Stack, Typography } from "@mui/material";
import { BatchBalanceResult } from "@/services/zora/swap/balance404";
import { ethers } from "ethers";
import { formatTokenFixedto } from "@/utils/format";
import { TabType } from "./SwapCard";

export function calculateTotalBalance(
  batchBalance: BatchBalanceResult,
  decimals: number,
): string {
  console.log("batchBalance", batchBalance);

  // 将 ERC1155 余额转换为 BigNumber，并提升到 18 位精度
  // const erc1155BalanceInWei = ethers.utils.parseUnits(
  //   batchBalance?.erc1155Balance || "0",
  //   18,
  // );

  // 将 ERC20 余额直接解析为 BigNumber
  const erc20Balance = ethers.BigNumber.from(batchBalance?.erc20Balance || "0");

  // 计算总余额
  // const totalBalance = erc1155BalanceInWei.add(erc20Balance);

  // 返回用户可读格式（18 位小数精度）
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
