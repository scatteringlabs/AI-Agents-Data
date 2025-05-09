import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import "/public/assets/css/style.css";
import "/public/assets/css/responsive.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http, WagmiProvider } from "wagmi";

import Preloader from "@/components/elements/Preloader";
import { base, baseSepolia, bsc, mainnet, sepolia, zora } from "wagmi/chains";
import { darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import Layout from "@/components/layout/Layout"; // 默认全局 Layout
import LaunchpadLayout from "@/components/layout/LaunchpadLayout"; // 新的 Launchpad Layout
import { createTheme, ThemeProvider } from "@mui/material";
import { themeOptions } from "@/configs/themeoptions";
import { Suspense } from "react";
import { useRouter } from "next/router";
import CustomWalletAvatar from "@/components/layout/header/CustomWalletAvatar";
import Script from "next/script";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChainProvider } from "@/context/chain-provider";
import { GlobalStateProvider } from "@/context/GlobalStateContext";
import PrivyAuthProvider from "@/context/privy-provider";
import { Erc20ZChainProvider } from "@/context/chain-provider-erc20z";
import MobileToast from "@/components/MobileToast";

const config = createConfig({
  chains: [mainnet, sepolia, base, baseSepolia, zora],
  transports: {
    [zora.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [baseSepolia.id]: http(
      "https://base-sepolia.g.alchemy.com/v2/CDVPSoGW0dc4AIKFN7nEwnrsLjAHvN5X",
    ),
    [base.id]: http(
      "https://base-mainnet.g.alchemy.com/v2/CDVPSoGW0dc4AIKFN7nEwnrsLjAHvN5X",
    ),
    [bsc.id]: http(
      "https://bnb-mainnet.g.alchemy.com/v2/gcYcBYmX69u_PZ3B8AdOH10-2B9fwcY8",
    ),
    // [base.id]: http(
    //   "https://base-mainnet.g.alchemy.com/v2/CDVPSoGW0dc4AIKFN7nEwnrsLjAHvN5X",
    // ),
  },
});
const client = new QueryClient();
const theme = createTheme(themeOptions);
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PrivyAuthProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={client}>
          <RainbowKitProvider
            theme={darkTheme()}
            locale="en-US"
            avatar={CustomWalletAvatar}
          >
            <ThemeProvider theme={theme}>
              <Erc20ZChainProvider>
                <ChainProvider>
                  <GlobalStateProvider>
                    <Suspense fallback={<Preloader />}>
                      <Layout>
                        <Component {...pageProps} />
                      </Layout>
                    </Suspense>
                    <Script
                      strategy="afterInteractive"
                      src={`https://www.googletagmanager.com/gtag/js?id=${GTM_ID}`}
                    />
                    <Script
                      id="gtag-init"
                      strategy="afterInteractive"
                      dangerouslySetInnerHTML={{
                        __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GTM_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
                      }}
                    />
                    <ToastContainer
                      position="bottom-right"
                      theme="dark"
                      // theme="colored"
                      autoClose={3000}
                    />
                    <MobileToast />
                  </GlobalStateProvider>
                </ChainProvider>
              </Erc20ZChainProvider>
            </ThemeProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </PrivyAuthProvider>
  );
}

export default MyApp;
