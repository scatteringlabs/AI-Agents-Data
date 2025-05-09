import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";
import {
  string,
  publicKey as publicKeySerializer,
  base58,
} from "@metaplex-foundation/umi/serializers";
import {
  generateSigner,
  Pda,
  PublicKey,
  publicKey,
  Transaction,
  Umi,
} from "@metaplex-foundation/umi";
import {
  EscrowV1,
  MPL_HYBRID_PROGRAM_ID,
  captureV1,
  fetchEscrowV1,
  releaseV1,
} from "@/utils/generated";
import { mplHybrid } from "./plugin";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { mplCore } from "@metaplex-foundation/mpl-core";
import { fetchDeployment } from "./generated/accounts/deployment";
import { fetchDeploymentConfig } from "./generated/accounts/deploymentConfig";
import { swapToFungible22 } from "./generated/instructions/swapToFungible22";
import { findAssociatedTokenPda } from "@metaplex-foundation/mpl-toolbox";
import { UmiPlugin } from "@metaplex-foundation/umi";
import { createLibreplexFairLaunchProgram } from "./generated/programs/libreplexFairLaunch";
import bs58 from "bs58";
import { swapToNonfungible22 } from "./generated/instructions/swapToNonfungible22";
import { sleep } from "@/views/trade/swap/sol/sol-token-card";
import pMap from "p-map";

export const libreplexFairLaunch = (): UmiPlugin => ({
  install(umi) {
    umi.programs.add(createLibreplexFairLaunchProgram(), false);
  },
});

// const COLLECTION = publicKey("AQJuBg4ns9p8QyJUWxStKfFV6AzVgN3YmWZvdLh18WNd");

export const initializeUmi = async (rpcEndpoint: string) => {
  const umi = await createUmi(rpcEndpoint);
  umi.use(libreplexFairLaunch());
  umi.use(mplHybrid());
  umi.use(mplCore());
  umi.use(mplTokenMetadata());
  umi.use(dasApi());
  return umi;
};

export const getEscrowAddress = (umi: Umi, COLLECTION: string) => {
  return umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
    string({ size: "variable" }).serialize("escrow"),
    publicKeySerializer().serialize(COLLECTION),
  ]);
};
export const LIBREPLEX_FAIR_LAUNCH_PROGRAM_ID =
  "8bvPnYE5Pvz2Z9dE6RAqWr1rzLknTndZ9hwvRE6kPDXP" as PublicKey<"8bvPnYE5Pvz2Z9dE6RAqWr1rzLknTndZ9hwvRE6kPDXP">;
// export const LIBREPLEX_FAIR_LAUNCH_PROGRAM_ID =
//   "43QY8SAMg2mSTipwXMa3sRUWcFrz6cH3XF6u1XBbQozS" as PublicKey<"43QY8SAMg2mSTipwXMa3sRUWcFrz6cH3XF6u1XBbQozS">;

export const SPL_TOKEN_PROGRAM_ID =
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" as PublicKey<"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA">;

export const getDeploymentData = async (umi: Umi, escrowAddress: string) => {
  if (!escrowAddress) {
    return;
  }
  let deploymentData;
  if (await umi.rpc.accountExists(publicKey(escrowAddress))) {
    deploymentData = await fetchDeployment(umi, publicKey(escrowAddress), {
      commitment: "processed",
    });
  }
  return deploymentData;
};

export const signatureToString = (signature: Uint8Array) =>
  base58.deserialize(signature)[0];

