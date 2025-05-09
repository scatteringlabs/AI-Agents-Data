import { useQuery } from "@tanstack/react-query";
import { fetchGraphQL } from ".";

export const GET_TOKEN_ENTITIES = `
  query getTokenEntities {
    tokenEntities(
      orderBy: lockValue
      orderDirection: desc
    ) {
      id
      addr
      name
      symbol
      decimal
      baseDecimal
      createTimestamp
      lastTxTimestamp
      erc721TotalSupply
      multiplier
      creator
      tokenVault
      factory
      supply
      marketCap
      params
      txCount
      memberCount
      initHash
      initPrice
      currentPrice
      lockValue
      state
      pool {
        id
        token0
        token1
        token0Price
        token1Price
        marketCapETH
      }
      positionId
    }
  }
`;

export interface Pool {
  id: string;
  token0: string;
  token1: string;
  token0Price: string;
  token1Price: string;
  marketCapETH: string;
}

// 定义返回的数据结构接口
export interface TokenEntity {
  id: string;
  addr: string;
  name: string;
  symbol: string;
  decimal: string;
  baseDecimal: string;
  createTimestamp: string;
  lastTxTimestamp: string;
  multiplier: string;
  index: string;
  creator: string;
  tokenVault: string;
  factory: string;
  supply: string;
  erc721TotalSupply: string;
  marketCap: string;
  params: string;
  txCount: string;
  memberCount: string;
  initHash: string;
  initPrice: string;
  currentPrice: string;
  lockValue: string;
  state: string;
  pool: Pool;
  positionId: string;
}

export interface TokenEntitiesResponse {
  tokenEntities: TokenEntity[];
}

export const useAllTokenList = () => {
  return useQuery<TokenEntitiesResponse, Error>({
    queryKey: ["tokenList"],
    queryFn: () =>
      fetchGraphQL<TokenEntitiesResponse>({
        query: GET_TOKEN_ENTITIES,
      }),
  });
};
