import { Dialog } from "@mui/material";
import HeaderTokensTable from "./header-tokens-table";
import HeaderTokensTableErc20Z from "./header-tokens-table-erc20z";
import { useGlobalState } from "@/context/GlobalStateContext";
interface iDialogSearch {
  setOpen: (a: boolean) => void;
  open: boolean;
}

const DialogSearch = ({ setOpen, open }: iDialogSearch) => {
  const { selectedOption } = useGlobalState();
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      aria-labelledby="responsive-dialog-title"
      sx={{
        ".MuiDialog-container": {
          alignItems: "flex-start",
          ".MuiPaper-root": {
            // width: "100%",
            background: "transparent",
            mx: {
              md: 1,
              xs: 1,
            },
            my: {
              md: 2,
              xs: 1,
            },
          },
        },
      }}
      slotProps={{
        backdrop: {
          style: {
            backgroundColor: "rgba(0, 0, 0, 0)",
          },
        },
      }}
    >
      <HeaderTokensTableErc20Z title="TRADE" closeDialog={handleClose} />
    </Dialog>
  );
};

export default DialogSearch;
