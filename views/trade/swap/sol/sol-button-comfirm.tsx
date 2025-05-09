import { ButtonWrapper } from "../wrapper";
import { safeParseUnits } from "@/utils/format";
import { usePrivy, useSolanaWallets } from "@privy-io/react-auth";
import { useMemo } from "react";
interface iButtonComfirm {
  quoteError: Error | null;
  chainId: number;
  loading: boolean;
  swap: () => void;
  // payToken: Token;
  payDebouncedValue: string;
  payTokenShowBalance: string;
  symbol: string;
  paySymbol: string;
  // receiveToken: Token;
  type: "Buy" | "Sell";
}

export const SolButtonComfirm = ({
  chainId,
  loading,
  swap,
  // payToken,
  payDebouncedValue,
  payTokenShowBalance,
  // receiveToken,
  type,
  symbol,
  paySymbol,
  quoteError,
}: iButtonComfirm) => {
  const { ready, authenticated, user, logout, login, connectWallet } =
    usePrivy();
  const { wallets: solanaWallets } = useSolanaWallets();
  const address = useMemo(() => solanaWallets?.[0]?.address, [solanaWallets]);
  if (!address) {
    return (
      <ButtonWrapper
        onClick={() => {
          connectWallet({ walletList: ["phantom"] });
        }}
      >
        Connect Wallet
      </ButtonWrapper>
    );
  }
  if (quoteError?.message === "Could not find any route") {
    return (
      <ButtonWrapper sx={{ opacity: 0.3, cursor: "default" }}>
        Could not find any route
      </ButtonWrapper>
    );
  }
  // if (currentChainId !== chainId) {
  //   return (
  //     <ButtonWrapper sx={{}} onClick={() => switchChain({ chainId })}>
  //       Switch network
  //     </ButtonWrapper>
  //   );
  // }
  if (!Number(payDebouncedValue)) {
    return (
      <ButtonWrapper sx={{ opacity: 0.3, cursor: "default" }}>
        Enter an amount
      </ButtonWrapper>
    );
  }
  if (loading) {
    return (
      <ButtonWrapper sx={{ opacity: 0.3, cursor: "default" }}>
        {type} {symbol}
      </ButtonWrapper>
    );
  }
  if (
    safeParseUnits(payTokenShowBalance, 9)?.lt(
      safeParseUnits(payDebouncedValue, 9),
    )
  ) {
    return (
      <ButtonWrapper sx={{ opacity: 0.3, cursor: "default" }}>
        Insufficient {paySymbol} balance
      </ButtonWrapper>
    );
  }
  return (
    <ButtonWrapper onClick={swap}>
      {type} {symbol}
    </ButtonWrapper>
  );
};
