import { Box, Divider, IconButton, Typography } from "@mui/material";
import Iconify from "../iconify";

interface iDrawerHeader {
  title: string;
  toggleDrawer: () => void;
}
const DrawerHeader = ({ title, toggleDrawer }: iDrawerHeader) => {
  return (
    <>
      <Box
        sx={{
          px: 2,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            color: "#FFF",
            fontSize: 16,
            fontFamily: "Poppins",
            fontWeight: 800,
          }}
        >
          {title}
        </Typography>
        <Box
          onClick={() => {
            toggleDrawer?.();
          }}
        >
          <IconButton
            aria-label="close"
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Iconify
              icon="solar:close-circle-line-duotone"
              sx={{ width: 32, height: 32 }}
            />
          </IconButton>
        </Box>
      </Box>
      <Divider sx={{ background: "rgba(255, 255, 255,0.1)" }} />
    </>
  );
};

export default DrawerHeader;
