import { MenuConfig } from "@/configs/header";
import Link from "next/link";
import { useRouter } from "next/router";
import Sidebar from "./Sidebar";
interface MobileMenuProps {
  handleMobileMenu: () => void;
}
export default function MobileMenu({ handleMobileMenu }: MobileMenuProps) {
  const router = useRouter();
  return (
    <>
      <nav id="mobile-main-nav" className="mobile-main-nav">
        <Sidebar />
      </nav>
    </>
  );
}
