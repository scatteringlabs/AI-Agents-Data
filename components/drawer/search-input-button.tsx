import { InputAdornment, TextField, styled } from "@mui/material";
import Iconify from "../iconify";
import { useGlobalState } from "@/context/GlobalStateContext";

export const CustomTextField = styled(TextField)({
  border: "1px solid #B054FF",
  borderRadius: "12px",
  width: "100%",
  "& .MuiOutlinedInput-root": {
    paddingLeft: "10px",
    borderRadius: "10px",
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#af54ff",
      borderWidth: "1px",
    },
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#B054FF",
    opacity: 1,
  },
});

const SearchInputButton = ({ setOpen }: { setOpen: (a: boolean) => void }) => {
  const { selectedOption } = useGlobalState();
  return (
    <CustomTextField
      value=""
      sx={{
        borderRadius: "12px",
        border: "1px solid #B054FF",
        background: {
          md: "#0E111C",
          xs: "#0E111C",
        },
        width: { sm: "100%", md: "100%" },
        // maxWidth: { sm: "100%", md: "100%" },
        input: {
          width: "100%",
          background: "transparent !important",
          pl: "0px !important",
        },
      }}
      autoComplete="off"
      placeholder={
        selectedOption === "404s"
          ? "Search collection or contract address"
          : "Search token or contract address"
      }
      type="search"
      onClick={() => {
        setOpen(true);
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Iconify icon="eva:search-fill" sx={{ ml: 1, color: "#B054FF" }} />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchInputButton;
