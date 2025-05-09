import { ethers } from "ethers";
import { toast } from "react-toastify";
import { Erc20SwapABI } from "../abi/erc20-swap";
import { pollTransactionReceipt } from "@/services/launchpad/swap";
import { Erc20SwapAddress } from "./config";
import { ConnectedWallet } from "@privy-io/react-auth";

interface SellErc20Params {
  erc20zAddress: string; // ERC20 合约地址
  recipient: string; // 接收 ETH 的地址
  erc20AmountIn: ethers.BigNumberish; // 输入的 ERC20 数量
  minEthToAcquire: ethers.BigNumberish; // 最小期望获得的 ETH 数量
  sqrtPriceLimitX96?: ethers.BigNumberish; // 价格平方根限制 (可选)
  chainId: number;
  wallet: ConnectedWallet;
}

// 合约地址

export const sellErc20 = async ({
  erc20zAddress,
  recipient,
  erc20AmountIn,
  minEthToAcquire,
  chainId,
  sqrtPriceLimitX96 = 0, // 默认值 0
  wallet,
}: SellErc20Params) => {
  if (!wallet?.isConnected) {
    toast.error("No wallet connected.");
    return;
  }

  try {
    const provider = await wallet?.getEthersProvider();

    const accounts = await provider.send("eth_requestAccounts", []);
    if (!accounts.length) {
      console.error("No accounts found");
      toast.error("No Ethereum accounts found");
      return;
    }
    const signer = provider.getSigner();

    // 检查 ERC20 余额是否足够
    const erc20Contract = new ethers.Contract(
      erc20zAddress,
      [
        "function balanceOf(address) view returns (uint256)",
        "function allowance(address owner, address spender) view returns (uint256)",
        "function approve(address spender, uint256 amount) returns (bool)",
      ],
      signer,
    );

    const ownerAddress = await signer.getAddress();
    const erc20Balance = await erc20Contract.balanceOf(ownerAddress);
    if (ethers.BigNumber.from(erc20Balance).lt(erc20AmountIn)) {
      toast.error("Insufficient ERC20 balance");
      return;
    }

    // 检查合约是否已授权足够额度
    const allowance = await erc20Contract.allowance(
      ownerAddress,
      Erc20SwapAddress,
    );
    if (ethers.BigNumber.from(allowance).lt(erc20AmountIn)) {
      // 如果授权不足，直接授权最大值
      const approveTx = await erc20Contract.approve(
        Erc20SwapAddress,
        ethers.constants.MaxUint256,
      );
      await pollTransactionReceipt(approveTx.hash, chainId, 1000);
      toast.success("ERC20 token transfer approved");
    }

    const contract = new ethers.Contract(
      Erc20SwapAddress,
      Erc20SwapABI,
      signer,
    );

    const estimatedminEthToAcquire = ethers.BigNumber.from(minEthToAcquire)
      .mul(990) // 0.99 * 1000
      .div(1000); // 还原第一个比例
    // 调用 sellErc20 方法
    const tx = await contract.sellErc20(
      erc20zAddress,
      recipient,
      erc20AmountIn,
      estimatedminEthToAcquire,
      sqrtPriceLimitX96,
    );

    const toastId = toast.loading(
      "Transaction sent. Waiting for confirmation...",
    );

    // 轮询交易状态
    const receipt = await pollTransactionReceipt(tx.hash, chainId, 1000);
    toast.success("ERC20 tokens sold successfully");
    toast.dismiss(toastId);
    return receipt;
  } catch (err) {
    const errorMessage = (err as any)?.reason || (err as Error).message;
    console.error("Error executing sellErc20:", errorMessage);
    toast.error(errorMessage);
  }
};
