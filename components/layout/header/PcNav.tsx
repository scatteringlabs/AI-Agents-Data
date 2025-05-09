import Link from "next/link";
import { useRouter } from "next/router";
import { MenuConfig } from "@/configs/header";
import { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import GlobalTypeSwitcher from "./GlobalTypeSwitcher";
import { useGlobalState } from "@/context/GlobalStateContext";

const PcNav = () => {
  const { selectedOption } = useGlobalState();

  const router = useRouter();
  const getPrimaryPath = (pathname: string) => {
    return pathname.split("/")[1]?.toLowerCase() || "";
  };

  const currentPrimaryPath = getPrimaryPath(router.pathname);
  const isActive = (url: string) => router.pathname.startsWith(url);
  const handleShallowRouteChange = (path: string) => {
    router.push(path, undefined, { shallow: true });
  };

  return (
    <nav id="main-nav" className="main-nav">
      <ul id="menu-primary-menu" className="menu">
        <GlobalTypeSwitcher />

        {selectedOption === "404s" &&
          MenuConfig?.map((menu) => {
            const menuPrimaryPath = getPrimaryPath(menu.url || "");

            return (
              <li
                className={
                  currentPrimaryPath && currentPrimaryPath === menuPrimaryPath
                    ? "menu-item current-menu-item"
                    : "menu-item"
                }
                key={menu.label}
              >
                <Link
                  href={menu.url}
                  target={menu.url?.includes("http") ? "_blank" : "_self"}
                >
                  <span
                    style={{ display: "inline-flex", alignItems: "center" }}
                  >
                    {menu.label}{" "}
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
                  </span>
                </Link>
              </li>
            );
          })}
        <li className="menu-item menu-item-has-children">
          <a>Launchpad</a>
          <ul className="sub-menu">
            {/* <li className="menu-item">
              <Link href="/genie">Scatter Genie</Link>
            </li> */}
            <li className="menu-item">
              <Link href="/launchpad/explore">Hybrid Meme </Link>
            </li>
            <li className="menu-item">
              <Link href="#">
                AI Agents
                <span style={{ fontSize: 12, marginLeft: "8px" }}>
                  (coming soon)
                </span>
              </Link>
            </li>
          </ul>
        </li>
        <li className="menu-item menu-item-has-children">
          <a>More</a>
          <ul className="sub-menu">
            {/* <li className="menu-item">
              <Link href="/genie">Scatter Genie</Link>
            </li> */}
            <li className="menu-item">
              <Link href="/market-overview">Market Overview</Link>
            </li>
            <li className="menu-item">
              <Link
                href="https://scattering.medium.com/hybrid-nfts-technical-support-plan-1ae8b36d4347"
                target="_blank"
              >
                Technical Support
              </Link>
            </li>
            <li className="menu-item">
              <Link href="https://t.me/hybridnfts" target="_blank">
                Telegram sniper bot
              </Link>
            </li>
            <li className="menu-item">
              <Link href="https://stoken.scattering.io/points" target="_blank">
                Points
              </Link>
            </li>
            <li className="menu-item">
              <Link href="https://stoken.scattering.io/trade" target="_blank">
                sToken
              </Link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default PcNav;
