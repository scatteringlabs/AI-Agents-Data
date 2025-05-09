import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
// @mui
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
// routes
// import { useRouter } from "src/routes/hooks";
// components
import Iconify from "@/components/iconify";
import SearchNotFound from "@/components/search-not-found";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  styled,
} from "@mui/material";
import Link from "next/link";
import AvatarCard from "../../collections/avatar-card";
import { useQuery } from "@tanstack/react-query";
import { getCollections } from "@/services/collections";
import { Ref, useCallback, useEffect, useRef, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import PriceChangeText from "../../collections/price-change-text";
import { formatIntNumberWithKM, formatUSD } from "@/utils/format";
import { TableDrawerHeader } from "@/components/drawer/table-drawer-header";
import {
  DrawerSortProvider,
  useDrawerSort,
} from "@/context/drawer-token-sort-provider";
import { TableDrawerRow } from "@/components/drawer/table-drawer-row";
import { useRouter } from "next/router";
import { SortFieldMap } from "@/components/drawer/tokens-table";
import { TableSkeleton } from "@/components/skeleton/table-skeleton";
// types
// import { IProductItem } from "src/types/product";

// ----------------------------------------------------------------------

type Props = {
  query: string;
  results: any[];
  onSearch: (inputValue: string) => void;
  hrefItem: (id: string) => string;
  loading?: boolean;
};
const CustomTextField = styled(TextField)({
  border: "1px solid rgba(255,255,255,0.3)",
  borderRadius: "8px",
  "& .MuiOutlinedInput-root": {
    paddingLeft: "10px",
    borderRadius: "8px",
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#af54ff",
      borderWidth: "1px",
    },
  },
});
export default function CollectionSearch() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const { sortOrder = "desc", sortedField = "24h Vol" } = useDrawerSort();
  const debouncedQuery = useDebounce(searchQuery);
  const router = useRouter();
  const { collectionAddress = "" } = router.query;
  const handleSearch = useCallback((inputValue: string) => {
    setSearchQuery(inputValue);
  }, []);

  const { data: collections, isLoading } = useQuery({
    queryKey: ["collections", { sortedField, sortOrder, debouncedQuery }],
    queryFn: () =>
      getCollections({
        page: 1,
        page_size: 50,
        sort_field: SortFieldMap[sortedField || "24h Vol"],
        type_name: "",
        sort_direction: sortOrder || "desc",
        name_like: debouncedQuery,
      }),
  });

  // const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (debouncedQuery) {
  //     if (event.key === "Enter") {
  //       collections?.data?.list?.filter(
  //         (product) => product.name === debouncedQuery,
  //       )[0];
  //     }
  //   }
  // };
  const clearSearch = () => {
    setSearchQuery("");
  };
  const handleClick = (event: React.SyntheticEvent) => {
    setOpen(false);
    setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }, 0);
  };
  return (
    <Autocomplete
      sx={{
        width: "100%",
        justifyContent: "center",
        display: "flex",
        ".MuiInputBase-root": {
          p: 0,
          paddingRight: "10px !important",
          padding: "6px 0px",
          border: "1px solid rgba(255, 255, 255, 0.01)",
          "&:hover": {
            background: "rgba(255, 255, 255, 0.05)",
            // borderRadius: "12px",
            // border: "1px solid rgba(255, 255, 255, 0.2)",
          },
        },
        ".Mui-focused": {
          padding: "6px 0px",
        },
      }}
      open={open}
      blurOnSelect={true}
      loading={isLoading}
      autoHighlight
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      inputValue={searchQuery}
      popupIcon={null}
      options={collections?.data?.list || []}
      onInputChange={(event, newValue) => handleSearch(newValue)}
      // getOptionLabel={(option) => option.name}
      getOptionLabel={(option) =>
        `${option.name} ${option.erc721_address} ${option.erc20_address} ${option.symbol}`
      }
      // onKeyUp={handleKeyUp}
      noOptionsText={<SearchNotFound query={searchQuery} />}
      isOptionEqualToValue={(option, value) =>
        option.erc721_address === value.erc721_address
      }
      slotProps={{
        popper: {
          placement: "bottom-start",

          sx: {
            py: 2,
            minWidth: { sm: "100%", md: "360px" },
            background: "transparent",
            maxHeight: { sm: "300px", md: "700px" },
            // paddingRight: "20px !important",
          },
        },
        paper: {
          sx: {
            padding: { sm: "20px", md: 0 },
            borderRadius: "14px",
            background: "#0E111C",
            [` .${autocompleteClasses.option}`]: {
              pl: 0.75,
            },
            maxHeight: { sm: "300px", md: "700px" },
          },
        },
      }}
      renderInput={(params) => {
        // const setRef = (inputEl: HTMLInputElement) => {
        //   // @ts-ignore
        //   inputRef.current = inputEl;
        //   if (typeof params.InputProps.ref === "function") {
        //     params.InputProps.ref(inputEl);
        //   }
        // };
        return (
          <CustomTextField
            {...params}
            sx={{
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              background: {
                md: "rgba(255, 255, 255, 0.05)",
                xs: "rgba(255, 255, 255, 0.05)",
              },
              width: { sm: "100%", md: "100%" },
              maxWidth: { sm: "100%", md: "480px" },
              input: {
                background: "transparent !important",
              },
            }}
            placeholder="Search token or contract address"
            name="s"
            title="Search for"
            required
            type="search"
            // ref={inputRef}
            InputProps={{
              ...params.InputProps,
              // ref: inputRef,
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify
                    icon="eva:search-fill"
                    sx={{ ml: 1, color: "#fff" }}
                  />
                </InputAdornment>
              ),
              endAdornment: searchQuery ? (
                <InputAdornment position="start">
                  <Iconify
                    onClick={clearSearch}
                    icon="ic:twotone-clear"
                    sx={{ ml: 1, color: "#fff", cursor: "pointer" }}
                  />
                </InputAdornment>
              ) : null,
            }}
          />
        );
      }}
      renderOption={(props: any, item, { inputValue }) => {
        // const matches = match(product.name, inputValue);
        // const parts = parse(product.name, matches);
        if (isLoading) {
          return (
            <Box
              className="widget-table-ranking"
              sx={{ color: "#fff", px: "16px" }}
            >
              <TableDrawerHeader title="TRADE" />
              <Box className="table-ranking-content table-token-content">
                <TableSkeleton />
              </Box>
            </Box>
          );
        }
        const index = props?.["data-option-index"] || 0;

        return (
          <Box
            className="widget-table-ranking search-token"
            sx={{ color: "#fff", px: "16px" }}
          >
            {index === 0 ? <TableDrawerHeader title="TRADE" /> : null}
            <Box className="table-ranking-content table-token-content search-token-content">
              <TableDrawerRow
                key={item.rank}
                item={item}
                title="TRADE"
                collectionAddress={collectionAddress?.toString() || ""}
              />
            </Box>
          </Box>
        );
      }}
    />
  );
}
