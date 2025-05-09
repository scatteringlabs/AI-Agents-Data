import { useFormContext, Controller } from "react-hook-form";
// @mui
import TextField from "@mui/material/TextField";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";
import { CustomTextField } from "./require-text";

// ----------------------------------------------------------------------

interface Props<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
> extends AutocompleteProps<T, Multiple, DisableClearable, FreeSolo> {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: React.ReactNode;
}

export default function RHFAutocomplete<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
>({
  name,
  label,
  placeholder,
  helperText,
  ...other
}: Omit<Props<T, Multiple, DisableClearable, FreeSolo>, "renderInput">) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...field}
          sx={{
            width: "100%",
            justifyContent: "center",
            display: "flex",
            background: "rgba(255, 255, 255, 0.05)",
            ".MuiInputBase-root": {
              background: "rgba(255, 255, 255, 0.05)",
              p: 0,
              paddingLeft: "10px !important",
              fontFamily: "Poppins",
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
          onChange={(event, newValue) =>
            setValue(name, newValue, { shouldValidate: true })
          }
          renderInput={(params) => (
            <CustomTextField
              // label={label}
              placeholder={placeholder}
              error={!!error}
              helperText={error ? error?.message : helperText}
              {...params}
            />
          )}
          {...other}
        />
      )}
    />
  );
}
