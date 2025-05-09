import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useQuery,
} from "@tanstack/react-query";

interface EventsQueryInput {
  address: string;
  networkId: number;
  quoteToken?: string;
}

interface FetchTokenEventsParams {
  limit?: number;
  query: EventsQueryInput;
  cursor?: string;
  direction?: "ASC" | "DESC";
}

interface EventData {
  __typename: string;
  amount0In: string | null;
  amount0Out: string | null;
  amount1In: string | null;
  amount1Out: string | null;
  amount0: string;
  amount1: string;
  amountNonLiquidityToken: string;
  priceUsd: string;
  priceUsdTotal: string;
  priceBaseToken: string;
  priceBaseTokenTotal: string;
  type: string;
}

export interface TokenEvent {
  address: string;
  baseTokenPrice: string;
  blockNumber: number;
  eventDisplayType: string;
  eventType: string;
  id: string;
  liquidityToken: string;
  logIndex: number;
  maker: string;
  timestamp: number;
  token0SwapValueUsd: string;
  token0ValueBase: string;
  token1SwapValueUsd: string;
  token1ValueBase: string;
  transactionHash: string;
  labels: {
    sandwich: string | null;
    __typename: string;
  };
  transactionIndex: number;
  quoteToken: string;
  data: EventData;
  __typename: string;
}

interface GetTokenEventsResponse {
  data: {
    getTokenEvents: {
      items: TokenEvent[];
      cursor: string;
      __typename: string;
    };
  };
}

const fetchTokenEvents = async (
  params: FetchTokenEventsParams,
): Promise<GetTokenEventsResponse> => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", "37c7834746a273a1291b8cdd83c976fdcd97a014");
  myHeaders.append("Content-Type", "application/json");

  const graphql = JSON.stringify({
    query: `query GetTokenEvents($limit: Int, $query: EventsQueryInput!, $cursor: String, $direction: RankingDirection) {
      getTokenEvents(limit: $limit, query: $query, cursor: $cursor, direction: $direction) {
        items {
          address
          baseTokenPrice
          blockNumber
          eventDisplayType
          eventType
          id
          liquidityToken
          logIndex
          maker
          timestamp
          token0SwapValueUsd
          token0ValueBase
          token1SwapValueUsd
          token1ValueBase
          transactionHash
          labels {
            sandwich {
              label
              sandwichType
              token0DrainedAmount
              token1DrainedAmount
              __typename
            }
            __typename
          }
          transactionIndex
          quoteToken
          data {
            __typename
            ... on BurnEventData {
              amount0
              amount1
              amount0Shifted
              amount1Shifted
              type
              __typename
            }
            ... on MintEventData {
              amount0
              amount1
              amount0Shifted
              amount1Shifted
              type
              __typename
            }
            ... on PoolBalanceChangedEventData {
              amount0
              amount1
              amount0Shifted
              amount1Shifted
              type
              __typename
            }
            ... on SwapEventData {
              amount0In
              amount0Out
              amount1In
              amount1Out
              amount0
              amount1
              amountNonLiquidityToken
              priceUsd
              priceUsdTotal
              priceBaseToken
              priceBaseTokenTotal
              type
              __typename
            }
          }
          __typename
        }
        cursor
        __typename
      }
    }`,
    variables: params,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: graphql,
    redirect: "follow" as RequestRedirect,
  };

  const response = await fetch(
    "https://graph.defined.fi/graphql",
    requestOptions,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
};

// export const useTokenEvents = (params: FetchTokenEventsParams) => {
//   return useQuery<GetTokenEventsResponse>({
//     queryKey: ["tokenEvents", params],
//     queryFn: () => fetchTokenEvents(params),
//     refetchInterval: 1000,
//   });
// };
interface TokenEventsPage {
  pages: GetTokenEventsResponse[];
  nextCursor?: string; // Using cursor instead of nextPage
}

export function useTokenEvents(
  params: FetchTokenEventsParams,
): UseInfiniteQueryResult<TokenEventsPage, Error> {
  return useInfiniteQuery({
    queryKey: ["tokenEvent", { params }],
    refetchInterval: 1000,
    queryFn: ({ pageParam = "" }) =>
      fetchTokenEvents({ ...params, cursor: pageParam }),
    initialPageParam: "", // Initialize cursor as empty string
    getNextPageParam: (lastPage) => {
      if (!lastPage) {
        return undefined;
      }
      const nextCursor = lastPage?.data?.getTokenEvents?.cursor;
      return nextCursor ? nextCursor : undefined; // Return cursor for next page if available
    },
  });
}
