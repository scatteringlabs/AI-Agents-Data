import { Box, Typography } from "@mui/material";
import React, { useState, useCallback } from "react";

interface Tab {
  rank: number;
  name: string;
}

interface DynamicTabsProps {
  tabs: Tab[];
  total: number;
  activeName: string;
  onChange?: (rank: number, name: string) => void;
}

export default function DynamicTabsNew({
  tabs,
  onChange,
  total,
  activeName,
}: DynamicTabsProps) {
  const handleOnClick = useCallback(
    (tab: Tab) => {
      if (onChange) {
        onChange(tab.rank, tab.name);
      }
    },
    [onChange],
  );

  return (
    <ul
      className="widget-menu-tab"
      style={{
        display: "flex",
        flexWrap: "wrap",
        padding: 0,
        listStyleType: "none",
      }}
    >
      {tabs.map((tab) => (
        <li
          key={tab.name}
          className={
            activeName === tab.name ? "item-title active" : "item-title"
          }
          onClick={() => handleOnClick(tab)}
          style={{ display: "flex", alignItems: "center" }}
        >
          <span className="inner" style={{ fontSize: "12px" }}>
            {tab.name}
            {activeName === tab.name ? `(${total})` : ""}
          </span>
        </li>
      ))}
    </ul>
  );
}
