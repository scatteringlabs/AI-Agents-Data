import React from "react";
import {
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ChainId } from "@uniswap/sdk-core";

interface ChainFilterProps {
  selectedChain: string;
  onChainChange: (chain: string) => void;
}

const chains: {
  value: string;
  label: string;
  icon?: string;
  iconActive?: string;
}[] = [
  { value: "-1", label: "All Chains" },
  {
    value: ChainId.MAINNET.toString(),
    label: "ethereum",
    icon: "/assets/images/tokens/eth-gray.svg",
    iconActive: "/assets/images/tokens/eth-active.svg",
  },
  {
    value: ChainId.BASE.toString(),
    label: "base",
    icon: "/assets/images/tokens/base-gray.svg",
    iconActive: "/assets/images/tokens/base-active.svg",
  },
  {
    value: ChainId.ARBITRUM_ONE.toString(),
    label: "arbitrum",
    icon: "/assets/images/tokens/arb-gray.svg",
    iconActive: "/assets/images/tokens/arb-active.svg",
  },
];

const CustomToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  color: "#fff",
  // marginRight: "20px",
  border: "1px solid #3D3D3D",
  borderRadius: "40px",
  overflow: "hidden",
  padding: "0px 10px",
  "& .MuiToggleButtonGroup-grouped": {
    margin: theme.spacing(0.5),
    border: 0,
    "&.Mui-disabled": {
      border: 0,
    },
    "&.Mui-selected": {
      color: "#af54ff",
      backgroundColor: "transparent",
    },
    "&.MuiToggleButtonGroup-grouped": {
      margin: 0,
    },
    "&:not(:first-of-type)": {
      borderRadius: theme.shape.borderRadius,
    },
    "&:first-of-type": {
      borderRadius: theme.shape.borderRadius,
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

  return (
    <CustomToggleButtonGroup
      value={selectedChain}
      exclusive
      onChange={handleChainChange}
      aria-label="chain filter"
      color="primary"
      sx={{ mr: { md: 2, xs: 0 } }}
    >
      {chains.map((chain, index) => (
        <ToggleButton
          key={chain.value}
          value={chain.value}
          aria-label={chain.value}
          sx={{
            color: "#fff",
            fontSize: { md: 14, xs: 10 },
            textTransform: "capitalize",
            fontWeight: selectedChain === chain.value ? "bold" : "normal",
          }}
        >
          {index === 0 ? (
            chain.label
          ) : (
            <Box
              component="img"
              sx={{ width: 24, height: 24 }}
              src={
                selectedChain === chain.value ? chain.iconActive : chain.icon
              }
            />
          )}
        </ToggleButton>
      ))}
    </CustomToggleButtonGroup>
  );
};

export default ChainFilter;
