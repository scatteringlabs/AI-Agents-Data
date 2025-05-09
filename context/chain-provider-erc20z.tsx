import { ChainIdByName, ChainNameById } from "@/constants/chain";
import { ChainId } from "@uniswap/sdk-core";
import { useRouter } from "next/router";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";

interface ChainContextValue {
  chainId: number;
  setChainId: (c: number) => void;
}

const ChainContext = createContext<ChainContextValue>({
  chainId: ChainId.BASE,
  setChainId: () => {},
});

interface ChainProviderProps {
  children: ReactNode;
}

export const Erc20ZChainProvider = ({ children }: ChainProviderProps) => {
  const router = useRouter();
  const { chain, GlobalType } = router.query;
  const [chainId, setChainId] = useState(
    ChainNameById?.[chain?.toString() || ""],
  );
  useEffect(() => {
    setChainId(ChainNameById?.[chain?.toString() || ""]);
  }, [chain, GlobalType, router]);

  // useEffect(() => {
  //   localStorage.setItem("chainId", chainId.toString());
  // }, [chainId]);

  return (
    <ChainContext.Provider value={{ chainId, setChainId }}>
      {children}
    </ChainContext.Provider>
  );
};

export const useErc20ZChain = () => {
  return useContext(ChainContext);
};
