import React, { useState, useCallback, useMemo } from "react";
import IconButton from "@mui/material/IconButton";
import Iconify from "../iconify/iconify";
import { Box, Typography } from "@mui/material";
import { useSort } from "@/context/token-sort-provider";

type SortOrder = "asc" | "desc" | "none";
interface iSortIconButton {
  title: string;
}
const SortIconButton = ({ title }: iSortIconButton) => {
  const { setSortedField, sortOrder, sortedField } = useSort();

  const toggleSort = useCallback(() => {
    setSortedField(title);
  }, [setSortedField, title]);

  return (
    <Typography
      onClick={toggleSort}
      variant="h3"
      sx={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        background:
          sortedField === title ? "rgba(255, 255, 255, 0.05)" : "transparent",
        borderRadius: "4px",
        padding: sortedField === title ? "8px 10px" : "0px",
        width: "auto",
        fontSize: { md: "14px !important", xs: "12px !important" },
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
    </Typography>
  );
};

export default SortIconButton;
