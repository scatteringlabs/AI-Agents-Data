import {
  ClassicQuoteData,
  ClassicTrade,
  GetQuoteArgs,
  PoolType,
  QuoteMethod,
  QuoteResult,
  QuoteState,
  RouterPreference,
  SwapRouterNativeAssets,
  TradeResult,
  V2PoolInRoute,
  V3PoolInRoute,
} from "@/types/swap/routing";
import {
  Trade as V3Trade,
  Route as V3RouteRaw,
  Pool,
  FeeAmount,
} from "@uniswap/v3-sdk";
import { Trade as V2Trade, Route as V2RouteRaw, Pair } from "@uniswap/v2-sdk";
import {
  MixedRouteSDK,
  MixedRouteTrade,
  Protocol,
  Trade,
} from "@uniswap/router-sdk";
import {
  AlphaRouter,
  AlphaRouterConfig,
  CurrencyAmount as SORCurrencyAmount,
  LowerCaseStringArray,
  MixedRouteWithValidQuote,
  RouteWithValidQuote,
  V2Route,
  V2RouteWithValidQuote,
  V3Route,
  V3RouteWithValidQuote,
  nativeOnChain,
} from "@uniswap/smart-order-router";
import {
  Currency,
  CurrencyAmount,
  Token,
  TradeType,
  ChainId,
} from "@uniswap/sdk-core";
import _ from "lodash";
import { ethers } from "ethers";
export const DEFAULT_ROUTING_CONFIG_BY_CHAIN = (
  chainId: ChainId,
): AlphaRouterConfig => {
  switch (chainId) {
    // Optimism
    case ChainId.OPTIMISM:
    case ChainId.OPTIMISM_GOERLI:
    case ChainId.OPTIMISM_SEPOLIA:
    case ChainId.BASE:
    case ChainId.BASE_GOERLI:
    case ChainId.BLAST:
      return {
        v2PoolSelection: {
          topN: 3,
          topNDirectSwaps: 1,
          topNTokenInOut: 5,
          topNSecondHop: 2,
          topNWithEachBaseToken: 2,
          topNWithBaseToken: 6,
        },
        v3PoolSelection: {
          topN: 2,
          topNDirectSwaps: 2,
          topNTokenInOut: 2,
          topNSecondHop: 1,
          topNWithEachBaseToken: 3,
          topNWithBaseToken: 3,
        },
        maxSwapsPerPath: 3,
        minSplits: 1,
        maxSplits: 7,
        distributionPercent: 10,
        forceCrossProtocol: false,
      };
    // Arbitrum calls have lower gas limits and tend to timeout more, which causes us to reduce the multicall
    // batch size and send more multicalls per quote. To reduce the amount of requests each quote sends, we
    // have to adjust the routing config so we explore fewer routes.
    case ChainId.ARBITRUM_ONE:
    case ChainId.ARBITRUM_GOERLI:
    case ChainId.ARBITRUM_SEPOLIA:
    case ChainId.CELO:
    case ChainId.CELO_ALFAJORES:
      return {
        v2PoolSelection: {
          topN: 3,
          topNDirectSwaps: 1,
          topNTokenInOut: 5,
          topNSecondHop: 2,
          topNWithEachBaseToken: 2,
          topNWithBaseToken: 6,
        },
        v3PoolSelection: {
          topN: 2,
          topNDirectSwaps: 2,
          topNTokenInOut: 2,
          topNSecondHop: 1,
          topNWithEachBaseToken: 3,
          topNWithBaseToken: 2,
        },
        maxSwapsPerPath: 2,
        minSplits: 1,
        maxSplits: 7,
        distributionPercent: 25,
        forceCrossProtocol: false,
      };
    default:
      return {
        v2PoolSelection: {
          topN: 3,
          topNDirectSwaps: 1,
          topNTokenInOut: 5,
          topNSecondHop: 2,
          tokensToAvoidOnSecondHops: new LowerCaseStringArray(
            "0xd46ba6d942050d489dbd938a2c909a5d5039a161", // AMPL on Mainnet
          ),
          topNWithEachBaseToken: 2,
          topNWithBaseToken: 6,
        },
        v3PoolSelection: {
          topN: 2,
          topNDirectSwaps: 2,
          topNTokenInOut: 3,
          topNSecondHop: 1,
          topNWithEachBaseToken: 3,
          topNWithBaseToken: 5,
        },
        maxSwapsPerPath: 3,
        minSplits: 1,
        maxSplits: 7,
        distributionPercent: 5,
        forceCrossProtocol: false,
      };
  }
};
function parseToken({ address, chainId, decimals, symbol }: any): Token {
  return new Token(chainId, address, parseInt(decimals.toString()), symbol);
}

