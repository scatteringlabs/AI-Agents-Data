import { Connection, PublicKey } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  getMint,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";

interface TokenBalance {
  mintAddress: string;
  balance: number;
  decimals: number;
  programId: string;
}

export const getTokenBalance = async (
  connection: Connection,
  walletAddress: string,
  tokenAddress: string,
): Promise<TokenBalance | null> => {
  try {
    const publicKey = new PublicKey(walletAddress);
    const programIds = [TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID];

    for (const programId of programIds) {
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        {
          programId: programId,
        },
      );

      for (const { account } of tokenAccounts.value) {
        const tokenAmount = account.data.parsed.info.tokenAmount.uiAmount;
        const decimals = account.data.parsed.info.tokenAmount.decimals;
        const mintAddress = account.data.parsed.info.mint;

        if (tokenAddress === mintAddress) {
          return {
            mintAddress: mintAddress,
            balance: tokenAmount,
            decimals,
            programId: programId.toString(),
          };
        }
      }
    }

    return null;
  } catch (err) {
    console.error("Error fetching token balance:", err);
    return null;
  }
};
