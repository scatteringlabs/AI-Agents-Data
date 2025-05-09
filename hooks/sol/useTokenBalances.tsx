import { useState, useEffect } from "react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import {
  TOKEN_PROGRAM_ID,
  getMint,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

interface TokenBalance {
  mintAddress: string;
  balance: number;
  decimals: number;
  programId: string;
}

const useTokenBalances = () => {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalances = async () => {
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

        setBalances(balanceList);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, [publicKey, connection]);

  return { balances, loading, error };
};

export default useTokenBalances;
