import { useCallback, useState } from "react";
import BackToTop from "../elements/BackToTop";
import Footer1 from "./footer/Footer1";
import Header3 from "./header/Header";
import { useRouter } from "next/router";
import { NO_FOOTER_PATH } from "@/configs/footer";
import { Box } from "@mui/material";
import Head from "next/head";
import Iconify from "../iconify";
import { MessageButton } from "../button/message-button";
import Logo from "./header/Logo";
import Sidebar from "./Sidebar";
// import { Helmet } from "react-helmet-async";
export default function Layout({ children }: any) {
  const [isMobileMenu, setMobileMenu] = useState(false);
  const handleMobileMenu = () => setMobileMenu(!isMobileMenu);
  const router = useRouter();

  const [navVisible, setNavVisible] = useState<boolean>(false);
  const toggleNavVisibility = useCallback(
    () => setNavVisible((visible) => !visible),
    [],
  );
  const { pathname } = router;
  const needFooter = !NO_FOOTER_PATH.includes(pathname.toString());
  console.log("Layout");

  return (
    <>
      <Head>
        <title>Scattering</title>
        <link rel="manifest" href="/manifest.json" />
        {/* <link
          rel="apple-touch-icon"
          href="/assets/images/logo/apple-icon-180.png"
        /> */}
        <link rel="manifest" href="/manifest.json" />
        {/* <link
          rel="mask-icon"
          href="/assets/images/logo/manifest-icon-192.maskable.png"
          color="#5bbad5"
        /> */}
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Native marketplace for all hybrid assets."
        />
        <meta
          name="keywords"
          content="ERC404,DN404,Scattering,Hybrid Assets,BT404,SP404"
        />
        <meta
          name="twitter:card"
          key="twitter:card"
          content="summary_large_image"
        />
        <meta name="twitter:site" content="@scattering_io" />
        <meta
          name="twitter:title"
          key="twitter:title"
          content="Scattering.io"
        />
        <meta
          name="twitter:description"
          content="Native marketplace for all hybrid assets."
        />
        <meta
          content="https://scattering.io/assets/images/media/twitter-card.png"
          key="og:image"
          property="og:image"
        />
        <meta
          content="https://scattering.io/assets/images/media/twitter-card.png"
          key="twitter:image:src"
          name="twitter:image:src"
        />
        <meta name="twitter:image:alt" content="image description" />
      </Head>
      <div
        id="wrapper"
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Sidebar />
        <Header3
          isMobileMenu={isMobileMenu}
          handleMobileMenu={handleMobileMenu}
        />
        {/* <img
          style={{
            position: "absolute",
            width: "100%",
            left: 0,
            top: 0,
            zIndex: -1,
          }}
          src="/assets/images/layout-bg.png"
          alt="scattering-layout"
        /> */}
        <Box
          sx={{
            // maxWidth: {
            //   lg: "1980px",
            //   // xl: "1980px",
            // },
            width: "calc( 100vw - 200px )",
            margin: "0 auto",
            minHeight: "calc( 100vh - 40px )",
            padding: "40px",
            marginTop: "80px",
          }}
          id="page"
          className="home-7"
        >
          {children}
        </Box>
        {/* {needFooter && <Footer1 />} */}
      </div>
      <BackToTop />
      <MessageButton />
    </>
  );
}
