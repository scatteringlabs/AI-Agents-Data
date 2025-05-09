import { BASE_URL_V3 } from "@/constants/url";

export interface MarketToken {
  chain_id: number;
  collection_count: number;
  total_volume_24h: string;
  change_volume_24h: string;
  total_volume_7d: string;
  total_volume_30d: string;
  total_market_cap: string;
}

interface ItemData {
  total_market_cap: string;
  collection_count: number;
  total_volume_24h: string;
  increase_24h_count: number;
  decrease_24h_count: number;
  new_collection_count: number;
  market_token_list: MarketToken[];
}

interface StasResponse {
  code: number;
  data: {
    item: ItemData;
  };
  msg: string;
}

export const getMarketStats = async (): Promise<StasResponse> => {
  const response = await fetch(`${BASE_URL_V3}/market/stats`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

interface MarketData {
  bucket: string;
  market_cap: string;
  volume: string;
}
interface MarketChartResponss {
  code: number;
  data: MarketData[];
  msg: string;
}
export const getMarketChart = async (
  days: number,
): Promise<MarketChartResponss> => {
  const response = await fetch(
    `${BASE_URL_V3}/market/market_cap_volume_stats?days=${days}`,
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};
