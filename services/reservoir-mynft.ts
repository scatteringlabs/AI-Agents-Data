import { chainIdToName } from "@/utils";
import { Reservoir_Base_Url } from "./reservoir";

interface TokenMetadata {
  imageOriginal: string;
  imageMimeType: string;
  tokenURI: string;
}

interface CollectionInfo {
  id: string;
  name: string;
  slug: string;
  symbol: string;
  contractDeployedAt: string;
  imageUrl: string;
  isSpam: boolean;
  isNsfw: boolean;
  metadataDisabled: boolean;
  openseaVerificationStatus: string;
  tokenCount: string;
  floorAsk: {
    id: string;
    price: {
      currency: {
        contract: string;
        name: string;
        symbol: string;
        decimals: number;
      };
      amount: {
        raw: string;
        decimal: number;
        usd: number;
        native: number;
      };
    };
    maker: string;
    validFrom: number;
    validUntil: number;
    source: {
      id: string;
      domain: string;
      name: string;
      icon: string;
      url: string;
    };
  };
  royaltiesBps: number;
  royalties: any[];
}

export interface TokenInfo {
  chainId: number;
  contract: string;
  tokenId: string;
  kind: string;
  name: string;
  image: string;
  imageSmall: string;
  imageLarge: string;
  metadata: TokenMetadata;
  description: string;
  rarityScore: number;
  rarityRank: number;
  supply: string;
  remainingSupply: string;
  media: any | null;
  isFlagged: boolean;
  isSpam: boolean;
  isNsfw: boolean;
  metadataDisabled: boolean;
  lastFlagUpdate: string | null;
  lastFlagChange: string | null;
  collection: CollectionInfo;
  topBid: any | null;
  floorAsk: any | null;
  lastAppraisalValue: number | null;
}

interface OwnershipInfo {
  tokenCount: string;
  onSaleCount: string;
  floorAsk: any | null;
  acquiredAt: string;
}

interface TokenResponseItem {
  token: TokenInfo;
  ownership: OwnershipInfo;
}

interface TokenResponse {
  tokens: TokenResponseItem[];
  continuation: string | null;
}

interface FetchUserNFTsParams {
  userAddress: string;
  limit?: number;
  chainId?: number;
  sortBy?: string;
  collection?: string;
  includeTopBid?: boolean;
  includeRawData?: boolean;
  excludeSpam?: boolean;
  continuation?: string;
  normalizeRoyalties?: boolean;
}

export const fetchUserNFTs = async ({
  userAddress,
  limit = 20,
  sortBy = "acquiredAt",
  collection,
  includeTopBid = true,
  includeRawData = true,
  excludeSpam = true,
  chainId = 1,
  continuation,
  normalizeRoyalties = false,
}: FetchUserNFTsParams): Promise<TokenResponse | undefined> => {
  console.log("fetchUserNFTs", continuation);
  if (!userAddress) {
    return;
  }
  try {
    const params = new URLSearchParams({
      limit: String(limit),
      sortBy,
      collection: collection || "",
      includeTopBid: String(includeTopBid),
      includeRawData: String(includeRawData),
      excludeSpam: String(excludeSpam),
      normalizeRoyalties: String(normalizeRoyalties),
    });

    if (continuation) {
      params.append("continuation", continuation);
    }

    const url = `${Reservoir_Base_Url[chainId]}/users/${userAddress}/tokens/v10?${params.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching user NFTs:", error);
    throw error; // 可以根据需要决定是否抛出错误或处理错误
  }
};
