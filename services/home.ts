import { BASE_URL, BASE_URL_DEV } from "@/constants/url";
interface CollectionType {
  id: number;
  name: string;
  color: string;
}

export interface CryptoAsset {
  chain_id: number;
  erc20_address: string;
  erc721_address: string;
  name: string;
  symbol: string;
  price_in_usd: string;
  volume: string;
  price_change: string;
  total_supply: string;
  market_cap: string;
  liquidity: string;
  slug: string;
  collection_type: CollectionType;
  rank: number;
  status: number;
  is_verified: boolean;
  nft_items: string;
  has_logo: boolean;
  sort_order: number;
  card_type: number;
  card_image_url: string;
}

interface BannerResponse {
  code: number;
  data: {
    list: CryptoAsset[];
  };
  msg: string;
}

export const getBanner = async (chainId: number): Promise<BannerResponse> => {
  const response = await fetch(
    `${BASE_URL_DEV}/index/banner?chain_id=${chainId === -1 ? 0 : chainId}`,
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};
export const getSpotlight = async (
  chainId: number,
): Promise<BannerResponse> => {
  const response = await fetch(
    `${BASE_URL_DEV}/index/spotlight?chain_id=${chainId === -1 ? 0 : chainId}`,
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};
