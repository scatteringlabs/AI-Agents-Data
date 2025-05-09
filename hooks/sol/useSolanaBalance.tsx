import { useState, useEffect, useCallback, useMemo } from "react";
import { Connection } from "@solana/web3.js";
import { usePrivy, useSolanaWallets } from "@privy-io/react-auth";
import { PublicKey } from "@solana/web3.js";
const connection = new Connection(
  "https://mainnet.helius-rpc.com/?api-key=c6323c63-ef25-4c90-acd3-3a81fb798c45",
  "confirmed",
);

export const useSolBalance = () => {
  // const { connection } = useConnection();
  const { wallets: solanaWallets } = useSolanaWallets();
  const address = useMemo(() => solanaWallets?.[0]?.address, [solanaWallets]);

  const publicKey = useMemo(
    () => (address ? new PublicKey(address) : ""),
    [address],
  );
  const [balance, setBalance] = useState<number | string | null>(0);
  const [error, setError] = useState<string | null>(null);

  const getBalance = useCallback(async () => {
    try {
      if (publicKey) {
        const balance = await connection.getBalance(publicKey);
        setBalance(balance / 1e9);
        setError(null);
      }
    } catch (err) {
      setError("Invalid address or unable to fetch balance");
      setBalance(0);
    }
  }, [publicKey]);

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  return { balance, error, refresh: getBalance };
};
