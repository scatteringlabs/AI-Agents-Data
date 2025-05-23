import { AlchemyRpcUrl } from "@/configs/chain";
import { ChainId } from "@uniswap/sdk-core";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { Erc20SwapABI } from "../abi/erc20-swap";
import { pollTransactionReceipt } from "@/services/launchpad/swap";
import { Erc20SwapAddress } from "./config";
import { ConnectedWallet } from "@privy-io/react-auth";

interface BuyErc20Params {
  erc20zAddress: string; // ERC20Z contract address
  recipient: string; // Address to receive ERC20 tokens
  minErc20Out: ethers.BigNumberish; // Minimum expected ERC20 output
  ethToSpend: ethers.BigNumberish; // Amount of ETH to send
  chainId: number;
  wallet: ConnectedWallet;
}
// Contract address

export const buyErc20 = async ({
  erc20zAddress,
  recipient,
  minErc20Out,
  ethToSpend,
  chainId,
  wallet,
}: BuyErc20Params) => {
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

    const contract = new ethers.Contract(
      Erc20SwapAddress,
      Erc20SwapABI,
      signer,
    );
    const ethToSpends = ethers.BigNumber.from(ethToSpend).mul(10098).div(9900);

    const tx = await contract.buyErc20(
      erc20zAddress,
      recipient,
      minErc20Out,
      0,
      {
        value: ethers.BigNumber.from(ethToSpends),
      },
    );
    const toastId = toast.loading(
      "Transaction sent. Waiting for confirmation...",
    );

    const receipt = await pollTransactionReceipt(tx.hash, chainId, 1000);
    toast.success("ERC20 tokens purchased successfully");
    toast.dismiss(toastId);
    return receipt;
  } catch (err) {
    const errorMessage = (err as any)?.reason || (err as Error).message;
    console.error("Error executing buyErc20:", errorMessage);
    toast.error(errorMessage);
  }
};
