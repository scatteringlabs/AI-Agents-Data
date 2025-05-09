import { styled } from "@mui/material/styles";
import MButton, { ButtonProps } from "@mui/material/Button";

const Button = styled(MButton)<ButtonProps>({
  fontSize: "14px",
  borderRadius: "9999px",
  backgroundColor: "#AF54FF !important",
  "&:hover": {
    backgroundColor: "#AF54FF",
  },
  width: "100%",
  fontWeight: "bold",
  color: "#000",
});

export default Button;
