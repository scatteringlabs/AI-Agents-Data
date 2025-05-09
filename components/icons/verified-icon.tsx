import CustomTooltip from "@/components/tooltip/CustomTooltip";
import { LinkText, TipText } from "../text";

const tooltipTitle = (
  <TipText>
    This is a verified collection.{" "}
    <LinkText href="https://forms.gle/3J4CpVtkaKBCbHzW6" target="_blank">
      Learn more
    </LinkText>
  </TipText>
);
export default function VerifiedIcon({ size = 20 }: { size?: number }) {
  return (
    <CustomTooltip title={tooltipTitle} arrow placement="right-end">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 26 26"
        fill="none"
      >
        <path
          d="M25.4242 11.604C25.793 11.975 26 12.4769 26 13C26 13.5231 25.793 14.025 25.4242 14.396L22.8712 16.9483V20.8974C22.8695 21.4204 22.661 21.9214 22.2912 22.2912C21.9214 22.661 21.4204 22.8695 20.8974 22.8712H16.9483L14.396 25.4242C14.025 25.793 13.5231 26 13 26C12.4768 26 11.975 25.793 11.6039 25.4242L9.05164 22.8712H5.10333C4.58024 22.8697 4.07901 22.6613 3.70907 22.2915C3.33913 21.9216 3.13053 21.4205 3.12881 20.8974V16.9483L0.575775 14.3961C0.206992 14.025 0 13.5232 0 13C0 12.4769 0.206992 11.975 0.575775 11.604L3.12879 9.05169V5.10261C3.1305 4.57953 3.3391 4.07838 3.70904 3.70857C4.07899 3.33876 4.58022 3.13034 5.1033 3.12881H9.05164L11.604 0.575775C11.975 0.206992 12.4769 0 13 0C13.5231 0 14.025 0.206992 14.396 0.575775L16.9483 3.12879H20.8974C21.4204 3.1305 21.9214 3.339 22.2912 3.70879C22.661 4.07858 22.8695 4.57963 22.8712 5.10259V9.05164L25.4242 11.604ZM13 19.4999L18.7777 8.66675H15.8889L13 14.5759L10.1112 8.66675H7.22231L13 19.4999Z"
          fill="#B054FF"
        />
      </svg>
    </CustomTooltip>
  );
}
