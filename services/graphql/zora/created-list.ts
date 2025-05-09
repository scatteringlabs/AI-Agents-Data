import { useQuery } from "@tanstack/react-query";

export const fetchZoraGraphQL = async <T>(
  query: string,
  variables?: Record<string, any>,
): Promise<T> => {
  const response = await fetch(
    "https://api.scattering.io/zora-info-api/graphql",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    },
  );

  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(
      `GraphQL errors: ${result.errors.map((e: any) => e.message).join(", ")}`,
    );
  }

  return result.data;
};

// 定义 GraphQL 查询
export const CREATED_NFT_GRID_QUERY = `
  query CreatedNftGridQuery($identifier: String!) {
    profile(identifier: $identifier) {
      __typename
      handle
      ...CreatedNftGrid_createdCollections
      ... on Node {
        __isNode: __typename
        id
      }
    }
  }

  fragment CreatedNftGrid_createdCollections on IGraphQLProfile {
    __isIGraphQLProfile: __typename
    createdCollectionsOrTokens(first: 120) {
      edges {
        node {
          __typename
          ...NftCardFragment
          media {
            __typename
            mimeType
          }
          ... on Node {
            __isNode: __typename
            id
          }
        }
        cursor
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
    id
  }

  fragment NftCardFragment on IGraphQLCollectionOrToken {
    __isIGraphQLCollectionOrToken: __typename
    ...NftCardThumbnailFragment
    ...TokenStatOverlayFragment
    ...CardWrapperFragment
    name
    address
    chainId
    ... on IGraphQLToken {
      __isIGraphQLToken: __typename
      tokenId
    }
  }

  fragment NftCardThumbnailFragment on IGraphQLCollectionOrToken {
    __isIGraphQLCollectionOrToken: __typename
    name
    media {
      __typename
      mimeType
      originalUri
      downloadableUri
      previewImage {
        __typename
        mimeType
        small
      }
    }
  }

  fragment TokenStatOverlayFragment on IGraphQLCollectionOrToken {
    __isIGraphQLCollectionOrToken: __typename
    chainId
    address
    ... on IGraphQLToken {
      __isIGraphQLToken: __typename
      tokenId
    }
    ... on GraphQLZora1155Token {
      salesStrategy {
        __typename
        ... on GraphQLZoraSaleStrategyUniswapV3Secondary {
          __typename
          sale {
            state
            price {
              tokenPrice
            }
          }
        }
        ... on GraphQLZoraSaleStrategyZoraTimedMinter {
          __typename
          sale {
            state
            endTime
            minimumMarketEth
            marketCountdown
            currentMarketEth
          }
        }
      }
      erc20zAddress
      totalTokenMints
      zoraComments {
        count
      }
    }
  }

  fragment CardWrapperFragment on IGraphQLCollectionOrToken {
    __isIGraphQLCollectionOrToken: __typename
    ...TokenStatOverlayFragment
    chainId
    address
    ... on IGraphQLToken {
      __isIGraphQLToken: __typename
      tokenId
    }
  }
`;

// 定义返回的数据结构接口
export interface Media {
  __typename: string;
  mimeType: string;
  originalUri?: string;
  downloadableUri?: string;
  previewImage?: {
    __typename: string;
    mimeType: string;
    small?: string;
  };
}

interface SalesStrategy {
  __typename: string;
  sale?: {
    state?: string;
    price?: {
      tokenPrice?: string;
    };
    endTime?: string;
    minimumMarketEth?: string;
    marketCountdown?: string;
    currentMarketEth?: string;
  };
}
export interface CreatedNode {
  __typename: string;
  name?: string;
  address?: string;
  chainId?: string;
  media?: Media;
  tokenId?: string;
  salesStrategy?: SalesStrategy;
  totalTokenMints?: number;
}

export interface CreatedCollectionsOrTokens {
  edges: {
    node: CreatedNode;
    cursor: string;
  }[];
  pageInfo: {
    endCursor: string;
    hasNextPage: boolean;
  };
}

export interface Profile {
  __typename: string;
  handle: string;
  createdCollectionsOrTokens: CreatedCollectionsOrTokens;
  id: string;
}

// 定义 GraphQL 返回的数据接口
export interface CreatedNftGridResponse {
  profile: Profile;
}

// 定义接口 hook
export const useCreatedNftGrid = (identifier: string) => {
  return useQuery<CreatedNftGridResponse, Error>({
    queryKey: ["createdNftGrid", identifier],
    queryFn: () =>
      fetchZoraGraphQL<CreatedNftGridResponse>(
        CREATED_NFT_GRID_QUERY,
        { identifier }, // 这里传递了变量
      ),
  });
};
