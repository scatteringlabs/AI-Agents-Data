import { ChainId } from "@uniswap/sdk-core";
import { ethers } from "ethers";

export function chainIdToNetworkName(networkId: number) {
  switch (networkId) {
    case 10000:
      return "solana";
    case ChainId.MAINNET:
      return "ethereum";
    case ChainId.ARBITRUM_ONE:
      return "arbitrum";
    case ChainId.OPTIMISM:
      return "optimism";
    case ChainId.POLYGON:
      return "polygon";
    case ChainId.BNB:
      return "smartchain";
    case ChainId.BASE:
      return "base";
    default:
      return "ethereum";
  }
}

export const getTokenLogoURL = ({
  address,
  chainId,
  size = 90,
}: {
  address?: string;
  chainId?: number;
  size?: number;
}) => {
  try {
    if (!address || !chainId) {
      return "/assets/images/avatar/avatar-01.png";
    }
    let checksumAddress = "";
    if (Number(chainId) === 10000) {
      checksumAddress = address;
    } else {
      checksumAddress = ethers.utils.getAddress(address);
    }

    return `https://d2oiecgevbfxbl.cloudfront.net/images/${size}x${size}/freeze=false/https://static.crystalvault.io/logo/${chainIdToNetworkName(
      chainId,
    )}/assets/${checksumAddress}/logo.png`;
  } catch (error) {
    return "";
  }
};

export const getTokenLogoURLWithoutCrop = ({
  address,
  chainId,
}: {
  address?: string;
  chainId?: ChainId;
}) => {
  if (!address || !chainId) {
    return "/assets/images/avatar/avatar-01.png";
  }
  try {
    let checksumAddress = "";
    if (Number(chainId) === 10000) {
      checksumAddress = address;
    } else {
      checksumAddress = ethers.utils.getAddress(address);
    }
    return `https://d2oiecgevbfxbl.cloudfront.net/images/90x90/freeze=false/https://static.crystalvault.io/logo/${chainIdToNetworkName(
      chainId,
    )}/assets/${checksumAddress}/logo.png`;
  } catch (error) {
    console.log("getTokenLogoURL", error);

    return "";
  }
};

export const getTokenLogoURLWithoutCropNoCDN = ({
  address,
  chainId,
}: {
  address?: string;
  chainId?: ChainId;
}) => {
  if (!address || !chainId) {
    return "/assets/images/avatar/avatar-01.png";
  }
  try {
    let checksumAddress = "";
    if (Number(chainId) === 10000) {
      checksumAddress = address;
    } else {
      checksumAddress = ethers.utils.getAddress(address);
    }
    return `https://static.crystalvault.io/logo/${chainIdToNetworkName(
      chainId,
    )}/assets/${checksumAddress}/logo.png`;
  } catch (error) {
    console.log("getTokenLogoURL", error);

    return "";
  }
};
// test
