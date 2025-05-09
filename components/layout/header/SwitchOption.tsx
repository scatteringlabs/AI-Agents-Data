// components/SwitchOption.tsx
import React from "react";
import { Typography } from "@mui/material";

interface SwitchOptionProps {
  value: string; // 用于逻辑处理
  label: string; // 用于显示的文本
  isSelected: boolean;
  onClick: (value: string) => void;
  borderRadius?: string;
  selectedBgColor?: string;
  unselectedBgColor?: string;
  selectedColor?: string;
  unselectedColor?: string;
}

const SwitchOption: React.FC<SwitchOptionProps> = ({
  value,
  label,
  isSelected,
  onClick,
  borderRadius = "4px",
  selectedBgColor = "rgb(176, 84, 255,0.2)",
  unselectedBgColor = "rgb(176, 84, 255,0.3)",
  selectedColor = "#fff",
  unselectedColor = "inherit",
}) => {
  return (
    <Typography
      sx={{
        background: isSelected ? selectedBgColor : unselectedBgColor,
        px: { md: 2, xs: 1 },
        py: 0.6,
        borderRadius,
        color: isSelected ? selectedColor : unselectedColor,
        cursor: "pointer",
        textAlign: "center",
        fontFamily: "Poppins",
        fontSize: { md: 14, xs: 12 },
        fontWeight: isSelected ? 600 : 400,
      }}
      onClick={() => onClick(value)}
    >
      {label}
    </Typography>
  );
};

export default SwitchOption;
