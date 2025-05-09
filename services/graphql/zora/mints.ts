import { useQuery } from "@tanstack/react-query";
import { fetchZoraGraphQL } from ".";

const GET_MINT_NODES = (
  collectionAddress: string,
  tokenId: string,
  network: string,
  chain: string,
) => `
    query ListCollections {
        mints(
            networks: {network: ${network}, chain: ${chain}}
            where: {tokens: {address: "${collectionAddress}", tokenId: "${tokenId}"}}
            sort: {sortKey: TIME, sortDirection: DESC}
        ) {
            nodes {
                mint {
                    quantity
                    toAddress
                    transactionInfo {
                        blockTimestamp
                    }
                }
            }
        }
    }
`;

// Define TypeScript interfaces for response structure
interface TransactionInfo {
  blockTimestamp: string;
}

export interface Mint {
  quantity: number;
  toAddress: string;
  transactionInfo: TransactionInfo;
}

export interface MintNode {
  mint: Mint;
}

interface MintsResponse {
  mints: {
    nodes: MintNode[];
  };
}

export const useMintNodes = (
  collectionAddress: string,
  tokenId: string,
  network: string = "BASE",
  chain: string = "BASE_MAINNET",
) => {
  return useQuery<MintsResponse, Error>({
    queryKey: ["mintNodes", collectionAddress, tokenId],
    queryFn: () =>
      fetchZoraGraphQL<MintsResponse>(
        GET_MINT_NODES(collectionAddress, tokenId, network, chain),
      ),
    enabled: Boolean(chain && network && tokenId && collectionAddress),
  });
};
