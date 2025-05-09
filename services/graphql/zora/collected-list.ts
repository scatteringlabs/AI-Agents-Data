import { useQuery } from "@tanstack/react-query";
import { fetchZoraGraphQL } from "./created-list";

export const COLLECTED_NFT_GRID_QUERY = `
  query CollectedNftGridQuery($identifier: String!) {
    profile(identifier: $identifier) {
      __typename
      handle
      ...CollectedNftGrid_collectedCollections
      ... on Node {
        __isNode: __typename
        id
      }
    }
  }

  fragment CollectedNftGrid_collectedCollections on IGraphQLProfile {
    __isIGraphQLProfile: __typename
    collectedCollectionsOrTokens(first: 99) {
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
            price {
              tokenPrice
            }
          }
        }
        ... on GraphQLZoraSaleStrategyZoraTimedMinter {
          __typename
          sale {
            price {
              mintFee
            }
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

export interface CollectedNode {
  __typename: string;
  name: string;
  address: string;
  chainId: string;
  media?: Media;
  tokenId?: string;
  salesStrategy?: {
    __typename: string;
    sale?: {
      price?: {
        tokenPrice?: string;
        mintFee?: string;
      };
      endTime?: string;
      minimumMarketEth?: string;
      marketCountdown?: string;
      currentMarketEth?: string;
    };
  };
}

export interface CollectedCollectionsOrTokens {
  edges: {
    node: CollectedNode;
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
  collectedCollectionsOrTokens: CollectedCollectionsOrTokens;
  id: string;
}

export interface CollectedNftGridResponse {
  profile: Profile;
}

export const useCollectedNftGrid = (identifier: string) => {
  return useQuery<CollectedNftGridResponse, Error>({
    queryKey: ["collectedNftGrid", identifier],
    queryFn: () =>
      fetchZoraGraphQL<CollectedNftGridResponse>(COLLECTED_NFT_GRID_QUERY, {
        identifier,
      }),
  });
};
