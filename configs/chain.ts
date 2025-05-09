import { ethers } from "ethers";
import { BaseProvider } from "@ethersproject/providers";
import { ChainId } from "@uniswap/sdk-core";

export const AlchemySwapRpcUrl: { [key: number]: string } = {
  [ChainId.MAINNET]:
    "https://eth-mainnet.g.alchemy.com/v2/2xhw8860Xv2QHTOjit5gbPQ30BR5HttT",
  [ChainId.ARBITRUM_ONE]:
    "https://arb-mainnet.g.alchemy.com/v2/2xhw8860Xv2QHTOjit5gbPQ30BR5HttT",
  [ChainId.ZORA]:
    "https://zora-mainnet.g.alchemy.com/v2/2xhw8860Xv2QHTOjit5gbPQ30BR5HttT",
  [ChainId.BASE]:
    "https://base-mainnet.g.alchemy.com/v2/2xhw8860Xv2QHTOjit5gbPQ30BR5HttT",
};

export const AlchemyRpcUrl: { [key: number]: string } = {
  [ChainId.MAINNET]:
    "https://eth-mainnet.g.alchemy.com/v2/CDVPSoGW0dc4AIKFN7nEwnrsLjAHvN5X",
  [ChainId.ARBITRUM_ONE]:
    "https://arb-mainnet.g.alchemy.com/v2/CDVPSoGW0dc4AIKFN7nEwnrsLjAHvN5X",
  [ChainId.ZORA]:
    "https://zora-mainnet.g.alchemy.com/v2/CDVPSoGW0dc4AIKFN7nEwnrsLjAHvN5X",
  [ChainId.BASE]:
    "https://base-mainnet.g.alchemy.com/v2/CDVPSoGW0dc4AIKFN7nEwnrsLjAHvN5X",
};

export function getMultiChainProvider(
  chainId?: number | string,
): BaseProvider | null {
  try {
    if (!chainId) {
      console.error(`No chain ID`);
      return null;
    }
    const rpcUrl = AlchemySwapRpcUrl[Number(chainId)];
    if (!rpcUrl) {
      console.error(`No RPC URL found for chain ID: ${chainId}`);
      return null;
    }
    return new ethers.providers.JsonRpcProvider(rpcUrl);
  } catch (error) {
    console.error(`Error creating provider for chain ID ${chainId}:`, error);
    return null;
  }
}
