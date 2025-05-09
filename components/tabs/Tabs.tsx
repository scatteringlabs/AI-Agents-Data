import { useCallback, useMemo, useState } from "react";

interface TabsProps {
  widthFull?: boolean;
  items: string[];
  onChange?: (val: string) => void;
  initValue?: string;
}

export default function Tabs({
  items,
  onChange,
  widthFull = false,
  initValue,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(initValue || items[0]);
  const handleClick = useCallback(
    (val: string) => {
      setActiveTab(val);
      onChange && onChange(val);
    },
    [onChange],
  );
  const tabs = useMemo(
    () =>
      items?.map((item) => (
        <span
          style={{
            minWidth: 120,
            textAlign: "center",
            width: widthFull ? "100%" : "auto",
            fontWeight: 800,
          }}
          key={item}
          className={`${item === activeTab ? "tw-bg-pink2 tw-text-white" : "tw-text-greyMetal"}  tw-rounded-full tw-p-6 tw-text-sm tw-inline-block tw-font-medium md:tw-text-base tw-cursor-pointer`}
          onClick={() => handleClick(item)}
        >
          {item}
        </span>
      )),
    [items, activeTab, handleClick, widthFull],
  );
  return (
    <div className="tw-rounded-full tw-border tw-border-solid tw-border-white/10 tw-flex">
      {tabs}
    </div>
  );
}
