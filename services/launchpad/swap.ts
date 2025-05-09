import { TokenFactoryABI } from "@/interface/launchpad/abi/TokenFactoryAbi";
import { AllAddress } from "@/interface/launchpad/config";
import { ConnectedWallet } from "@privy-io/react-auth";
import { ChainId } from "@uniswap/sdk-core";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { erc20Abi } from "viem";

interface ihandleGetETHAmountInForToken {
  tokenAddress: string;
  tokenAmount: string;
}

export const getETHAmountInForToken = async ({
  tokenAddress,
  tokenAmount,
}: ihandleGetETHAmountInForToken) => {
  if (!window.ethereum) {
    return;
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const tokenFactoryContract = new ethers.Contract(
      AllAddress?.TokenFactory,
      TokenFactoryABI,
      provider,
    );

    const tokenAmountInWei = ethers.utils.parseUnits(tokenAmount, 18);

    const [receivedAmount, paidAmount, platformFee, projectFee] =
      await tokenFactoryContract.getETHAmountInForToken(
        tokenAddress,
        tokenAmountInWei,
      );
    return {
      tokensReceived: ethers.utils.formatUnits(receivedAmount, 18),
      ethPaid: ethers.utils.formatEther(paidAmount),
      platformFee: ethers.utils.formatEther(platformFee),
      projectFee: ethers.utils.formatEther(projectFee),
    };
  } catch (err) {
    const errorMessage = (err as any)?.reason || (err as Error).message;
    console.error("Error fetching ETH amount in:", err);
  }
};

export const getETHAmountOutForToken = async ({
  tokenAddress,
  tokenAmount,
}: ihandleGetETHAmountInForToken) => {
  if (!window.ethereum) {
    return;
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const tokenFactoryContract = new ethers.Contract(
      AllAddress?.TokenFactory,
      TokenFactoryABI,
      provider,
    );

    const tokenAmountInWei = ethers.utils.parseUnits(tokenAmount, 18);

    const [amountNeed, amountReturn, platformFee, projectFee] =
      await tokenFactoryContract.getETHAmountOutForToken(
        tokenAddress,
        tokenAmountInWei,
      );

    return {
      amountNeed: ethers.utils.formatUnits(amountNeed, 18),
      amountReturn: ethers.utils.formatEther(amountReturn),
      platformFee: ethers.utils.formatEther(platformFee),
      projectFee: ethers.utils.formatEther(projectFee),
    };
  } catch (err) {
    const errorMessage = (err as any)?.reason || (err as Error).message;
    console.error("Error fetching ETH amount in:", err);
  }
};

interface iSwapParams {
  isBuy: boolean;
  tokenAddr: string;
  recipient: string;
  amountIn: string;
  amountOutMinimum: string;
  wallet: ConnectedWallet;
}

export const executeSwap = async ({
  isBuy,
  tokenAddr,
  recipient,
  amountIn,
  amountOutMinimum,
  wallet,
}: iSwapParams) => {
  if (!wallet.isConnected) {
    console.error("wallet not connected");
    return;
  }

  try {
    const provider = await wallet?.getEthersProvider();

    const accounts = await provider.send("eth_requestAccounts", []);
    if (!accounts.length) {
      console.error("No accounts found");
      return;
    }
    const signer = provider.getSigner();
    console.log("0000");

    const tokenFactoryContract = new ethers.Contract(
      AllAddress?.TokenFactory,
      TokenFactoryABI,
      signer,
    );

    const amountInWei = ethers.utils.parseUnits(amountIn, 18);
    const amountOutMinWei = ethers.utils
      .parseUnits(amountOutMinimum, 18)
      .mul(97)
      .div(100);

    // 如果是卖出，检查是否已批准
    if (!isBuy) {
      const tokenContract = new ethers.Contract(tokenAddr, erc20Abi, signer);
      const allowance = await tokenContract.allowance(
        accounts[0],
        AllAddress.TokenFactory,
      );

      if (allowance.lt(amountInWei)) {
        // 如果未批准，则进行 approve
        const txApprove = await tokenContract.approve(
          AllAddress.TokenFactory,
          ethers.utils.parseUnits("1000000000", 18),
        );

        // 等待批准交易完成（使用轮询）
        const receiptApprove = await pollTransactionReceipt(
          txApprove.hash,
          ChainId.BASE,
          1000,
        );
        console.log("receiptApprove", receiptApprove);

        if (!receiptApprove) {
          console.error("Approval transaction failed or was not found");
          return;
        }
      }
    }

    // 构造 SwapParams 结构
    const swapParams = {
      isBuy,
      tokenAddr,
      recipient,
      amountIn: amountInWei,
      amountOutMinimum: amountOutMinWei,
    };
    console.log(
      "1111",
      swapParams,
      amountInWei?.toString(),
      amountOutMinWei?.toString(),
    );

    // 预估 gas
    const estimatedGas = await tokenFactoryContract.estimateGas.swap(
      swapParams,
      {
        value: isBuy ? amountInWei : 0,
      },
    );

    // 增加 20% 的 gas 限制
    const gasLimit = estimatedGas.mul(120).div(100);
    console.log("estimatedGas", estimatedGas);
    console.log("gasLimit", gasLimit);

    // 调用 swap 函数
    const tx = await tokenFactoryContract.swap(swapParams, {
      value: isBuy ? amountInWei : 0, // 如果是购买，附带 ETH
      gasLimit, // 使用增加后的 gas 限制
    });
    const receipt = await pollTransactionReceipt(tx.hash, ChainId.BASE, 1000);
    // 等待交易完成
    toast.success("Swap Transaction Successful");
    return receipt;
  } catch (err) {
    const errorMessage = (err as any)?.reason || (err as Error).message;
    console.error("Error executing swap:", errorMessage);
    toast.error(errorMessage);
  }
};

