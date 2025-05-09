import { Token } from "@uniswap/sdk-core";
import React, { useState, ReactNode } from "react";

interface TokenPriceContextValue {
  currency: string;
  tokenPrice: string;
  setTokenPrice: (a: string) => void;
  setCurrency: (a: string) => void;
}

export const TokenPriceContext =
  React.createContext<TokenPriceContextValue | null>(null);

interface TokenPriceProviderProps {
  children: ReactNode;
}

const TokenPriceProvider: React.FC<TokenPriceProviderProps> = ({
  children,
}) => {
  const [tokenPrice, setTokenPrice] = useState<string>("");
  const [currency, setCurrency] = useState<string>("usd");

  return (
    <TokenPriceContext.Provider
      value={{ tokenPrice, setTokenPrice, currency, setCurrency }}
    >
      {children}
    </TokenPriceContext.Provider>
  );
};

export default TokenPriceProvider;
