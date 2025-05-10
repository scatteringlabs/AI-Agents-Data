import { useState } from "react";
import BackToTop from "../elements/BackToTop";
import Footer1 from "./footer/Footer1";
import Header3 from "./header/Header";
import { Box } from "@mui/material";
import Head from "next/head";
import { MessageButton } from "../button/message-button";
import Sidebar from "./Sidebar";
import { useRouter } from "next/router";
// import { Helmet } from "react-helmet-async";
export default function Layout({ children }: any) {
  const [isMobileMenu, setMobileMenu] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const handleMobileMenu = () => setMobileMenu(!isMobileMenu);
  const router = useRouter();

  const handleSidebarCollapse = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

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
          content="Scattering platform serves as a native marketplace for AI tokens such as AI agents, AGI, crypto trading, autonomous agents, frameworks, DeFAI, Swarm, 3D models, music, video, app stores, trading, investment DAO, games, development tools, Launchpad, social and data, building a comprehensive cutting-edge technology and innovation ecosystem."
        />
        <meta
          name="keywords"
          content="AI agents, AGI, crypto trading, autonomous agents, frameworks, DeFAI, Swarm, 3D models, music, video, app stores, trading, investment DAO, games, development tools, Launchpad, social and data,"
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
          content="Scattering platform serves as a native marketplace for AI tokens such as AI agents, AGI, crypto trading, autonomous agents, frameworks, DeFAI, Swarm, 3D models, music, video, app stores, trading, investment DAO, games, development tools, Launchpad, social and data, building a comprehensive cutting-edge technology and innovation ecosystem."
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
      <Box
        id="wrapper"
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "flex-start",
          height: "100vh",
          overflowY: "auto",
          overflowX: "hidden",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255, 255, 255, 0.2)",
            borderRadius: "4px",
            "&:hover": {
              background: "rgba(255, 255, 255, 0.3)",
            },
          },
        }}
      >
        <Box sx={{ display: { md: "block", xs: "none" } }}>
          <Sidebar onCollapse={handleSidebarCollapse} />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            ml: { md: 0, xs: 0 },
          }}
        >
          <Header3
            isMobileMenu={isMobileMenu}
            handleMobileMenu={handleMobileMenu}
            isSidebarCollapsed={isSidebarCollapsed}
          />
          <Box
            sx={{
              width: "100%",
              margin: "0 auto",
              position: "relative",
              pl: { md: 0, xs: 0 },
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
            id="page"
            className="home-7"
          >
            <Box sx={{ flex: 1 }}>{children}</Box>
            <Box
              sx={{
                position: "sticky",
                left: "-40px",
                bottom: "0px",
                width: "100%",
                zIndex: 999,
              }}
            >
              <Footer1 />
            </Box>
          </Box>
        </Box>
      </Box>
      <BackToTop />
      <MessageButton />
    </>
  );
}
