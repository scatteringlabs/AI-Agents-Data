import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  styled,
  Container,
  useMediaQuery,
} from "@mui/material";
import MobileHeader from "./MobileHeader";
import PcNav from "./PcNav";
import Logo from "./Logo";
import { DrawerSortProvider } from "@/context/drawer-token-sort-provider";
import Iconify from "@/components/iconify";
import DialogSearch from "@/components/drawer/dialog-search";
import SearchInputButton from "@/components/drawer/search-input-button";
import AllChainFilter from "@/components/drawer/all-chain-filter";
import { useChain } from "@/context/chain-provider";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useGlobalState } from "@/context/GlobalStateContext";
import PrivyLogin from "./privy-wallet";
import { useErc20ZChain } from "@/context/chain-provider-erc20z";
import GlobalTypeSwitcher from "./GlobalTypeSwitcher";
import { usePathname } from "next/navigation";
import { Menu } from "@mui/icons-material";

interface HeaderProps {
  isMobileMenu: boolean;
  handleMobileMenu: () => void;
  isSidebarCollapsed?: boolean;
}

export default function Header3({
  isMobileMenu,
  handleMobileMenu,
  isSidebarCollapsed = false,
}: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState<string>(
    "rgba(1, 4, 16, 0.5)",
  );
  const { chainId: zoraChainId, setChainId: setZoraChainId } = useErc20ZChain();
  const handleChain = (newChain: string) => {
    setZoraChainId(Number(newChain));
  };

  const router = useRouter();
  const pathName = usePathname();
  const { slug } = router.query;
  const isShowChainFilter = useMemo(
    () => !slug && pathName !== "/market-overview",
    [slug, pathName],
  );

  const isMobile = useMediaQuery("(max-width:900px)");

  return (
    <DrawerSortProvider>
      <Box
        sx={{
          background: `${backgroundColor} !important`,
          top: 0,
          backdropFilter: "blur(4px)",
          height: {
            md: isShowChainFilter ? "128px !important" : "80px !important",
            xs: isShowChainFilter ? "110px !important" : "60px !important",
          },
          //,
        }}
        id="header_main"
        className={`header_1 header-fixed header-full is-fixed is-small`}
      >
        <Box className="container-fluid">
          <div>
            <Box
              className="col-md-12"
              sx={{ px: { md: "15px !important", xs: "8px !important" } }}
            >
              <div id="site-header-inner">
                <Stack
                  className="wrap-box flex"
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box
                    sx={{
                      display: { md: "none", xs: "block", width: "100px" },
                    }}
                  >
                    <Link href="/" rel="home" className="main-logo">
                      <img
                        id="mobile-logo_header"
                        src="/assets/images/logo/logo.png"
                        data-retina="assets/images/logo/logo-dark@2x.png"
                      />
                    </Link>
                  </Box>
                  <Stack flexDirection="row"> </Stack>
                  {!open ? (
                    <Box
                      sx={{
                        mr: { md: 2, xs: 0 },
                        display: { md: "flex", xs: "none" },
                        flexGrow: 1,
                        maxWidth: 1000,
                      }}
                    >
                      <SearchInputButton setOpen={setOpen} />
                    </Box>
                  ) : null}
                  <Stack
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <IconButton
                      onClick={() => {
                        setOpen(true);
                      }}
                      sx={{
                        display: { md: "none", xs: "block" },
                        p: { md: 2, xs: 1 },
                      }}
                    >
                      <Iconify
                        icon="eva:search-fill"
                        sx={{ ml: { md: 1, xs: 0 }, color: "#fff" }}
                      />
                    </IconButton>
                    <PrivyLogin />
                    <Box
                      className="mobile-button"
                      onClick={handleMobileMenu}
                      sx={{ ml: 2 }}
                    >
                      <span />
                    </Box>
                  </Stack>
                </Stack>
              </div>
            </Box>
          </div>
        </Box>

        <MobileHeader
          isMobileMenu={isMobileMenu}
          handleMobileMenu={handleMobileMenu}
          setOpen={setOpen}
        />
        {isShowChainFilter ? (
          <Box
            sx={{
              position: "fixed",
              left: isSidebarCollapsed ? 80 : 80,
              top: { md: 80, xs: 60 },
              width: "100%",
              zIndex: 2,
            }}
          >
            <AllChainFilter
              selectedChain={zoraChainId?.toString()}
              onChainChange={handleChain}
            />
          </Box>
        ) : null}
        <DialogSearch open={open} setOpen={setOpen} />
        {open ? (
          <Box
            sx={{
              position: "fixed",
              left: 0,
              top: {
                md: 80,
                xs: 0,
              },
              width: "100%",
              height: {
                md: "calc( 100vh - 80px )",
                xs: "100vh",
              },
              background: "rgba(1, 4, 16, 0.2)",
              backdropFilter: "blur(4px)",
            }}
          />
        ) : null}
      </Box>
    </DrawerSortProvider>
  );
}
