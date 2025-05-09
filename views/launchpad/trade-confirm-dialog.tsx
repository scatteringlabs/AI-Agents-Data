import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, Box, Typography, styled } from "@mui/material";

const Text = styled(Typography)`
  color: #fff;
  text-align: center;
  font-family: Poppins;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 30px;
`;

const TradeConfirmDialog = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        width: "100vw",
        height: "100vh",
        zIndex: 999,
        left: 0,
        top: 0,
        background: "rgba(0,0,0,0.8)",
      }}
    >
      <Box
        component="img"
        src="/assets/images/launchpad/boom.gif"
        sx={{ position: "absolute", width: "100%", bottom: 0, left: 0 }}
      />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        sx={{ height: "100%" }}
      >
        <Box
          component="img"
          src="/assets/images/launchpad/congrats.gif"
          sx={{ width: 500 }}
        />
        <Text> The DEX LP is deploying now. </Text>
        <Text> Taking 5-7 seconds. </Text>
      </Box>
    </Box>
  );
};

export default TradeConfirmDialog;
