import { ethers } from "ethers";
import { AllAddress } from "@/interface/launchpad/config";
import { TokenFactoryABI } from "@/interface/launchpad/abi/TokenFactoryAbi";
import { BASE_URL_DEV } from "@/constants/url";
import { toast } from "react-toastify";
import { pollTransactionReceipt } from "@/services/launchpad/swap";
import { ChainId } from "@uniswap/sdk-core";
import { ConnectedWallet } from "@privy-io/react-auth";

export const BaseSID = 8453;
// export const BaseSID = 84532;

const GAS_MULTIPLIER = 1.2; // 增加 20% 的 gas 限制
const POLL_INTERVAL = 1000; // 轮询间隔，单位为 ms
const POLL_TIMEOUT = 30000; // 轮询超时，单位为 ms

export const createToken = async (
  collectionName: string,
  tokenSymbol: string,
  address: string,
  id: string,
  conversionRatio: number,
  baseURI: string,
  wallet: ConnectedWallet,
) => {
  if (!wallet.isConnected) {
    console.error("wallet not connected");
    return {};
  }

  const ETH_PAYMENT = "0.001"; // 合约交互的 ETH 支付费用
  const INITIAL_MINT_AMOUNT = "0";
  const URI_TYPE_SINGLE_LINK = 0; // URI 类型定义

  try {
    const provider = await wallet?.getEthersProvider();
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    const tokenFactoryContract = new ethers.Contract(
      AllAddress?.TokenFactory,
      TokenFactoryABI,
      signer,
    );

    const args = [
      {
        name: collectionName,
        symbol: tokenSymbol,
        uriType: URI_TYPE_SINGLE_LINK,
        baseURI,
        projectAdmin: address,
        multiplier: conversionRatio,
      },
      ethers.utils.parseUnits(INITIAL_MINT_AMOUNT, 18),
    ];

    const estimatedGas = await tokenFactoryContract.estimateGas.createToken(
      ...args,
      {
        value: ethers.utils.parseUnits(ETH_PAYMENT, "ether"),
      },
    );
    const gasLimit = estimatedGas
      .mul(ethers.BigNumber.from(Math.ceil(GAS_MULTIPLIER * 100)))
      .div(100);

    const tx = await tokenFactoryContract.createToken(...args, {
      value: ethers.utils.parseUnits(ETH_PAYMENT, "ether"),
      gasLimit,
    });

    const receipt = await pollTransactionReceipt(
      tx.hash,
      ChainId.BASE,
      POLL_INTERVAL,
    );
    console.log("receipt", receipt);

    const topic = receipt.logs?.find((log: any) =>
      log.topics?.includes(
        "0x1ad1211f7a691e74bd9e10657aedbcf93c3ee2b524e226d7fe04a7ec6f74ed40",
      ),
    );
    console.log("topic", topic);
    if (receipt?.logs?.[5]?.address) {
      toast.success("Token created！");
      return {
        hash: receipt.transactionHash,
        address: receipt?.logs?.[5]?.address,
      };
    } else {
      return {
        hash: "",
        address: "",
      };
    }
  } catch (error) {
    const errorMessage = (error as any)?.reason || (error as Error).message;
    console.error("createToken:", errorMessage);
    toast.error(errorMessage);
    return {
      hash: "",
      address: "",
    };
  }
};

