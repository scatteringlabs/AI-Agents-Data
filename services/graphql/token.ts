import { useQuery } from "@tanstack/react-query";
import { fetchGraphQL } from ".";

export const GET_TOKEN_ENTITIES = `
  query getTokenEntities($owner: String!) {
    tokenEntities(
      where: { owner: $owner }
      orderBy: createTimestamp
      orderDirection: desc
    ) {
      id
      addr
      name
      state
      symbol
      supply
      marketCap
      lockValue
      projectSwapFee
      projectShareFee
      positionId
      pool
    }
  }
`;

export interface TokenEntity {
  id: string;
  addr: string;
  name: string;
  state: string;
  symbol: string;
  supply: string;
  marketCap: string;
  lockValue: string;
  projectSwapFee: string;
  projectShareFee: string;
  positionId: string;
  pool: string;
}

export interface TokenEntitiesResponse {
  tokenEntities: TokenEntity[];
}

export const useTokenEntities = (owner: string) => {
  return useQuery<TokenEntitiesResponse, Error>({
    queryKey: ["tokenEntities", owner],
    queryFn: () =>
      fetchGraphQL<TokenEntitiesResponse>({
        query: GET_TOKEN_ENTITIES,
        variables: { owner },
      }),
    enabled: !!owner,
  });
};
