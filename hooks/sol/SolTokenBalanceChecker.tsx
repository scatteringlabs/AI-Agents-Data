import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  AccountLayout,
  MintLayout,
  TOKEN_2022_PROGRAM_ID,
  getMint,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";

export const useTokenBalance = (tokenMintAddress: string) => {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getTokenBalance = async () => {
      try {
        if (publicKey) {
          const mintPublicKey = new PublicKey(tokenMintAddress);
          const mintInfo = await getMint(connection, mintPublicKey);
          console.log("mintInfo", mintInfo);

          const accountInfo = await connection.getAccountInfo(mintPublicKey);

          let tokenAccounts;
          if (accountInfo?.owner?.equals(TOKEN_PROGRAM_ID)) {
            tokenAccounts = await connection.getTokenAccountsByOwner(
              publicKey,
              {
                programId: TOKEN_PROGRAM_ID,
              },
            );
          } else if (accountInfo?.owner?.equals(TOKEN_2022_PROGRAM_ID)) {
            tokenAccounts = await connection.getTokenAccountsByOwner(
              publicKey,
              {
                programId: TOKEN_2022_PROGRAM_ID,
              },
            );
          }

          const tokenAccount = tokenAccounts?.value?.find((accountInfo) => {
            const accountData = AccountLayout.decode(accountInfo.account.data);

            return (
              new PublicKey(accountData.mint).toString() === tokenMintAddress
            );
          });

          if (tokenAccount) {
            const accountData = AccountLayout.decode(tokenAccount.account.data);
            const amount = accountData.amount;
            const tokenAmount =
              Number(amount) / Math.pow(10, mintInfo?.decimals || 9);
            setTokenBalance(tokenAmount);
            setError(null);
          } else {
            setTokenBalance(0);
            setError("Token account not found");
          }
        }
      } catch (err) {
        setTokenBalance(0);
        setError("Unable to fetch token balance");
      }
    };

    if (connected) {
      getTokenBalance();
    }
  }, [connection, publicKey, connected, tokenMintAddress]);

  return { tokenBalance, error };
};
export function useBalance(mint?: PublicKey) {
  // const { balances } = useBalances();
  const { publicKey: owner } = useWallet();

  const account =
    mint && owner
      ? getAssociatedTokenAddressSync(
          new PublicKey(mint.toString()),
          owner,
          true,
        )
      : null;

  return { amount: 0 };
}
