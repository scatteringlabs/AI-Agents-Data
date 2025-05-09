import { ChainId, Token } from "@uniswap/sdk-core";
import { zeroAddress } from "viem";
import {
  ETH_BSC,
  USDC_ARBITRUM,
  USDC_BASE,
  USDC_MAINNET,
  USDT,
} from "./tokens";
import { USDT_ARBITRUM } from "@uniswap/smart-order-router";
import { BaseSID } from "@/views/launchpad/create/tokenService";

// export enum ChainId {
//   MAINNET = 1,
//   Goerli = 5,

//   ARBITRUM_ONE = 42161,
//   Base = 8453,
//   Optimism = 10,
//   Polygon = 137,
//   PolygonMumbai = 80001,
//   Bnb = 56,
// }

export const ALL_SUPPORTED_CHAINS: string[] = Object.values(ChainId).map((c) =>
  c.toString(),
);

export const ChainNameById: { [key: string]: number } = {
  ethereum: ChainId.MAINNET,
  arbitrum: ChainId.ARBITRUM_ONE,
  base: ChainId.BASE,
  sepolia: ChainId.SEPOLIA,
  zora: ChainId.ZORA,
  solana: 10000,
  bnb: ChainId.BNB,
  "base-sepolia": 84532,
  "": -1,
};

export const ChainIdByName: { [key: number]: string } = {
  [ChainId.MAINNET]: "ethereum",
  [10000]: "solana",
  [ChainId.ARBITRUM_ONE]: "arbitrum",
  [ChainId.BASE]: "base",
  [ChainId.SEPOLIA]: "sepolia",
  [84532]: "base-sepolia",
  [ChainId.ZORA]: "zora",
  [ChainId.BNB]: "BNB",
};

export const GmgnNameById: { [key: number]: string } = {
  [ChainId.MAINNET]: "eth",
  [10000]: "sol",
  [ChainId.ARBITRUM_ONE]: "arbitrum",
  [ChainId.BASE]: "base",
  [ChainId.SEPOLIA]: "sepolia",
  [84532]: "base-sepolia",
  [ChainId.ZORA]: "zora",
  [ChainId.BNB]: "bsc",
};

export const DexscreenerNameById: { [key: number]: string } = {
  [ChainId.MAINNET]: "ethereum",
  [10000]: "solana",
  [ChainId.BASE]: "base",
  [ChainId.SEPOLIA]: "sepolia",
  [ChainId.BNB]: "bsc",
};
export const ZeroAddressSymbol: { [key: number]: string } = {
  [ChainId.MAINNET]: "ETH",
  [ChainId.ARBITRUM_ONE]: "ETH",
  [ChainId.BASE]: "ETH",
  [ChainId.SEPOLIA]: "ETH",
};

export const SolBaseTokens = [
  {
    address: "So11111111111111111111111111111111111111112",
    symbol: "SOL",
    decimals: 9,
  },
  {
    address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    symbol: "USDT",
    decimals: 6,
  },
  {
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    symbol: "USDC",
    decimals: 6,
  },
];
export const BaseTokenById: { [key: number]: Token[] } = {
  [ChainId.MAINNET]: [
    new Token(ChainId.MAINNET, zeroAddress, 18, "ETH", "ETH"),
  ],
  [ChainId.BNB]: [new Token(ChainId.BNB, zeroAddress, 18, "BNB", "BNB")],
  [ChainId.ZORA]: [new Token(ChainId.ZORA, zeroAddress, 18, "ETH", "ETH")],
  [ChainId.ARBITRUM_ONE]: [
    new Token(ChainId.ARBITRUM_ONE, zeroAddress, 18, "ETH", "ETH"),
    // USDT_ARBITRUM,
    // USDC_ARBITRUM,
  ],
  [ChainId.BASE]: [
    new Token(ChainId.BASE, zeroAddress, 18, "ETH", "ETH"),
    // USDC_BASE,
  ],
  [ChainId.SEPOLIA]: [
    new Token(ChainId.SEPOLIA, zeroAddress, 18, "ETH", "ETH"),
    // new Token(
    //   ChainId.SEPOLIA,
    //   "0xf830994C6cA0f2A8389eDFd98bee5F4eD7513602",
    //   6,
    //   "USDT",
    //   "USDT",
    // ),
    // new Token(
    //   ChainId.SEPOLIA,
    //   "0xC194aEbd23F7f1d175C7729fDE7dB4b3298e84EE",
    //   6,
    //   "USDC",
    //   "USDC",
    // ),
  ],
};
