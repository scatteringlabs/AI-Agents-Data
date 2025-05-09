import { ZORA_BASE_URL, ZoraXApiKey } from "@/constants/url";
import { LiquidityPool } from "../tokens";

interface PoolParams {
  chain_id: number;
  mt_address: string;
  token_id: number;
}

export interface PoolResponse {
  data: {
    list: LiquidityPool[];
  };
}

export const getPoolInfo = async (
  params: PoolParams,
): Promise<PoolResponse> => {
  const queryParams = new URLSearchParams(params as any).toString();
  const response = await fetch(`${ZORA_BASE_URL}/coins/pools?${queryParams}`, {
    headers: {
      "x-api-key": ZoraXApiKey,
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};
