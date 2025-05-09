import React, { useState, useCallback, useMemo } from "react";
import IconButton from "@mui/material/IconButton";
import Iconify from "../iconify/iconify";
import { Box, Typography } from "@mui/material";
import { useSort } from "@/context/erc20z-token-sort-provider";

type SortOrder = "asc" | "desc" | "none";
interface iSortIconButton {
  title: string;
}
const SortIconButton20Z = ({ title }: iSortIconButton) => {
  const { setSortedField, sortOrder, sortedField } = useSort();

  const toggleSort = useCallback(() => {
    setSortedField(title);
  }, [setSortedField, title]);

  return (
    <Box
      onClick={toggleSort}
      sx={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        background:
          sortedField === title ? "rgba(255, 255, 255, 0.05)" : "transparent",
        borderRadius: "4px",
        padding: sortedField === title ? "2px 10px" : "0px",
        width: "auto",
        fontSize: "12px !important",
        fontWeight: 500,
        color: "rgba(255, 255, 255, 0.8)",
      }}
    >
      {title}
      <Box sx={{ ml: 1 }}>
        <Box
          aria-label="sort"
          sx={{
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Iconify
            icon="flowbite:angle-up-outline"
            sx={{
              width: 14,
              height: 14,
              color:
                sortOrder === "asc" && sortedField === title
                  ? "#fff"
                  : "#545454",
            }}
          />
          <Iconify
            icon="flowbite:angle-down-outline"
            sx={{
              width: 14,
              height: 14,
              color:
                sortOrder === "desc" && sortedField === title
                  ? "#fff"
                  : "#545454",
              mt: "-4px",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SortIconButton20Z;
