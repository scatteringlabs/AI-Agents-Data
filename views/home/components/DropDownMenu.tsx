import Link from "next/link";
import { Menu } from "@headlessui/react";

interface DropDownItem {
  label: string;
  value: string;
}

interface DropDownMenuProps {
  items: DropDownItem[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

function DropDownMenu({ items, selectedValue, onSelect }: DropDownMenuProps) {
  return (
    <div className="tf-soft">
      <div className="soft-right">
        <Menu as="div" className="dropdown">
          <Menu.Button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <svg
              width={20}
              height={20}
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.125 5.625H16.875M3.125 10H16.875M3.125 14.375H10"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>
              {items.find((item) => item.value === selectedValue)?.label ||
                "Select"}
            </span>
          </Menu.Button>
          <Menu.Items className="dropdown-menu d-block show">
            <h6>Sort by</h6>
            {items.map((item) => (
              <Link
                href="#"
                key={item.value}
                onClick={(e) => {
                  e.preventDefault();
                  onSelect(item.value);
                }}
                className="dropdown-item"
              >
                <div
                  className={`sort-filter ${selectedValue === item.value ? "active" : ""}`}
                >
                  <span>{item.label}</span>
                  <span className="icon-tick">
                    <span className="path2" />
                  </span>
                </div>
              </Link>
            ))}
          </Menu.Items>
        </Menu>
      </div>
    </div>
  );
}

export default DropDownMenu;
