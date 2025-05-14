import {
  Connection,
  Keypair,
  VersionedTransaction,
  PublicKey,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import fetch from "cross-fetch";
import { Wallet } from "@project-serum/anchor";
import bs58 from "bs58";
import axios, { AxiosError } from "axios";
import {
  getAssociatedTokenAddress,
  getAccount,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createTransferInstruction,
  NATIVE_MINT,
} from "@solana/spl-token";
import { JupQuoteResponse } from "@/services/useJupiterQuote";
import { toast } from "react-toastify";
// const connection = new Connection("https://api.testnet.solana.com");
const connection = new Connection(
  "https://solana-mainnet.g.alchemy.com/v2/KHbyoLjlGnvTVCfKp_sQ0JLPRArap0jl",
);

// It is recommended that you use your own RPC endpoint.
// This RPC endpoint is only for demonstration purposes so that this example will run.
// const connection = new Connection(
//   "https://neat-hidden-sanctuary.solana-mainnet.discover.quiknode.pro/2af5315d336f9ae920028bbb90a73b724dc1bbed/",
// );

// const wallet = new Wallet(
//   Keypair.fromSecretKey(bs58.decode(process.env.PRIVATE_KEY || "")),
// );

interface QuoteParams {
  inputMint: string;
  outputMint: string;
  amount: number;
  // slippage: number;
}

export enum ErrorCode {
  SDK_ERROR = "SdkError",
  INVALID_AMOUNT_ERROR = "InvalidAmountError",
  AMOUNT_NOT_ENOUGH_ERROR = "AmountNotEnoughError",
  INSUFFICIENT_POOL_LIQUIDITY_ERROR = "InsufficientPoolLiquidityError",
  JUPITER_ERROR = "JupiterError",
  INVALID_GAS_FEE_PAYMENT_OPTION_ERROR = "InvalidGasFeePaymentOptionError",
  INVALID_MESSENGER_OPTION_ERROR = "InvalidMessengerOptionError",
  METHOD_NOT_SUPPORTED_ERROR = "MethodNotSupportedError",
  VERIFY_TX_ERROR = "VerifyTxError",
  INVALID_TX_ERROR = "InvalidTxError",
  EXTRA_GAS_MAX_LIMIT_EXCEEDED_ERROR = "ExtraGasMaxLimitExceededError",
  ARGUMENT_INVALID_DECIMALS_ERROR = "ArgumentInvalidDecimalsError",
  TIMEOUT_ERROR = "TimeoutError",
  NODE_RPC_URL_NOT_INITIALIZED_ERROR = "NodeRpcUrlNotInitializedError",
  CCTP_DOES_NOT_SUPPORTED_ERROR = "CCTPDoesNotSupportedError",
  TX_TOO_LARGE = "TxTooLargeError",
}
export abstract class SdkRootError extends Error {
  public errorCode: ErrorCode;

  protected constructor(code: ErrorCode, message?: string) {
    super(message);
    this.errorCode = code;
  }
}

export class JupiterError extends SdkRootError {
  constructor(message?: string) {
    super(ErrorCode.JUPITER_ERROR, message);
  }
}

const JUPITER_API_URL = "https://quote-api.jup.ag/v6/quote";
export const fetchRoute = async ({
  inputMint,
  outputMint,
  amount,
  // slippage,
}: QuoteParams) => {
  // swapping SOL to USDC with input 0.1 SOL and 0.5% slippage
  try {
    const routes = await fetch(
      `${JUPITER_API_URL}?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&platformFeeBps=10&autoSlippage=true&autoSlippageCollisionUsdValue=1000&swapMode=ExactIn&onlyDirectRoutes=false&asLegacyTransaction=false&maxAccounts=64&experimentalDexes=Jupiter%20LO`,
    );
    const { data } = await routes.json();
  } catch (error) {
    console.log("error", error);
  }
};
const signAndSendTransaction = async (tx: VersionedTransaction) => {
  const { solana } = window as any;

  try {
    console.log("tx", tx);
    console.log("solana", solana);
    console.log("solana", solana?.isPhantom);

    if (solana && solana.isPhantom) {
      // Request Phantom wallet to sign transaction
      console.log("111");

      const signedTransaction = await solana.signTransaction(tx);
      console.log("222");

      // Send and confirm transaction
      const signature = await sendAndConfirmTransaction(
        connection,
        signedTransaction.serialize(),
        [],
      );
      console.log("333");
      console.log("Transaction successful with signature:", signature);
      return signature;
    } else {
      console.error("Phantom Wallet is not installed.");
    }
  } catch (error) {
    console.error("Transaction failed:", error);
    throw error;
  }
};
export const getBalance = async (publicKey: PublicKey) => {
  try {
    const balance = await connection.getBalance(publicKey);
    return balance / 1e9;
  } catch (error) {
    console.error("Error fetching balance:", error);
    throw error;
  }
};

const USDT_MINT_ADDRESS = new PublicKey(
  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
);

export const getTokenBalance = async (walletAddress: string) => {
  try {
    const walletPublicKey = new PublicKey(walletAddress);
    const tokenAddress = await getAssociatedTokenAddress(
      USDT_MINT_ADDRESS,
      walletPublicKey,
    );
    const tokenAccount = await getAccount(connection, tokenAddress);
    const balance = Number(tokenAccount.amount) / 1e6; // Convert lamports to USDC (assuming USDC has 6 decimals)
    return balance;
  } catch (error) {
    console.error("Error fetching token balance:", error);
    throw error;
  }
};

export const sendTransaction = async (
  fromAddress: string,
  toAddress: string,
  amount: number,
  privateKey: string,
) => {
  try {
    const fromPublicKey = new PublicKey(fromAddress);
    const toPublicKey = new PublicKey(toAddress);

    // Create associated token address for the recipient
    const toTokenAddress = await getAssociatedTokenAddress(
      toPublicKey,
      TOKEN_PROGRAM_ID,
      undefined,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    );

    // Create transfer instruction
    const transferInstruction = createTransferInstruction(
      fromPublicKey,
      toTokenAddress,
      toPublicKey,
      amount,
      [],
      TOKEN_PROGRAM_ID,
    );

    // Create and send transaction
    const transaction = new Transaction().add(transferInstruction);
    const signers = [
      {
        publicKey: fromPublicKey,
        secretKey: new Uint8Array(JSON.parse(privateKey)),
      },
    ];
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      signers,
    );

    return signature;
  } catch (error) {
    console.error("Error sending transaction:", error);
    throw error;
  }
};

