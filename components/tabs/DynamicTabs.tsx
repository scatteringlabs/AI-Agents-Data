import { Box, Typography } from "@mui/material";
import React, { useState, useCallback } from "react";

interface Tab {
  rank: number;
  name: string;
}

interface DynamicTabsProps {
  tabs: Tab[];
  total: number;
  activetab?: Tab;
  onChange?: (rank: number, name: string) => void;
}

export default function DynamicTabs({
  tabs,
  onChange,
  total,
  activetab,
}: DynamicTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>(activetab || tabs[0]);

  const handleOnClick = useCallback(
    (tab: Tab) => {
      setActiveTab(tab);
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
            activeTab.name === tab.name ? "item-title active" : "item-title"
          }
          onClick={() => handleOnClick(tab)}
          style={{ display: "flex", alignItems: "center" }}
        >
          <span className="inner" style={{ fontSize: "12px" }}>
            {tab.name}
            {activeTab.name === tab.name ? `(${total})` : ""}
          </span>
        </li>
      ))}
    </ul>
  );
}
