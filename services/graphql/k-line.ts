import { graphql_endpoint } from ".";

// Define K-line data GraphQL query
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

// Define Price interface
export interface Price {
  id: string;
  type: string;
  minPrice: string;
  maxPrice: string;
  openPrice: string;
  closePrice: string;
  timestamp: string;
}

// Update TokenEntity interface to include price information
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

// Define return data structure interface
export interface TokenEntitiesResponse {
  tokenEntities: TokenEntity[];
}

interface GraphQLRequestPayload {
  query: string;
  variables?: Record<string, any>;
}

// Use fetch to get K-line data
export const fetchKlineData = async (
  addr: string,
  priceType: string, // Added parameter
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
