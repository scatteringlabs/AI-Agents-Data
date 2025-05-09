import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import { base, bsc, mainnet } from "viem/chains";

const solanaConnectors = toSolanaWalletConnectors({
  // By default, shouldAutoConnect is enabled
  shouldAutoConnect: true,
});

export default function PrivyAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProvider
      appId="cm3fyx9z90231tr135i26in48"
      config={{
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
          logo: "https://scattering.io/assets/images/logo/logo-512.png",
          walletChainType: "ethereum-and-solana",
          // walletList: ["detected_wallets", "phantom"],
          walletList: [
            "detected_wallets", // 自动检测浏览器中的钱包
            "metamask", // MetaMask
            "coinbase_wallet", // Coinbase Wallet
            "rainbow", // Rainbow Wallet
            "phantom", // Solana Phantom Wallet
            "zerion", // Zerion Wallet
            "cryptocom", // Crypto.com Wallet
            "uniswap", // Uniswap Wallet
            "okx_wallet", // OKX Wallet
            "universal_profile", // Universal Profile
          ],
        },
        defaultChain: base,
        supportedChains: [base, bsc, mainnet],
        embeddedWallets: {
          // createOnLogin: "all-users",
          createOnLogin: "off",
        },
        externalWallets: {
          solana: { connectors: solanaConnectors },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
