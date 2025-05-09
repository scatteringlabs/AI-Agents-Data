import { getMultiChainProvider } from "@/configs/chain";
import { CurrencyAmount, Token, TradeType } from "@uniswap/sdk-core";
import { Pool, Route, SwapQuoter, computePoolAddress } from "@uniswap/v3-sdk";
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import { readContracts } from "@wagmi/core";
import { config } from "@/configs/wagmi-config";
import { ethers } from "ethers";
import { BigNumber } from "@ethersproject/bignumber";
import { defaultAbiCoder } from "@ethersproject/abi";
import JSBI from "jsbi";
import { formatWei } from "./format";

const uniswapV3Factory = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
const quoterV2 = "0x61fFE014bA17989E743c5F6cB21bF9697530B21e";
function countDecimals(x: number) {
  if (Math.floor(x) === x) {
    return 0;
  }
  return x.toString().split(".")[1].length || 0;
}

export function fromReadableAmount(amount: number, decimals: number): JSBI {
  const extraDigits = 10 ** countDecimals(amount);
  const adjustedAmount = amount * extraDigits;
  return JSBI.divide(
    JSBI.multiply(
      JSBI.BigInt(parseInt(`${adjustedAmount}`)),
      JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals)),
    ),
    JSBI.BigInt(extraDigits),
  );
}

interface iGetOutputQuote {
  feeTier: number;
  chainId: number;
  amountIn: number;
  tokenIn: Token;
  tokenOut: Token;
  poolAddress: string;
  tradeType: TradeType;
}
export async function getOutputQuote({
  chainId,
  tokenIn,
  tokenOut,
  feeTier,
  poolAddress,
  amountIn,
  tradeType,
}: iGetOutputQuote) {
  const provider = getMultiChainProvider(chainId);
  if (!provider) {
    throw new Error("Provider required to get pool state");
  }
  const poolContract = new ethers.Contract(
    poolAddress,
    IUniswapV3PoolABI.abi,
    provider,
  );

  const [sqrtPriceX96, tick] = await poolContract.slot0();
  const liquidity = await poolContract.liquidity();

  const pool = new Pool(
    tokenIn,
    tokenOut,
    feeTier,
    sqrtPriceX96.toString(),
    liquidity.toString(),
    Number(tick),
  );
  const swapRoute0 = new Route([pool], tokenIn, tokenOut);
  const { calldata } = await SwapQuoter.quoteCallParameters(
    swapRoute0,
    CurrencyAmount.fromRawAmount(
      tokenIn,
      fromReadableAmount(amountIn, tokenIn.decimals).toString(),
    ),
    TradeType.EXACT_OUTPUT,
    // TradeType.EXACT_INPUT,
    {
      useQuoterV2: true,
    },
  );
  const quoteCallReturnData = await provider.call({
    to: quoterV2,
    data: calldata,
  });
  const [amount0Out] = defaultAbiCoder.decode(["uint256"], quoteCallReturnData);
  return formatWei(amount0Out.toString());
}
