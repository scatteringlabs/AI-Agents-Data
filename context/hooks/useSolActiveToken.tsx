import { useContext } from "react";
import { TokenContext } from "../sol-token-provider";

export function useSolActiveToken() {
  const context = useContext(TokenContext);

  if (!context) {
    throw new Error("useToken must be used within a TokenProvider");
  }

  return context;
}
