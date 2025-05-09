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

interface HeaderProps {
  isMobileMenu: boolean;
  handleMobileMenu: () => void;
}

export default function Header3({
  isMobileMenu,
  handleMobileMenu,
}: HeaderProps) {
  const { selectedOption } = useGlobalState();

  const [open, setOpen] = useState(false);
  const [backgroundColor, setBackgroundColor] =
    useState<string>("rgba(1, 4, 16, 1)");
  const { chainId, setChainId } = useChain();
  const { chainId: zoraChainId, setChainId: setZoraChainId } = useErc20ZChain();
  const handleChain = (newChain: string) => {
    setZoraChainId(Number(newChain));
  };

  const router = useRouter();
  const isShowChainFilter = useMemo(
    () =>
      !router.pathname?.includes("collect") &&
      !router.pathname?.includes("collection") &&
      !router.pathname?.includes("assets") &&
      !router.pathname?.includes("portfolio") &&
      !router.pathname?.includes("/market-overview") &&
      !router.pathname?.includes("/genie") &&
      !router.pathname?.includes("/launchpad"),
    [router],
  );

  return (
    <DrawerSortProvider>
      <Box
        sx={{
          background: `${backgroundColor} !important`,
          top: 0,
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
                  <Stack flexDirection="row">1</Stack>
                  {!open ? (
                    <Box
                      sx={{
                        mr: { md: 2, xs: 0 },
                        display: { md: "flex", xs: "none" },
                        flexGrow: 1,
                        maxWidth: 1000,
                      }}
                      // onMouseEnter={(event) => {
                      //   setAnchorEl(event.currentTarget);
                      // }}
                    >
                      <SearchInputButton setOpen={setOpen} />
                    </Box>
                  ) : null}
                  {/* <Box sx={{ display: { md: "none", xs: "block" } }}>
                    <GlobalTypeSwitcher />
                  </Box> */}
                  <Stack
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {/* <IconButton
                      onClick={() => {
                        setOpen(true);
                      }}
                      sx={{
                        display: { sm: "none", xs: "block" },
                        p: { md: 2, xs: 1 },
                      }}
                    >
                      <Iconify
                        icon="eva:search-fill"
                        sx={{ ml: { md: 1, xs: 0 }, color: "#fff" }}
                      />
                    </IconButton> */}
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
              left: 240,
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
