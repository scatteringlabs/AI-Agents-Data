import { Signer } from "ethers";

import { NativeSigner } from "./NativeSigner";
import { Address } from "viem";
import { AccountType } from "@/hooks/data/usePermit2Signature";
import { Keyring } from "../Keyring/Keyring";

/** Manages initialized ethers.Signers across the app */
export class SignerManager {
  private readonly signers: Record<Address, Signer> = {};

  async getSignerForAccount(account: any): Promise<Signer> {
    const signer = this.signers[account.address];
    if (signer) {
      return signer;
    }

    if (account.type === AccountType.SignerMnemonic) {
      const addresses = await Keyring.getAddressesForStoredPrivateKeys();
      if (!addresses.includes(account.address)) {
        throw new Error("No private key found for address");
      }
      const newSigner = new NativeSigner(account.address);
      this.signers[account.address] = newSigner;
      return newSigner;
    }

    throw new Error("No signer found for account");
  }
}
