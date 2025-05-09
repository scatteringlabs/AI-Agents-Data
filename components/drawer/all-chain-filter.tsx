import React, { useEffect, useMemo } from "react";
import {
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ChainId } from "@uniswap/sdk-core";
import { useRouter } from "next/router";
import { useGlobalState } from "@/context/GlobalStateContext";

interface AllChainFilterProps {
  selectedChain: string;
  onChainChange: (chain: string) => void;
  initialChain?: string;
}

export const chainsErc20z: {
  value: string;
  label: string;
  icon?: string;
  iconActive?: string;
}[] = [
  {
    value: "-1",
    label: "All Chains",
    icon: "/assets/images/tokens/all-gray.svg",
    iconActive: "/assets/images/tokens/all-active.svg",
  },
  {
    value: "10000",
    label: "Solana",
    icon: "/assets/images/tokens/sol-gray.svg",
    iconActive: "/assets/images/tokens/sol-active.svg",
  },
  {
    value: ChainId.BASE.toString(),
    label: "base",
    icon: "/assets/images/tokens/base-gray.svg",
    iconActive: "/assets/images/tokens/base-active.svg",
  },
  {
    value: ChainId.BNB.toString(),
    label: "BNB",
    icon: "/assets/images/tokens/bsc-gray.svg",
    iconActive: "/assets/images/tokens/bsc-active.svg",
  },
  {
    value: ChainId.MAINNET.toString(),
    label: "ethereum",
    icon: "/assets/images/tokens/eth-gray.svg",
    iconActive: "/assets/images/tokens/eth-active.svg",
  },
  // {
  //   value: ChainId.ARBITRUM_ONE.toString(),
  //   label: "arbitrum",
  //   icon: "/assets/images/tokens/arb-gray.svg",
  //   iconActive: "/assets/images/tokens/arb-active.svg",
  // },
];

const CustomToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  color: "#fff",
  // background: "#010410",
  width: "100%",
  overflow: "hidden",
  // padding: "0px 10px",
  display: "flex",
  // borderRadius: "6px 6px 0px 0px",
  borderTop: "1px solid rgba(255, 255, 255,0.1)",
  borderBottom: "1px solid rgba(255, 255, 255,0.1)",
  justifyContent: "flex-start",
  "& .MuiToggleButtonGroup-grouped": {
    margin: theme.spacing(0.5),
    border: 0,
    "&.Mui-disabled": {
      border: 0,
    },
    "&.Mui-selected": {
      color: "#FFF",
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

const AllChainFilter: React.FC<AllChainFilterProps> = ({
  selectedChain,
  onChainChange,
  initialChain,
}) => {
  const showChain = useMemo(() => chainsErc20z, []);
  const router = useRouter();

  useEffect(() => {
    if (initialChain) {
      onChainChange(initialChain);
    }
  }, [initialChain, onChainChange]);
  const handleChainChange = (
    event: React.MouseEvent<HTMLElement>,
    newChain: string,
  ) => {
    if (newChain !== null) {
      onChainChange(newChain);
      // router.push(
      //   {
      //     pathname: router.pathname,
      //     query: { ...router.query, chain: newChain },
      //   },
      //   undefined,
      //   { shallow: true },
      // );
    }
  };
  return (
    <CustomToggleButtonGroup
      value={selectedChain}
      exclusive
      onChange={handleChainChange}
      aria-label="chain filter"
      color="primary"
      sx={{ justifyContent: { md: "flex-start", xs: "space-between" } }}
    >
      {showChain?.map((chain, index) => (
        <ToggleButton
          key={chain.value}
          value={chain.value}
          aria-label={chain.value}
          sx={{
            fontSize: { md: 14, xs: 10 },
            // width: { md: "140px", xs: "100%" },
            px: { md: "40px", xs: "20px" },
            justifyContent: "center",
            background:
              selectedChain === chain.value
                ? "rgba(176, 84, 255,0.2) !important"
                : "",
          }}
        >
          <Box
            component="img"
            sx={{
              width: 24,
              height: 24,
              opacity: selectedChain === chain.value ? 1 : 0.6,
            }}
            src={selectedChain === chain.value ? chain.iconActive : chain.icon}
          />
          {selectedChain === chain.value ? (
            <Typography
              sx={{
                marginLeft: "10px",
                color: "#fff",
                fontFamily: "Poppins",
                fontWeight: 500,
                fontSize: { md: 14, xs: 12 },
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

export default AllChainFilter;
