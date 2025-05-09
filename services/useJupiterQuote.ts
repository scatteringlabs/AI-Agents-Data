import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

interface JupiterQuoteRequest {
  inputMint: string;
  outputMint: string;
  amount: number;
  slippageBps?: number;
  onlyDirectRoutes?: boolean;
  swapMode?: "ExactOut" | "ExactIn";
}
type SwapInfo = {
  ammKey: string;
  label: string;
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  feeAmount: string;
  feeMint: string;
};

type RoutePlan = {
  swapInfo: SwapInfo;
  percent: number;
};

export type JupQuoteResponse = {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: "ExactIn" | "ExactOut";
  slippageBps: number;
  platformFee: string | null;
  priceImpactPct: string;
  routePlan: RoutePlan[];
  contextSlot: number;
  computedAutoSlippage: number;
  timeTaken: number;
};

class JupiterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JupiterError";
  }
}

const JUPITER_API_URL = "https://quote-api.jup.ag/v6/quote";

const fetchJupiterQuote = async ({
  inputMint,
  outputMint,
  amount,
  slippageBps = 300,
  onlyDirectRoutes = false,
  swapMode = "ExactIn",
}: JupiterQuoteRequest): Promise<JupQuoteResponse> => {
  try {
    const response = await axios.get<JupQuoteResponse>(
      `${JUPITER_API_URL}?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&swapMode=${swapMode}&autoSlippage=true&autoSlippageCollisionUsdValue=1000&computeAutoSlippage=true&onlyDirectRoutes=false&asLegacyTransaction=false&minimizeSlippage=false&experimentalDexes=Jupiter LO`,
    );
    return response.data;
  } catch (err) {
    if (
      err instanceof AxiosError &&
      err.response &&
      err.response.data &&
      err.response.data.error
    ) {
      // toast?.error(err.response.data.error);
      throw new JupiterError(err.response.data.error);
    }
    throw new JupiterError("Cannot get route");
  }
};

export const useJupiterQuote = ({
  inputMint,
  outputMint,
  amount,
  slippageBps = 300,
  onlyDirectRoutes = false,
  swapMode = "ExactIn",
}: JupiterQuoteRequest): UseQueryResult<JupQuoteResponse, Error> => {
  console.log(inputMint, outputMint, amount);

  return useQuery<JupQuoteResponse, Error>({
    queryKey: [
      "jupiterQuote",
      {
        inputMint,
        outputMint,
        amount,
        slippageBps,
        onlyDirectRoutes,
        swapMode,
      },
    ],
    queryFn: () =>
      fetchJupiterQuote({
        inputMint,
        outputMint,
        amount,
        slippageBps,
        onlyDirectRoutes,
        swapMode,
      }),
    enabled: Boolean(inputMint && outputMint && amount > 0),
    retry: 0,
  });
};
