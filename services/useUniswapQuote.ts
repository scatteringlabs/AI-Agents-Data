import { ZeroAddressSymbol } from "@/constants/chain";
import { QuoteResponse } from "@/types/token";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ChainId, Currency, Percent, TradeType } from "@uniswap/sdk-core";
import {
  FlatFeeOptions,
  SwapOptions as UniversalRouterSwapOptions,
  SwapRouter as UniversalSwapRouter,
} from "@uniswap/universal-router-sdk";
import { Fee } from "@uniswap/universal-router-sdk/dist/entities/protocols/element-market";
import { FeeOptions } from "@uniswap/v3-sdk";
import { zeroAddress } from "viem";

interface UniswapQuoteRequest {
  tokenInChainId: number;
  tokenIn: string;
  tokenOutChainId: number;
  tokenOut: string;
  amount: string;
  sendPortionEnabled: boolean;
  type: string;
  intent: string;
  configs: Array<{
    protocols: string[];
    enableUniversalRouter: boolean;
    routingType: string;
    recipient: string;
    enableFeeOnTransferFeeFetching: boolean;
  }>;
}

interface UniswapQuoteRequets {
  recipient: string;
  tokenIn: string;
  tokenOut: string;
  amount: string;
  chainId: number;
  permit2Params?: any;
  type: number;
}
// export interface TradeQuoteRequest {
//   amount: string
//   deadline?: number
//   enableUniversalRouter: boolean
//   fetchSimulatedGasLimit?: boolean
//   recipient?: string
//   slippageTolerance?: number
//   tokenInAddress: string
//   tokenInChainId: ChainId
//   tokenOutAddress: string
//   tokenOutChainId: ChainId
//   type: 'exactIn' | 'exactOut'
//   permitSignatureInfo?: PermitSignatureInfo | null
//   loggingProperties: {
//     isUSDQuote?: boolean
//   }
//   sendPortionEnabled?: boolean
// }

export const fetchUniswapQuote = async ({
  recipient,
  tokenIn,
  tokenOut,
  amount,
  chainId,
  permit2Params,
  type,
}: UniswapQuoteRequets): Promise<QuoteResponse> => {
  const body: UniswapQuoteRequest = {
    tokenInChainId: chainId,
    tokenIn: tokenIn === zeroAddress ? ZeroAddressSymbol?.[chainId] : tokenIn,
    tokenOutChainId: chainId,
    tokenOut:
      tokenOut === zeroAddress ? ZeroAddressSymbol?.[chainId] : tokenOut,
    amount,
    sendPortionEnabled: true,
    type: type === TradeType.EXACT_INPUT ? "EXACT_INPUT" : "EXACT_OUTPUT",
    intent: "quote",
    configs: [
      {
        protocols: ["V2", "V3", "MIXED"],
        enableUniversalRouter: true,
        routingType: "CLASSIC",
        recipient,
        enableFeeOnTransferFeeFetching: true,
        ...permit2Params,
      },
    ],
  };

  const response = await fetch("https://mp.scattering.io/quote", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorRes: any = await response.json();

    throw new Error(errorRes?.detail);
  }

  return response.json() as Promise<QuoteResponse>;
};

export const useUniswapQuote = ({
  recipient,
  tokenIn,
  tokenOut,
  amount,
  chainId,
  type,
}: UniswapQuoteRequets): UseQueryResult<QuoteResponse, Error> => {
  return useQuery<QuoteResponse, Error>({
    queryKey: [
      "uniswapQuote",
      { tokenIn, tokenOut, amount, recipient, chainId, type },
    ],
    queryFn: () =>
      fetchUniswapQuote({
        recipient,
        tokenIn,
        tokenOut,
        amount,
        chainId,
        type,
      }),
    enabled: Boolean(tokenIn && tokenOut && chainId && Number(amount) > 0),
    retry: 0,
  });
};

export const slippageToleranceToPercent = (slippage: number): Percent => {
  const basisPoints = Math.round(slippage * 100);
  return new Percent(basisPoints, 10_000);
};

interface MethodParameterArgs {
  permit2Signature?: any;
  trade: any;
  address: string;
  feeOptions?: FeeOptions;
  flatFeeOptions?: FlatFeeOptions;
}

// https://github.com/Uniswap/wallet/blob/ed1285d64996d7fe3ce3c2b5cd3b31f447d7249b/apps/mobile/src/features/transactions/swap/hooks.ts#L542

export const getSwapMethodParameters = ({
  permit2Signature,
  trade,
  address,
  feeOptions,
  flatFeeOptions,
}: MethodParameterArgs): { calldata: string; value: string } => {
  const slippageTolerancePercent = slippageToleranceToPercent(1);
  const baseOptions = {
    slippageTolerance: slippageTolerancePercent,
    recipient: address,
    fee: feeOptions,
    flatFee: flatFeeOptions,
  };

  const universalRouterSwapOptions: UniversalRouterSwapOptions =
    permit2Signature
      ? {
          ...baseOptions,
          inputTokenPermit: {
            signature: permit2Signature.signature,
            ...permit2Signature.permitMessage,
          },
        }
      : baseOptions;
  return UniversalSwapRouter.swapERC20CallParameters(
    trade,
    universalRouterSwapOptions,
  );
};
export const MAX_AUTO_SLIPPAGE_TOLERANCE = 5.5;

export function getFees(trade: any): any | undefined {
  if (!trade?.swapFee?.recipient) return undefined;

  if (trade.tradeType === TradeType.EXACT_INPUT) {
    return {
      feeOptions: {
        fee: trade.swapFee.percent,
        recipient: trade.swapFee.recipient,
      },
    };
  }

  return {
    flatFeeOptions: {
      amount: trade.swapFee.amount,
      recipient: trade.swapFee.recipient,
    },
  };
}
