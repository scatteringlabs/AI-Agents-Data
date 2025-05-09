import { useEffect } from "react";
import { useAtom } from "jotai";
import { selectedChainAtom } from "../selectedChainAtom";

export const useSelectedChain = (initialChainId?: number | string) => {
  const [selectedChain, setSelectedChain] = useAtom(selectedChainAtom);

  useEffect(() => {
    if (initialChainId !== undefined) {
      setSelectedChain(initialChainId);
    }
  }, [initialChainId, setSelectedChain]);

  return { selectedChain, setSelectedChain };
};
