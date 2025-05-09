import { SortProvider } from "@/context/token-sort-provider";
import { Drawer } from "@mui/material";
import { useCallback, useState } from "react";
import TokensTable from "./tokens-table";
import { DrawerSortProvider } from "@/context/drawer-token-sort-provider";
interface iTokenDrawer {
  open: boolean;
  toggleDrawer: () => void;
  title?: string;
}
export const TokenDrawer = ({
  open,
  toggleDrawer,
  title = "TRADE",
}: iTokenDrawer) => {
  return (
    <Drawer open={open} onClose={toggleDrawer}>
      <DrawerSortProvider>
        <TokensTable toggleDrawer={toggleDrawer} title={title} />
      </DrawerSortProvider>
    </Drawer>
  );
};
