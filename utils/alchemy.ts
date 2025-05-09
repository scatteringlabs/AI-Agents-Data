import { BaseSID } from "@/views/launchpad/create/tokenService";
import { ChainId } from "@uniswap/sdk-core";
import { Alchemy, Network, OwnedNftsResponse } from "alchemy-sdk";

const networkMapping: { [key: string]: Network } = {
  [ChainId.MAINNET]: Network.ETH_MAINNET,
  [ChainId.BASE]: Network.BASE_MAINNET,
  [ChainId.ARBITRUM_ONE]: Network.ARB_MAINNET,
  [84532]: Network.BASE_SEPOLIA,
};

const API_KEY = "CDVPSoGW0dc4AIKFN7nEwnrsLjAHvN5X";

export async function fetchNFTs(
  ownerAddress: string,
  network: string,
  collectionAddress: string,
): Promise<OwnedNftsResponse | undefined> {
  const alchemyNetwork = networkMapping[network.toLowerCase()];
  if (!alchemyNetwork) {
    console.error(`Unsupported network: ${network}`);
    return;
  }
  if (!ownerAddress) {
    return;
  }

  const alchemy = new Alchemy({ apiKey: API_KEY, network: alchemyNetwork });

  try {
    const nfts = await alchemy.nft.getNftsForOwner(ownerAddress, {
      contractAddresses: [collectionAddress],
    });
    return nfts;
  } catch (error) {
    console.error("Error fetching NFTs:", error);
  }
}
