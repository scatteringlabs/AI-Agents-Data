import { useQuery } from "@tanstack/react-query";
import { fetchGraphQL } from ".";

// GraphQL 查询
export const GET_USER_BALANCE_AND_TOKEN = `
  query getUserBalanceAndToken($userId: String!) {
    user(id: $userId) {
      id
      members {
        balance
        token {
          id
        }
      }
    }
  }
`;

// 定义返回的数据结构接口
export interface Token {
  id: string;
}

export interface Member {
  balance: string;
  token: Token;
}

export interface User {
  id: string;
  members: Member[];
}

// 优化后的返回类型
export interface UserBalanceAndTokenResponse {
  user: User;
}

// 定义新的 Hook
export const useUserBalanceAndToken = (userId: string) => {
  return useQuery<UserBalanceAndTokenResponse, Error>({
    queryKey: ["userBalanceAndToken", userId],
    queryFn: () =>
      fetchGraphQL<UserBalanceAndTokenResponse>({
        query: GET_USER_BALANCE_AND_TOKEN,
        variables: { userId },
      }),
    enabled: Boolean(userId && userId !== ""),
  });
};