export const swapNFTtoToken22 = async (
  umi: Umi,
  idList: string[],
  escrow_address: string,
  fungibleMint: string,
) => {
  try {
    const user = umi.identity;

    const fungibleMintAddress = publicKey(fungibleMint);
    const creatorFeeTreasury = publicKey(umi.identity.publicKey);
    let fungibleTokenProgram = publicKey(SPL_TOKEN_PROGRAM_ID?.toString());
    let myFungibleAccount = await umi.rpc.getAccount(fungibleMintAddress);
    if (myFungibleAccount.exists) {
      fungibleTokenProgram = myFungibleAccount.owner;
    }
    let swapToFungible22Builder: any;

    for (const id of idList) {
      const nonFungibleMintAddress = publicKey(id);

      let nonFungibleTokenProgram = publicKey(SPL_TOKEN_PROGRAM_ID?.toString());
      let myNonFungibleAccount = await umi.rpc.getAccount(
        nonFungibleMintAddress,
      );
      if (myNonFungibleAccount.exists) {
        nonFungibleTokenProgram = myNonFungibleAccount.owner;
      }

      const hashlistMarkerPDA = umi.eddsa.findPda(
        publicKey(LIBREPLEX_FAIR_LAUNCH_PROGRAM_ID),
        [
          string({ size: "variable" }).serialize("hashlist_marker"),
          publicKeySerializer().serialize(escrow_address),
          publicKeySerializer().serialize(nonFungibleMintAddress),
        ],
      );

      const fungibleSourceTokenAccount = findAssociatedTokenPda(umi, {
        mint: fungibleMintAddress,
        owner: publicKey(escrow_address),
        tokenProgramId: fungibleTokenProgram,
      });

      const fungibleTargetTokenAccount = findAssociatedTokenPda(umi, {
        mint: fungibleMintAddress,
        owner: publicKey(user.publicKey),
        tokenProgramId: fungibleTokenProgram,
      });

      const nonFungibleSourceTokenAccount = findAssociatedTokenPda(umi, {
        mint: nonFungibleMintAddress,
        owner: publicKey(user.publicKey),
        tokenProgramId: nonFungibleTokenProgram,
      });

      const nonFungibleTargetTokenAccount = findAssociatedTokenPda(umi, {
        mint: nonFungibleMintAddress,
        owner: publicKey(escrow_address),
        tokenProgramId: nonFungibleTokenProgram,
      });

      const swapToFungible22BuilderSingle = swapToFungible22(umi, {
        signer: umi.identity,
        deployment: publicKey(escrow_address),
        fungibleMint: fungibleMintAddress,
        fungibleSourceTokenAccount: fungibleSourceTokenAccount, // Custodian FT ATA
        fungibleTargetTokenAccount: fungibleTargetTokenAccount, // User FT ATA
        fungibleTargetTokenAccountOwner: user.publicKey, // User
        hashlistMarker: hashlistMarkerPDA,
        nonFungibleMint: nonFungibleMintAddress,
        nonFungibleSourceAccountOwner: user, // User
        nonFungibleSourceTokenAccount: nonFungibleSourceTokenAccount, // User NFT ATA
        nonFungibleTargetTokenAccount: nonFungibleTargetTokenAccount, // Custodian NFT ATA
      });

      if (!swapToFungible22Builder) {
        swapToFungible22Builder = swapToFungible22BuilderSingle;
      } else {
        swapToFungible22Builder = swapToFungible22Builder.add(
          swapToFungible22BuilderSingle,
        );
      }
    }
    if (swapToFungible22Builder) {
      // const commitment = "confirmed";
      // const blockhash = await umi.rpc.getLatestBlockhash({
      //   commitment,
      // });
      let txSign = await swapToFungible22Builder.buildAndSign(umi);
      const { signatures, errors } = await sendTxsWithRetries({
        txs: [txSign],
        umi,
        concurrency: 1,
        retries: 3,
      });
      return signatures[0];
      // console.log(signatures, errors);

      // const signature = await umi.rpc.sendTransaction(txSign, {
      //   commitment,
      // });
      // // const sig = signatureToString(signature);
      // const confirmRes = await umi.rpc.confirmTransaction(signature, {
      //   commitment,
      //   strategy: {
      //     type: "blockhash",
      //     ...blockhash,
      //   },
      // });
      // if (confirmRes.value?.err) {
      //   throw new Error("Transaction failed");
      // }
      // console.log("confirmRes", confirmRes);
      // return confirmRes;
    }
    await sleep(500); // Don't spam the RPC
    // console.log("tx: ", bs58.encode(txSign.signatures[0]));
    // return res;
  } catch (error) {
    console.log(error);
  }
};

