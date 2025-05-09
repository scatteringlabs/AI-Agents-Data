import { useContext } from "react";
import { TokenContext } from "../token-provider";

export function useActiveToken() {
  const context = useContext(TokenContext);

  if (!context) {
    throw new Error("useToken must be used within a TokenProvider");
  }

  return context;
}
