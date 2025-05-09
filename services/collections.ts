import { ChainNameById } from "@/constants/chain";
import { BASE_URL, BASE_URL_DEV, MP_BASE_URL, XApiKey } from "@/constants/url";
import {
  CollectionsDetailsResponse,
  CollectionsResponse,
  CollectionItemsResponse,
  ItemPopupInfoResponse,
  ItemDetailResp,
  CollectionAttrResp,
  CollectionResponse,
  CollectionSlugResponse,
} from "@/types/collection";
import { BLinkApiData } from "@/views/trade/swap/sol/PreviewComponent";

interface CollectionParams {
  page?: number;
  page_size?: number;
  parent_type_id?: number;
  chain_id?: number | string;
  sort_field?: string;
  type_name?: string;
  collection_address?: string;
  sort_direction?: string;
  name_like?: string;
}

export const getCollections = async (
  params: CollectionParams,
): Promise<CollectionsResponse> => {
  const queryParams = new URLSearchParams(params as any).toString();
  const response = await fetch(
    `${BASE_URL_DEV}/index/collections?${queryParams}`,
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};
export const getNewCollections = async (
  params: CollectionParams,
): Promise<CollectionsResponse> => {
  const queryParams = new URLSearchParams(params as any).toString();
  const response = await fetch(
    `${BASE_URL_DEV}/index/new_collections?${queryParams}`,
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};
export const getCollection = async (
  params: CollectionParams,
): Promise<CollectionResponse> => {
  const queryParams = new URLSearchParams(params as any).toString();
  const response = await fetch(`${BASE_URL}/index/collection?${queryParams}`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

interface CollectionBySlugParams {
  slug?: string;
}
export const getCollectionBySlug = async ({
  slug,
}: CollectionBySlugParams): Promise<CollectionSlugResponse> => {
  const response = await fetch(`${BASE_URL_DEV}/collection/slug/${slug}`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

interface CollectionByAddressParams {
  chain_name: string;
  token: string;
}
export const getCollectionByAddress = async ({
  chain_name,
  token,
}: CollectionByAddressParams): Promise<CollectionSlugResponse> => {
  console.log(chain_name, token);

  const chainId = ChainNameById?.[chain_name];
  const response = await fetch(
    `${BASE_URL_DEV}/collection/detail?chain_id=${chainId}&token=${token}`,
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

interface CollectionDetails {
  chain_id: string;
  token: string;
}

export const getCollectionDetails = async ({
  chain_id,
  token,
}: CollectionDetails): Promise<CollectionSlugResponse> => {
  const response = await fetch(
    `${BASE_URL_DEV}/nft/detail?chain_id=${chain_id}&token=${token}`,
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};
interface iGetCollectionsDetails {
  page?: number;
  pageSize?: number;
  chainId?: number;
  address?: string;
}

export const getCollectionsDetails = async ({
  chainId,
  address,
}: iGetCollectionsDetails): Promise<CollectionsDetailsResponse> => {
  const response = await fetch(
    `${MP_BASE_URL}/collection/addr/${chainId}/${address}`,
    {
      headers: {
        "x-api-key": XApiKey,
      },
    },
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

export interface GetCollectionsItems {
  address: string;
  attributes?: GetCollectionsItemsAttribute[];
  chainId: number;
  /**
   * 0 asc 1 desc
   */
  order?: number;
  owner?: string;
  /**
   * default to 1
   */
  page?: number;
  /**
   * default to 20
   */
  pageSize?: number;
  raritySearch?: GetCollectionsItemsTopDown;
  /**
   * 0 tokenId 1 rarity
   */
  sortBy?: number;
}

interface GetCollectionsItemsAttribute {
  traitType?: string;
  traitValues?: string[];
}

interface GetCollectionsItemsTopDown {
  down?: number;
  top?: number;
}
export const getCollectionsItems = async ({
  chainId,
  address,
  page,
  owner,
  attributes,
  raritySearch,
}: GetCollectionsItems): Promise<CollectionItemsResponse> => {
  const response = await fetch(`${MP_BASE_URL}/item/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": XApiKey,
    },
    body: JSON.stringify({
      chainId,
      address,
      page,
      owner,
      attributes,
      raritySearch,
    }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json(); // 解析并返回响应的JSON
};

interface iGetItemPopupInfo {
  address?: string;
  chainId?: number;
  tokenId?: string;
}
export const getItemPopupInfo = async ({
  chainId,
  address,
  tokenId,
}: iGetItemPopupInfo): Promise<ItemPopupInfoResponse> => {
  const response = await fetch(
    `${MP_BASE_URL}/item/search/popup/${chainId}/${address}/${tokenId}`,
    {
      headers: {
        "x-api-key": XApiKey,
      },
    },
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

interface iGetItemDetail {
  address?: string;
  chainId?: number;
  tokenId?: string;
}
export const getItemDetail = async ({
  chainId,
  address,
  tokenId,
}: iGetItemDetail): Promise<ItemDetailResp> => {
  const response = await fetch(
    `${MP_BASE_URL}/item/detail/${chainId}/${address}/${tokenId}`,
    {
      headers: {
        "x-api-key": XApiKey,
      },
    },
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

interface iGetCollectionAttr {
  address?: string;
  chainId?: number;
}
export const getCollectionAttr = async ({
  chainId,
  address,
}: iGetCollectionAttr): Promise<CollectionAttrResp> => {
  const response = await fetch(
    `${MP_BASE_URL}/collection/attributes/${chainId}/${address}`,
    {
      headers: {
        "x-api-key": XApiKey,
      },
    },
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};
export const getBlinkInfo = async (slug: string): Promise<BLinkApiData> => {
  const response = await fetch(
    `https://api.scattering.io/blink-api/buy/${slug}`,
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};
