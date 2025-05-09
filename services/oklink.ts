const OKLINK_URL = "https://www.oklink.com";
const apiKey = "466dc1f3-82aa-4180-ac5f-3e9f002a31dd";
// const apiKey = process.env.NEXT_PUBLIC_API_KEY;
export interface Position {
  holderAddress: string;
  amount: string;
  valueUsd: string;
  positionChange24h: string;
  rank: string;
}

export interface BlockchainData {
  page: string;
  limit: string;
  totalPage: string;
  chainFullName: string;
  chainShortName: string;
  circulatingSupply: string;
  positionList: Position[];
}

interface ApiResponse {
  code: string;
  msg: string;
  data: BlockchainData[];
}

interface fetchPositionListParams {
  chainShortName: string;
  limit?: number;
  tokenContractAddress: string;
}
export const fetchPositionList = async ({
  chainShortName,
  limit = 100,
  tokenContractAddress,
}: fetchPositionListParams): Promise<BlockchainData[]> => {
  if (!apiKey) {
    throw new Error("API key is not defined");
  }
  const response = await fetch(
    `${OKLINK_URL}/api/v5/explorer/token/position-list?chainShortName=${chainShortName}&tokenContractAddress=${tokenContractAddress}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Ok-Access-Key": apiKey, // 使用环境变量中的 API 密钥
      },
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json: ApiResponse = await response.json();
  return json.data;
};

interface Transaction {
  txid: string;
  blockHash: string;
  height: string;
  transactionTime: string;
  from: string;
  to: string;
  isToContract: boolean;
  isFromContract: boolean;
  amount: string;
  transactionSymbol: string;
  tokenContractAddress: string;
  protocolType: string;
  state: string;
  methodId: string;
  tokenId: string;
}

interface TransactionData {
  page: string;
  limit: string;
  totalPage: string;
  totalTransfer: string;
  transactionList: Transaction[];
}
interface TransactionApiResponse {
  data: TransactionData[];
}
export const fetchTransactionList = async (
  chainShortName: string,
  tokenContractAddress: string,
  limit: number = 100,
): Promise<TransactionData[]> => {
  const response = await fetch(
    `${OKLINK_URL}/api/v5/explorer/token/transaction-list?chainShortName=${chainShortName}&tokenContractAddress=${tokenContractAddress}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Ok-Access-Key": apiKey,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json: TransactionApiResponse = await response.json();
  return json.data;
};

interface TransactionAddress {
  address: string;
  buyCount: string;
  buyAmount: string;
  sellCount: string;
  sellAmount: string;
  txnCount: string;
  txnAmount: string;
  buyValueUsd: string;
  sellValueUsd: string;
  txnValueUsd: string;
}
interface TransactionStatData {
  page: string;
  limit: string;
  totalPage: string;
  totalTransfer: string;
  transactionAddressList: TransactionAddress[];
}

interface TransactionStatApiResponse {
  data: TransactionStatData[];
}
export const fetchTransactionStats = async (
  chainShortName: string,
  tokenContractAddress: string,
  limit: number = 100,
): Promise<TransactionStatData[]> => {
  const response = await fetch(
    `${OKLINK_URL}/api/v5/explorer/token/transaction-stats?chainShortName=${chainShortName}&tokenContractAddress=${tokenContractAddress}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Ok-Access-Key": apiKey,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json: TransactionStatApiResponse = await response.json();
  return json.data;
};
