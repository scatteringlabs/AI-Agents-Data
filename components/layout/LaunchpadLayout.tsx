import { useState } from "react";
import BackToTop from "../elements/BackToTop";
import Footer1 from "./footer/Footer1";
import Header3 from "./header/Header";
import { useRouter } from "next/router";
import { NO_FOOTER_PATH } from "@/configs/footer";
import { Box, Card, Typography, useMediaQuery, useTheme } from "@mui/material";
import Head from "next/head";
import Iconify from "../iconify";
import { MessageButton } from "../button/message-button";
import Link from "next/link";
import AutoLaunchpadDialog from "../dialog/auto-launchpad-dialog";
import TabComponent from "@/views/launchpad/my-tab";
// import { Helmet } from "react-helmet-async";
export default function Layout({ children }: any) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isMobileMenu, setMobileMenu] = useState(false);
  const handleMobileMenu = () => setMobileMenu(!isMobileMenu);
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { pathname } = router;
  const needFooter = !NO_FOOTER_PATH.includes(pathname.toString());
  return (
    <>
      <Head>
        <title>Scattering</title>
        <link rel="manifest" href="/manifest.json" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Native marketplace for all hybrid NFTs. ERC404, DN404, SPL404, SPL20. Zero swap fees."
        />
        <meta
          name="keywords"
          content="ERC404,DN404,Scattering,Hybrid NFTs,BT404,SP404"
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
          content="Native marketplace for all hybrid NFTs. ERC404, DN404, SPL404, SPL20. Zero swap fees."
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
      <div id="wrapper" style={{ position: "relative" }}>
        <Header3
          isMobileMenu={isMobileMenu}
          handleMobileMenu={handleMobileMenu}
        />
        <img
          style={{
            position: "absolute",
            width: "100%",
            left: 0,
            top: 0,
            zIndex: -1,
          }}
          src="/assets/images/layout-bg.png"
          alt="scattering-layout"
        />
        <Box
          sx={{
            maxWidth: {
              lg: "1980px",
              // xl: "1980px",
            },
            margin: "0 auto",
            minHeight: "calc( 100vh - 40px )",
            paddingTop: { md: "128px", xs: "100px" },
          }}
          id="page"
          className="home-7 tw-px-4 md:tw-px-24"
        >
          <Card
            sx={{
              background: "transparent",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "flex-start",
              position: "relative",
              minHeight: "calc( 100vh - 130px )",
              p: { md: 0, xs: 2 },
            }}
          >
            <Typography
              sx={{
                fontSize: { md: 48, xs: 24 },
                color: "#fff",
                fontFamily: "Poppins",
                fontWeight: 600,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Hybrid Meme Launchpad
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={isMobile ? "100%" : "718"}
                  height="14"
                  viewBox="0 0 718 14"
                  fill="none"
                >
                  <path
                    d="M0.358643 11C124.53 4.96301 441.858 -3.48877 717.796 11"
                    stroke="url(#paint0_angular_6191_24297)"
                    stroke-width="6"
                  />
                  <defs>
                    <radialGradient
                      id="paint0_angular_6191_24297"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(359.077 7) rotate(90) scale(4 358.719)"
                    >
                      <stop offset="0.0993526" stop-color="#FFC876" />
                      <stop offset="0.526122" stop-color="#ACFF8E" />
                      <stop offset="0.739587" stop-color="#9453FF" />
                      <stop offset="0.913343" stop-color="#FF89C2" />
                    </radialGradient>
                  </defs>
                </svg>
              </span>
            </Typography>
            <Typography
              sx={{
                fontFamily: "Poppins",
                fontWeight: 400,
                lineHeight: "30px",
                fontSize: { md: 14, xs: 12 },
                maxWidth: 1000,
                textAlign: "center",
                color: "#CAC6DD",
                mt: { md: 2, xs: 2 },
              }}
            >
              The Scattering launchpad utilizes the bonding curve for creators
              to raise initial liquidity for hybrid meme on Base. Anyone can
              launch a Hybrid meme in just 2 minutes and at a cost of only
              0.001ETH through Scattering.
            </Typography>
            <Box
              display="flex"
              columnGap={2}
              sx={{ marginTop: { md: "20px", xs: "20px" } }}
            >
              <Link href="/launchpad/create">
                <Box
                  sx={{
                    background: "#B054FF",
                    cursor: "pointer",
                    display: "flex",
                    px: { md: 4, xs: 1 },
                    py: { md: 2, xs: 1 },
                    alignItems: "center",
                    fontFamily: "Poppins",
                    fontSize: { md: 14, xs: 12 },
                    borderRadius: "10px",
                    columnGap: 1,
                    fontWeight: 700,
                    color: "#fff",
                    "&:hover": {
                      transform: "scale(1.02)",
                      color: "#fff",
                    },
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M22.35 2.25847L22.23 1.75447L21.727 1.63247C21.438 1.56247 20.916 1.48047 20.048 1.48047C18.408 1.48047 16.348 1.78047 14.543 2.28147C13.553 2.55647 12.67 2.87947 11.918 3.24247C11.14 3.61747 10.505 4.04247 10.078 4.46847C9.68901 4.85847 9.18001 5.62847 8.56401 6.76047C8.42101 7.02347 8.27401 7.30447 8.12101 7.60447C6.87101 7.96047 5.38601 8.83947 4.75801 9.23547C3.33301 10.1285 2.17801 11.0635 1.67101 11.7345C1.59249 11.8388 1.53923 11.9599 1.5154 12.0883C1.49158 12.2167 1.49784 12.3489 1.53369 12.4745C1.56954 12.6001 1.634 12.7156 1.72203 12.8121C1.81005 12.9085 1.91923 12.9833 2.04101 13.0305C2.19801 13.0905 2.37001 13.1545 2.55001 13.2245C3.37001 13.5365 4.37301 13.9145 5.15201 14.2965L5.14901 14.3005L9.66301 18.8195C10.045 19.5995 10.427 20.6095 10.741 21.4375L10.936 21.9465C10.9825 22.0688 11.0569 22.1786 11.1533 22.2671C11.2497 22.3556 11.3654 22.4204 11.4913 22.4563C11.6171 22.4923 11.7496 22.4983 11.8782 22.4741C12.0068 22.4498 12.1279 22.3958 12.232 22.3165C12.902 21.8105 13.838 20.6545 14.73 19.2295C15.124 18.5995 16.003 17.1175 16.364 15.8665C16.669 15.7115 16.957 15.5615 17.224 15.4165C18.364 14.7975 19.134 14.2865 19.519 13.8975C20.62 12.7965 21.595 10.4315 22.129 7.57147C22.362 6.32447 22.493 5.05647 22.498 4.00147C22.505 3.10447 22.423 2.55847 22.35 2.25847ZM6.86201 10.2585C6.46201 11.1505 6.09601 12.0085 5.79401 12.7305C5.16595 12.438 4.52717 12.1691 3.87901 11.9245C4.33101 11.5545 4.93101 11.1175 5.65501 10.6655C6.12901 10.3675 6.59801 10.1005 7.03501 9.87847C6.97701 10.0025 6.91901 10.1285 6.86201 10.2585ZM13.301 18.3315C12.9178 18.9488 12.4973 19.5422 12.042 20.1085C11.7976 19.4615 11.5294 18.8237 11.238 18.1965C11.963 17.8935 12.823 17.5265 13.725 17.1205C13.847 17.0635 13.969 17.0105 14.088 16.9565C13.863 17.3925 13.596 17.8585 13.301 18.3315ZM20.812 3.99147C20.808 4.94947 20.688 6.10947 20.472 7.26047C20.238 8.51147 19.905 9.69047 19.507 10.6745C19.137 11.5915 18.717 12.3135 18.326 12.7025L18.321 12.7065C18.227 12.8035 17.811 13.1735 16.418 13.9305C15.3078 14.5208 14.1771 15.0718 13.028 15.5825C11.923 16.0795 10.878 16.5205 10.08 16.8505L7.13701 13.8975C7.46501 13.0975 7.90701 12.0505 8.40201 10.9495C8.91167 9.80126 9.46202 8.67155 10.052 7.56247C10.805 6.17947 11.18 5.75547 11.276 5.65947C11.564 5.37147 12.054 5.05247 12.656 4.76147C13.317 4.44247 14.105 4.15447 14.998 3.90847C16.664 3.44247 18.553 3.16547 20.051 3.16547C20.353 3.16547 20.595 3.17747 20.787 3.19347C20.803 3.39947 20.815 3.66247 20.813 3.99047L20.812 3.99147ZM4.34101 17.5975C3.42401 17.5975 2.65101 18.2045 2.40001 19.0415L1.51901 21.9515C1.49798 22.0216 1.49629 22.096 1.51411 22.167C1.53192 22.238 1.56859 22.3028 1.62023 22.3546C1.67187 22.4065 1.73656 22.4434 1.80746 22.4615C1.87836 22.4796 1.95284 22.4782 2.02301 22.4575L4.92901 21.5745C5.34542 21.4469 5.70992 21.1891 5.96895 20.839C6.22797 20.4889 6.36784 20.065 6.36801 19.6295C6.3684 19.3629 6.31628 19.0989 6.21461 18.8525C6.11295 18.6062 5.96373 18.3822 5.7755 18.1935C5.58726 18.0048 5.36369 17.855 5.11755 17.7528C4.87142 17.6505 4.60754 17.5977 4.34101 17.5975Z"
                      fill="white"
                    />
                    <path
                      d="M13.94 10.0388C14.0778 10.1845 14.2435 10.301 14.4271 10.3815C14.6107 10.462 14.8086 10.5049 15.009 10.5077C15.2095 10.5104 15.4085 10.4729 15.5942 10.3975C15.78 10.322 15.9487 10.21 16.0905 10.0682C16.2322 9.92642 16.3441 9.75764 16.4195 9.57186C16.4948 9.38608 16.5322 9.18708 16.5294 8.9866C16.5266 8.78613 16.4836 8.58826 16.4029 8.40469C16.3223 8.22111 16.2057 8.05557 16.06 7.91783C15.7762 7.64948 15.3989 7.50244 15.0083 7.50796C14.6178 7.51349 14.2448 7.67114 13.9686 7.9474C13.6925 8.22367 13.535 8.59674 13.5297 8.98731C13.5243 9.37788 13.6716 9.75512 13.94 10.0388Z"
                      fill="white"
                    />
                  </svg>
                  <span>Create</span>
                </Box>
              </Link>

              <Box
                sx={{
                  width: { md: 200, xs: 150 },
                  position: "relative",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  fontFamily: "Poppins",
                  fontSize: 14,
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                  border: "1px solid #B054FF",
                  borderRadius: "10px",
                }}
                onClick={() => {
                  setOpen(true);
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontSize: { md: "16px", xs: "12px" },
                    color: "#B054FF",
                    fontWeight: 700,
                    // textTransform: "uppercase",
                    position: "absolute",
                    left: "0px",
                    top: "0px",
                    width: "100%",
                    lineHeight: { md: "50px", xs: "40px" },
                    height: { md: "50px", xs: "40px" },
                    textAlign: "center",
                  }}
                >
                  How it works
                </Typography>
              </Box>
            </Box>
            <AutoLaunchpadDialog open={open} setOpen={setOpen} />
            <TabComponent />
            {children}
          </Card>
        </Box>
        {needFooter && <Footer1 />}
      </div>
      <BackToTop />
      <MessageButton />
    </>
  );
}
