import { useQuery, UseQueryResult } from "@tanstack/react-query";

// 定义 Token 信息接口
interface TokenInfo {
  chainId: number;
  chainName: string;
  tokenContractAddress: string;
  tokenLogoUrl: string;
  tokenName: string;
  tokenSymbol: string;
  decimals: number;
  explorerUrl: string;
}

// 定义 CommonDexInfo 接口
interface CommonDexInfo {
  bestPriceRouterSave: string;
  code: string;
  defiPlatformInfo: {
    defiPlatformName: string;
    id: string;
    logoUrl: string;
    type: string;
  };
  estimateReserveGasTokenFee: string;
  fromNativeTokenSymbol: string;
  fromToken: TokenInfo;
  fromTokenAmount: string;
  fromTokenPrice: string;
  toNativeTokenSymbol: string;
  toToken: TokenInfo;
}

// 定义响应数据接口
interface CrossSwapResponse {
  code: number;
  data: {
    commonDexInfo: CommonDexInfo;
    intentCode: string;
    singleChainSwapInfo: any | null;
    swapType: string;
  };
  msg: string;
  error_code: string;
  error_message: string;
  detailMsg: string;
}

// 请求参数接口
interface SwapRequest {
  chainId: number;
  toChainId: number;
  fromTokenAddress: string;
  toTokenAddress: string;
  amount: string;
  // slippage: string;
  userWalletAddress: string;
}

// 构建请求 URL 的函数
function buildSwapUrl({
  chainId,
  toChainId,
  fromTokenAddress,
  toTokenAddress,
  amount,
  // slippage,
  userWalletAddress,
}: SwapRequest): string {
  const baseUrl = "https://www.okx.com/api/v5/dex/cross-chain/quote";
  // const baseUrl = "https://www.okx.com/priapi/v1/dx/trade/bridge/v3/quote";
  const params = new URLSearchParams({
    chainId: "1",
    // chainId: chainId.toString(),
    toChainId: "8453",
    // toChainId: toChainId.toString(),
    fromTokenAddress,
    toTokenAddress,
    amount,
    slippage: "0.15",
    slippageType: "1", // slippage type 固定为1
    pmm: "1", // 固定参数
    gasDropType: "0", // 固定参数
    forbiddenBridgeTypes: "0", // 固定参数
    feePercent: "1", // 固定参数
    referrerAddress: "0x64190E41af3459E80630427b9a2032964726F551", // 固定参数
    sort: "0", // 固定参数
    t: Date.now().toString(), // 时间戳
  });
  return `${baseUrl}?${params.toString()}`;
}

// 获取报价的请求函数
export async function fetchSwapQuote({
  chainId,
  toChainId,
  fromTokenAddress,
  toTokenAddress,
  amount,
  // slippage,
  userWalletAddress,
}: SwapRequest): Promise<CrossSwapResponse> {
  const url = buildSwapUrl({
    chainId,
    toChainId,
    fromTokenAddress,
    toTokenAddress,
    amount,
    // slippage,
    userWalletAddress,
  });

  const response = await fetch(url, {
    method: "GET",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.msg || "Failed to fetch OKX quote.");
  }

  return response.json();
}

// 使用 React Query 获取报价数据的 hook
export function useBridgeSwapQuote({
  chainId,
  toChainId,
  fromTokenAddress,
  toTokenAddress,
  amount,
  // slippage,
  userWalletAddress,
}: SwapRequest): UseQueryResult<CrossSwapResponse, Error> {
  return useQuery<CrossSwapResponse, Error>({
    queryKey: [
      "swapQuote",
      {
        chainId,
        toChainId,
        fromTokenAddress,
        toTokenAddress,
        amount,
        // slippage,
        userWalletAddress,
      },
    ],
    queryFn: () =>
      fetchSwapQuote({
        chainId,
        toChainId,
        fromTokenAddress,
        toTokenAddress,
        amount,
        // slippage,
        userWalletAddress,
      }),
    enabled: Number(amount) > 0,
    retry: 0,
  });
}
