import { createCollectorClient } from "@zoralabs/protocol-sdk";
import { useEffect, useState } from "react";
import { useChainId, usePublicClient } from "wagmi";

// Define SecondaryInfo type
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

// React Hook: Get secondary information
export const useSecondaryInfo = (
  contract: string, // Force contract parameter to be a string type starting with '0x'
  tokenId: bigint,
): SecondaryInfo | null => {
  const chainId = useChainId();
  const publicClient = usePublicClient()!;

  const [secondaryInfo, setSecondaryInfo] = useState<SecondaryInfo | null>(
    null,
  );

  useEffect(() => {
    const fetchSecondaryInfo = async () => {
      if (!contract) {
        return;
      }
      const collectorClient = createCollectorClient({ chainId, publicClient });

      try {
        const result = await collectorClient.getSecondaryInfo({
          // @ts-ignore
          contract,
          tokenId,
        });

        if (result) {
          setSecondaryInfo({
            erc20z: result.erc20z,
            marketCountdown: Number(result.marketCountdown ?? 0), // Handle bigint conversion and undefined
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
        console.error("Failed to get secondary info:", error);
      }
    };

    fetchSecondaryInfo();
  }, [chainId, publicClient, contract, tokenId]);

  return secondaryInfo;
};
