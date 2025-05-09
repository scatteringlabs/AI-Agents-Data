import { Tooltip, TooltipProps, tooltipClasses } from "@mui/material";
import { styled } from "@mui/material/styles";

const CustomTooltip = styled(
  ({ className, ...props }: TooltipProps & { className?: string }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ),
)(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#202025",
    color: "#fff",
    padding: "10px 20px",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#202025",
  },
}));

export default CustomTooltip;
