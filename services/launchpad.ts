import { BASE_URL_V3 } from "@/constants/url";

interface LaunchpadParams {
  sort_field: string;
  sort_direction: string;
  page: number;
  page_size: number;
  chain_id?: number;
}

export interface AgentData {
  name: string;
  chain_id: number;
  slug: string;
  logo_url: string;
  agent_nums_in_1d: number;
  agent_nums_in_7d: number;
  agent_nums_in_30d: number;
  total_agent_nums: number;
  total_revenue: string;
}

interface LaunchpadResponse {
  code: number;
  data: AgentData[];
  msg: string;
}

export const getLaunchpadList = async (
  params: LaunchpadParams,
): Promise<LaunchpadResponse> => {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== undefined),
  );
  const queryParams = new URLSearchParams(filteredParams as any).toString();
  const response = await fetch(`${BASE_URL_V3}/launchpad2/list?${queryParams}`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};
