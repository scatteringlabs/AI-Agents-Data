import { useQuery } from "@tanstack/react-query";
import { fetchZoraGraphQL } from ".";

const GET_MINT_COMMENTS = (
  collectionAddress: string,
  tokenId: string,
  network: string,
  chain: string,
) => `
    query ListCollections {
        mintComments(
            networks: {network: ${network}, chain: ${chain}}
            where: {collectionAddress: "${collectionAddress}", tokenId: "${tokenId}"}
        ) {
            comments {
                comment
                fromAddress
                quantity
                transactionInfo {
                    blockTimestamp
                }
            }
        }
    }
`;

interface TransactionInfo {
  blockTimestamp: string;
}

export interface Comment {
  comment: string;
  fromAddress: string;
  quantity: number;
  transactionInfo: TransactionInfo;
}

interface MintCommentsResponse {
  mintComments: {
    comments: Comment[];
  };
}
export const useMintComments = (
  collectionAddress: string,
  tokenId: string,
  network: string = "BASE",
  chain: string = "BASE_MAINNET",
) => {
  return useQuery<MintCommentsResponse, Error>({
    queryKey: ["mintComments", collectionAddress, tokenId, network, chain],
    queryFn: () => {
      if (!(collectionAddress && tokenId && network && chain)) {
        return {
          mintComments: {
            comments: [],
          },
        };
      }
      return fetchZoraGraphQL<MintCommentsResponse>(
        GET_MINT_COMMENTS(collectionAddress, tokenId, network, chain),
      );
    },
    enabled: Boolean(chain && network && tokenId && collectionAddress),
  });
};
