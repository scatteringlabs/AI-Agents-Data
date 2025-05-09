import { chainIdToName } from "@/utils";
import { BaseSID } from "@/views/launchpad/create/tokenService";
import { ChainId } from "@uniswap/sdk-core";

interface Currency {
  contract: string;
  name: string;
  symbol: string;
  decimals: number;
}

interface Amount {
  raw: string;
  decimal: number;
  usd: number;
  native: number;
}

interface Token {
  contract: string;
  tokenId: string;
  name: string;
  image: string;
}

interface MarketPrice {
  currency: Currency;
  amount: Amount;
  netAmount: Amount;
}

interface FloorAsk {
  id: string;
  price: MarketPrice;
  maker: string;
  validFrom: number;
  validUntil: number;
  token: Token;
}

interface TopBid {
  id: string;
  price: MarketPrice;
  maker: string;
  validFrom: number;
  validUntil: number;
}

interface Market {
  floorAsk: FloorAsk;
  topBid: TopBid;
}

interface Stats {
  tokenCount: number;
  onSaleCount: number;
  flaggedTokenCount: number;
  sampleImages: string[];
  market: Market;
}

interface ApiResponse {
  stats: Stats;
}

export const Reservoir_Base_Url: Record<number, string> = {
  [ChainId.ARBITRUM_ONE]: "https://api-arbitrum.reservoir.tools",
  [ChainId.BASE]: "https://api-base.reservoir.tools",
  [ChainId.MAINNET]: "https://api.reservoir.tools",
  [84532]: "https://api-base-sepolia.reservoir.tools",
  [ChainId.ZORA]: "https://api-zora.reservoir.tools",
};
export async function fetchCollectionStats(
  collectionAddress: string,
): Promise<Stats> {
  const url = `https://api.reservoir.tools/stats/v2?collection=${collectionAddress}`;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result: ApiResponse = await response.json();
    return result.stats;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

interface VolumeData {
  id: string; // 合集ID
  timestamp: number; // 时间戳（秒）
  volume: number; // 交易量
  rank: number; // 排名
  floor_sell_value: number; // 最低出售价格
  sales_count: number; // 销售次数
}

interface VolumeDataResponse {
  collections: VolumeData[]; // 返回数据的数组
}

export async function fetchDailyVolumes(
  collectionAddress: string,
): Promise<VolumeDataResponse> {
  const url = `https://api.reservoir.tools/collections/daily-volumes/v1?id=${collectionAddress}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const result = await response.json();
  return result;
}

interface Currency {
  contract: string;
  name: string;
  symbol: string;
  decimals: number;
}

interface Price {
  raw: string;
  decimal: number;
  usd: number;
  native: number;
}

interface Token {
  contract: string;
  tokenId: string;
  name: string;
  image: string;
}

interface FloorAsk {
  id: string;
  sourceDomain: string;
  // price: any;
  maker: string;
  validFrom: number;
  validUntil: number;
  token: Token;
}

interface Rank {
  "1day": number | null;
  "7day": number | null;
  "30day": number | null;
  allTime: number | null;
}

interface Volume {
  "1day": number;
  "7day": number;
  "30day": number;
  allTime: number;
}

interface VolumeChange {
  "1day": number;
  "7day": number;
  "30day": number;
}

interface FloorSale {
  "1day": number;
  "7day": number;
  "30day": number;
}

interface FloorSaleChange {
  "1day": number;
  "7day": number;
  "30day": number;
}

export interface Collection {
  id: string;
  slug: string;
  createdAt: string;
  name: string;
  image: string;
  banner: string;
  discordUrl: string;
  externalUrl: string;
  twitterUsername: string;
  openseaVerificationStatus: string;
  description: string;
  sampleImages: string[];
  tokenCount: string;
  onSaleCount: string;
  primaryContract: string;
  tokenSetId: string;
  royalties: any; // Assuming this can be null
  allRoyalties: {
    opensea: any[]; // Assuming this is an array
  };
  lastBuy: {
    value: any; // Assuming this can be null
  };
  floorAsk: FloorAsk;
  rank: Rank;
  volume: Volume;
  volumeChange: VolumeChange;
  floorSale: FloorSale;
  floorSaleChange: FloorSaleChange;
  collectionBidSupported: boolean;
  ownerCount: number;
  contractKind: string;
  mintedTimestamp: number;
  mintStages: any[]; // Assuming this is an array
}

interface CollectionsResponse {
  collections: Collection[];
}

export async function fetchCollectionDetails(
  id: string,
  chainId: number,
): Promise<Collection[]> {
  const url = `${Reservoir_Base_Url[chainId]}/collections/v5?id=${id}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const result: CollectionsResponse = await response.json();
  return result.collections;
}
// export interface TokenDetails {
//   token: {
//     chainId: number;
//     contract: string;
//     tokenId: string;
//     name: string;
//     description: string | null;
//     image: string;
//     imageSmall: string;
//     imageLarge: string;
//     metadata: {
//       imageOriginal: string;
//       imageMimeType: string;
//       tokenURI: string;
//     };
//     media: any; // Nullable field, adjust based on actual data
//     kind: string;
//     isFlagged: boolean;
//     isSpam: boolean;
//     isNsfw: boolean;
//     metadataDisabled: boolean;
//     lastFlagUpdate: string | null;
//     lastFlagChange: string | null;
//     supply: string;
//     remainingSupply: string;
//     decimals: string | null;
//     rarity: string | null;
//     rarityRank: string | null;
//     collection: {
//       id: string;
//       name: string;
//       image: string;
//       slug: string | null;
//       symbol: string;
//       creator: string;
//       tokenCount: number;
//       metadataDisabled: boolean;
//       floorAskPrice: string | null;
//     };
//     owner: string;
//     mintedAt: string;
//     createdAt: string;
//     mintStages: any[];
//   };
//   market: {
//     floorAsk: {
//       id: string | null;
//       price: string | null;
//       maker: string | null;
//       validFrom: string | null;
//       validUntil: string | null;
//       source: string | null;
//     };
//   };
//   updatedAt: string;
// }

interface TokensResponse {
  tokens: TokenDetails[];
}
export async function fetchTokensDetails(
  tokens: string,
  chainId: number,
): Promise<TokenDetails[]> {
  console.log("chainId", chainId);

  if (!chainId) {
    return [];
  }
  const url = `${Reservoir_Base_Url[chainId]}/tokens/v7?tokens=${tokens}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const result: TokensResponse = await response.json();
  return result.tokens;
}

export interface Order {
  id: string;
  kind: string;
  side: string;
  status: string;
  tokenSetId: string;
  tokenSetSchemaHash: string;
  contract: string;
  contractKind: string;
  maker: string;
  taker: string;
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
    netAmount: {
      raw: string;
      decimal: number;
      usd: number;
      native: number;
    };
  };
  validFrom: number;
  validUntil: number;
  quantityFilled: number;
  quantityRemaining: number;
  dynamicPricing: null | any;
  criteria: {
    kind: string;
    data: {
      token: {
        tokenId: string;
      };
    };
  };
  source: {
    id: string;
    domain: string;
    name: string;
    icon: string;
    url: string;
  };
  feeBps: number;
  feeBreakdown: Array<{
    kind: string;
    recipient: string;
    bps: number;
  }>;
  expiration: number;
  isReservoir: null | boolean;
  isDynamic: boolean;
  createdAt: string;
  updatedAt: string;
  originatedAt: string | null;
  isNativeOffChainCancellable: boolean;
}
interface fetchOrdersResponse {
  continuation: string;
  orders: Order[];
}

interface TokenMetadata {
  imageOriginal: string;
  imageMimeType: string;
  tokenURI: string;
}

interface TokenCollection {
  id: string;
  name: string;
  image: string;
  slug: string;
  symbol: string;
  creator: string;
  tokenCount: number;
  metadataDisabled: boolean;
  floorAskPrice: {
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
}

interface TokenLastSale {
  orderSource: string | null;
  fillSource: string | null;
  timestamp: number;
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
      netAmount?: {
        raw: string;
        decimal: number;
        usd: number;
        native: number;
      };
    };
  };
  marketplaceFeeBps?: number;
  paidFullRoyalty?: boolean;
  feeBreakdown?: Array<{
    kind: string;
    bps: number;
    recipient: string;
    rawAmount: string;
    source: string;
  }>;
}

interface TokenData {
  chainId: number;
  contract: string;
  tokenId: string;
  name: string;
  description: string;
  image: string;
  imageSmall: string;
  imageLarge: string;
  metadata: TokenMetadata;
  media: string | null;
  kind: string;
  isFlagged: boolean;
  isSpam: boolean;
  isNsfw: boolean;
  metadataDisabled: boolean;
  lastFlagUpdate: string | null;
  lastFlagChange: string | null;
  supply: string;
  remainingSupply: string;
  rarity: number;
  rarityRank: number;
  collection: TokenCollection;
  lastSale: TokenLastSale;
  owner: string | null;
  mintedAt: string;
  createdAt: string;
  decimals: number | null;
  mintStages: Array<unknown>;
}

interface MarketFloorAsk {
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
  validUntil: number | null;
  quantityFilled: string;
  quantityRemaining: string;
  source: {
    id: string;
    domain: string;
    name: string;
    icon: string;
    url: string;
  };
}

interface MarketData {
  floorAsk: MarketFloorAsk;
}

interface TokenMarket {
  token: TokenData;
  market: MarketData;
  updatedAt: string;
}

interface TokenResponse {
  tokens: TokenMarket[];
  continuation: string;
}
export const fetchOrders = async (
  id: string,
  chainId: number,
): Promise<fetchOrdersResponse | null> => {
  try {
    const url = `${Reservoir_Base_Url[chainId]}/orders/asks/v5?contracts=${id}`;

    const response: any = await fetch(url, {
      // headers: {
      //   accept: "*/*",
      //   "x-api-key": "demo-api-key",
      // },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching orders:", error);
    return null;
  }
};

interface FetchNFTListParams {
  includeDynamicPricing?: boolean;
  limit?: number;
  chainId?: number;
  collection?: string;
  sortBy?: string;
  sortDirection?: string;
  includeQuantity?: boolean;
  includeLastSale?: boolean;
  normalizeRoyalties?: boolean;
  continuation?: string; // 用于分页
}

export const fetchNFTList = async (
  {
    includeDynamicPricing = true,
    limit = 20,
    chainId = 1,
    collection = "0x9e9fbde7c7a83c43913bddc8779158f1368f0413",
    sortBy = "floorAskPrice",
    sortDirection = "asc",
    includeQuantity = true,
    includeLastSale = true,
    normalizeRoyalties = false,
    continuation,
  }: FetchNFTListParams = {}, // 默认参数解构
): Promise<TokenResponse | undefined> => {
  if (!chainId) {
    return;
  }
  try {
    const params = new URLSearchParams({
      includeDynamicPricing: String(includeDynamicPricing),
      limit: String(limit),
      collection,
      sortBy,
      sortDirection,
      includeQuantity: String(includeQuantity),
      includeLastSale: String(includeLastSale),
      normalizeRoyalties: String(normalizeRoyalties),
    });

    if (continuation) {
      params.append("continuation", continuation);
    }

    const url = `${Reservoir_Base_Url[chainId]}/tokens/v7?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

export interface TokenDetails {
  token: {
    chainId: number;
    contract: string;
    tokenId: string;
    name: string;
    description: string;
    image: string;
    imageSmall: string;
    imageLarge: string;
    metadata: {
      imageOriginal: string;
      imageMimeType: string;
      tokenURI: string;
    };
    kind: string;
    isFlagged: boolean;
    isSpam: boolean;
    isNsfw: boolean;
    metadataDisabled: boolean;
    lastFlagUpdate: string;
    supply: string;
    remainingSupply: string;
    rarity: number;
    rarityRank: number;
    collection: {
      id: string;
      name: string;
      image: string;
      slug: string;
      symbol: string;
      creator: string;
      tokenCount: number;
      metadataDisabled: boolean;
      floorAskPrice: {
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
    };
    owner: string;
    mintedAt: string;
    createdAt: string;
    decimals: number | null;
    mintStages: any[];
  };
  market: {
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
  };
  updatedAt: string;
}

interface TokensResponse {
  tokens: TokenDetails[];
}
export async function fetchTokenDetails(
  contractAddress: string,
  tokenId: string,
  chainId: number,
): Promise<TokensResponse> {
  console.log("chainId", chainId);

  if (!chainId) {
    return { tokens: [] };
  }
  const url = `${Reservoir_Base_Url[chainId]}/tokens/v7?tokens=${contractAddress}%3A${tokenId}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const result: TokensResponse = await response.json();
  return result;
}

interface TokenAttributesResponse {
  attributes: Attribute[];
  continuation: string | null;
}

interface Attribute {
  key: string;
  value: string;
  tokenCount: number;
  onSaleCount: number;
  sampleImages: string[];
  floorAsks: any[];
}

export async function fetchTokenAttributes(
  collectionAddress: string,
  tokenId: string,
  chainId: number,
): Promise<TokenAttributesResponse> {
  const url = `${Reservoir_Base_Url[chainId]}/collections/${collectionAddress}/attributes/explore/v6?tokenId=${tokenId}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const result: TokenAttributesResponse = await response.json();
  return result;
}