function parsePool({
  fee,
  sqrtRatioX96,
  liquidity,
  tickCurrent,
  tokenIn,
  tokenOut,
}: V3PoolInRoute): Pool {
  return new Pool(
    parseToken(tokenIn),
    parseToken(tokenOut),
    parseInt(fee) as FeeAmount,
    sqrtRatioX96,
    liquidity,
    parseInt(tickCurrent),
  );
}

const parsePair = ({ reserve0, reserve1 }: V2PoolInRoute): Pair =>
  new Pair(
    CurrencyAmount.fromRawAmount(parseToken(reserve0.token), reserve0.quotient),
    CurrencyAmount.fromRawAmount(parseToken(reserve1.token), reserve1.quotient),
  );

// TODO(WEB-2050): Convert other instances of tradeType comparison to use this utility function
export function isExactInput(tradeType: TradeType): boolean {
  return tradeType === TradeType.EXACT_INPUT;
}
function isVersionedRoute<T extends V2PoolInRoute | V3PoolInRoute>(
  type: T["type"],
  route: (V3PoolInRoute | V2PoolInRoute)[],
): route is T[] {
  return route.every((pool) => pool.type === type);
}
// function buildTrade(trades: any) {
//   return new RouterTrade({
//     v2Routes: trades
//       .filter((trade: any) => trade instanceof V2Trade)
//       .map((trade: any) => ({
//         routev2: trade.route,
//         inputAmount: trade.inputAmount,
//         outputAmount: trade.outputAmount,
//       })),
//     v3Routes: trades
//       .filter((trade: any) => trade instanceof V3Trade)
//       .map((trade: any) => ({
//         routev3: trade.route,
//         inputAmount: trade.inputAmount,
//         outputAmount: trade.outputAmount,
//       })),
//     mixedRoutes: trades
//       .filter((trade: any) => trade instanceof MixedRouteTrade)
//       .map((trade: any) => ({
//         mixedRoute: trade.route,
//         inputAmount: trade.inputAmount,
//         outputAmount: trade.outputAmount,
//       })),
//     tradeType: trades[0].tradeType,
//   });
// }
export function buildTrade<TTradeType extends TradeType>(
  tokenInCurrency: Currency,
  tokenOutCurrency: Currency,
  tradeType: TTradeType,
  routeAmounts: RouteWithValidQuote[],
): Trade<Currency, Currency, TTradeType> {
  /// Removed partition because of new mixedRoutes
  const v3RouteAmounts = _.filter(
    routeAmounts,
    (routeAmount) => routeAmount.protocol === Protocol.V3,
  );
  const v2RouteAmounts = _.filter(
    routeAmounts,
    (routeAmount) => routeAmount.protocol === Protocol.V2,
  );
  const mixedRouteAmounts = _.filter(
    routeAmounts,
    (routeAmount) => routeAmount.protocol === Protocol.MIXED,
  );

  const v3Routes = _.map<
    V3RouteWithValidQuote,
    {
      routev3: V3RouteRaw<Currency, Currency>;
      inputAmount: SORCurrencyAmount;
      outputAmount: SORCurrencyAmount;
    }
  >(
    v3RouteAmounts as V3RouteWithValidQuote[],
    (routeAmount: V3RouteWithValidQuote) => {
      const { route, amount, quote } = routeAmount;

      // The route, amount and quote are all in terms of wrapped tokens.
      // When constructing the Trade object the inputAmount/outputAmount must
      // use native currencies if specified by the user. This is so that the Trade knows to wrap/unwrap.
      if (tradeType == TradeType.EXACT_INPUT) {
        const amountCurrency = CurrencyAmount.fromFractionalAmount(
          tokenInCurrency,
          amount.numerator,
          amount.denominator,
        );
        const quoteCurrency = CurrencyAmount.fromFractionalAmount(
          tokenOutCurrency,
          quote.numerator,
          quote.denominator,
        );

        const routeRaw = new V3RouteRaw(
          route.pools,
          amountCurrency.currency,
          quoteCurrency.currency,
        );

        return {
          routev3: routeRaw,
          inputAmount: amountCurrency,
          outputAmount: quoteCurrency,
        };
      } else {
        const quoteCurrency = CurrencyAmount.fromFractionalAmount(
          tokenInCurrency,
          quote.numerator,
          quote.denominator,
        );

        const amountCurrency = CurrencyAmount.fromFractionalAmount(
          tokenOutCurrency,
          amount.numerator,
          amount.denominator,
        );

        const routeCurrency = new V3RouteRaw(
          route.pools,
          quoteCurrency.currency,
          amountCurrency.currency,
        );

        return {
          routev3: routeCurrency,
          inputAmount: quoteCurrency,
          outputAmount: amountCurrency,
        };
      }
    },
  );

  const v2Routes = _.map<
    V2RouteWithValidQuote,
    {
      routev2: V2RouteRaw<Currency, Currency>;
      inputAmount: SORCurrencyAmount;
      outputAmount: SORCurrencyAmount;
    }
  >(
    v2RouteAmounts as V2RouteWithValidQuote[],
    (routeAmount: V2RouteWithValidQuote) => {
      const { route, amount, quote } = routeAmount;

      // The route, amount and quote are all in terms of wrapped tokens.
      // When constructing the Trade object the inputAmount/outputAmount must
      // use native currencies if specified by the user. This is so that the Trade knows to wrap/unwrap.
      if (tradeType == TradeType.EXACT_INPUT) {
        const amountCurrency = CurrencyAmount.fromFractionalAmount(
          tokenInCurrency,
          amount.numerator,
          amount.denominator,
        );
        const quoteCurrency = CurrencyAmount.fromFractionalAmount(
          tokenOutCurrency,
          quote.numerator,
          quote.denominator,
        );

        const routeV2SDK = new V2RouteRaw(
          route.pairs,
          amountCurrency.currency,
          quoteCurrency.currency,
        );

        return {
          routev2: routeV2SDK,
          inputAmount: amountCurrency,
          outputAmount: quoteCurrency,
        };
      } else {
        const quoteCurrency = CurrencyAmount.fromFractionalAmount(
          tokenInCurrency,
          quote.numerator,
          quote.denominator,
        );

        const amountCurrency = CurrencyAmount.fromFractionalAmount(
          tokenOutCurrency,
          amount.numerator,
          amount.denominator,
        );

        const routeV2SDK = new V2RouteRaw(
          route.pairs,
          quoteCurrency.currency,
          amountCurrency.currency,
        );

        return {
          routev2: routeV2SDK,
          inputAmount: quoteCurrency,
          outputAmount: amountCurrency,
        };
      }
    },
  );

  const mixedRoutes = _.map<
    MixedRouteWithValidQuote,
    {
      mixedRoute: MixedRouteSDK<Currency, Currency>;
      inputAmount: SORCurrencyAmount;
      outputAmount: SORCurrencyAmount;
    }
  >(
    mixedRouteAmounts as MixedRouteWithValidQuote[],
    (routeAmount: MixedRouteWithValidQuote) => {
      const { route, amount, quote } = routeAmount;

      if (tradeType != TradeType.EXACT_INPUT) {
        throw new Error(
          "Mixed routes are only supported for exact input trades",
        );
      }

      // The route, amount and quote are all in terms of wrapped tokens.
      // When constructing the Trade object the inputAmount/outputAmount must
      // use native currencies if specified by the user. This is so that the Trade knows to wrap/unwrap.
      const amountCurrency = CurrencyAmount.fromFractionalAmount(
        tokenInCurrency,
        amount.numerator,
        amount.denominator,
      );
      const quoteCurrency = CurrencyAmount.fromFractionalAmount(
        tokenOutCurrency,
        quote.numerator,
        quote.denominator,
      );

      const routeRaw = new MixedRouteSDK(
        route.pools,
        amountCurrency.currency,
        quoteCurrency.currency,
      );

      return {
        mixedRoute: routeRaw,
        inputAmount: amountCurrency,
        outputAmount: quoteCurrency,
      };
    },
  );

  const trade = new Trade({ v2Routes, v3Routes, mixedRoutes, tradeType });

  return trade;
}
export function transformRoutesToTrade(args: any, data: any): TradeResult {
  const { tokenInAddress, tokenOutAddress, tradeType } = args;
  const tokenInIsNative = Object.values(SwapRouterNativeAssets).includes(
    tokenInAddress as SwapRouterNativeAssets,
  );
  const tokenOutIsNative = Object.values(SwapRouterNativeAssets).includes(
    tokenOutAddress as SwapRouterNativeAssets,
  );
  const { gasUseEstimateUSD, blockNumber } = data?.quote;

  const routes = computeRoutes(
    tokenInIsNative,
    tokenOutIsNative,
    data?.quote?.route,
  );

  const trade = new ClassicTrade({
    v2Routes:
      routes
        ?.filter(
          (
            r: any,
          ): r is (typeof routes)[0] & {
            routev2: NonNullable<(typeof routes)[0]["routev2"]>;
          } => r.routev2 !== null,
        )
        .map(({ routev2, inputAmount, outputAmount }: any) => ({
          routev2,
          inputAmount,
          outputAmount,
        })) ?? [],
    v3Routes:
      routes
        ?.filter(
          (
            r: any,
          ): r is (typeof routes)[0] & {
            routev3: NonNullable<(typeof routes)[0]["routev3"]>;
          } => r.routev3 !== null,
        )
        .map(({ routev3, inputAmount, outputAmount }: any) => ({
          routev3,
          inputAmount,
          outputAmount,
        })) ?? [],
    mixedRoutes:
      routes
        ?.filter(
          (
            r: any,
          ): r is (typeof routes)[0] & {
            mixedRoute: NonNullable<(typeof routes)[0]["mixedRoute"]>;
          } => r.mixedRoute !== null,
        )
        .map(({ mixedRoute, inputAmount, outputAmount }: any) => ({
          mixedRoute,
          inputAmount,
          outputAmount,
        })) ?? [],
    tradeType,
    // @ts-ignore
    gasUseEstimateUSD: parseFloat(gasUseEstimateUSD).toFixed(2).toString(),
    blockNumber,
  });

  return { state: QuoteState.SUCCESS, trade };
}
const parsePoolOrPair = (pool: V3PoolInRoute | V2PoolInRoute): Pool | Pair => {
  return pool.type === PoolType.V3Pool ? parsePool(pool) : parsePair(pool);
};
export function computeRoutes(
  tokenInIsNative: boolean,
  tokenOutIsNative: boolean,
  routes: any,
):
  | {
      routev3: V3RouteRaw<Currency, Currency> | null;
      routev2: V2RouteRaw<Currency, Currency> | null;
      mixedRoute: MixedRouteSDK<Currency, Currency> | null;
      inputAmount: CurrencyAmount<Currency>;
      outputAmount: CurrencyAmount<Currency>;
    }[]
  | undefined {
  if (!routes?.length) return [];

  const tokenIn = routes[0]?.[0]?.tokenIn;
  const tokenOut = routes[0]?.[routes[0]?.length - 1]?.tokenOut;
  if (!tokenIn || !tokenOut)
    throw new Error("Expected both tokenIn and tokenOut to be present");

  const parsedCurrencyIn = tokenInIsNative
    ? nativeOnChain(tokenIn.chainId)
    : parseToken(tokenIn);
  const parsedCurrencyOut = tokenOutIsNative
    ? nativeOnChain(tokenOut.chainId)
    : parseToken(tokenOut);

  try {
    return routes.map((route: any) => {
      if (!route?.length) {
        throw new Error("Expected route to have at least one pair or pool");
      }
      const rawAmountIn = route[0].amountIn;
      const rawAmountOut = route[route.length - 1].amountOut;

      if (!rawAmountIn || !rawAmountOut) {
        throw new Error("Expected both amountIn and amountOut to be present");
      }

      const isOnlyV2 = isVersionedRoute<V2PoolInRoute>(PoolType.V2Pool, route);
      const isOnlyV3 = isVersionedRoute<V3PoolInRoute>(PoolType.V3Pool, route);

      return {
        routev3: isOnlyV3
          ? new V3Route(
              route.map(parsePool),
              // @ts-ignore
              parsedCurrencyIn,
              parsedCurrencyOut,
            )
          : null,
        routev2: isOnlyV2
          ? new V2Route(
              route.map(parsePair),
              // @ts-ignore
              parsedCurrencyIn,
              parsedCurrencyOut,
            )
          : null,
        mixedRoute:
          !isOnlyV3 && !isOnlyV2
            ? new MixedRouteSDK(
                route.map(parsePoolOrPair),
                parsedCurrencyIn,
                parsedCurrencyOut,
              )
            : null,
        inputAmount: CurrencyAmount.fromRawAmount(
          parsedCurrencyIn,
          rawAmountIn,
        ),
        outputAmount: CurrencyAmount.fromRawAmount(
          parsedCurrencyOut,
          rawAmountOut,
        ),
      };
    });
  } catch (e) {
    console.error("Error computing routes", e);
    return;
  }
}
