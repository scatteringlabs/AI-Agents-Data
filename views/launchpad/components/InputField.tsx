import React from "react";
import { InputBase, Typography, Box } from "@mui/material";

interface InputFieldProps {
  label: string;
  value: string;
  placeholder: string;
  error?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  placeholder,
  onChange,
  error = false,
}) => (
  <Box width="100%" mb={2}>
    <Typography
      sx={{ fontFamily: "Poppins", fontSize: 16, color: "#FFF", pl: 1, mb: 1 }}
    >
      {label}
    </Typography>
    <InputBase
      value={value}
      onChange={onChange}
      fullWidth
      placeholder={placeholder}
      sx={{
        fontFamily: "Poppins",
        color: "#fff",
        ".MuiInputBase-input": { color: "#fff", borderRadius: 1 },
        border: error ? "1px solid red" : "none",
        borderRadius: 1,
      }}
    />
  </Box>
);

export default InputField;
