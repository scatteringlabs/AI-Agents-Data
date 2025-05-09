import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchTheGraphQL } from ".";

export const GET_TOKEN_ENTITY_MEMBERS_BY_ID_PAGINATED = `
  query getTokenEntityMembersById($id: String!, $first: Int, $skip: Int) {
    tokenEntity(id: $id) {
      id
      name
      memberCount
      members(orderBy: balance, orderDirection: desc, first: $first, skip: $skip) {
        balance
        user {
          id
        }
      }
    }
  }
`;

export interface Member {
  balance: string;
  user: {
    id: string;
  };
}

export interface TokenEntityWithMembers {
  id: string;
  name: string;
  memberCount: string;
  members: Member[];
}

export interface TokenEntityMembersResponse {
  tokenEntity: TokenEntityWithMembers;
}

const PAGE_SIZE = 30;

export const useTokenEntityMembersById = (id: string) => {
  return useInfiniteQuery<TokenEntityMembersResponse, Error>({
    queryKey: ["members", id],
    queryFn: ({ pageParam = 0 }) =>
      fetchTheGraphQL<TokenEntityMembersResponse>({
        query: GET_TOKEN_ENTITY_MEMBERS_BY_ID_PAGINATED,
        variables: {
          id,
          first: PAGE_SIZE,
          skip: pageParam,
        },
      }),
    getNextPageParam: (lastPage, allPages) => {
      const hasMore = lastPage?.tokenEntity?.members?.length === PAGE_SIZE;
      return hasMore ? allPages?.length * PAGE_SIZE : undefined;
    },
    enabled: Boolean(id),
    initialPageParam: 0,
    refetchInterval: 10000,
  });
};
