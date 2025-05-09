import { ethers } from "ethers";
import { QuoterV2ABI } from "../abi/QuoterV2";
import { AlchemyRpcUrl } from "@/configs/chain";
import { ChainId } from "@uniswap/sdk-core";

const QUOTER_V2_ADDRESS: Record<number, string> = {
  [ChainId.BASE]: "0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a",
  [ChainId.ZORA]: "0x11867e1b3348F3ce4FcC170BC5af3d23E07E64Df",
};

const ZORA_FEE_TIER = 10000;

export async function quoteExactInputSingle(
  tokenIn: string,
  tokenOut: string,
  amountIn: ethers.BigNumberish,
  chainId: number,
): Promise<string> {
  try {
    const provider = new ethers.providers.StaticJsonRpcProvider(
      AlchemyRpcUrl[chainId],
      chainId,
    );

    const quoterV2 = new ethers.Contract(
      QUOTER_V2_ADDRESS[chainId],
      QuoterV2ABI,
      provider,
    );
    const [amountOut, sqrtPriceX96After, initializedTicksCrossed, gasEstimate] =
      await quoterV2.callStatic.quoteExactInputSingle([
        tokenIn,
        tokenOut,
        amountIn,
        ZORA_FEE_TIER,
        0,
      ]);
    return ethers.utils.formatUnits(amountOut, 18);
  } catch (error) {
    console.error("Error in quoteExactInputSingle:", error);
    return "0";
  }
}

export async function quoteExactOutputSingle(
  tokenIn: string,
  tokenOut: string,
  amountOut: ethers.BigNumberish,
  chainId: number,
): Promise<string> {
  const provider = new ethers.providers.StaticJsonRpcProvider(
    AlchemyRpcUrl[chainId],
    chainId,
  );

  const quoterV2 = new ethers.Contract(
    QUOTER_V2_ADDRESS[chainId],
    QuoterV2ABI,
    provider,
  );

  try {
    const [amountIn, sqrtPriceX96After, initializedTicksCrossed, gasEstimate] =
      await quoterV2.callStatic.quoteExactOutputSingle([
        tokenIn,
        tokenOut,
        amountOut,
        ZORA_FEE_TIER,
        0,
      ]);
    return ethers.utils.formatUnits(amountIn, 18);
  } catch (error) {
    console.error("Error in quoteExactOutputSingle:", error);
    return "0";
  }
}
