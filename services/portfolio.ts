import { BASE_URL, MP_BASE_URL, XApiKey } from "@/constants/url";
import { CollectionItemsResponse } from "@/types/collection";
import { TokenInfo, TokenInfoResponse } from "@/types/token";

interface RequestTokensParams {
  page?: number;
  page_size?: number;
  chain_id?: number;
  type_name?: string;
}

export const getTokens = async (
  params: RequestTokensParams,
): Promise<TokenInfoResponse> => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, value.toString());
    }
  });

  const queryString = queryParams.toString();
  const response = await fetch(`${BASE_URL}/profile/tokens?${queryString}`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

export interface NFTsSum {
  contractAddress: string;
  chainId: number;
  nums: number;
  name: string;
}
export interface NFTSumResponse {
  data: NFTsSum[];
}
export const getMyNFTsSum = async (
  walletAddress?: `0x${string}`,
): Promise<NFTSumResponse | null> => {
  if (!walletAddress) {
    return null;
  }
  const response = await fetch(
    `${MP_BASE_URL}/collection/wallet/${walletAddress}`,
    {
      headers: {
        "x-api-key": XApiKey,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

interface RequestAllMyNFTsParams {
  page?: number;
  pageSize?: number;
  owner?: string;
}
export const getAllMyNFTs = async ({
  page,
  pageSize,
  owner,
}: RequestAllMyNFTsParams): Promise<CollectionItemsResponse> => {
  const response = await fetch(`${MP_BASE_URL}/wallet/nfts`, {
    method: "POST",
    headers: {
      "x-api-key": XApiKey,
    },
    body: JSON.stringify({
      page,
      owner,
      pageSize,
    }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};
