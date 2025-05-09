import { LP_BASE_URL } from "@/constants/url";

interface RepoStatsParams {
  page?: number;
  page_size?: number;
  repo_full_name?: string; // 可选，筛选某个具体仓库
}

interface RepoStat {
  mint: string;
  repo_name: string;
  repo_owner: string;
  repo_full_name: string;
  stars_count: number;
  forks_count: number;
  contributors_count: number;
  stats_date: string;
  updated_at: string;
}

interface RepoStatsResponse {
  data: RepoStat[];
  page: number;
  page_size: number;
  total_count: number;
  total_pages: number;
}

export const getRepoStatsHistory = async (
  params: RepoStatsParams,
): Promise<RepoStatsResponse> => {
  const queryParams = new URLSearchParams(params as any).toString();
  const response = await fetch(
    `${LP_BASE_URL}/repo-stats/history?${queryParams}`,
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};
