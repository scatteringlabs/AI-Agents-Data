import { BASE_URL_DEV, ZORA_BASE_URL, ZoraXApiKey } from "@/constants/url";
import { ChainId } from "@uniswap/sdk-core";

interface GetPoolInfoParams {
  chain_id: number;
  token_contract_address: string;
}
export interface PoolInfo {
  chain_id: number;
  pool_address: string;
  erc721_address: string;
  base_asset_address: string;
  base_asset_price_usd: string;
  base_asset_symbol: string;
  base_asset_decimals: number;
  quote_asset_address: string;
  quote_asset_symbol: string;
  total_volume: string;
  total_liquidity: string;
  market_cap: string;
  price_change: string;
  slug: string;
  name: string;
  symbol: string;
  total_supply: string;
  project_url: string;
  discord_url: string;
  telegram_url: string;
  twitter_url: string;
  has_logo: boolean;
}
interface GetPoolInfoResponse {
  data: {
    item: PoolInfo;
  };
}
interface GetTokenTypeResponse {
  data: {
    list: {
      id: number;
      name: string;
    }[];
  };
}
export const getPoolInfo = async (
  params: GetPoolInfoParams,
): Promise<GetPoolInfoResponse> => {
  const queryParams = new URLSearchParams(params as any).toString();
  const response = await fetch(
    `${BASE_URL_DEV}/trade/pool/info?${queryParams}`,
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

export const getTokenTypes = async (
  chain_id: number,
): Promise<GetTokenTypeResponse> => {
  const response = await fetch(
    `${BASE_URL_DEV}/index/coll_category?chain_id=${chain_id === -1 ? 0 : chain_id}`,
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};
export const getZoraTokenTypes = async (
  chain_id: number,
): Promise<GetTokenTypeResponse> => {
  const response = await fetch(
    `${ZORA_BASE_URL}/coins/types?chain_id=${chain_id === -1 ? 0 : chain_id}`,
    {
      headers: {
        "x-api-key": ZoraXApiKey,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};
export type LiquidityPool = {
  chain_id: number;
  pool_address: string;
  liquidity_name: string;
  liquidity_logo: string;
  base_asset_address: string;
  base_asset_symbol: string;
  base_amount: string;
  quote_asset_address: string;
  quote_asset_symbol: string;
  quote_amount: string;
  liquidity: string;
};

interface GetLiquidityResponse {
  data: {
    list: LiquidityPool[];
  };
}

export const getLiquidityInfo = async (
  params: GetPoolInfoParams,
): Promise<GetLiquidityResponse> => {
  const queryParams = new URLSearchParams(params as any).toString();
  const response = await fetch(
    `${BASE_URL_DEV}/trade/liquidity/list?${queryParams}`,
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

interface GetTokensPriceParams {
  tokenAddresses: string[];
  chainId: number;
}
export const geckoNetworkName: Record<number, string> = {
  [ChainId.ARBITRUM_ONE]: "arbitrum",
  [ChainId.MAINNET]: "eth",
  [ChainId.BASE]: "base",
  [ChainId.ZORA]: "zora-network",
  10000: "solana",
};
export async function getTokensPrice({
  tokenAddresses,
  chainId,
}: GetTokensPriceParams) {
  const addresses = tokenAddresses.join("%2C");
  const baseUrl = `https://api.geckoterminal.com/api/v2/simple/networks/${geckoNetworkName?.[chainId]}/token_price/`;
  const url = `${baseUrl}${addresses}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const jsonResponse = await response.json();
    return jsonResponse.data.attributes.token_prices;
  } catch (error) {
    console.error("Error fetching token prices:", error);
    return null; // 出错时返回null
  }
}

interface GetPriceResponse {
  data: {
    eth_usd: number;
  };
}
export const getETHPrice = async (): Promise<GetPriceResponse> => {
  const response = await fetch(`https://api.scattering.io/api/v2/common/price`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};
