import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchGraphQL } from ".";

export const GET_TOKEN_ENTITY_BY_ID_PAGINATED = `
  query getTokenEntityById($id: String!, $first: Int, $skip: Int) {
    tokenEntity(id: $id) {
      id
      name
      swapTxs(orderBy: timestamp, orderDirection: desc, first: $first, skip: $skip) {
        id
        timestamp
        direction
        erc20Amount
        nativeAmount
        platformFee
        projectFee
        from
        to
        hash
      }
    }
  }
`;

export interface SwapTx {
  id: string;
  timestamp: string;
  direction: string;
  erc20Amount: string;
  nativeAmount: string;
  platformFee: string;
  projectFee: string;
  from: string;
  to: string;
  hash: string;
}

export interface TokenEntityWithSwapTxs {
  id: string;
  name: string;
  swapTxs: SwapTx[];
}

export interface TokenEntityResponse {
  tokenEntity: TokenEntityWithSwapTxs;
}

const PAGE_SIZE = 30;

export const useTokenSwapTxsById = (id: string) => {
  return useInfiniteQuery<TokenEntityResponse, Error>({
    queryKey: ["swap-txs", id],
    queryFn: ({ pageParam = 0 }) =>
      fetchGraphQL<TokenEntityResponse>({
        query: GET_TOKEN_ENTITY_BY_ID_PAGINATED,
        variables: {
          id,
          first: PAGE_SIZE,
          skip: pageParam,
        },
      }),
    getNextPageParam: (lastPage, allPages) => {
      const hasMore = lastPage?.tokenEntity?.swapTxs?.length === PAGE_SIZE;
      return hasMore ? allPages?.length * PAGE_SIZE : undefined;
    },
    enabled: Boolean(id),
    initialPageParam: 0, // 指定初始分页参数
    refetchInterval: 3000,
  });
};
