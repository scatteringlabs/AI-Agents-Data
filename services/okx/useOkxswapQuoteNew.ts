import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ethers } from "ethers";

export const Erc20SellContractAddresses: Record<number, string> = {
  1: "0x40aA958dd87FC8305b97f2BA922CDdCa374bcD7f", // Ethereum
  324: "0xc67879F4065d3B9fe1C09EE990B891Aa8E3a4c2f", // zkSync Era
  10: "0x68D6B739D2020067D1e2F713b999dA97E4d54812", // Optimism
  137: "0x3B86917369B83a6892f553609F3c2F439C184e31", // Polygon
  56: "0x2c34A2Fb1d0b4f55de51E1d0bDEfaDDce6b7cDD6", // BNB Chain
  66: "0x70cBb871E8f30Fc8Ce23609E9E0Ea87B6b222F58", // OKC
  43114: "0x40aA958dd87FC8305b97f2BA922CDdCa374bcD7f", // Avalanche C
  250: "0x70cBb871E8f30Fc8Ce23609E9E0Ea87B6b222F58", // Fantom
  42161: "0x70cBb871E8f30Fc8Ce23609E9E0Ea87B6b222F58", // Arbitrum
  59140: "0x57df6092665eb6058DE53939612413ff4B09114E", // Linea
  1030: "0x68D6B739D2020067D1e2F713b999dA97E4d54812", // Conflux eSpace
  8453: "0x57df6092665eb6058DE53939612413ff4B09114E", // Base
  1111: "0x57df6092665eb6058DE53939612413ff4B09114E", // Mantle
};

// 定义响应数据的类型
interface TokenInfo {
  chainId: number;
  tokenContractAddress: string;
  tokenSymbol: string;
  tokenName: string;
  tokenLogoUrl: string;
  decimals: number;
}

interface CommonDexInfo {
  fromToken: TokenInfo;
  toToken: TokenInfo;
  fromTokenAmount: string;
  toTokenAmount: string;
}

interface SingleChainSwapInfo {
  estimateGasFee: string;
  receiveAmount: string;
  payAmount: string;
}

export interface CrossSwapResponse {
  code: number;
  data: {
    commonDexInfo: CommonDexInfo;
    singleChainSwapInfo: SingleChainSwapInfo;
  };
  msg: string;
}

interface SwapRequest {
  decimals: number;
  chainId: number;
  toChainId: number;
  fromTokenAddress: string;
  toTokenAddress: string;
  amount: string;
  userWalletAddress?: string;
}

// 构建请求 URL 的函数
function buildOkxQuoteUrl({
  chainId,
  toChainId,
  fromTokenAddress,
  toTokenAddress,
  amount,
  userWalletAddress,
}: SwapRequest): string {
  const baseUrl =
    "https://www.okx.com/priapi/v1/dx/trade/multi/outer/v3/quote/snap-mode";
  const params = new URLSearchParams({
    chainId: chainId.toString(),
    toChainId: toChainId.toString(),
    fromTokenAddress,
    toTokenAddress,
    amount,
    userWalletAddress: userWalletAddress || "",
    slippage: "0.01",
    slippageType: "1",
    pmm: "1",
    gasDropType: "0",
    forbiddenBridgeTypes: "0",
    feePercent: "1",
    referrerAddress: "0xa975ea5f814b274f77d8335c4024ad3711ef75e4",
  });
  return `${baseUrl}?${params.toString()}`;
}

// 获取报价的请求函数
export async function fetchOkxQuote({
  chainId,
  toChainId,
  fromTokenAddress,
  toTokenAddress,
  amount,
  userWalletAddress,
  decimals,
}: SwapRequest): Promise<CrossSwapResponse> {
  const url = buildOkxQuoteUrl({
    chainId,
    toChainId,
    fromTokenAddress,
    toTokenAddress,
    amount,
    userWalletAddress,
    decimals,
  });

  const response = await fetch(url, {
    method: "GET",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.msg || "Failed to fetch OKX quote.");
  }

  return response.json() as Promise<CrossSwapResponse>;
}

// 自定义 hook，使用 React Query 来获取报价数据
export function useOkxQuote({
  chainId,
  toChainId,
  fromTokenAddress,
  toTokenAddress,
  amount,
  userWalletAddress,
  decimals,
}: SwapRequest): UseQueryResult<CrossSwapResponse, Error> {
  const amountInNormalUnit = ethers.utils.formatUnits(amount, decimals || 18);

  return useQuery<CrossSwapResponse, Error>({
    queryKey: [
      "okxQuote",
      {
        chainId,
        toChainId,
        fromTokenAddress,
        toTokenAddress,
        amount,
        userWalletAddress,
        decimals,
      },
    ],
    queryFn: () =>
      fetchOkxQuote({
        chainId,
        toChainId,
        fromTokenAddress,
        toTokenAddress,
        amount: amountInNormalUnit,
        userWalletAddress,
        decimals,
      }),
    enabled: Boolean(Number(amount) > 0 && decimals),
    retry: 0,
  });
}

interface AutoSlippageInfo {
  autoSlippage: string;
}

interface DexQuoteInfo {
  amountOut: string;
  blockHeight: number;
  dexName: string;
  dexShowName: string;
  exchangeDirection: string;
  extraInfo: string;
  feeRate: string;
  fromTokenIndex: string;
  isUnderlying: string;
  okLinkUrl: string;
  pairAddress: string;
  percent: string;
  poolId: string;
  slippage: string;
  sqrtPrice: string;
  toTokenContractAddress: string;
  toTokenIndex: string;
}

interface SubRouter {
  dexQuoteInfoList: DexQuoteInfo[];
  fromToken: any; // You can further type this based on your data structure
  toToken: any; // You can further type this based on your data structure
}

interface DexRouter {
  percent: string;
  router: string;
  subRouterList: SubRouter[];
}

interface Payload {
  chainId: number;
  fromAmount: string;
  fromTokenAddress: string;
  fromTokenDecimal: string;
  toAmount: string;
  toTokenAddress: string;
  toTokenDecimal: string;
  userWalletAddress: string;
  estimateGasFee: string;
  pmm: string;
  gasDropType: number;
  minimumReceived: string;
  openMev: boolean;
  toChainId: number;
  slippage: string;
  autoSlippageInfo: AutoSlippageInfo;
  dexRouterList: DexRouter[];
  originDexRouterList: DexRouter[];
}

export const saveOrder = async (
  payload: Payload,
  type?: string,
): Promise<any> => {
  // Get the current timestamp
  const timestamp = Date.now();

  // Create the request URL with the timestamp
  const url =
    type === "sol"
      ? `https://www.okx.com/priapi/v1/dx/trade/multi/callData?t=${timestamp}`
      : `https://www.okx.com/priapi/v1/dx/trade/multi/outer/saveOrder?t=${timestamp}`;

  try {
    // Make the POST request with the provided payload
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload), // Stringify the payload
    });

    // Check for successful response
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    // Parse and return the JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error saving order:", error);
    throw error;
  }
};
