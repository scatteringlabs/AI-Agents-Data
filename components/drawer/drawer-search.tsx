import { Box, InputAdornment, TextField, styled } from "@mui/material";
import Iconify from "../iconify";
import { useCallback, useEffect, useRef } from "react";
import { CustomTextField } from "./search-input-button";
import { useGlobalState } from "@/context/GlobalStateContext";

interface iDrawerSearch {
  setSearchQuery: (a: string) => void;
  searchQuery: string;
}

const DrawerSearch = ({ setSearchQuery, searchQuery }: iDrawerSearch) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { selectedOption } = useGlobalState();

  const handleSearch = useCallback(
    (inputValue: string) => {
      setSearchQuery(inputValue);
    },
    [setSearchQuery],
  );

  useEffect(() => {
    // Focus the input when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <CustomTextField
      inputRef={inputRef}
      value={searchQuery}
      sx={{
        borderRadius: "6px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        background: {
          md: "#0E111C",
          xs: "#0E111C",
        },
        width: { xs: "80%", md: "100%" },
        input: {
          width: "100%",
          background: "transparent !important",
          pl: "0px !important",
        },
        "& .MuiInputBase-input::placeholder": {
          color: "#B054FF",
          opacity: 0.3,
        },
      }}
      autoComplete="off"
      placeholder="Search token or contract address"
      type="search"
      onChange={(event) => handleSearch(event?.target?.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Iconify icon="eva:search-fill" sx={{ ml: 1, color: "#B054FF" }} />
          </InputAdornment>
        ),
        endAdornment: searchQuery ? (
          <InputAdornment position="start">
            <Iconify
              onClick={() => handleSearch("")}
              icon="ic:twotone-clear"
              sx={{ ml: 1, color: "#B054FF", cursor: "pointer" }}
            />
          </InputAdornment>
        ) : null,
      }}
    />
  );
};

export default DrawerSearch;
