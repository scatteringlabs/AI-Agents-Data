import { Token } from "@uniswap/sdk-core";
import React, { useState, ReactNode } from "react";

interface TokenContextValue {
  activeToken: Token;
  setActiveToken: (token: Token) => void;
}

export const TokenContext = React.createContext<TokenContextValue | null>(null);

interface TokenProviderProps {
  initialToken: Token;
  children: ReactNode;
}

const TokenProvider: React.FC<TokenProviderProps> = ({
  children,
  initialToken,
}) => {
  const [activeToken, setActiveToken] = useState<Token>(initialToken);

  return (
    <TokenContext.Provider value={{ activeToken, setActiveToken }}>
      {children}
    </TokenContext.Provider>
  );
};

export default TokenProvider;
