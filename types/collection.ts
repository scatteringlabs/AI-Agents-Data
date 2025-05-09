export interface CollectionItem {
  rank: number;
  imageSrc: string;
  name: string;
  volume: number;
  change24h: string;
  change7d: string;
  floorPrice: number;
  owners: number;
  items: number;
}

export interface CollectionType {
  id: number;
  name: string;
  color: string;
}

export interface Collection {
  chain_id: number;
  address: string;
  project_url: string;
  erc20_address: string;
  erc721_address: string;
  total_mints: string;
  name: string;
  status_flags: number;
  price_in_usd: string;
  logo_url: string;
  volume: string;
  volume_change: string;
  price_change: string;
  total_supply: string;
  market_cap: string;
  created_timestamp: number;
  launch_timestamp: number;
  token_id?: number;
  liquidity: string;
  total_liquidity: string;
  price_change_in_1hours?: string;
  price_change_in_6hours?: string;
  price_change_in_24hours?: string;
  total_buy_count_24hours?: string;
  total_buyer_count_24hours?: string;
  total_makers_count_24hours?: string;
  total_sell_count_24hours?: string;
  total_seller_count_24hours?: string;
  total_tx_count_24hours?: string;
  total_volume_in_1hours?: string;
  total_volume_in_6hours?: string;
  total_volume_in_24hours?: string;
  ft_address?: string;
  mt_address?: string;
  slug: string;
  symbol: string;
  has_logo: boolean;
  is_verified: boolean;
  type_id: number;
  zora_coin_type: CollectionType;
  collection_type: CollectionType;
  rank: number;
  creation_date: string;
  twitter_username?: string;
  creator_x_username?: string;
  twitter_score?: string;
  influencers_count?: number;
  projects_count?: number;
  venture_capitals_count?: number;
  tags: {
    rank: string;
    name: string;
  }[];
  top_20_followers?: Array<{
    name: string;
    username: string;
    avatar: string;
  }>;
}

export interface CollectionsResponse {
  data: {
    list: Collection[];
    page: number;
    page_size: number;
    total_count: number;
  };
}
export interface CollectionResponse {
  data: {
    item: Collection;
  };
}
export interface CollectionSlugResponse {
  data: { item: CollectionDetails };
}
export interface CollectionErc20zResponse {
  data: { item: CollectionDetailsErc20z };
}
export interface CollectionsDetailsResponse {
  data: CollectionDetails;
}

export interface CollectionDetails {
  chain_id: number;
  address: string;
  base_asset_address: string;
  erc20_address: string;
  total_liquidity: string;
  total_volume_in_24hours: string;
  erc721_address: string;
  name: string;
  symbol: string;
  description: string;
  price_in_usd: string;
  volume: string;
  price_change: string;
  price_change_in_24hours: string;
  total_supply: string;
  market_cap: string;
  liquidity: string;
  profile: string;
  research_report: string;
  ai_report: string;
  slug: string;
  has_logo: boolean;
  is_verified: boolean;
  nft_info: string;
  conversion_ratio: number;
  collection_story: string;
  nft_items: string;
  nft_owners: number;
  status: number; // 1 uin pool 2 no pool 3 other pool
  status_flags: number; // 1 our tokens
  unique_own: string;
  logo_url: string;
  banner_url: string;
  mobile_banner_url: string;
  project_url: string;
  discord_url: string;
  telegram_url: string;
  twitter_username: string;
  creator_x_username: string;
  collection_type: CollectionType;
  create_time: string;
  medium_url: string;
  facebook_url: string;
  tiktok_url: string;
  reddit_url: string;
  coingecko_url: string;
  okx_url: string;
  opensea_url: string;
  magiceden_url: string;
  coinmarketcap_url: string;
  okxmarket_url: string;
  dexscreener_url: string;
  dextools_url: string;
  github_url: string;
  pool_address: string;
  base_asset_symbol: string;
  base_asset_decimals: number;
  quote_asset_symbol: string;
  deployment_type: number;
  escrow_address: string;
  collection_address: string;
  authority_address: string;
  warpcast_url: string;
  instagram_url: string;
  tags: {
    rank: string;
    name: string;
  }[];
}

