export const getErc20CollectionsOwned = async (
  address: string,
): Promise<GetCollectionsOwnedResponse> => {
  // 准备请求体
  const body = JSON.stringify({
    data: {
      address,
    },
  });

  // 准备请求头
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  // 配置请求选项
  const requestOptions: RequestInit = {
    method: "POST",
    headers,
    body,
    redirect: "follow", // 如果需要自动处理重定向
  };

  try {
    // 执行请求
    const response = await fetch(
      "https://us-central1-pump-art.cloudfunctions.net/getErc20CollectionsOwned",
      requestOptions,
    );

    // 检查响应是否成功
    if (!response.ok) {
      throw new Error("Failed to fetch Zora username");
    }

    // 解析 JSON 数据
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching Zora username:", error);
    throw error;
  }
};
export const getCollectionsOwned = async (
  address: string,
): Promise<GetCollectionsOwnedResponse> => {
  // 准备请求体
  const body = JSON.stringify({
    data: {
      address,
    },
  });

  // 准备请求头
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  // 配置请求选项
  const requestOptions: RequestInit = {
    method: "POST",
    headers,
    body,
    redirect: "follow", // 如果需要自动处理重定向
  };

  try {
    // 执行请求
    const response = await fetch(
      "https://us-central1-pump-art.cloudfunctions.net/getCollectionsOwned",
      requestOptions,
    );

    // 检查响应是否成功
    if (!response.ok) {
      throw new Error("Failed to fetch Zora username");
    }

    // 解析 JSON 数据
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching Zora username:", error);
    throw error;
  }
};

export interface CollectionInfo {
  base_token_price_native_currency: string;
  base_token_price_usd: string;
  chain: string;
  collection_description: string;
  collection_id: string;
  collection_image_url: string;
  collection_name: string;
  day_mint_change: number;
  day_mint_change_percentage: number;
  deployed_by: string;
  deployed_via_contract: string;
  description: string;
  end_time: number;
  erc20z_address: string;
  extra_metadata: string;
  fdv_usd: number;
  fundsRecipient: string;
  h1_buyers: number;
  h1_buys: number;
  h1_price_change: number;
  h1_sellers: number;
  h1_sells: number;
  h1_volume: number;
  h24_buyers: number;
  h24_buys: number;
  h24_price_change: number;
  h24_sellers: number;
  h24_sells: number;
  h24_volume: number;
  h6_price_change: number;
  h6_volume: number;
  hour_mint_change: number;
  hour_mint_change_percentage: number;
  image_properties: string;
  image_url: string;
  last_time_updated_day_change: number;
  last_time_updated_hour_change: number;
  last_updated_defi_data: number;
  last_updated_fdv: number;
  last_updated_nft_info: number;
  last_updated_token_count: number;
  liquidity_usd: number;
  lower_name: string;
  m5_price_change: number;
  m5_volume: number;
  market_cap_usd: number;
  market_countdown: number;
  minimum_market_eth: number;
  mint_fee: number;
  mint_timer_started: boolean;
  minting_ended: boolean;
  name: string;
  nft_id: string;
  owned_by: string;
  owner_count: number;
  pool_address: string;
  pool_created_at: string;
  previews: string;
  secondary_activated: boolean;
  start_time: number;
  status: string;
  ticker: string;
  token_count: number;
  token_id: number;
  total_supply_wei: string;
  zora_image_url: string;
}

export interface ZoraCollection {
  amountOwned: number;
  chain: string;
  lastUpdated: number;
  collectionInfo: CollectionInfo;
}

export interface GetCollectionsOwnedResponse {
  result: {
    status: string;
    data: Record<string, ZoraCollection>;
  };
}

export interface GetZoraUsernameParams {
  data: {
    address: string;
  };
}

export interface GetZoraUsernameResponse {
  result: {
    status: string;
    data: string;
  };
}

export const getZoraUsername = async (
  params: GetZoraUsernameParams,
): Promise<GetZoraUsernameResponse> => {
  const url = "https://us-central1-pump-art.cloudfunctions.net/getZoraUsername";

  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  };

  try {
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Zora username. Status: ${response.status}`,
      );
    }

    const result: GetZoraUsernameResponse = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching Zora username:", error);
    throw error;
  }
};
