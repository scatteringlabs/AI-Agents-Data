import {
  AllowanceProvider,
  AllowanceTransfer,
  MaxUint160,
  PERMIT2_ADDRESS,
  PermitSingle,
} from "@uniswap/permit2-sdk";
import { ChainId, Currency, CurrencyAmount, Token } from "@uniswap/sdk-core";
import { UNIVERSAL_ROUTER_ADDRESS } from "@uniswap/universal-router-sdk";
import { addMonths, getUnixTime, addMinutes } from "date-fns";
import { BigNumber, TypedDataField, ethers, providers } from "ethers";
import { useCallback } from "react";
import { useAsyncData } from "../react/useAsyncData";
import { Address } from "viem";
import { useAccount } from "wagmi";
import { signTypedData } from "@/utils/sign/signing";

type Maybe<T> = T | null | undefined;
export enum AccountType {
  SignerMnemonic = "signerMnemonic", // Key lives in native keystore
  Readonly = "readonly", // Accounts without keys (e.g. so user can track balances)
}
export enum BackupType {
  Manual = "manual",
  Cloud = "cloud",
}

export type AccountCustomizations = {
  localPfp?: string;
};

export interface AccountBase {
  type: AccountType;
  address: Address;
  name?: string;
  customizations?: AccountCustomizations;
  backups?: BackupType[];
  pending?: boolean;
  timeImportedMs: number;
  pushNotificationsEnabled?: boolean;
}

export interface SignerMnemonicAccount extends AccountBase {
  type: AccountType.SignerMnemonic;
  derivationIndex: number;
  mnemonicId: string;
}

export interface ReadOnlyAccount extends AccountBase {
  type: AccountType.Readonly;
}

export type Account = SignerMnemonicAccount | ReadOnlyAccount;

export type Permit = {
  domain?: Record<string, any>;
  values?: Record<string, any>;
  types?: Record<string, any>;
};

export function currentTimeInSeconds(): number {
  return getUnixTime(new Date()); // 当前时间的UNIX时间戳（秒）
}

export function inXMinutesUnix(x: number): number {
  return getUnixTime(addMinutes(new Date(), x)); // X分钟后的时间的UNIX时间戳（秒）
}
const PERMIT2_SIG_VALIDITY_TIME = 30; // minutes
export function getPermitStruct(
  tokenAddress: string,
  nonce: number,
  universalRouterAddress: string,
): PermitSingle {
  return {
    details: {
      token: tokenAddress,
      amount: MaxUint160,
      // expiration specifies when the allowance will need to be re-set
      expiration: getUnixTime(addMonths(new Date(), 1)),
      nonce,
    },
    spender: universalRouterAddress,
    // the time at which the permit signature is invalid
    // can be quite short as we assume this will be submitted right away
    // traditional permit has this as well
    sigDeadline: inXMinutesUnix(PERMIT2_SIG_VALIDITY_TIME),
  };
}

export type PermitSignatureInfo = {
  signature: string;
  permitMessage: PermitSingle;
  nonce: number;
  expiry: number;
};

async function getPermit2PermitSignature(
  // provider: providers.JsonRpcProvider,
  // signerManager: SignerManager,
  account: any,
  tokenAddress: string,
  chainId: ChainId,
  tokenInAmount: string,
): Promise<PermitSignatureInfo | undefined> {
  try {
    if (account.type === AccountType.Readonly) {
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();
    const user = account.address;
    const allowanceProvider = new AllowanceProvider(provider, PERMIT2_ADDRESS);
    const universalRouterAddress = UNIVERSAL_ROUTER_ADDRESS(chainId);
    const {
      amount: permitAmount,
      expiration,
      nonce,
    } = await allowanceProvider.getAllowanceData(
      tokenAddress,
      user,
      universalRouterAddress,
    );

    if (
      !permitAmount.lt(tokenInAmount) &&
      expiration > currentTimeInSeconds()
    ) {
      return;
    }

    const permitMessage = getPermitStruct(
      tokenAddress,
      nonce,
      universalRouterAddress,
    );
    const { domain, types, values } = AllowanceTransfer.getPermitData(
      permitMessage,
      PERMIT2_ADDRESS,
      chainId,
    );
    const signature = await signer._signTypedData(domain, types, { ...values });
    return {
      signature,
      permitMessage,
      nonce,
      expiry: BigNumber.from(permitMessage.sigDeadline).toNumber(),
    };
  } catch (error) {
    return;
  }
}

export function usePermit2Signature(
  currencyInAmount: Maybe<CurrencyAmount<Currency>>,
  skip?: boolean,
): {
  isLoading: boolean;
  data: PermitSignatureInfo | undefined;
} {
  const account = useAccount();
  const currencyIn = currencyInAmount?.currency;

  const permitSignatureFetcher = useCallback(() => {
    if (!currencyIn || currencyIn.isNative || skip) {
      return;
    }

    return getPermit2PermitSignature(
      account,
      currencyIn.address,
      currencyIn.chainId,
      currencyInAmount.quotient.toString(),
    );
  }, [account, currencyIn, currencyInAmount?.quotient, skip]);

  return useAsyncData(permitSignatureFetcher);
}
// Used to sign permit messages where we already have the domain, types, and values.
// export function usePermit2SignatureWithData(
//   currencyInAmount: Maybe<CurrencyAmount<Currency>>,
//   permitData: Maybe<Permit>,
//   skip?: boolean,
// ): {
//   isLoading: boolean;
//   signature: string | undefined;
// } {
//   // const signerManager = useWalletSigners();
//   const account = useAccount();
//   const currencyIn = currencyInAmount?.currency;
//   // const provider = useProvider(currencyIn?.chainId ?? ChainId.MAINNET);

//   const { domain, types, values } = permitData || {};

//   const permitSignatureFetcher = useCallback(async () => {
//     if (
//       !currencyIn ||
//       currencyIn.isNative ||
//       skip ||
//       !domain ||
//       !types ||
//       !values
//     ) {
//       return;
//     }
//     const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
//     return { isLoading: false, signature: "" };
//     const signerManager = provider.getSigner();
//     // return await signTypedData(
//     //   domain,
//     //   types as Record<string, TypedDataField[]>,
//     //   values as Record<string, unknown>,
//     //   account,
//     //   // signerManager,
//     // );
//   }, [account, currencyIn, domain, skip, types, values]);

//   const { data, isLoading } = useAsyncData(permitSignatureFetcher);

//   return {
//     isLoading,
//     signature: data,
//   };
// }
