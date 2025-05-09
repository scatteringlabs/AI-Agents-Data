import { Box } from "@mui/material";
import Iconify from "../iconify";
import Link from "next/link";

export const MessageButton = () => {
  return (
    <Link href="https://t.me/scatteringlabs" target="_blank">
      <Box
        sx={{
          position: "fixed",
          right: 10,
          bottom: 112,
          background: "#af54ff",
          p: "12px",
          borderRadius: "50%",
          cursor: "pointer",
        }}
      >
        <Iconify icon="system-uicons:message-writing" sx={{ color: "#000" }} />
      </Box>
    </Link>
  );
};
