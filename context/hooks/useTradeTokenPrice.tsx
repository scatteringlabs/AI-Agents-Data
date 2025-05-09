import { useContext } from "react";
import { TokenPriceContext } from "../token-price-provider";

export function useTradeTokenPrice() {
  const context = useContext(TokenPriceContext);

  if (!context) {
    throw new Error("useToken must be used within a TokenProvider");
  }

  return context;
}
