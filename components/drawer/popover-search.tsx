import { DrawerSortProvider } from "@/context/drawer-token-sort-provider";
import { Box, Popover } from "@mui/material";
import TokensTable from "./tokens-table";

interface iPopoverSearch {
  title: string;
  anchorEl: HTMLDivElement | null;
  setAnchorEl: (a: HTMLDivElement | null) => void;
}

const PopoverSearch = ({ title, anchorEl, setAnchorEl }: iPopoverSearch) => {
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Popover
      id={open ? "simple-popover" : undefined}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      sx={{
        ".MuiPaper-root": {
          backgroundColor: "transparent",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "12px",
        },
      }}
    >
      <DrawerSortProvider>
        <Box
          sx={{
            maxHeight: "calc( 100vh - 300px )",
          }}
          onMouseLeave={handleClose}
        >
          <TokensTable title={title} />
        </Box>
      </DrawerSortProvider>
    </Popover>
  );
};

export default PopoverSearch;