export const swapTokenToNFT = async (
  umi: Umi,
  idList: string[],
  escrow_address: string,
  fungibleMint: string,
) => {
  try {
    const user = umi.identity;
    const fungibleMintAddress = publicKey(fungibleMint);
    const creatorFeeTreasury = publicKey(umi.identity.publicKey);
    let fungibleTokenProgram = publicKey(SPL_TOKEN_PROGRAM_ID?.toString());
    let myFungibleAccount = await umi.rpc.getAccount(fungibleMintAddress);
    if (myFungibleAccount.exists) {
      fungibleTokenProgram = myFungibleAccount.owner;
    }

    const deploymentConfigPDA = umi.eddsa.findPda(
      publicKey(LIBREPLEX_FAIR_LAUNCH_PROGRAM_ID),
      [
        string({ size: "variable" }).serialize("deployment_config"),
        publicKeySerializer().serialize(escrow_address),
      ],
    );

    let swapToNonfungible22Builder: any;

    for (const id of idList) {
      const nonFungibleMintAddress = publicKey(id);

      let nonFungibleTokenProgram = publicKey(SPL_TOKEN_PROGRAM_ID?.toString());
      let myNonFungibleAccount = await umi.rpc.getAccount(
        nonFungibleMintAddress,
      );
      if (myNonFungibleAccount.exists) {
        nonFungibleTokenProgram = myNonFungibleAccount.owner;
      }

      const hashlistMarkerPDA = umi.eddsa.findPda(
        publicKey(LIBREPLEX_FAIR_LAUNCH_PROGRAM_ID),
        [
          string({ size: "variable" }).serialize("hashlist_marker"),
          publicKeySerializer().serialize(escrow_address),
          publicKeySerializer().serialize(nonFungibleMintAddress),
        ],
      );

      const fungibleSourceTokenAccount = findAssociatedTokenPda(umi, {
        mint: fungibleMintAddress,
        owner: publicKey(user.publicKey),
        tokenProgramId: fungibleTokenProgram,
      });

      const fungibleTargetTokenAccount = findAssociatedTokenPda(umi, {
        mint: fungibleMintAddress,
        owner: publicKey(escrow_address),
        tokenProgramId: fungibleTokenProgram,
      });

      const nonFungibleSourceTokenAccount = findAssociatedTokenPda(umi, {
        mint: nonFungibleMintAddress,
        owner: publicKey(escrow_address),
        tokenProgramId: nonFungibleTokenProgram,
      });

      const nonFungibleTargetTokenAccount = findAssociatedTokenPda(umi, {
        mint: nonFungibleMintAddress,
        owner: publicKey(user.publicKey),
        tokenProgramId: nonFungibleTokenProgram,
      });

      const swapToNonfungible22BuilderSingle = swapToNonfungible22(umi, {
        deployment: publicKey(escrow_address),
        deploymentConfig: deploymentConfigPDA,
        hashlistMarker: hashlistMarkerPDA,
        fungibleMint: fungibleMintAddress,
        fungibleSourceTokenAccount: fungibleSourceTokenAccount, // User FT ATA
        fungibleTargetTokenAccount: fungibleTargetTokenAccount, // Custodian FT ATA
        nonFungibleMint: nonFungibleMintAddress,
        nonFungibleSourceTokenAccount: nonFungibleSourceTokenAccount, // Custodian NFT ATA
        nonFungibleTargetTokenAccount: nonFungibleTargetTokenAccount, // User NFT ATA
      });

      if (!swapToNonfungible22Builder) {
        swapToNonfungible22Builder = swapToNonfungible22BuilderSingle;
      } else {
        swapToNonfungible22Builder = swapToNonfungible22Builder.add(
          swapToNonfungible22BuilderSingle,
        );
      }
    }

    if (swapToNonfungible22Builder) {
      const commitment = "confirmed";
      const blockhash = await umi.rpc.getLatestBlockhash({
        commitment,
      });
      let txSign = await swapToNonfungible22Builder.buildAndSign(umi);
      const { signatures, errors } = await sendTxsWithRetries({
        txs: [txSign],
        umi,
        concurrency: 1,
        retries: 3,
      });
      return signatures[0];
      // console.log(signatures, errors);
      // const signature = await umi.rpc.sendTransaction(txSign, {
      //   skipPreflight: true,
      //   preflightCommitment: commitment,
      //   maxRetries: 3,
      // });
      // // const sig = signatureToString(signature);
      // const confirmRes = await umi.rpc.confirmTransaction(signature, {
      //   commitment,
      //   strategy: {
      //     type: "blockhash",
      //     ...blockhash,
      //   },
      // });
      // if (confirmRes.value?.err) {
      //   throw new Error("Transaction failed");
      // }
      // console.log("confirmRes", confirmRes);
      // return confirmRes;
    } else {
      console.log("No transactions to send");
    }
  } catch (error) {
    console.log(error);
  }
};
export const getAssetsByOwner = async (umi: Umi, owner: PublicKey) => {
  return await umi.rpc.getAssetsByOwner({ owner });
};

