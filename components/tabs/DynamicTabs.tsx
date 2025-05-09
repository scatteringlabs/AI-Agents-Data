import { Box, Typography } from "@mui/material";
import React, { useState, useCallback } from "react";

interface Tab {
  id: number;
  name: string;
}

interface DynamicTabsProps {
  tabs: Tab[];
  total: number;
  onChange?: (id: number, name: string) => void;
}

export default function DynamicTabs({
  tabs,
  onChange,
  total,
}: DynamicTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>(tabs[0]);

  const handleOnClick = useCallback(
    (tab: Tab) => {
      setActiveTab(tab);
      if (onChange) {
        onChange(tab.id, tab.name);
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
          key={tab.id}
          className={
            activeTab.id === tab.id ? "item-title active" : "item-title"
          }
          onClick={() => handleOnClick(tab)}
          style={{ display: "flex", alignItems: "center" }}
        >
          {tab.name?.toLowerCase() === "drakula" ? (
            <Box
              component="img"
              src="/assets/images/tags/drakula.png"
              alt=""
              className="avatar"
              // onError={handleImgError}
              sx={{
                width: { md: 20, xs: 20 * 0.6 },
                height: { md: 20, xs: 20 * 0.6 },
                borderRadius: "50%",
                position: "relative",
                zIndex: 1,
                mr: { md: 1, xs: 0.4 },
              }}
            />
          ) : null}
          <span className="inner">
            {tab.name}
            {activeTab.id === tab.id ? `(${total})` : ""}
          </span>
        </li>
      ))}
    </ul>
  );
}
