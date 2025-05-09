import PriceChangeText from "@/components/collections/price-change-text";
import {
  formatNumberWithKM,
  formatTokenFixedto,
  formatUSD,
} from "@/utils/format";
import { Box, Tooltip, Typography } from "@mui/material";
import { formatDistanceToNowStrict } from "date-fns";
import { parseISO, format } from "date-fns";

export const CommonKMCol = ({ value }: { value?: string }) => {
  return (
    <div
      className={`td4`}
      style={{
        width: "120px",
        padding: "0 10px",
        display: "flex",
        justifyContent: "flex-start",
      }}
    >
      <h6 style={{ fontSize: "14px", marginLeft: "-18px" }}>
        {formatNumberWithKM(value, "$")}
      </h6>
    </div>
  );
};

export const Common$Col = ({ value }: { value?: string }) => {
  return (
    <div
      className={`td2`}
      style={{
        width: "120px",
        padding: "0 10px",
        display: "flex",
        justifyContent: "flex-start",
      }}
    >
      <h6
        className="price gem"
        style={{ fontSize: "14px", marginLeft: "-24px" }}
      >
        ${formatTokenFixedto(value, 3)}
      </h6>
    </div>
  );
};

export const CommonDate = ({ value }: { value?: number }) => {
  return (
    <div
      className="td2"
      style={{
        width: "120px",
        padding: "0 10px",
        display: "flex",
        justifyContent: "flex-start",
      }}
    >
      <h6
        className="price gem"
        style={{ fontSize: "14px", marginLeft: "-14px" }}
      >
        {value ? formatDistanceToNowStrict(new Date(value * 1000)) : ""}
      </h6>
    </div>
  );
};

export const CommonCol = ({ value }: { value?: string }) => {
  let displayValue = "N/A";
  let title = "";
  try {
    if (value && value !== "N/A") {
      const date =
        typeof value === "string"
          ? parseISO(value)
          : new Date(Number(value) * 1000);
      const now = new Date();
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60),
      );

      if (diffInMinutes < 60) {
        displayValue = `${diffInMinutes}m`;
      } else if (diffInMinutes < 1440) {
        // 24 hours
        const hours = Math.floor(diffInMinutes / 60);
        displayValue = `${hours}h`;
      } else if (diffInMinutes < 43200) {
        // 30 days
        const days = Math.floor(diffInMinutes / 1440);
        displayValue = `${days}d`;
      } else if (diffInMinutes < 525600) {
        // 365 days
        const months = Math.floor(diffInMinutes / 43200);
        displayValue = `${months}mo`;
      } else {
        const years = Math.floor(diffInMinutes / 525600);
        const remainingMonths = Math.floor((diffInMinutes % 525600) / 43200);
        if (remainingMonths === 0) {
          displayValue = `${years}y`;
        } else {
          displayValue = `${years}y ${remainingMonths}mo`;
        }
      }

      title = format(date, "MMM dd, yyyy");
    }
  } catch (error) {
    console.error("Error parsing date:", error);
  }

  return (
    <div
      className={`td4`}
      style={{
        padding: "0 8px",
        textAlign: "left",
        display: "flex",
        justifyContent: "flex-start",
      }}
    >
      <Tooltip
        title={title}
        enterDelay={0}
        leaveDelay={0}
        arrow
        placement="top"
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: "rgba(0, 0, 0, 0.8)",
              "& .MuiTooltip-arrow": {
                color: "rgba(0, 0, 0, 0.8)",
              },
              fontSize: "12px",
              padding: "8px 12px",
            },
          },
        }}
      >
        <h6
          style={{
            fontSize: "14px",
            position: "relative",
            cursor: "default",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            margin: 0,
            padding: 0,
            textAlign: "left",
            marginLeft: "-14px",
          }}
        >
          {displayValue}
        </h6>
      </Tooltip>
    </div>
  );
};

export const CommonPriceChangeCol = ({ value }: { value?: string }) => {
  return (
    <div
      className={`td3 ${Number(value) < 0 ? "danger" : "success"}`}
      style={{
        width: "120px",
        padding: "0 10px",
        display: "flex",
        justifyContent: "flex-start",
      }}
    >
      <div style={{ marginLeft: "-18px" }}>
        <PriceChangeText priceChange={value} />
      </div>
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
    <div
      className="td5"
      style={{
        width: "120px",
        padding: "0 10px",
        flexDirection: "column",
        rowGap: "8px",
      }}
    >
      <h6 style={{ fontSize: "14px", marginLeft: "-64px" }}>{total}</h6>
      <Box sx={{ display: "flex", columnGap: 0.4, marginLeft: "-64px" }}>
        <h6 style={{ color: "#00B912", fontSize: "12px" }}>{value1}</h6>
        <h6 style={{ color: "gray", fontSize: "12px" }}>/</h6>
        <h6 style={{ color: "#DC2626", fontSize: "12px" }}>{value2}</h6>
      </Box>
    </div>
  );
};
