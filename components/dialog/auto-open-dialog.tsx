import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { ButtonWrapper } from "@/views/trade/swap/wrapper";
import Link from "next/link";
import Iconify from "../iconify";
import { useRouter } from "next/router";

const AutoOpenDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const handleShallowRouteChange = (path: string) => {
    router.push(path, undefined, { shallow: true });
  };
  const handleClose = () => {
    setOpen(false);
    const nextOpen = new Date();
    nextOpen.setTime(nextOpen.getTime() + 3600 * 1000 * 24);
    localStorage.setItem("nextOpenTime_3.0", nextOpen.toString());
  };

  useEffect(() => {
    const nextOpenStr = localStorage.getItem("nextOpenTime_3.0");
    if (!nextOpenStr) {
      setOpen(true);
    }
    return () => {
      const nextOpen = new Date();
      nextOpen.setTime(nextOpen.getTime() + 3600 * 1000 * 24);
      localStorage.setItem("nextOpenTime_2.0", nextOpen.toString());
    };
  }, []);

  return (
    <Dialog
      open={false}
      onClose={handleClose}
      PaperProps={{ sx: { background: "#202025" } }}
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Iconify icon="solar:close-circle-line-duotone" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: { md: 6, xs: 2 } }}>
        <Stack
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Box
            sx={{ width: 345 }}
            component="img"
            src="/assets/images/launchpad/hybrid.png"
          />
        </Stack>
        <Typography
          variant="h5"
          sx={{
            color: "#fff",
            fontSize: { md: 20, xs: 14 },
            textAlign: "center",
            fontWeight: 500,
            px: 10,
          }}
        >
          {" "}
          Unlock a brand-new experience for launching hybrid assets.
        </Typography>
        <ButtonWrapper
          onClick={() => handleShallowRouteChange("/launchpad/explore")}
          sx={{ mx: 10, py: 1, borderRadius: 2, textTransform: "capitalize" }}
        >
          Launch Now
        </ButtonWrapper>
      </DialogContent>
    </Dialog>
  );
};

export default AutoOpenDialog;
