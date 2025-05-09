import { http, createConfig } from "wagmi";
import { mainnet, sepolia, arbitrum, base } from "wagmi/chains";

export const config = createConfig({
  chains: [mainnet, sepolia, arbitrum, base],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
  },
});