export interface CollectionDetailsErc20z {
  chain_id: number;
  ft_address: string;
  mt_address: string;
  token_id: number;
  name: string;
  symbol: string;
  decimals: number;
  total_supply: string;
  total_mints: string;
  market_cap: string;
  price_change_in_usd: string;
  status: number;
  logo_url: string;
  is_verified: boolean;
  created_timestamp: number;
  launch_timestamp: number;
  creator: string;
  price_in_usd: string;
  price_change: string;
  total_liquidity: string;
  total_volume: string;
  zora_coin_type: string | null;
  rank: number;
  pool_address: string;
  price_change_in_1hours?: string;
  price_change_in_6hours?: string;
  price_change_in_24hours?: string;
  total_buy_count_24hours?: string;
  total_buyer_count_24hours?: string;
  total_makers_count_24hours?: string;
  total_sell_count_24hours?: string;
  total_seller_count_24hours?: string;
  total_tx_count_24hours?: string;
  total_volume_in_1hours?: string;
  total_volume_in_6hours?: string;
  total_volume_in_24hours?: string;
}

export interface CollectionItemsResponse {
  code?: number;
  data?: CollectionItemListResp;
}

export interface CollectionItemListResp {
  items?: CollectionItemEntity[];
  page?: number;
}

export interface CollectionItemEntity {
  chainId?: number;
  contractAddress?: string;
  /**
   * image or video
   */
  mediaType?: string;
  imageUrl?: string;
  animationUrl?: string;
  contentUri?: string;
  name?: string;
  originalUrl?: string;
  price?: number;
  rarity?: number;
  thumbnailUrl?: string;
  tokenId?: string;
}

export interface ItemPopupInfoResponse {
  code?: number;
  data?: ItemListPopupResp;
}
export interface ItemListPopupResp {
  itemTraits?: ItemListPopupTrait[];
  rank?: number;
  total?: number;
}
export interface ItemListPopupTrait {
  percentage?: number;
  traitType?: string;
  traitValue?: string;
  /**
   * 0 string 1 number 2 boolean 3 time
   */
  valueType?: number;
}

export interface ItemDetailResp {
  code?: number;
  data?: ItemDetail;
}

export interface ItemDetail {
  chainName?: string;
  collection?: ItemDetailCollection;
  contractAddress?: string;
  contentUri?: string;
  imageUrl?: string;
  /**
   * image or video
   */
  mediaType?: string;
  name?: string;
  originalUrl?: string;
  owner?: string;
  rarity?: number;
  thumbnailUrl?: string;
  tokenId?: string;
  /**
   * 0 erc721 1 erc404 2 erc1155
   */
  tokenType?: number;
  traits?: ItemDetailTrait[];
  updateTime?: number;
}

export interface ItemDetailCollection {
  createdAddress?: string;
  logoUrl?: string;
  name?: string;
  slug?: string;
}
export interface ItemDetailTrait {
  floorPrice?: number;
  percentage?: number;
  traitType?: string;
  traitValue?: string;
  /**
   * 0 string 1 number 2 boolean 3 time
   */
  valueType?: number;
}

export interface CollectionAttrResp {
  code?: number;
  data?: CollectionAttrs;
}

export interface CollectionAttrs {
  list?: CollectionAttr[];
}

export interface CollectionAttr {
  key?: CollectionAttributeKey;
  values?: CollectionAttributeValue[];
}

export interface CollectionAttributeKey {
  maxValue?: number;
  minValue?: number;
  traitType?: string;
  traitUniqueValues?: number;
  /**
   * 0: string 1: number 2: boolean 3: time
   */
  valueType?: number;
}

export interface CollectionAttributeValue {
  itemTotal?: number;
  value?: string;
}
