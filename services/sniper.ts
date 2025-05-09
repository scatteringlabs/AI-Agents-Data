interface Trait {
  value: string | number;
  trait_type: string;
}

interface AdditionalMetadata {
  key: string;
  value: string;
}

export interface ListingItem {
  listingPrice: number;
  mint: string;
  blocktime: number;
  signature: string;
  owner: string;
  marketplace: string;
  slot: number;
  image: string;
  name: string;
  sellerFeeBasisPoints: number;
  traits: Trait[];
  royaltyFeeBasisPoints: number;
  isToken2022: boolean;
  additionalMetadata: AdditionalMetadata[];
  ssRarityRank: number;
  customRank: number;
  ssRarityPercentile: number;
  ssStatRank: number;
  ssStatPercentile: number;
  hrRank: number;
  mrRank: number;
  lastSold: any | null;
}
// https://aerial-wildcat-ecd.notion.site/Sniper-Labs-APIs-f3ae3810e87f47938dc895b69a23592b  Sniper Doc
interface ListingResponse {
  lastToken: string;
  result: ListingItem[];
}
// paginationToken
export async function fetchListings(
  slug: string,
  paginationToken: string,
  rarityQueryParam: string,
  limit: number = 96,
  sort: string = "lth",
): Promise<ListingResponse> {
  const url = `https://api.scattering.io/sol-nft-api/v1/collections/${slug}/listings?limit=${limit}&sort=${sort}&unlisted=true&paginationToken=${paginationToken}&traits=${rarityQueryParam}`;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result: ListingResponse = await response.json();

    const filteredResult = result.result.filter(
      (item) => item.listingPrice !== 0 && item.listingPrice !== -1,
    );

    return {
      ...result,
      result: filteredResult,
    };
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function buyNFT(
  buyerAddress: string,
  signature: string,
  blocktime: number,
): Promise<any> {
  const url = `https://api.scattering.io/sol-nft-api/v1/buy?signature=${signature}&buyerAddress=${buyerAddress}&blocktime=${blocktime}`;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
interface ListingTrait {
  value: string;
  trait_type: string;
  rarity: number;
  count: number;
  floorPrice: number;
}

interface AdditionalMetadata {
  key: string;
  value: string;
}

interface NFTData {
  isToken2022: boolean;
  uri: string;
  marketplace: string;
  listingPrice: number;
  name: string;
  metaplexSymbol: string;
  signature: string;
  listingPriceInLamports: number;
  image: string;
  metadataPointerAddress: string;
  accountMetadataBuffer: string;
  owner: string;
  transferHookAuthority: string;
  token2022Standard: string;
  mintAddress: string;
  symbol: string;
  timestamp: number;
  tokenStandard: number;
  traits: ListingTrait[];
  freezeAuthority: string;
  sellerFeeBasisPoints: number;
  listingType: string;
  metadataSlot: number;
  updateAuthority: string;
  slot: number;
  additionalMetadata: AdditionalMetadata[];
  verified: boolean;
  ssRarityRank: number;
  ssRarityPercentile: number;
  ssStatRank: number;
  ssStatPercentile: number;
  royaltyFeeBasisPoints: number;
  lastSold: number;
  lastSoldTime: string;
  lastActivityType: string;
  lastActivityTimestamp: string;
  collectionFloorPrice: number;
}
export async function fetchNFTDetails(mintAddress: string): Promise<NFTData> {
  const url = `https://api.scattering.io/sol-nft-api/v1/nfts/${mintAddress}`;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

interface CollectionDetails {
  name: string;
  image: string;
  mintDate: string;
  description: string;
  discord: string;
  website: string;
  twitter: string;
  verified: boolean;
  nftValidation: string;
  symbol: string;
  ssSymbol: string;
  inscribed: boolean;
  indexed: boolean;
  isToken2022: boolean;
  libreplexDeploymentAddress: string;
  hitSecondaryEpoch: string;
  libreplexMachineAddress: string;
  association: string;
  associationType: string;
  exclusive: boolean;
  skipMetadataSync: boolean;
  tokenTaxFlatFee: number;
  creatorRoyaltyAddress: string;
}
export async function fetchCollectionNameAndImage(
  slug: string,
): Promise<CollectionDetails> {
  const url = `https://api.scattering.io/sol-nft-api/v1/collections/${slug}`;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
export interface CollectionStats {
  oneDayVolume: number;
  oneDayTrades: number;
  uniqueHolders: string;
  floorPrice: number;
  listedCount: number;
  volume: number;
  supply: number;
  compressedUniqueHolders: number | null;
  marketcap: number;
}
export async function fetchCollectionStas(
  slug: string,
): Promise<CollectionStats> {
  const url = `https://api.scattering.io/sol-nft-api/v1/collections/${slug}/stats`;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

interface Listing {
  price: number;
  marketplace: string;
  time: number;
}

export interface NFTHoldingMint {
  mintAddress: string;
  symbol: string;
  owner: string;
  image: string;
  name: string;
  ssRarityPercentile: number;
  ssRarityRank: number;
  ssStatPercentile: number;
  ssStatRank: number;
  traits: Trait[];
  listing: Listing;
  lastSoldPrice: number | null;
}

interface NFTHoldingCollection {
  mints: NFTHoldingMint[];
  floorPrice: number;
  volume: number;
  volumePercentOneDay: number;
  floorPricePercentOneDay: number;
}

interface NFTHolding {
  [key: string]: NFTHoldingCollection;
}

interface HoldingNFTData {
  nftHolding: NFTHolding;
  sumTotalHolding: number;
}
export async function fetchNFTHolding(wallet: string): Promise<HoldingNFTData> {
  const url = `https://api.scattering.io/sol-nft-api/v2/wallets/${wallet}/nfts`;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
