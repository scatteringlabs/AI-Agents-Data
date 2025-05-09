import { ButtonWrapper } from "./wrapper";
import { Token } from "@uniswap/sdk-core";
import { safeParseUnits } from "@/utils/format";
import { usePrivy, useSolanaWallets, useWallets } from "@privy-io/react-auth";
import { useMemo } from "react";
interface iButtonComfirm {
  quoteError: any;
  chainId: number;
  loading: boolean;
  swap: () => void;
  payToken: Token;
  payDebouncedValue: string;
  payTokenShowBalance: string;
  receiveToken: Token;
  type: "Buy" | "Sell";
}

export const ButtonComfirm = ({
  chainId,
  loading,
  swap,
  payToken,
  payDebouncedValue,
  payTokenShowBalance,
  receiveToken,
  type,
  quoteError,
}: iButtonComfirm) => {
  const { wallets } = useWallets();
  const wallet = useMemo(() => wallets[0], [wallets]);
  const currentChainId = useMemo(
    () => wallet?.chainId?.split(":")?.[1],
    [wallet],
  );

  const { user, login, logout, connectWallet } = usePrivy();
  const chainType = useMemo(() => user?.wallet?.chainType, [user]);
  const address = useMemo(() => wallets[0]?.address, [wallets]);
  const handleSwitch = async () => {
    try {
      const res = await connectWallet();
      console.log("res", res);
      setTimeout(() => login(), 300);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  // if (chainType === "solana") {
  //   return <ButtonWrapper onClick={handleSwitch}>Switch Wallet</ButtonWrapper>;
  // }
  if (!address) {
    return (
      <ButtonWrapper
        onClick={() => {
          connectWallet();
        }}
      >
        Connect Wallet
      </ButtonWrapper>
    );
  }

  if (quoteError?.message === "No quotes available") {
    return (
      <ButtonWrapper sx={{ opacity: 0.3, cursor: "default" }}>
        Insufficient liquidity for this trade.
      </ButtonWrapper>
    );
  }
  if (Number(currentChainId) !== chainId) {
    return (
      <ButtonWrapper
        sx={{}}
        onClick={() => wallet?.switchChain(`0x${chainId?.toString(16)}`)}
      >
        Switch network
      </ButtonWrapper>
    );
  }
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
        {type} {type === "Buy" ? receiveToken?.symbol : payToken?.symbol}
      </ButtonWrapper>
    );
  }
  if (
    safeParseUnits(payTokenShowBalance, payToken.decimals)?.lt(
      safeParseUnits(payDebouncedValue, payToken.decimals),
    )
  ) {
    return (
      <ButtonWrapper sx={{ opacity: 0.3, cursor: "default" }}>
        Insufficient {payToken.symbol} balance
      </ButtonWrapper>
    );
  }
  return (
    <ButtonWrapper onClick={swap}>
      {type} {type === "Buy" ? receiveToken?.symbol : payToken?.symbol}{" "}
      {/* {selectedChain === chainId ? "" : "(Bridge)"} */}
    </ButtonWrapper>
  );
};
