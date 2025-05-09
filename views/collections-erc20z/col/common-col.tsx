import PriceChangeText from "@/components/collections/price-change-text";
import {
  formatNumberWithKM,
  formatTokenFixedto,
  formatUSD,
} from "@/utils/format";
import { Box } from "@mui/material";
import { formatDistanceToNowStrict } from "date-fns";

export const CommonKMCol = ({ value }: { value?: string }) => {
  return (
    <div className={`td4`}>
      <h6>{formatNumberWithKM(value, "$")}</h6>
    </div>
  );
};
export const Common$Col = ({ value }: { value?: string }) => {
  return (
    <div className={`td2`}>
      <h6 className="price gem">${formatTokenFixedto(value, 2)}</h6>
    </div>
  );
};

export const CommonDate = ({ value }: { value?: number }) => {
  return (
    <div className="td2">
      <h6 className="price gem">
        {value ? formatDistanceToNowStrict(new Date(value * 1000)) : ""}
      </h6>
    </div>
  );
};

export const CommonCol = ({ value }: { value?: string }) => {
  return (
    <div className={`td4`}>
      <h6>{value}</h6>
    </div>
  );
};
export const CommonPriceChangeCol = ({ value }: { value?: string }) => {
  return (
    <div className={`td3 ${Number(value) < 0 ? "danger" : "success"}`}>
      <PriceChangeText priceChange={value} />
    </div>
  );
};

export const CommonTXCol = ({
  total,
  value1,
  value2,
}: {
  total?: string;
  value2?: string;
  value1?: string;
}) => {
  return (
    <div className="td5" style={{ flexDirection: "column", rowGap: "14px" }}>
      <h6>{total}</h6>
      <Box sx={{ display: "flex", columnGap: 0.4 }}>
        <h6 style={{ color: "#00B912", fontSize: 12 }}>{value1}</h6>
        <h6 style={{ color: "gray", fontSize: 12 }}>/</h6>
        <h6 style={{ color: "#DC2626", fontSize: 12 }}>{value2}</h6>
      </Box>
    </div>
  );
};