export const searchAssets = async ({
  umi,
  owner,
  authority,
  collection,
}: {
  umi: Umi;
  owner?: PublicKey;
  authority?: PublicKey;
  collection?: string;
}) => {
  return await umi.rpc.searchAssets({
    owner,
    authority,
    // grouping: collection
    //   ? ["collection", collection?.toString() || ""]
    //   : undefined,
    limit: 200,
  });
};

export const fetchEscrowData = async (umi: Umi, escrow: Pda) => {
  return await fetchEscrowV1(umi, escrow);
};
export const runCaptureV1 = async (
  umi: Umi,
  escrow: Pda,
  assets: PublicKey | Pda,
  collection: PublicKey | Pda,
  tokenMintAddr: PublicKey | Pda,
  escrowData: EscrowV1,
) => {
  return await captureV1(umi, {
    owner: umi.identity,
    escrow: escrow,
    asset: assets,
    collection: collection,
    token: tokenMintAddr,
    feeProjectAccount: escrowData.feeLocation,
  }).sendAndConfirm(umi);
};
export const runReleaseV1 = async (
  umi: Umi,
  escrow: Pda,
  assets: PublicKey | Pda,
  collection: PublicKey | Pda,
  tokenMintAddr: PublicKey | Pda,
  escrowData: EscrowV1,
) => {
  return await releaseV1(umi, {
    owner: umi.identity,
    escrow: escrow,
    asset: assets,
    collection: collection,
    token: tokenMintAddr,
    feeProjectAccount: escrowData.feeLocation,
  }).sendAndConfirm(umi);
};

export interface SendTxsWithRetriesOptions {
  txs: Transaction[];
  umi: Umi;
  concurrency: number;
  retries?: number;
  commitment?: "finalized" | "confirmed";
  onProgress?: (signature: string) => void;
}

export async function sendTxsWithRetries({
  txs,
  umi,
  concurrency,
  onProgress,
  ...opts
}: SendTxsWithRetriesOptions) {
  const results: string[] = [];
  let retries = opts.retries || 3;
  let txsToSend = [...txs];
  const commitment = opts.commitment || "confirmed";

  do {
    const errors: Transaction[] = [];
    console.log("init tries left", retries);
    // eslint-disable-next-line no-await-in-loop
    await pMap(
      txsToSend,
      async (tx) => {
        try {
          const blockhash = await umi.rpc.getLatestBlockhash({
            commitment,
          });
          const res = await umi.rpc.sendTransaction(tx, {
            commitment,
          });
          const sig = signatureToString(res);
          console.log("signature", sig);

          const confirmRes = await umi.rpc.confirmTransaction(res, {
            commitment,
            strategy: {
              type: "blockhash",
              ...blockhash,
            },
          });
          if (confirmRes.value?.err) {
            throw new Error("Transaction failed");
          }

          onProgress?.(sig);
          results.push(sig);
        } catch (e) {
          console.log(e);
          errors.push(tx);
        }
      },
      {
        concurrency,
      },
    );
    txsToSend = errors;
    retries -= 1;
  } while (txsToSend.length && retries >= 0);

  return {
    signatures: results,
    errors: txsToSend,
  };
}
