import { BaseSID } from "@/views/launchpad/create/tokenService";
import { ChainId } from "@uniswap/sdk-core";
import { useState, useEffect } from "react";

const MOBILE_WIDTH_THRESHOLD = 768;

export function useIsPc() {
  const [isPc, setIsPc] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    function handleResize() {
      setIsPc(window.innerWidth > MOBILE_WIDTH_THRESHOLD);
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isPc;
}

export function maskAddress(address?: string) {
  if (!address) return "--";
  if (address.length <= 18) {
    return address;
  }
  const pat = /(\S{6})\S*(\S{4})/;
  const result = address.replace(pat, "$1...$2");
  return result;
}

export function chainIdToName(chainId?: number | string) {
  let name = "-";
  switch (Number(chainId)) {
    case 10000:
      name = "Solana";
      break;
    case ChainId.MAINNET:
      name = "Ethereum";
      break;
    case ChainId.ARBITRUM_ONE:
      name = "Arbitrum";
      break;
    case ChainId.BASE:
      name = "Base";
      break;
    case ChainId.ZORA:
      name = "Zora";
      break;
    case 84532:
      name = "Base Sepolia";
      break;
  }

  return name;
}
