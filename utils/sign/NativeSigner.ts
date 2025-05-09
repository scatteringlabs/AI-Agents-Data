import { ALL_SUPPORTED_CHAINS } from "@/constants/chain";
import {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";
import { _TypedDataEncoder } from "@ethersproject/hash";
import { ChainId } from "@uniswap/sdk-core";
import {
  BigNumberish,
  Bytes,
  Signer,
  UnsignedTransaction,
  providers,
  utils,
} from "ethers";
import { hexlify } from "ethers/lib/utils";
import { Keyring } from "../Keyring/Keyring";
import { areAddressesEqual } from "../addresses";

export function toSupportedChainId(chainId?: BigNumberish): ChainId | null {
  if (!chainId || !ALL_SUPPORTED_CHAINS.includes(chainId.toString())) {
    return null;
  }
  return parseInt(chainId.toString(), 10) as ChainId;
}

/**
 * A signer that uses a native keyring to access keys
 * NOTE: provide Keyring.platform.ts at runtime.
 */

export class NativeSigner extends Signer {
  constructor(
    private readonly address: string,
    provider?: providers.Provider,
  ) {
    super();

    if (provider && !providers.Provider.isProvider(provider)) {
      throw new Error(`Invalid provider: ${provider}`);
    }

    utils.defineReadOnly(this, "provider", provider);
  }

  getAddress(): Promise<string> {
    return Promise.resolve(this.address);
  }

  signMessage(message: string | Bytes): Promise<string> {
    if (typeof message === "string") {
      return Keyring.signMessageForAddress(this.address, message);
    }

    // chainID isn't available here, but is not needed for signing hashes so just default to Mainnet
    return Keyring.signHashForAddress(
      this.address,
      hexlify(message).slice(2),
      ChainId.MAINNET,
    );
  }

  // reference: https://github.com/ethers-io/ethers.js/blob/ce8f1e4015c0f27bf178238770b1325136e3351a/packages/wallet/src.ts/index.ts#L135
  async _signTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, unknown>,
  ): Promise<string> {
    const signature = await Keyring.signHashForAddress(
      this.address,
      _TypedDataEncoder.hash(domain, types, value),
      toSupportedChainId(domain.chainId) || ChainId.MAINNET,
    );
    return signature;
  }

  async signTransaction(
    transaction: providers.TransactionRequest,
  ): Promise<string> {
    const tx = await utils.resolveProperties(transaction);

    if (tx.chainId === undefined) {
      throw new Error("Attempted to sign transaction with an undefined chain");
    }

    if (tx.from != null) {
      if (!areAddressesEqual(tx.from, this.address)) {
        throw new Error(`Signing address does not match the tx 'from' address`);
      }
      delete tx.from;
    }

    const ut = <UnsignedTransaction>tx;
    const hashedTx = utils.keccak256(utils.serializeTransaction(ut));
    const signature = await Keyring.signTransactionHashForAddress(
      this.address,
      hashedTx,
      tx.chainId || ChainId.MAINNET,
    );

    return utils.serializeTransaction(ut, signature);
  }

  connect(provider: providers.Provider): NativeSigner {
    return new NativeSigner(this.address, provider);
  }
}
