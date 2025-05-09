import React from "react";
import { Box, Button, ButtonGroup } from "@mui/material";

interface TimeFilterProps {
  value: "1h" | "6h" | "24h";
  onChange: (time: "1h" | "6h" | "24h") => void;
}

const TimeFilter: React.FC<TimeFilterProps> = ({ value, onChange }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0)",
        padding: "0px",
        borderRadius: 2,
        width: "fit-content",
        mr: 2,
      }}
    >
      <ButtonGroup variant="text">
        {["1h", "6h", "24h"].map((time) => (
          <Button
            key={time}
            onClick={() => onChange(time as "1h" | "6h" | "24h")}
            sx={{
              color: value === time ? "#fff" : "#b0b0b0",
              backgroundColor:
                value === time ? "#9b51e0" : "rgba(255, 255, 255, 0.10)",
              fontWeight: 600,
              textTransform: "none",
              border: "none",
              padding: "8px 16px",
              fontFamily: "Poppins",
              borderRight: "1px solid #0f071c !important",
              borderLeft: "1px solid #0f071c !important",
              borderRadius: 2,
              fontSize: 14,
              "&:hover": {
                backgroundColor: value === time ? "#9b51e0" : "#333333",
              },
            }}
          >
            {time}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
};

export default TimeFilter;