export const saveLaunchpadProject = async (formData: FormData) => {
  const response = await fetch(
    `https://api.scattering.io/launchpad-api/v2/project/save`,
    {
      headers: {
        "x-api-key": "epz4afebvjemayeod29khazncqav2dodwkj",
      },
      method: "POST",
      body: formData,
      redirect: "follow",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to submit form");
  }
  return response.json();
};

export const updateLaunchpadProject = async (
  id: string,
  formData: FormData,
) => {
  const response = await fetch(
    `https://api.scattering.io/launchpad-api/v2/project/update/${id}`,
    {
      headers: {
        "x-api-key": "epz4afebvjemayeod29khazncqav2dodwkj",
      },
      method: "POST",
      body: formData,
      redirect: "follow",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to submit form");
  }
  return response.json();
};

interface iUpdate {
  token_address?: string;
  transaction_hash: string;
  id: string;
}

export const updateLaunchpadToChain = async (formData: iUpdate) => {
  const response = await fetch(
    `https://api.scattering.io/launchpad-api/v2/project/set-official`,
    {
      headers: {
        "x-api-key": "epz4afebvjemayeod29khazncqav2dodwkj",
      },
      method: "PUT",
      body: JSON.stringify(formData),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to submit form");
  }
  return response.json();
};

interface ProjectParams {
  status: number;
  wallet_address?: string;
  chain_id: number;
}
// 定义单个项目的数据结构
export interface Project {
  // ID: number;
  uuid: string;
  slug: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  wallet_address: string;
  token_address: string;
  collection_name: string;
  token_symbol: string;
  description: string;
  chain_id: number;
  nft_quantity: number;
  collection_story: string;
  nft_info: string;
  initial_buy: string;
  pre_reveal_image: string;
  collection_logo: string;
  banner_image: string;
  nft_media_images: string;
  x: string;
  telegram: string;
  website: string;
  status: number;
  transaction_hash: string;
  is_pinned: boolean;
}

// 定义 API 响应的数据结构
interface ProjectListResponse {
  code: number;
  data: Project[];
  msg: string;
}

export const getProjectList = async (
  params: ProjectParams,
): Promise<ProjectListResponse> => {
  const queryParams = new URLSearchParams(params as any).toString();
  const response = await fetch(
    `https://api.scattering.io/launchpad-api/v2/project/list?${queryParams}`,
    {
      headers: {
        "x-api-key": "epz4afebvjemayeod29khazncqav2dodwkj",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  // 指定返回数据的类型为 ProjectListResponse
  const data: ProjectListResponse = await response.json();
  return data;
};

// 定义单个项目的数据结构
export interface ProjectData {
  uuid: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  wallet_address: string;
  token_address: string;
  collection_name: string;
  token_symbol: string;
  description: string;
  chain_id: number;
  nft_quantity: number;
  collection_story: string;
  nft_info: string;
  slug: string;
  initial_buy: string;
  pre_reveal_image: string;
  collection_logo: string;
  banner_image: string;
  nft_media_images: string;
  x: string;
  telegram: string;
  website: string;
  status: number;
  transaction_hash: string;
}

// API 响应数据结构
interface ProjectResponse {
  code: number;
  data: ProjectData;
  msg: string;
}

export const getProjectDetails = async (
  id: string,
): Promise<ProjectResponse> => {
  const response = await fetch(
    `https://api.scattering.io/launchpad-api/v2/project/${id}`,
    {
      headers: {
        "x-api-key": "epz4afebvjemayeod29khazncqav2dodwkj",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  // 指定返回数据的类型为 ProjectListResponse
  const data: ProjectResponse = await response.json();
  return data;
};

export const getProjectDetailsByAddress = async (
  address: string,
): Promise<ProjectResponse> => {
  const params = { chain_id: BaseSID, token_address: address };
  const queryParams = new URLSearchParams(params as any).toString();
  const response = await fetch(
    `https://api.scattering.io/launchpad-api/v2/project/detail?${queryParams}`,
    {
      headers: {
        "x-api-key": "epz4afebvjemayeod29khazncqav2dodwkj",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  // 指定返回数据的类型为 ProjectListResponse
  const data: ProjectResponse = await response.json();
  return data;
};

export const getProjectDetailsBatch = async (
  ids: string[],
): Promise<ProjectListResponse> => {
  if (!ids?.length) {
    return {
      code: 0,
      data: [],
      msg: "no data",
    };
  }
  const body = {
    chain_id: BaseSID,
    token_addresses: ids,
  };
  const response = await fetch(
    `https://api.scattering.io/launchpad-api/v2/project/batch`,
    {
      method: "POST",
      headers: {
        "x-api-key": "epz4afebvjemayeod29khazncqav2dodwkj",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  // 指定返回数据的类型为 ProjectListResponse
  const data: ProjectListResponse = await response.json();
  return data;
};

export const saveLaunchpadProjectMedia = async (data: object) => {
  try {
    const response = await fetch(
      `https://api.scattering.io/launchpad-api/v2/project/update-media`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "epz4afebvjemayeod29khazncqav2dodwkj",
        },
        method: "PUT",
        body: JSON.stringify(data),
        redirect: "follow",
      },
    );

    if (!response.ok) {
      // 处理服务器返回的错误
      const errorData = await response.json();
      throw new Error(errorData?.message || "Failed to submit form");
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving project media:", error);
    const errorMessage = (error as any)?.reason || (error as Error).message;
    toast.error(errorMessage);
    throw error;
  }
};
