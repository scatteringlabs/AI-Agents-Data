import { AlchemyRpcUrl } from "@/configs/chain";
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";

export type BatchBalanceResult = {
  ethBalance: string;
  erc20Balance: string;
};

interface FetchBatchDataParams {
  userAddress: string;
  erc20Address: string;
  chainId: number;
}

async function fetchBatchBalanceData({
  userAddress,
  erc20Address,
  chainId,
}: FetchBatchDataParams): Promise<BatchBalanceResult> {
  const rpcUrl = AlchemyRpcUrl[chainId];
  if (!rpcUrl) {
    throw new Error(`RPC URL for chainId ${chainId} is not configured`);
  }

  const batchRequests = [
    {
      jsonrpc: "2.0",
      id: 1,
      method: "eth_getBalance",
      params: [userAddress, "latest"],
    },
    {
      jsonrpc: "2.0",
      id: 2,
      method: "eth_call",
      params: [
        {
          to: erc20Address,
          data: `0x70a08231000000000000000000000000${userAddress.slice(2)}`,
        },
        "latest",
      ],
    },
  ];

  const response = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(batchRequests),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch data: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();

  if (!data || !Array.isArray(data)) {
    throw new Error("Invalid response format");
  }

  const ethBalance = ethers.BigNumber.from(data[0].result);
  const erc20Balance = ethers.BigNumber.from(data[1].result);

  return {
    ethBalance: ethBalance.toString(),
    erc20Balance: erc20Balance.toString(),
  };
}

interface UseBatchBalanceQueryParams {
  userAddress: string;
  erc20Address: string;
  chainId: number;
}

export function useBatchBalanceQuery({
  userAddress,
  erc20Address,
  chainId,
}: UseBatchBalanceQueryParams) {
  return useQuery({
    queryKey: ["batchBalanceData", { userAddress, erc20Address, chainId }],
    queryFn: () =>
      fetchBatchBalanceData({
        userAddress,
        erc20Address,
        chainId,
      }),
    enabled: Boolean(userAddress && erc20Address && chainId),
  });
}
