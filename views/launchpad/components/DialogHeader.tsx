import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import AvatarCard from "@/components/collections/avatar-card";
import Iconify from "@/components/iconify";

interface DialogHeaderProps {
  collectionLogo: string;
  collectionName: string;
  tokenSymbol: string;
  onClose: () => void;
}

const DialogHeader: React.FC<DialogHeaderProps> = ({
  collectionLogo,
  collectionName,
  tokenSymbol,
  onClose,
}) => (
  <Box display="flex" justifyContent="space-between" alignItems="center">
    <Box display="flex" alignItems="center" columnGap={2}>
      <AvatarCard
        logoUrl={collectionLogo || ""}
        hasLogo={Boolean(collectionLogo)}
        symbol={tokenSymbol}
        size={80}
        mr={0}
      />
      <Box>
        <Typography
          sx={{ fontSize: "18px", color: "white", fontWeight: "bold" }}
        >
          {collectionName}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ color: "gray", fontSize: "14px" }}
        >
          {tokenSymbol}
        </Typography>
      </Box>
    </Box>
    <IconButton
      aria-label="close"
      onClick={onClose}
      sx={{ color: "gray", p: 0, mb: 6 }}
    >
      <Iconify
        icon="solar:close-circle-line-duotone"
        sx={{ width: "30px", height: "30px" }}
      />
    </IconButton>
  </Box>
);

export default DialogHeader;
