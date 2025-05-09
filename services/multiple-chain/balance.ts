import { AlchemyRpcUrl } from "@/configs/chain";
import { ethers } from "ethers";

export type MultipleChainBalanceResult = {
  [chainId: number]: string;
};

interface FetchMultipleChainBalanceParams {
  userAddress: string;
  chainIds: number[];
}

async function fetchMultipleChainBalanceData({
  userAddress,
  chainIds,
}: FetchMultipleChainBalanceParams): Promise<MultipleChainBalanceResult> {
  const result: MultipleChainBalanceResult = {};

  // 对每个 chainId 发起单独的请求
  for (const chainId of chainIds) {
    const rpcUrl = AlchemyRpcUrl[chainId];
    if (!rpcUrl) {
      throw new Error(`RPC URL for chainId ${chainId} is not configured`);
    }

    const batchRequest = [
      {
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getBalance",
        params: [userAddress, "latest"],
      },
    ];

    // 发起请求
    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(batchRequest),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data for chainId ${chainId}: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();

    if (!data || !Array.isArray(data)) {
      throw new Error("Invalid response format");
    }

    // 解析返回的余额
    const ethBalance = ethers.BigNumber.from(data[0].result);
    result[chainId] = ethBalance.toString();
  }

  return result;
}

export default fetchMultipleChainBalanceData;
