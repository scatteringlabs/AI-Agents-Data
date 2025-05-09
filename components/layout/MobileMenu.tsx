import { MenuConfig } from "@/configs/header";
import Link from "next/link";
import { useRouter } from "next/router";
interface MobileMenuProps {
  handleMobileMenu: () => void;
}
export default function MobileMenu({ handleMobileMenu }: MobileMenuProps) {
  const router = useRouter();
  return (
    <>
      <nav id="mobile-main-nav" className="mobile-main-nav">
        <ul id="menu-mobile-menu" className="menu">
          {MenuConfig?.map((menu) => (
            <li
              className={
                router?.pathname?.toLowerCase() === menu.url?.toLowerCase()
                  ? "item-menu-mobile current-menu-item"
                  : "item-menu-mobile"
              }
              key={menu.label}
              onClick={handleMobileMenu}
            >
              <Link
                href={menu.url}
                target={menu.url?.includes("http") ? "_blank" : "_self"}
              >
                {menu.label}
                {menu.label === "Genie" ? (
                  <span
                    style={{
                      background: "red",
                      color: "#fff",
                      fontSize: 10,
                      fontFamily: "Poppins",
                      fontWeight: 500,
                      padding: "0px 4px",
                      borderRadius: "4px",
                      marginLeft: 4,
                      height: "18px",
                      lineHeight: "18px",
                    }}
                  >
                    New
                  </span>
                ) : null}
              </Link>
            </li>
          ))}

          <li className="item-menu-mobile">
            <Link href="/launchpad/explore">Hybrid Meme</Link>
          </li>
          <li className="item-menu-mobile">
            <Link href="#">
              AI Agents
              <span style={{ fontSize: 12, marginLeft: "8px" }}>
                (coming soon)
              </span>
            </Link>
          </li>
          <li className="item-menu-mobile">
            <Link href="https://t.me/hybridnfts" target="_blank">
              Telegram sniper bot
            </Link>
          </li>
          <li className="item-menu-mobile">
            <Link href="https://stoken.scattering.io/points" target="_blank">
              Points
            </Link>
          </li>
          <li className="item-menu-mobile">
            <Link href="https://stoken.scattering.io/trade" target="_blank">
              sToken
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
