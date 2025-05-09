import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";

interface HoldersInput {
  tokenId: string;
  cursor?: string; // cursor 应该作为 HoldersInput 的一部分
}

interface FetchHoldersParams {
  address: string;
  networkId: number;
  input: HoldersInput;
}

interface HolderItem {
  balance: string;
  shiftedBalance: string;
  tokenId: string;
  walletId: string;
  __typename: string;
}

interface GetHoldersResponse {
  data: {
    getTokenInfo: {
      id: string;
      totalSupply: string;
      __typename: string;
    };
    holders: {
      count: number;
      status: string;
      items: HolderItem[];
      cursor: string;
      __typename: string;
    };
  };
}
interface HoldersPage {
  pages: GetHoldersResponse[];
  nextCursor?: string;
}

const fetchHolders = async (
  params: FetchHoldersParams & { cursor?: string },
): Promise<GetHoldersResponse> => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", "37c7834746a273a1291b8cdd83c976fdcd97a014");
  myHeaders.append("Content-Type", "application/json");

  // 确保 cursor 是 input 的一部分
  const graphql = JSON.stringify({
    operationName: "GetHolders",
    variables: {
      address: params.address,
      networkId: params.networkId,
      input: {
        ...params.input,
        cursor: params.cursor || undefined, // 在这里确保 cursor 在 input 中
      },
    },
    query: `
      query GetHolders($input: HoldersInput!, $address: String!, $networkId: Int!) {
        getTokenInfo(address: $address, networkId: $networkId) {
          id
          totalSupply
          __typename
        }
        holders(input: $input) {
          count
          status
          items {
            balance
            shiftedBalance
            tokenId
            walletId
            __typename
          }
          cursor
          __typename
        }
      }
    `,
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
    throw new Error("Failed to fetch holders data");
  }

  return response.json();
};

export function useHolders(
  params: FetchHoldersParams,
): UseInfiniteQueryResult<HoldersPage, Error> {
  return useInfiniteQuery({
    queryKey: ["holders", params],
    queryFn: ({ pageParam = "" }) =>
      fetchHolders({ ...params, cursor: pageParam || undefined }), // 确保 cursor 正确传递
    initialPageParam: "", // 初始化时 cursor 为空字符串
    getNextPageParam: (lastPage) => {
      const nextCursor = lastPage?.data?.holders?.cursor || "";
      return nextCursor ? nextCursor : undefined; // 如果有 cursor，则返回以获取下一页数据
    },
    enabled: Boolean(params?.address),
  });
}
