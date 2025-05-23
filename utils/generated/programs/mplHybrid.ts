/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  ClusterFilter,
  Context,
  Program,
  PublicKey,
} from "@metaplex-foundation/umi";
import {
  getMplHybridErrorFromCode,
  getMplHybridErrorFromName,
} from "../errors";

// export const MPL_HYBRID_PROGRAM_ID =
//   "9go86qdDhRjgqUc5hFxVDmiMdtPkkogAqi4nWytzaJA1" as PublicKey<"9go86qdDhRjgqUc5hFxVDmiMdtPkkogAqi4nWytzaJA1">;
export const MPL_HYBRID_PROGRAM_ID =
  "MPL4o4wMzndgh8T1NVDxELQCj5UQfYTYEkabX3wNKtb" as PublicKey<"MPL4o4wMzndgh8T1NVDxELQCj5UQfYTYEkabX3wNKtb">;

export function createMplHybridProgram(): Program {
  return {
    name: "mplHybrid",
    publicKey: MPL_HYBRID_PROGRAM_ID,
    getErrorFromCode(code: number, cause?: Error) {
      return getMplHybridErrorFromCode(code, this, cause);
    },
    getErrorFromName(name: string, cause?: Error) {
      return getMplHybridErrorFromName(name, this, cause);
    },
    isOnCluster() {
      return true;
    },
  };
}

export function getMplHybridProgram<T extends Program = Program>(
  context: Pick<Context, "programs">,
  clusterFilter?: ClusterFilter,
): T {
  return context.programs.get<T>("mplHybrid", clusterFilter);
}

export function getMplHybridProgramId(
  context: Pick<Context, "programs">,
  clusterFilter?: ClusterFilter,
): PublicKey {
  return context.programs.getPublicKey(
    "mplHybrid",
    MPL_HYBRID_PROGRAM_ID,
    clusterFilter,
  );
}
