import { useState, useEffect, useCallback, useMemo } from "react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import {
  TOKEN_PROGRAM_ID,
  getMint,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import { usePrivy, useSolanaWallets } from "@privy-io/react-auth";

const connection = new Connection(
  "https://mainnet.helius-rpc.com/?api-key=c6323c63-ef25-4c90-acd3-3a81fb798c45",
  "confirmed",
);

interface TokenBalance {
  mintAddress: string;
  balance: number;
  decimals: number;
  programId: string;
}

const useTokenBalance = (tokenAddress: string) => {
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { wallets: solanaWallets } = useSolanaWallets();
  const address = useMemo(() => solanaWallets?.[0]?.address, [solanaWallets]);

  const publicKey = useMemo(
    () => (address ? new PublicKey(address) : ""),
    [address],
  );
  const fetchBalances = useCallback(async () => {
    if (!publicKey || !connection) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const programIds = [TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID];

      let balanceList: TokenBalance[] = [];

      for (const programId of programIds) {
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          publicKey,
          {
            programId: programId,
          },
        );

        for (const { account } of tokenAccounts.value) {
          const tokenAmount = account.data.parsed.info.tokenAmount.uiAmount;
          const mintAddress = account.data.parsed.info.mint;
          if (tokenAddress === account.data.parsed.info.mint) {
            const mintInfo = await getMint(
              connection,
              new PublicKey(mintAddress),
              "confirmed",
              programId,
            );

            balanceList.push({
              mintAddress: mintAddress,
              balance: tokenAmount,
              decimals: mintInfo.decimals,
              programId: programId.toString(),
            });
          }
        }
      }
      setBalances(balanceList);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [publicKey, tokenAddress]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  return { balances, loading, error, refetch: fetchBalances };
};

export default useTokenBalance;
