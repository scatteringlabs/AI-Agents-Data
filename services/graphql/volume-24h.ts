import { useQuery } from "@tanstack/react-query";
import { fetchGraphQL } from ".";

export const GET_24H_VOLUME_FOR_TOKEN = `
  query get24HVolumeForToken($id: String!, $startTimestamp: Int!, $endTimestamp: Int!) {
    tokenEntity(id: $id) {
      id
      name
      creator
      memberCount
      multiplier
      hourData(where: {startTimestamp_gt: $startTimestamp, startTimestamp_lt: $endTimestamp}) {
        id
        startTimestamp
        hourlyVolumeETH
        txCount
      }
    }
  }
`;

// 定义返回的数据结构接口
export interface HourlyVolumeData {
  id: string;
  startTimestamp: string;
  hourlyVolumeETH: string;
  txCount: string;
}

export interface TokenVolumeEntity {
  id: string;
  name: string;
  creator: string;
  memberCount: string;
  multiplier: string;
  hourData: HourlyVolumeData[];
}

export interface TokenVolumeResponse {
  tokenEntity: TokenVolumeEntity;
}

interface VolumeQueryVariables {
  id: string;
  startTimestamp: number;
  endTimestamp: number;
}

// 获取指定 Token 的 24 小时交易量 Hook
export const use24HVolumeForToken = (
  id: string,
  startTimestamp: number,
  endTimestamp: number,
) => {
  return useQuery<TokenVolumeResponse, Error>({
    queryKey: ["24hVolume", id, startTimestamp, endTimestamp],
    queryFn: () =>
      fetchGraphQL<TokenVolumeResponse>({
        query: GET_24H_VOLUME_FOR_TOKEN,
        variables: { id, startTimestamp, endTimestamp },
      }),
  });
};
