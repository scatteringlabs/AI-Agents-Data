import { BASE_URL_V3 } from "@/constants/url";

interface LaunchpadParams {
  sort_field: string;
  sort_direction: string;
  page: number;
  page_size: number;
}

export interface AgentData {
  name: string;
  chain_id: number;
  slug: string;
  agent_nums: number;
  price_change_in_1d: string;
  price_change_in_7d: string;
  price_change_in_30d: string;
  total_protocol_fee: string;
  total_count_on_scr: number;
  total_market_cap_on_scr: string;
  top_agent_name_on_scr: string;
  top_agent_logo_on_scr: string;
  top_agent_market_cap_on_scr: string;
}

interface LaunchpadResponse {
  code: number;
  data: AgentData[];
  msg: string;
}

export const getLaunchpadList = async (
  params: LaunchpadParams,
): Promise<LaunchpadResponse> => {
  const queryParams = new URLSearchParams(params as any).toString();
  const response = await fetch(`${BASE_URL_V3}/launchpad/list?${queryParams}`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};
