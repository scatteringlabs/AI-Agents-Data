import { AlchemyRpcUrl } from "@/configs/chain";
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";

export type BatchBalanceResult = {
  ethBalance: string;
  erc20Balance: string;
  erc1155Balance: string;
};

interface FetchBatchDataParams {
  userAddress: string;
  erc20Address: string;
  erc1155Address: string;
  nftTokenId: number;
  chainId: number;
}

// 批量请求工具函数
async function fetchBatchBalanceData({
  userAddress,
  erc20Address,
  erc1155Address,
  nftTokenId,
  chainId,
}: FetchBatchDataParams): Promise<BatchBalanceResult> {
  // RPC URL
  const rpcUrl = AlchemyRpcUrl[chainId];
  if (!rpcUrl) {
    throw new Error(`RPC URL for chainId ${chainId} is not configured`);
  }

  // 构建 JSON-RPC 批量请求
  const batchRequests = [
    {
      jsonrpc: "2.0",
      id: 1,
      method: "eth_getBalance",
      params: [userAddress, "latest"], // 获取 ETH 余额
    },
    {
      jsonrpc: "2.0",
      id: 2,
      method: "eth_call", // 获取 ERC20 Token 余额
      params: [
        {
          to: erc20Address,
          data: `0x70a08231000000000000000000000000${userAddress.slice(2)}`, // ERC20 balanceOf 编码
        },
        "latest",
      ],
    },
    {
      jsonrpc: "2.0",
      id: 3,
      method: "eth_call", // 获取 ERC1155 NFT 数量
      params: [
        {
          to: erc1155Address,
          data: `0x00fdd58e000000000000000000000000${userAddress.slice(
            2,
          )}${nftTokenId.toString(16).padStart(64, "0")}`, // ERC1155 balanceOf 编码
        },
        "latest",
      ],
    },
  ];

  // 发起批量请求
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

  // 解析返回结果
  const ethBalance = ethers.BigNumber.from(data[0].result); // ETH 余额
  const erc20Balance = ethers.BigNumber.from(data[1].result); // ERC20 余额
  const erc1155Balance = ethers.BigNumber.from(data[2].result); // ERC1155 数量

  return {
    ethBalance: ethBalance.toString(), // 转为字符串，避免前端丢失精度
    erc20Balance: erc20Balance.toString(),
    erc1155Balance: erc1155Balance.toString(),
  };
}

// 使用 useQuery Hook 调用批量获取数据方法
interface UseBatchBalanceQueryParams {
  userAddress: string;
  erc20Address: string;
  erc1155Address: string;
  nftTokenId: number;
  chainId: number;
}

export function useBatchBalanceQuery({
  userAddress,
  erc20Address,
  erc1155Address,
  nftTokenId,
  chainId,
}: UseBatchBalanceQueryParams) {
  return useQuery({
    queryKey: [
      "batchBalanceData",
      { userAddress, erc20Address, erc1155Address, nftTokenId, chainId },
    ],
    queryFn: () =>
      fetchBatchBalanceData({
        userAddress,
        erc20Address,
        erc1155Address,
        nftTokenId,
        chainId,
      }),
    enabled: Boolean(
      userAddress && erc20Address && erc1155Address && nftTokenId && chainId,
    ),
  });
}