export const getJupiterSwapTx = async (
  jupiterData: JupQuoteResponse,
  userAddress: string,
): Promise<{ transaction: VersionedTransaction }> => {
  let transactionResponse: any;
  try {
    const requestBody: {
      quoteResponse: JupQuoteResponse;
      userPublicKey: string;
      wrapAndUnwrapSol: boolean;
      feeAccount?: string;
    } = {
      quoteResponse: jupiterData,
      userPublicKey: userAddress,
      wrapAndUnwrapSol: false,
    };

    // 如果是使用 SOL 购买，添加手续费账户
    if (
      jupiterData.inputMint === "So11111111111111111111111111111111111111112"
    ) {
      requestBody.feeAccount = "BvfuZPcBVZvrt3JRUdz2dFjgC1R7rrd7YqBPodt2ysiJ";
    }

    transactionResponse = await axios.post(
      "https://quote-api.jup.ag/v6/swap",
      JSON.stringify(requestBody),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    console.log("transactionResponse", transactionResponse);
  } catch (err) {
    console.log("err", err);

    if (
      err instanceof AxiosError &&
      err.response &&
      err.response.data &&
      err.response.data.error
    ) {
      throw new JupiterError(err.response.data.error);
    }
    toast?.error("Cannot get swap transaction");
    throw new JupiterError("Cannot get swap transaction");
  }

  let swapTransaction;
  if (transactionResponse?.data?.swapTransaction) {
    swapTransaction = transactionResponse.data.swapTransaction;
  } else {
    throw new JupiterError("Cannot get swap transaction");
  }
  console.log("swapTransaction", swapTransaction);

  const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
  // @ts-ignore
  return { transaction: VersionedTransaction.deserialize(swapTransactionBuf) };
};

interface JupiterSwapParams {
  userAddress: string;
  stableTokenAddress: string;
  amount: string;
}
// export const jupiterSwap = async ({
//   userAddress,
//   stableTokenAddress,
//   amount,
// }: JupiterSwapParams) => {
//   try {
//     const { tx } = await getJupiterSwapTx(
//       userAddress,
//       stableTokenAddress,
//       amount,
//     );
//     const signature = await signAndSendTransaction(tx);
//     console.log("Transaction signature:", signature);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// };
// const sendRawTransaction = async (
//   transaction: Transaction,
//   privateKey: string,
// ) => {
//   const keypair = solanaWeb3.Keypair.fromSecretKey(bs58.decode(privateKey));
//   return await sendAndConfirmTransaction(connection, transaction, [keypair]);
// };
