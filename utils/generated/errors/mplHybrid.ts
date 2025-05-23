/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Program, ProgramError } from "@metaplex-foundation/umi";

type ProgramErrorConstructor = new (
  program: Program,
  cause?: Error,
) => ProgramError;
const codeToErrorMap: Map<number, ProgramErrorConstructor> = new Map();
const nameToErrorMap: Map<string, ProgramErrorConstructor> = new Map();

/** InvalidCollection: Invalid Collection */
export class InvalidCollectionError extends ProgramError {
  override readonly name: string = "InvalidCollection";

  readonly code: number = 0x1770; // 6000

  constructor(program: Program, cause?: Error) {
    super("Invalid Collection", program, cause);
  }
}
codeToErrorMap.set(0x1770, InvalidCollectionError);
nameToErrorMap.set("InvalidCollection", InvalidCollectionError);

/** InvalidCollectionAuthority: Collection Authority does not match signer */
export class InvalidCollectionAuthorityError extends ProgramError {
  override readonly name: string = "InvalidCollectionAuthority";

  readonly code: number = 0x1771; // 6001

  constructor(program: Program, cause?: Error) {
    super("Collection Authority does not match signer", program, cause);
  }
}
codeToErrorMap.set(0x1771, InvalidCollectionAuthorityError);
nameToErrorMap.set(
  "InvalidCollectionAuthority",
  InvalidCollectionAuthorityError,
);

/** RandomnessError: Error in the randomness */
export class RandomnessErrorError extends ProgramError {
  override readonly name: string = "RandomnessError";

  readonly code: number = 0x1772; // 6002

  constructor(program: Program, cause?: Error) {
    super("Error in the randomness", program, cause);
  }
}
codeToErrorMap.set(0x1772, RandomnessErrorError);
nameToErrorMap.set("RandomnessError", RandomnessErrorError);

/** InvalidConstantFeeWallet: Invalid Fee Constant Wallet */
export class InvalidConstantFeeWalletError extends ProgramError {
  override readonly name: string = "InvalidConstantFeeWallet";

  readonly code: number = 0x1773; // 6003

  constructor(program: Program, cause?: Error) {
    super("Invalid Fee Constant Wallet", program, cause);
  }
}
codeToErrorMap.set(0x1773, InvalidConstantFeeWalletError);
nameToErrorMap.set("InvalidConstantFeeWallet", InvalidConstantFeeWalletError);

/** InvalidProjectFeeWallet: Invalid Project Fee Wallet */
export class InvalidProjectFeeWalletError extends ProgramError {
  override readonly name: string = "InvalidProjectFeeWallet";

  readonly code: number = 0x1774; // 6004

  constructor(program: Program, cause?: Error) {
    super("Invalid Project Fee Wallet", program, cause);
  }
}
codeToErrorMap.set(0x1774, InvalidProjectFeeWalletError);
nameToErrorMap.set("InvalidProjectFeeWallet", InvalidProjectFeeWalletError);

/** InvalidSlotHash: Invalid SlotHash Program Account */
export class InvalidSlotHashError extends ProgramError {
  override readonly name: string = "InvalidSlotHash";

  readonly code: number = 0x1775; // 6005

  constructor(program: Program, cause?: Error) {
    super("Invalid SlotHash Program Account", program, cause);
  }
}
codeToErrorMap.set(0x1775, InvalidSlotHashError);
nameToErrorMap.set("InvalidSlotHash", InvalidSlotHashError);

/** InvalidMplCore: Invalid MPL CORE Program Account */
export class InvalidMplCoreError extends ProgramError {
  override readonly name: string = "InvalidMplCore";

  readonly code: number = 0x1776; // 6006

  constructor(program: Program, cause?: Error) {
    super("Invalid MPL CORE Program Account", program, cause);
  }
}
codeToErrorMap.set(0x1776, InvalidMplCoreError);
nameToErrorMap.set("InvalidMplCore", InvalidMplCoreError);

/** InvalidCollectionAccount: Invalid Collection Account */
export class InvalidCollectionAccountError extends ProgramError {
  override readonly name: string = "InvalidCollectionAccount";

  readonly code: number = 0x1777; // 6007

  constructor(program: Program, cause?: Error) {
    super("Invalid Collection Account", program, cause);
  }
}
codeToErrorMap.set(0x1777, InvalidCollectionAccountError);
nameToErrorMap.set("InvalidCollectionAccount", InvalidCollectionAccountError);

/** InvalidAssetAccount: Invalid Asset Account */
export class InvalidAssetAccountError extends ProgramError {
  override readonly name: string = "InvalidAssetAccount";

  readonly code: number = 0x1778; // 6008

  constructor(program: Program, cause?: Error) {
    super("Invalid Asset Account", program, cause);
  }
}
codeToErrorMap.set(0x1778, InvalidAssetAccountError);
nameToErrorMap.set("InvalidAssetAccount", InvalidAssetAccountError);

/** MaxMustBeGreaterThanMin: Max must be greater than Min */
export class MaxMustBeGreaterThanMinError extends ProgramError {
  override readonly name: string = "MaxMustBeGreaterThanMin";

  readonly code: number = 0x1779; // 6009

  constructor(program: Program, cause?: Error) {
    super("Max must be greater than Min", program, cause);
  }
}
codeToErrorMap.set(0x1779, MaxMustBeGreaterThanMinError);
nameToErrorMap.set("MaxMustBeGreaterThanMin", MaxMustBeGreaterThanMinError);

/** InvalidMintAccount: Invalid Mint Account */
export class InvalidMintAccountError extends ProgramError {
  override readonly name: string = "InvalidMintAccount";

  readonly code: number = 0x177a; // 6010

  constructor(program: Program, cause?: Error) {
    super("Invalid Mint Account", program, cause);
  }
}
codeToErrorMap.set(0x177a, InvalidMintAccountError);
nameToErrorMap.set("InvalidMintAccount", InvalidMintAccountError);

/** NumericalOverflow: Numerical Overflow */
export class NumericalOverflowError extends ProgramError {
  override readonly name: string = "NumericalOverflow";

  readonly code: number = 0x177b; // 6011

  constructor(program: Program, cause?: Error) {
    super("Numerical Overflow", program, cause);
  }
}
codeToErrorMap.set(0x177b, NumericalOverflowError);
nameToErrorMap.set("NumericalOverflow", NumericalOverflowError);

/**
 * Attempts to resolve a custom program error from the provided error code.
 * @category Errors
 */
export function getMplHybridErrorFromCode(
  code: number,
  program: Program,
  cause?: Error,
): ProgramError | null {
  const constructor = codeToErrorMap.get(code);
  return constructor ? new constructor(program, cause) : null;
}

/**
 * Attempts to resolve a custom program error from the provided error name, i.e. 'Unauthorized'.
 * @category Errors
 */
export function getMplHybridErrorFromName(
  name: string,
  program: Program,
  cause?: Error,
): ProgramError | null {
  const constructor = nameToErrorMap.get(name);
  return constructor ? new constructor(program, cause) : null;
}
