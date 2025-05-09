import { formatNumberWithKM, formatUSD } from "@/utils/format";
import { Typography } from "@mui/material";
import { size } from "viem";

interface iLabelPriceText {
  label: string;
  price: string | number;
}
const LabelPriceText = ({ label, price }: iLabelPriceText) => {
  return (
    <Typography
      variant="h6"
      style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "14px" }}
    >
      {label}:
      <span
        style={{
          color: "white",
          paddingLeft: 4,
          fontSize: "14px",
          fontWeight: "400",
        }}
      >
        {price}
      </span>
    </Typography>
  );
};

export default LabelPriceText;
