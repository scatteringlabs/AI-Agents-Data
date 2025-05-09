import {
  BASE_URL,
  BASE_URL_DEV,
  MP_BASE_URL,
  XApiKey,
  ZORA_BASE_URL,
  ZoraXApiKey,
} from "@/constants/url";
import {
  CollectionsDetailsResponse,
  CollectionsResponse,
  CollectionItemsResponse,
  ItemPopupInfoResponse,
  ItemDetailResp,
  CollectionAttrResp,
  CollectionResponse,
  CollectionSlugResponse,
  CollectionErc20zResponse,
} from "@/types/collection";
import { BLinkApiData } from "@/views/trade/swap/sol/PreviewComponent";

interface CollectionParams {
  page?: number;
  page_size?: number;
  parent_type_id?: number;
  zora_coin_type?: number;
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
  const response = await fetch(`${ZORA_BASE_URL}/coins/list?${queryParams}`, {
    headers: {
      "x-api-key": ZoraXApiKey,
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

export const getNewTokens = async (
  params: CollectionParams,
): Promise<CollectionsResponse> => {
  const queryParams = new URLSearchParams(params as any).toString();
  const response = await fetch(
    `${ZORA_BASE_URL}/coins/new_on_secondary?${queryParams}`,
    {
      headers: {
        "x-api-key": ZoraXApiKey,
      },
    },
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
  const response = await fetch(`${BASE_URL}/index/collection?${queryParams}`, {
    headers: {
      "x-api-key": ZoraXApiKey,
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

interface CollectionBySlugParams {
  chain_id: number;
  mt_address: string;
  token_id: number;
}
export const getCollectionDetail = async (
  params: CollectionBySlugParams,
): Promise<CollectionErc20zResponse> => {
  const queryParams = new URLSearchParams(params as any).toString();
  const response = await fetch(`${ZORA_BASE_URL}/coins/detail?${queryParams}`, {
    headers: {
      "x-api-key": ZoraXApiKey,
    },
  });

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
