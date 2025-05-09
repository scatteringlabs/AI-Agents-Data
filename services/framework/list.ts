import { LP_BASE_URL } from "@/constants/url";

export type Duration = "1d" | "3d" | "7d" | "30d";

interface RepoStatsParams {
  duration: Duration;
  page?: number;
  page_size?: number;
  chain?: string;
}

export interface RepoStat {
  mint: string;
  repo_name: string;
  repo_owner: string;
  repo_full_name: string;
  stars_count: number;
  forks_count: number;
  contributors_count: number;
  stats_date: string;
  symbol: string;
  address: string;
  chain: string;
  metadata: Record<string, any>;
  repo_url: string;
  // 可选字段，根据 duration 不同返回不同的字段
  stars_change_1d?: number;
  forks_change_1d?: number;
  contributors_change_1d?: number;
  stars_change_3d?: number;
  forks_change_3d?: number;
  contributors_change_3d?: number;
  stars_change_7d?: number;
  forks_change_7d?: number;
  contributors_change_7d?: number;
  stars_change_30d?: number;
  forks_change_30d?: number;
  contributors_change_30d?: number;
}

interface RepoStatsResponse {
  data: RepoStat[];
  page: number;
  page_size: number;
  total_count: number;
  total_pages: number;
}

export const getRepoStatsByDuration = async (
  params: RepoStatsParams,
): Promise<RepoStatsResponse> => {
  const { duration, ...restParams } = params;
  const cleanedParams = Object.fromEntries(
    Object.entries(restParams)
      .filter(([_, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)]),
  );
  const queryParams = new URLSearchParams(cleanedParams);

  const response = await fetch(
    `${LP_BASE_URL}/repo-stats/${duration}?${queryParams}`,
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};
