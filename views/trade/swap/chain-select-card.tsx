import React, { useState } from "react";
import { tokenIcons } from "@/constants/tokens";
import { chainIdToName } from "@/utils";
import { Box, Popover, MenuItem, Typography } from "@mui/material";
import { ChainId } from "@uniswap/sdk-core";
import ChainLogoCard from "./chain-logo-card";
import { atom, useAtom } from "jotai";
import { useSelectedChain } from "@/store/atoms/hooks/useSelectedChain";

interface iChainSelector {
  chainId: number | string;
}

const ChainSelector = ({ chainId }: iChainSelector) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { selectedChain, setSelectedChain } = useSelectedChain(chainId);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectChain = (newChainId: number | string) => {
    setSelectedChain(newChainId);
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? "chain-popover" : undefined;

  return (
    <Box sx={{ display: "flex", alignItems: "center", columnGap: 0.4 }}>
      <Box
        component="img"
        src={tokenIcons?.[selectedChain?.toString()]}
        sx={{
          width: { md: 16, xs: 14 },
          height: { md: 16, xs: 14 },
          cursor: "pointer",
        }}
        onClick={handleClick}
      />
      <Typography
        onClick={handleClick}
        sx={{
          cursor: "pointer",
          fontSize: 14,
          fontFamily: "Poppins",
          color: "#fff",
        }}
      >
        {chainIdToName(selectedChain)}
      </Typography>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
          {[1, ChainId.BASE].map((chainIdOption) => (
            <MenuItem
              key={chainIdOption}
              onClick={() => handleSelectChain(chainIdOption)}
            >
              {/* {chainIdToName(chainIdOption)} */}
              <ChainLogoCard chainId={chainIdOption} />
            </MenuItem>
          ))}
        </Box>
      </Popover>
    </Box>
  );
};

export default ChainSelector;
