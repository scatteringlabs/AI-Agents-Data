import { createCollectorClient } from "@zoralabs/protocol-sdk";
import { useChainId, usePublicClient } from "wagmi";
import { useState, useEffect } from "react";

type TokenInfo = {
  contract: string;
  creator: string;
  maxSupply: number;
  mintType: "1155" | "721" | "premint";
  tokenURI: string;
  totalMinted: number;
};

type UseMintableTokenResult = {
  token: TokenInfo | null;
  prepareMint: (() => void) | null;
  loading: boolean;
  error: Error | null;
};

export const useMintableToken = (
  tokenContract: `0x${string}`,
  mintType: "premint", // 强制要求为 "premint" 类型
): UseMintableTokenResult => {
  const chainId = useChainId();
  const publicClient = usePublicClient()!;

  const [token, setToken] = useState<TokenInfo | null>(null);
  const [prepareMint, setPrepareMint] = useState<(() => void) | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMintableToken = async () => {
      setLoading(true);
      setError(null);
      const collectorClient = createCollectorClient({ chainId, publicClient });

      try {
        const { token, prepareMint } = await collectorClient.getToken({
          tokenContract,
          mintType,
        } as any); // 使用 `as any` 暂时忽略类型不匹配的问题

        if (token) {
          setToken({
            contract: token.contract as unknown as string, // 进行类型断言
            creator: token.creator,
            maxSupply: Number(token.maxSupply), // 转换为 `number` 类型
            mintType: token.mintType as "1155" | "721" | "premint",
            tokenURI: token.tokenURI,
            totalMinted: Number(token.totalMinted), // 转换为 `number` 类型
          });
          setPrepareMint(() => prepareMint);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchMintableToken();
  }, [chainId, publicClient, tokenContract, mintType]);

  return { token, prepareMint, loading, error };
};
