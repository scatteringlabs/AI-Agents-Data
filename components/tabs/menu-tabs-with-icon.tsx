import React, { useState, useCallback } from "react";
import Iconify from "../iconify";
export interface TabItem {
  tabkey: string;
  icon?: string;
}

interface MenuTabsProps {
  tabs: TabItem[];
  onChange?: (key: string) => void;
}

export default function MenuTabsWithIcon({ tabs, onChange }: MenuTabsProps) {
  const [activeKey, setActivKey] = useState<string>(tabs?.[0]?.tabkey || "");

  const handleOnClick = useCallback(
    (key: string) => {
      setActivKey(key);
      if (onChange) {
        onChange(key);
      }
    },
    [onChange],
  );

  return (
    <ul className="widget-menu-tab">
      {tabs.map(({ tabkey, icon }) => (
        <li
          key={tabkey}
          className={activeKey === tabkey ? "item-title active" : "item-title"}
          onClick={() => handleOnClick(tabkey)}
          style={{ display: "flex", alignItems: "center" }}
        >
          {icon ? (
            <Iconify icon={icon} sx={{ width: 16, height: 16, mr: 1 }} />
          ) : null}
          <span className="inner">{tabkey}</span>
        </li>
      ))}
    </ul>
  );
}
