import { graphql_endpoint } from ".";

// 定义获取 K 线数据的 GraphQL 查询
export const GET_KLINE_DATA = `
  query getKlineData($addr: String!, $priceType: String!) {
    tokenEntities(
      where: { addr: $addr }
      orderBy: createTimestamp
      orderDirection: desc
    ) {
      id
      addr
      name
      symbol
      supply
      marketCap
      lockValue
      projectSwapFee
      projectShareFee
      positionId
      pool
      prices(where: { type: $priceType }, orderBy: timestamp, orderDirection: desc) {
        id
        type
        minPrice
        maxPrice
        openPrice
        closePrice
        timestamp
      }
    }
  }
`;

// 定义 Price 接口
export interface Price {
  id: string;
  type: string;
  minPrice: string;
  maxPrice: string;
  openPrice: string;
  closePrice: string;
  timestamp: string;
}

// 更新 TokenEntity 接口以包含价格信息
export interface TokenEntity {
  id: string;
  addr: string;
  name: string;
  symbol: string;
  supply: string;
  marketCap: string;
  lockValue: string;
  projectSwapFee: string;
  projectShareFee: string;
  positionId: string;
  pool: string;
  prices: Price[];
}

// 定义返回的数据结构接口
export interface TokenEntitiesResponse {
  tokenEntities: TokenEntity[];
}

interface GraphQLRequestPayload {
  query: string;
  variables?: Record<string, any>;
}

// 使用 fetch 获取 K 线数据
export const fetchKlineData = async (
  addr: string,
  priceType: string, // 新增的参数
): Promise<TokenEntitiesResponse> => {
  const payload: GraphQLRequestPayload = {
    query: GET_KLINE_DATA,
    variables: { addr, priceType },
  };

  const response = await fetch(graphql_endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json();

  if (response.ok && !json.errors) {
    return json.data;
  } else {
    throw new Error(
      json.errors ? json.errors[0].message : "GraphQL request failed",
    );
  }
};
