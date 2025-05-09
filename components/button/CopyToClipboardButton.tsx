import React from "react";
import IconButton from "@mui/material/IconButton";
import Iconify from "../iconify";
import { toast } from "react-toastify";

const CopyToClipboardButton: React.FC<{
  textToCopy: string;
  size?: number;
}> = ({ textToCopy, size = 20 }) => {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <IconButton onClick={() => copyToClipboard(textToCopy)} sx={{ p: 0 }}>
      {/* <Box component="img" src="/assets/images/copy-icon.svg" /> */}

      <Iconify
        icon="icon-park-outline:copy"
        sx={{ width: size, height: size, color: "white", ml: 1 }}
      />
    </IconButton>
  );
};

export default CopyToClipboardButton;
