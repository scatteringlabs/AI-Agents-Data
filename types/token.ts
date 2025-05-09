export interface TokenType {
  id: number;
  name: string;
}

export interface TokenInfo {
  name: string;
  symbol: string;
  chain_id: number;
  decimals: number;
  address: string;
  price: string;
  logo_url: string;
  has_logo: boolean;
  token_type: TokenType;
}

export interface TokenInfoResponse {
  data: {
    list: TokenInfo[];
    page: number;
    page_size: number;
    total_count: number;
  };
}

export interface QuoteResponse {
  routing: string;
  quote: Quote;
  requestId: string;
  allQuotes: AllQuote[];
}

interface Quote {
  methodParameters: MethodParameters;
  blockNumber: string;
  amount: string;
  amountDecimals: string;
  quote: string;
  quoteDecimals: string;
  quoteGasAdjusted: string;
  quoteGasAdjustedDecimals: string;
  quoteGasAndPortionAdjusted: string;
  quoteGasAndPortionAdjustedDecimals: string;
  gasUseEstimateQuote: string;
  gasUseEstimateQuoteDecimals: string;
  gasUseEstimate: string;
  gasUseEstimateUSD: string;
  simulationStatus: string;
  simulationError: boolean;
  gasPriceWei: string;
  route: Route[][];
  routeString: string;
  quoteId: string;
  hitsCachedRoutes: boolean;
  portionBips: number;
  portionRecipient: string;
  portionAmount: string;
  portionAmountDecimals: string;
  requestId: string;
  tradeType: string;
  portionBipsslippage: number;
  slippage: number;
}

interface MethodParameters {
  calldata: string;
  value: string;
  to: string;
}

interface Route {
  type: string;
  address: string;
  tokenIn: Token;
  tokenOut: Token;
  fee: string;
  liquidity: string;
  sqrtRatioX96: string;
  tickCurrent: string;
  amountIn: string;
  amountOut: string;
}

interface Token {
  chainId: number;
  decimals: string;
  address: string;
  symbol: string;
}

interface AllQuote {
  routing: string;
  quote: Quote;
}
