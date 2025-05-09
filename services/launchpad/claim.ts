import { RoyaltiesABI } from "@/interface/launchpad/abi/Royalties";
import { TokenFactoryABI } from "@/interface/launchpad/abi/TokenFactoryAbi";
import { TokenImplABI } from "@/interface/launchpad/abi/TokenImplABI";
import { AllAddress } from "@/interface/launchpad/config";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { pollTransactionReceipt } from "./swap";
import { ChainId } from "@uniswap/sdk-core";
import { ConnectedWallet } from "@privy-io/react-auth";

export enum ProjectFeeType {
  Swap = 0, // Enum to match with uint8 type
  Share = 1,
}

interface ICollectProjectFeeParams {
  tokenAddr: string;
  feeType: ProjectFeeType;
  wallet: ConnectedWallet;
}

export const collectProjectFee = async ({
  tokenAddr,
  feeType,
  wallet,
}: ICollectProjectFeeParams) => {
  if (!wallet.isConnected) {
    console.error("wallet not connected");
    return;
  }

  try {
    const provider = await wallet?.getEthersProvider();

    // Request wallet authorization
    const accounts = await provider.send("eth_requestAccounts", []);
    if (!accounts.length) {
      console.error("No accounts found");
      return;
    }
    const signer = provider.getSigner();

    // Instantiate the contract
    const tokenFactoryContract = new ethers.Contract(
      AllAddress?.TokenFactory,
      TokenFactoryABI,
      signer,
    );

    // Call the contract's collectProjectFee method
    const tx = await tokenFactoryContract.collectProjectFee(tokenAddr, feeType);
    console.log("Transaction sent:", tx);

    // Use pollTransactionReceipt to wait for transaction completion
    const receipt = await pollTransactionReceipt(tx.hash, ChainId.BASE, 1000);
    console.log("Transaction Successful:", receipt);
    toast.success("Project fee collected successfully");

    return receipt;
  } catch (err) {
    const errorMessage = (err as any)?.reason || (err as Error).message;
    console.error("Error collecting project fee:", errorMessage);
    toast.error(errorMessage);
  }
};

interface IGetUnclaimedFeesParams {
  tokens: string[]; // 传递的多个token地址
}

// 返回的结构体类型定义
interface IUnclaimedFees {
  token0: string;
  token1: string;
  token0Amount: ethers.BigNumber;
  token1Amount: ethers.BigNumber;
}

// 调用 getUnclaimedFeesBatch 的方法
export const getUnclaimedFeesBatch = async ({
  tokens,
}: IGetUnclaimedFeesParams) => {
  if (!tokens.length) {
    return;
  }
  if (!window.ethereum) {
    console.error("Ethereum wallet not detected");
    return;
  }
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // 请求钱包授权
    const accounts = await provider.send("eth_requestAccounts", []);
    if (!accounts.length) {
      console.error("No accounts found");
      return;
    }
    const signer = provider.getSigner();

    // 实例化合约
    const royaltiesContract = new ethers.Contract(
      AllAddress?.Royalties,
      RoyaltiesABI,
      signer,
    );

    // 调用合约的 getUnclaimedFeesBatch 方法
    const unclaimedFees: IUnclaimedFees[] =
      await royaltiesContract.getUnclaimedFeesBatch(tokens);

    return unclaimedFees;
  } catch (err) {
    const errorMessage = (err as any)?.reason || (err as Error).message;
    console.error("Error retrieving unclaimed fees:", errorMessage);
    // toast.error(errorMessage);
  }
};

interface IClaimForParams {
  tokenAddress: string;
  wallet: ConnectedWallet;
}

export const claimLPFeeFor = async ({
  tokenAddress,
  wallet,
}: IClaimForParams) => {
  if (!wallet.isConnected) {
    console.error("wallet not connected");
    return;
  }

  try {
    const provider = await wallet?.getEthersProvider();

    // Request wallet authorization
    const accounts = await provider.send("eth_requestAccounts", []);
    if (!accounts.length) {
      console.error("No accounts found");
      return;
    }
    const signer = provider.getSigner();

    // Instantiate the contract
    const royaltiesContract = new ethers.Contract(
      AllAddress?.Royalties, // Replace with the appropriate contract address
      RoyaltiesABI, // Replace with the actual ABI
      signer,
    );

    // Call the contract's claimFor method
    const tx = await royaltiesContract.claimFor(tokenAddress);
    console.log("Transaction sent:", tx);

    // Use pollTransactionReceipt to wait for transaction completion
    const receipt = await pollTransactionReceipt(tx.hash, ChainId.BASE, 1000);
    console.log("Transaction Successful:", receipt);
    toast.success("Successfully claimed fees for token");

    return receipt;
  } catch (err) {
    const errorMessage = (err as any)?.reason || (err as Error).message;
    console.error("Error claiming fees:", errorMessage);
    toast.error(errorMessage);
  }
};

export const getErc721TotalSupply = async (contractAddress: string) => {
  if (!window.ethereum) {
    console.error("Ethereum wallet not detected");
    return;
  }
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const accounts = await provider.send("eth_requestAccounts", []);
    if (!accounts.length) {
      console.error("No accounts found");
      return;
    }

    const signer = provider.getSigner();

    const contract = new ethers.Contract(contractAddress, TokenImplABI, signer);

    const totalSupply = await contract.erc721TotalSupply();

    console.log("ERC721 Total Supply:", totalSupply.toString());

    // 返回总供应量
    return totalSupply;
  } catch (err) {
    const errorMessage = (err as any)?.reason || (err as Error).message;
    console.error("Error retrieving ERC721 total supply:", errorMessage);
  }
};
