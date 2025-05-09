import { useQuery, UseQueryResult } from "@tanstack/react-query";
import crypto from "crypto";
import { ethers } from "ethers";

interface OkxSwapQuoteRequest {
  chainId: string;
  amount: string;
  fromTokenAddress: string;
  toTokenAddress: string;
  slippage: string;
  userWalletAddress: string;
  // apiKey: string;
  // passphrase: string;
  // projectId?: string;
}

interface OkxSwapQuoteResponse {
  data: any;
  code: string;
  msg: string;
}

const generateSignature = (
  method: string,
  url: string,
  body: string,
  timestamp: string,
  apiKey: string,
): string => {
  const prehash = timestamp + method + url + body;
  const hmac = crypto.createHmac("sha256", "CDE7BABD383A5CAF85EA277D64A76CBC");
  return hmac.update(prehash).digest("base64");
};
// const getSign = (str) => {
//   return crypto.createHmac("sha256", secretkey).update(str).digest("base64");
// };
interface OkXSwapParams {
  fromChainId: string;
  toChainId: string;
  sort: string;
  fromTokenAddress: string;
  toTokenAddress: string;
  amount: string;
  userWalletAddress: string;
}

const okXSwap = async ({
  toChainId,
  fromChainId,
  fromTokenAddress,
  toTokenAddress,
  amount,
  sort,
  userWalletAddress,
}: OkXSwapParams): Promise<string> => {
  const requestPath = `/api/v5/dex/aggregator/swap?chainId=${fromChainId}&fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${amount}&slippage=0.1&userWalletAddress=${userWalletAddress}&slippageType=1&pmm=1&gasDropType=0&forbiddenBridgeTypes=0&dexIds=34%2C29%2C47%2C49%2C48%2C40%2C30%2C53%2C54%2C51%2C55%2C259%2C58%2C52%2C59%2C81%2C83%2C80%2C82%2C88%2C91%2C92%2C90%2C89%2C99%2C28%2C101%2C351%2C104%2C105%2C108%2C110%2C248%2C132%2C114%2C113%2C131%2C130%2C133%2C134%2C135%2C136%2C215%2C153%2C141%2C102%2C159%2C160%2C27%2C202%2C230%2C199%2C266%2C184%2C356%2C186%2C200%2C203%2C207%2C204%2C210%2C330%2C214%2C213%2C218%2C226%2C234%2C239%2C257%2C262%2C265%2C323%2C328%2C365%2C352%2C354%2C355%2C379%2C380%2C394%2C399%2C401%2C404`;
  const timestamp = new Date().toISOString();

  // Create HMAC SHA256 and base64 encode it
  const hmac = crypto.createHmac("sha256", "CDE7BABD383A5CAF85EA277D64A76CBC");
  hmac.update(timestamp + "GET" + requestPath);
  const signature = hmac.digest("base64"); // Base64-encoded signature

  // This is necessary for OKX request
  const headers = {
    "OK-ACCESS-KEY": "485c9f87-3ea0-49ff-be73-eb69949579d8",
    "OK-ACCESS-SIGN": signature,
    "OK-ACCESS-TIMESTAMP": timestamp,
    "OK-ACCESS-PASSPHRASE": "Scattering666_",
  };

  // OKX API URL (https://www.okx.com/web3/build/docs/api/dex-swap)
  const apiUrl = `https://www.okx.com${requestPath}`;

  // Fetch from OKX API
  const swapdata = await fetch(apiUrl, { method: "GET", headers }).then(
    (response) => response.json(),
  );
  const swapdata2 = await fetch(
    "https://www.okx.com/priapi/v1/dx/trade/multi/outer/v3/quote/snap-mode?chainId=1&toChainId=1&toTokenAddress=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&fromTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&amount=0.000011&userWalletAddress=0x64190e41af3459e80630427b9a2032964726f551&slippage=0.01&slippageType=1&pmm=1&gasDropType=0&forbiddenBridgeTypes=0",
    // "https://www.okx.com/priapi/v1/dx/trade/multi/outer/v3/quote/snap-mode?chainId=1&toChainId=1&toTokenAddress=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&fromTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&amount=0.000011&userWalletAddress=0x64190e41af3459e80630427b9a2032964726f551&slippage=0.01&slippageType=1&pmm=1&gasDropType=0&forbiddenBridgeTypes=0&dexIds=34%2C29%2C47%2C49%2C48%2C40%2C30%2C53%2C54%2C51%2C55%2C259%2C58%2C52%2C59%2C81%2C83%2C80%2C82%2C88%2C91%2C92%2C90%2C89%2C99%2C28%2C101%2C351%2C104%2C105%2C108%2C110%2C248%2C132%2C114%2C113%2C131%2C130%2C133%2C134%2C135%2C136%2C215%2C153%2C141%2C102%2C159%2C160%2C27%2C202%2C230%2C199%2C266%2C184%2C356%2C186%2C200%2C203%2C207%2C204%2C210%2C330%2C214%2C213%2C218%2C226%2C234%2C239%2C257%2C262%2C265%2C323%2C328%2C365%2C352%2C354%2C355%2C379%2C380%2C394%2C399%2C401%2C404&t=1733245291352",
    { method: "GET" },
  ).then((response) => response.json());

  // Return response data to pass to the user
  return swapdata.data[0].tx.data.toString();
};
export const fetchOkxSwapQuote = async ({
  chainId,
  amount,
  fromTokenAddress,
  toTokenAddress,
  slippage,
  userWalletAddress,
}: OkxSwapQuoteRequest): Promise<OkxSwapQuoteResponse> => {
  try {
    const timestamp = new Date().toISOString();

    const params = new URLSearchParams({
      chainId,
      amount,
      fromTokenAddress,
      toTokenAddress,
      slippage,
      userWalletAddress,
    });
    const test = await okXSwap({
      fromChainId: "1",
      toChainId: "1",
      amount: "0.001",
      sort: "1",
      fromTokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      toTokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      // slippage,
      userWalletAddress: "0x64190e41af3459e80630427b9a2032964726f551",
    });
    console.log("test", test);

    const url = `https://www.okx.com/api/v5/dex/aggregator/swap?${params.toString()}`;

    // 请求体为空
    const body = "";

    // 计算签名
    const signature = generateSignature(
      "GET",
      url,
      body,
      timestamp,
      "485c9f87-3ea0-49ff-be73-eb69949579d8",
    );

    // 设置请求头
    const headers: Record<string, string> = {
      "OK-ACCESS-KEY": "485c9f87-3ea0-49ff-be73-eb69949579d8",
      "OK-ACCESS-SIGN": signature,
      "OK-ACCESS-TIMESTAMP": timestamp,
      "OK-ACCESS-PASSPHRASE": "Scattering666_",
      "Content-Type": "application/json",
    };

    // 如果是 WaaS 请求，添加项目 ID
    // if (projectId) {
    //   headers["OK-ACCESS-PROJECT"] = projectId;
    // }

    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      const errorRes: any = await response.json();
      throw new Error(errorRes?.msg || "Error fetching swap quote");
    }

    return response.json();
  } catch (error) {
    console.log("fetchOkxSwapQuote", error);
    return {
      data: [],
      code: "0",
      msg: "error",
    };
  }
};

export const useOkxSwapQuote = ({
  chainId,
  amount,
  fromTokenAddress,
  toTokenAddress,
  slippage,
  userWalletAddress,
}: OkxSwapQuoteRequest): UseQueryResult<OkxSwapQuoteResponse, Error> => {
  const amountInNormalUnit = ethers.utils.formatUnits(amount, 18);
  return useQuery<OkxSwapQuoteResponse, Error>({
    queryKey: [
      "okxSwapQuote",
      {
        chainId,
        amount,
        fromTokenAddress,
        toTokenAddress,
        slippage,
        userWalletAddress,
      },
    ],
    queryFn: () =>
      fetchOkxSwapQuote({
        chainId,
        amount: amountInNormalUnit,
        fromTokenAddress,
        toTokenAddress,
        slippage,
        userWalletAddress,
      }),
    enabled: Boolean(
      chainId &&
        amountInNormalUnit &&
        fromTokenAddress &&
        toTokenAddress &&
        slippage &&
        userWalletAddress,
    ),
    retry: 0,
  });
};
