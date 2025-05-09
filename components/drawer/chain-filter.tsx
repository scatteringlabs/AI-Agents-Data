import React, { useMemo } from "react";
import {
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ChainId } from "@uniswap/sdk-core";
import { useGlobalState } from "@/context/GlobalStateContext";
import { chainsErc20z } from "./all-chain-filter";

interface ChainFilterProps {
  selectedChain: string;
  onChainChange: (chain: string) => void;
}

// const chains: {
//   value: string;
//   label: string;
//   icon?: string;
//   iconActive?: string;
// }[] = [
//   {
//     value: "-1",
//     label: "All Chains",
//     icon: "/assets/images/tokens/all-gray.svg",
//     iconActive: "/assets/images/tokens/all-active.svg",
//   },
//   {
//     value: ChainId.MAINNET.toString(),
//     label: "ethereum",
//     icon: "/assets/images/tokens/eth-gray.svg",
//     iconActive: "/assets/images/tokens/eth-active.svg",
//   },
//   {
//     value: "10000",
//     label: "Solana",
//     icon: "/assets/images/tokens/sol-gray.svg",
//     iconActive: "/assets/images/tokens/sol-active.svg",
//   },
//   {
//     value: ChainId.BASE.toString(),
//     label: "base",
//     icon: "/assets/images/tokens/base-gray.svg",
//     iconActive: "/assets/images/tokens/base-active.svg",
//   },
//   // {
//   //   value: ChainId.ARBITRUM_ONE.toString(),
//   //   label: "arbitrum",
//   //   icon: "/assets/images/tokens/arb-gray.svg",
//   //   iconActive: "/assets/images/tokens/arb-active.svg",
//   // },
// ];

const CustomToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  color: "#fff",
  background: "#0E111C",
  width: "100%",
  overflow: "hidden",
  // padding: "0px 10px",
  display: "flex",
  borderRadius: "6px 6px 0px 0px",
  borderBottom: "1px solid rgba(255, 255, 255,0.1)",
  justifyContent: "space-between",
  "& .MuiToggleButtonGroup-grouped": {
    margin: theme.spacing(0.5),
    border: 0,
    "&.Mui-disabled": {
      border: 0,
    },
    "&.Mui-selected": {
      color: "#FFF",
      backgroundColor: "transparent",
    },
    "&.MuiToggleButtonGroup-grouped": {
      margin: 0,
    },
    "&:not(:first-of-type)": {
      borderRadius: 0,
    },
    "&:first-of-type": {
      borderRadius: 0,
    },
  },
}));

const ChainFilter: React.FC<ChainFilterProps> = ({
  selectedChain,
  onChainChange,
}) => {
  const handleChainChange = (
    event: React.MouseEvent<HTMLElement>,
    newChain: string,
  ) => {
    if (newChain !== null) {
      onChainChange(newChain);
    }
  };
  const showChain = useMemo(() => chainsErc20z, []);
  return (
    <CustomToggleButtonGroup
      value={selectedChain}
      exclusive
      onChange={handleChainChange}
      aria-label="chain filter"
      color="primary"
    >
      {showChain.map((chain, index) => (
        <ToggleButton
          key={chain.value}
          value={chain.value}
          aria-label={chain.value}
          sx={{
            color: "#fff",
            fontSize: { md: 14, xs: 10 },
            width: "100%",
            justifyContent: "center",
            background:
              selectedChain === chain.value
                ? "rgba(255, 255, 255,0.05) !important"
                : "",
          }}
        >
          <Box
            component="img"
            sx={{ width: 24, height: 24 }}
            src={selectedChain === chain.value ? chain.iconActive : chain.icon}
          />
          {selectedChain === chain.value ? (
            <Typography
              sx={{
                marginLeft: "10px",
                color: "#fff",
                fontSize: 12,
                textTransform: "capitalize",
                display: {
                  md: "inline-block",
                  xs: "none",
                },
              }}
            >
              {chain.label}
            </Typography>
          ) : null}
        </ToggleButton>
      ))}
    </CustomToggleButtonGroup>
  );
};

export default ChainFilter;
