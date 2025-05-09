import { Typography } from "@mui/material";

interface iPriceChangeText {
  priceChange?: string | number;
  fontSize?: number;
  fontWeight?: number;
}
const PriceChangeText = ({
  priceChange,
  fontSize,
  fontWeight = 600,
}: iPriceChangeText) => {
  return (
    <Typography
      variant="h5"
      sx={{
        color:
          Number(priceChange) > 0
            ? "#00B912"
            : Number(priceChange) === 0
              ? "rgba(255, 255, 255,0.6)"
              : "#DC2626",
        textAlign: "right",
        fontSize: fontSize ? fontSize : { md: 14, xs: 12 },
        fontWeight,
      }}
    >
      {priceChange ? Number(priceChange) : 0}%
    </Typography>
  );
};

export default PriceChangeText;
