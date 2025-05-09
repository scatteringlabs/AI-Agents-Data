import { Duration } from "@/services/framework/list";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import React from "react";

const durations: Duration[] = ["1d", "3d", "7d", "30d"];

export default function TimeFilterTabs({
  value,
  onChange,
}: {
  value: Duration;
  onChange: (val: Duration) => void;
}) {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={(_, val) => val && onChange(val)}
      size="small"
      color="primary"
      sx={{
        ".MuiButtonBase-root.Mui-selected": { color: "#B054FF !important" },
      }}
    >
      {durations.map((d) => (
        <ToggleButton
          key={d}
          value={d}
          sx={{
            fontSize: 20,
            px: 2,
            color: "gray",
          }}
        >
          {d}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
