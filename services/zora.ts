import { createCollectorClient } from "@zoralabs/protocol-sdk";
import { useEffect, useState } from "react";
import { useChainId, usePublicClient } from "wagmi";

// 定义 SecondaryInfo 类型
type SecondaryInfo = {
  erc20z: string;
  marketCountdown: number;
  minimumMintsForCountdown: number;
  mintCount: number;
  name: string;
  pool: string;
  saleEnd: number;
  saleStart: number;
  secondaryActivated: boolean;
  symbol: string;
};

export const useSecondaryInfo = (
  contract: `0x${string}`,
  tokenId: bigint,
): SecondaryInfo | null => {
  const chainId = useChainId();
  const publicClient = usePublicClient()!;

  const [secondaryInfo, setSecondaryInfo] = useState<SecondaryInfo | null>(
    null,
  );

  useEffect(() => {
    const fetchSecondaryInfo = async () => {
      const collectorClient = createCollectorClient({ chainId, publicClient });

      try {
        const result = await collectorClient.getSecondaryInfo({
          contract,
          tokenId,
        });

        if (result) {
          setSecondaryInfo({
            erc20z: result.erc20z,
            marketCountdown: Number(result.marketCountdown ?? 0),
            minimumMintsForCountdown: Number(
              result.minimumMintsForCountdown ?? 0,
            ),
            mintCount: Number(result.mintCount ?? 0),
            name: result.name,
            pool: result.pool,
            saleEnd: Number(result.saleEnd ?? 0),
            saleStart: Number(result.saleStart ?? 0),
            secondaryActivated: result.secondaryActivated,
            symbol: result.symbol,
          });
        }
      } catch (error) {
        console.error("获取 secondary 信息失败:", error);
      }
    };

    fetchSecondaryInfo();
  }, [chainId, publicClient, contract, tokenId]);

  return secondaryInfo;
};
