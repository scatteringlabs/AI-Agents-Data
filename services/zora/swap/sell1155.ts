import { ethers } from "ethers";
import { toast } from "react-toastify";
import { SecondarySwapABI } from "../abi/sec";
import { pollTransactionReceipt } from "@/services/launchpad/swap";
import { ChainId } from "@uniswap/sdk-core";
import { ERC155ABI } from "../abi/erc1155";
import { SecondarySwapAddress } from "./config";
import { ConnectedWallet } from "@privy-io/react-auth";

// 合约地址
interface CallSell1155Params {
  tokenAddress: string; // ERC1155 合约地址
  from: string; // 卖家地址
  // to: string; // 接收者地址
  tokenId: ethers.BigNumberish; // ERC1155 Token ID
  amount: ethers.BigNumberish; // 卖出的 1155 数量
  // recipient: string; // 接收 ETH 的地址
  minEthToAcquire: ethers.BigNumberish; // 最小收到的 ETH 数量
  // sqrtPriceLimitX96: ethers.BigNumberish; // 价格限制
  chainId: number;
  wallet: ConnectedWallet;
}

export const callSell1155 = async ({
  tokenAddress,
  from,
  tokenId,
  amount,
  minEthToAcquire,
  chainId,
  wallet,
}: CallSell1155Params) => {
  if (!wallet?.isConnected) {
    toast.error("No wallet connected.");
    return;
  }

  try {
    const provider = await wallet?.getEthersProvider();

    // 请求用户授权连接钱包
    const accounts = await provider.send("eth_requestAccounts", []);
    if (!accounts.length) {
      console.error("No accounts found");
      toast.error("No Ethereum accounts found");
      return;
    }
    const signer = provider.getSigner();

    // 使用 ERC1155 合约实例
    const contract = new ethers.Contract(tokenAddress, ERC155ABI, signer);
    const minEthToSpendS = ethers.BigNumber.from(minEthToAcquire)
      .mul(97)
      .div(100);
    // 编码附加参数 data
    const data = ethers.utils.defaultAbiCoder.encode(
      ["address", "uint256", "uint160"],
      [from, minEthToSpendS, 0],
    );

    // 调用 safeTransferFrom 方法

    console.log(
      tokenAddress,
      from,
      ethers.BigNumber.from(tokenId),
      amount,
      minEthToAcquire,
      data,
    );
    const iface = new ethers.utils.Interface(ERC155ABI);
    const calldata = iface.encodeFunctionData("safeTransferFrom", [
      from, // from 地址
      SecondarySwapAddress, // 合约地址
      ethers.BigNumber.from(tokenId), // tokenId
      ethers.BigNumber.from(amount), // 数量
      data, // 附加参数
    ]);

    console.log("Calldata:", calldata);
    const tx = await contract.safeTransferFrom(
      from,
      SecondarySwapAddress,
      ethers.BigNumber.from(tokenId),
      ethers.BigNumber.from(amount),
      data,
    );

    console.log("tx", tx);
    toast.info("Transaction sent. Waiting for confirmation...");

    // 等待交易确认
    const receipt = await pollTransactionReceipt(tx.hash, chainId, 1000);
    console.log("Transaction Successful:", receipt);
    toast.success("1155 tokens sold successfully");

    return receipt;
  } catch (err) {
    const errorMessage = (err as any)?.reason || (err as Error).message;
    console.error("Error executing sell1155:", errorMessage);
    toast.error(errorMessage);
  }
};
