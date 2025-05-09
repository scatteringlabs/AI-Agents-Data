import { TokenDetails } from "@/services/reservoir";
import { CollectionItemEntity } from "@/types/collection";

export function replaceImageUrl(url: string | undefined) {
  if (url?.startsWith("https://ipfs.io")) {
    return url.replace("https://ipfs.io", "https://cf-ipfs.com");
  }

  return url ?? "";
}

export function getProperImageUrl(card?: CollectionItemEntity) {
  if (!card) {
    return "";
  }
  const url =
    card.contentUri ||
    card.thumbnailUrl ||
    card.originalUrl ||
    card.imageUrl ||
    card?.animationUrl;

  return replaceImageUrl(url);
}

export function getImageUrl(card?: TokenDetails) {
  if (!card) {
    return "";
  }
  const url =
    card.token?.imageLarge || card.token?.image || card.token?.imageSmall;

  return url;
}
