import { Box, Button, ButtonGroup, Stack, Typography } from "@mui/material";
import { formatWeiToToken, ModeType } from "./swap-card";
import CustomTooltip from "@/components/tooltip/CustomTooltip";
import { TipText } from "@/views/collect/verified-icon";
import { BatchBalanceResult } from "@/services/zora/swap/balance";
import { Dispatch, SetStateAction } from "react";
import { ethers } from "ethers";
import { formatTokenFixedto } from "@/utils/format";

export function calculateTotalBalance(
  batchBalance: BatchBalanceResult,
): string {
  console.log("batchBalance", batchBalance);

  // 将 ERC1155 余额转换为 BigNumber，并提升到 18 位精度
  const erc1155BalanceInWei = ethers.utils.parseUnits(
    batchBalance?.erc1155Balance || "0",
    18,
  );

  // 将 ERC20 余额直接解析为 BigNumber
  const erc20Balance = ethers.BigNumber.from(batchBalance?.erc20Balance || "0");

  // 计算总余额
  const totalBalance = erc1155BalanceInWei.add(erc20Balance);

  // 返回用户可读格式（18 位小数精度）
  return ethers.utils.formatUnits(totalBalance, 18);
}

interface iModeTab {
  mode: ModeType;
  setMode: (mode: ModeType) => void;
  batchBalance?: BatchBalanceResult;
}
const ModeTab = ({ mode, setMode, batchBalance }: iModeTab) => {
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
            ? formatTokenFixedto(calculateTotalBalance(batchBalance))
            : "0"}
          <CustomTooltip
            title={
              <TipText>
                {formatWeiToToken(batchBalance?.erc20Balance)} Tokens +{" "}
                {batchBalance?.erc1155Balance} NFTs
              </TipText>
            }
            arrow
            placement="top"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <g opacity="0.3" clip-path="url(#clip0_9156_27927)">
                <path
                  d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 -3.13124e-07 8 -6.99382e-07C3.58172 -1.08564e-06 1.08564e-06 3.58172 6.99382e-07 8C3.13124e-07 12.4183 3.58172 16 8 16ZM7.3125 12L7.3125 6.69544C7.3125 6.31573 7.62031 6.00794 8 6.00794C8.37969 6.00794 8.6875 6.31573 8.6875 6.69544L8.6875 12C8.6875 12.3797 8.37969 12.6875 8 12.6875C7.62031 12.6875 7.3125 12.3797 7.3125 12ZM8 5.3125C7.44772 5.3125 7 4.86478 7 4.3125C7 3.76022 7.44772 3.3125 8 3.3125C8.55228 3.3125 9 3.76022 9 4.3125C9 4.86478 8.55228 5.3125 8 5.3125Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_9156_27927">
                  <rect
                    width="16"
                    height="16"
                    fill="white"
                    transform="translate(16 16) rotate(-180)"
                  />
                </clipPath>
              </defs>
            </svg>
          </CustomTooltip>
        </Typography>
      </Box>
      <ButtonGroup variant="text">
        {["Token", "NFT"].map((m) => (
          <Button
            key={m}
            onClick={() => setMode(m as ModeType)}
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

export default ModeTab;
