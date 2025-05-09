import { Menu } from "@headlessui/react";
import styles from "./collect.module.css";
import { useCallback, useState } from "react";

interface SelectItem {
  label: string;
  value: string | number;
}

interface CollectionSelectProps {
  options: SelectItem[];
  onSelect?: (val: string | number) => void;
}

export default function CollectionSelect({
  options,
  onSelect,
}: CollectionSelectProps) {
  const [activeItem, setActiveItem] = useState(options[0]);

  const handleClick = useCallback(
    (val: SelectItem) => {
      setActiveItem(val);
      onSelect && onSelect(val.value);
    },
    [onSelect],
  );

  return (
    <div className="tf-soft">
      <Menu as="div" className={`dropdown ${styles.select}`}>
        <Menu.Button
          className="btn btn-secondary dropdown-toggle"
          style={{
            borderRadius: "9999px",
            padding: "16px 24px",
            height: "100%",
          }}
          type="button"
          id="dropdownMenuButton"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <span className="tw-mr-1">Price:</span>
          <span className="inner">{activeItem.label}</span>
        </Menu.Button>
        <Menu.Items
          as="div"
          className="dropdown-menu d-block"
          aria-labelledby="dropdownMenuButton"
        >
          {options.map((option) => (
            <a
              className="dropdown-item"
              key={option.value}
              onClick={() => handleClick(option)}
            >
              <div className="sort-filter">
                <span>{option.label}</span>
                <span className="icon-tick">
                  <span className="path2" />
                </span>
              </div>
            </a>
          ))}
        </Menu.Items>
      </Menu>
    </div>
  );
}
