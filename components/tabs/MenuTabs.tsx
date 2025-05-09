import React, { useState, useCallback } from "react";

interface MenuTabsProps {
  tabs: string[];
  onChange?: (key: string) => void;
}

export default function MenuTabs({ tabs, onChange }: MenuTabsProps) {
  const [activeKey, setActivKey] = useState<string>(tabs?.[0] || "");

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
      {tabs.map((tab) => (
        <li
          key={tab}
          className={activeKey === tab ? "item-title active" : "item-title"}
          onClick={() => handleOnClick(tab)}
        >
          <span className="inner">{tab}</span>
        </li>
      ))}
    </ul>
  );
}