interface IGetTokenAmountOutForETH {
  tokenAddress: string;
  ethAmount: string;
}

export const getTokenAmountOutForETH = async ({
  tokenAddress,
  ethAmount,
}: IGetTokenAmountOutForETH) => {
  if (!window.ethereum) {
    console.error("Ethereum wallet not detected");
    return;
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const tokenFactoryContract = new ethers.Contract(
      AllAddress?.TokenFactory,
      TokenFactoryABI,
      provider,
    );

    // 将 ETH 金额转换为最小单位（Wei）
    const ethAmountInWei = ethers.utils.parseUnits(ethAmount, "ether");

    // 调用 getTokenAmountOutForETH 方法
    const [receivedAmount, paidAmount, platformFee, projectFee] =
      await tokenFactoryContract.getTokenAmountOutForETH(
        tokenAddress,
        ethAmountInWei,
      );
    return {
      tokensReceived: ethers.utils.formatUnits(receivedAmount, 18),
      ethPaid: ethers.utils.formatEther(paidAmount),
      platformFee: ethers.utils.formatEther(platformFee),
      projectFee: ethers.utils.formatEther(projectFee),
    };
  } catch (err) {
    const errorMessage = (err as any)?.reason || (err as Error).message;
    console.error("Error fetching token amount out for ETH:", errorMessage);
  }
};

const NETWORK_CONFIG: Record<number, string> = {
  1: "https://eth-mainnet.g.alchemy.com/v2/CDVPSoGW0dc4AIKFN7nEwnrsLjAHvN5X", // Ethereum Mainnet
  84532:
    "https://base-sepolia.g.alchemy.com/v2/CDVPSoGW0dc4AIKFN7nEwnrsLjAHvN5X", // Base-Sepolia Testnet
  [ChainId.BASE]:
    "https://base-mainnet.g.alchemy.com/v2/CDVPSoGW0dc4AIKFN7nEwnrsLjAHvN5X", // Base Mainnet
  [ChainId.ZORA]:
    "https://zora-mainnet.g.alchemy.com/v2/CDVPSoGW0dc4AIKFN7nEwnrsLjAHvN5X", // Base Mainnet
};

export const pollTransactionReceipt = async (
  txHash: string,
  chainId: number,
  interval: number = 1000,
): Promise<any> => {
  const ALCHEMY_URL = NETWORK_CONFIG[chainId];
  if (!ALCHEMY_URL) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }

  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        const response = await fetch(ALCHEMY_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: 1,
            jsonrpc: "2.0",
            method: "eth_getTransactionReceipt",
            params: [txHash],
          }),
        });

        const data = await response.json();

        // Check if we received a valid receipt
        if (data.result) {
          console.log("resolve", data.result);

          resolve(data.result);
        } else {
          // Wait for the specified interval and poll again
          setTimeout(poll, interval);
        }
      } catch (error) {
        // Handle potential errors (e.g., network issues)
        reject(error);
      }
    };

    // Start the polling
    poll();
  });
};
