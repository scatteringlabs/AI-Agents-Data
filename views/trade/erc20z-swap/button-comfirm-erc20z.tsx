import { useChainId, useConnect, useSwitchChain } from "wagmi";
import CustomConnectButton from "@/components/layout/header/CustomConnectButton";
import { Token } from "@uniswap/sdk-core";
import { injected } from "wagmi/connectors";
import { BigNumber, ethers } from "ethers";
import { safeParseUnits } from "@/utils/format";
import { ButtonWrapper } from "../swap/wrapper";
import { CollectionDetailsErc20z } from "@/types/collection";
import { BatchBalanceResult } from "@/services/zora/swap/balance";
import { ModeType } from "./swap-card";
import { usePrivy } from "@privy-io/react-auth";
import { useMemo } from "react";
interface iButtonComfirm {
  collectionDetails?: CollectionDetailsErc20z;
  // quoteError: any;
  // chainId: number;
  // loading: boolean;
  // swap: () => void;
  // payToken: Token;
  payDebouncedValue: string;
  // payTokenShowBalance: string;
  // receiveToken: Token;
  batchBalance?: BatchBalanceResult;
  type: "Buy" | "Sell";
  mode: ModeType;
  clickFun?: () => (() => void) | undefined;
}

export const ButtonComfirmErc20z = ({
  batchBalance,
  collectionDetails,
  type,
  payDebouncedValue,
  clickFun,
  mode,
}: iButtonComfirm) => {
  const currentChainId = useChainId();
  const { user, login } = usePrivy();
  const address = useMemo(() => user?.wallet?.address, [user]);
  const { switchChain } = useSwitchChain();
  // const { connect } = useConnect();
  if (!address) {
    return (
      <ButtonWrapper
        onClick={() => {
          login();
        }}
      >
        Connect Wallet
      </ButtonWrapper>
    );
  }

  // if (quoteError?.message === "No quotes available") {
  //   return (
  //     <ButtonWrapper sx={{ opacity: 0.3, cursor: "default" }}>
  //       Insufficient liquidity for this trade.
  //     </ButtonWrapper>
  //   );
  // }
  if (
    currentChainId !== collectionDetails?.chain_id &&
    collectionDetails?.chain_id
  ) {
    return (
      <ButtonWrapper
        sx={{}}
        onClick={() => {
          switchChain({ chainId: collectionDetails?.chain_id });
        }}
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
  // if (loading) {
  //   return (
  //     <ButtonWrapper sx={{ opacity: 0.3, cursor: "default" }}>
  //       {type} {type === "Buy" ? receiveToken?.symbol : payToken?.symbol}
  //     </ButtonWrapper>
  //   );
  // }
  if (
    safeParseUnits(batchBalance?.ethBalance || "0", 18)?.lt(
      safeParseUnits(
        ethers.utils
          .parseUnits(payDebouncedValue?.toString() || "0", 18)
          ?.toString(),
        18,
      ),
    ) &&
    type === "Buy" &&
    mode === "Token"
  ) {
    return (
      <ButtonWrapper sx={{ opacity: 0.3, cursor: "default" }}>
        Insufficient ETH balance
      </ButtonWrapper>
    );
  }
  if (
    safeParseUnits(batchBalance?.ethBalance || "0", 18)?.lt(
      safeParseUnits(
        ethers.utils
          .parseUnits(payDebouncedValue?.toString() || "0", 18)
          ?.toString(),
        18,
      ),
    ) &&
    type === "Buy" &&
    mode === "NFT"
  ) {
    return (
      <ButtonWrapper sx={{ opacity: 0.3, cursor: "default" }}>
        Insufficient ETH balance
      </ButtonWrapper>
    );
  }
  if (
    safeParseUnits(batchBalance?.erc20Balance || "0", 18)?.lt(
      safeParseUnits(
        ethers.utils
          .parseUnits(payDebouncedValue?.toString() || "0", 18)
          ?.toString(),
        18,
      ),
    ) &&
    type === "Sell" &&
    mode === "Token"
  ) {
    return (
      <ButtonWrapper sx={{ opacity: 0.3, cursor: "default" }}>
        Insufficient {collectionDetails?.symbol} balance
      </ButtonWrapper>
    );
  }
  if (
    Number(batchBalance?.erc1155Balance) < Number(payDebouncedValue) &&
    type === "Sell" &&
    mode === "NFT"
  ) {
    return (
      <ButtonWrapper sx={{ opacity: 0.3, cursor: "default" }}>
        Insufficient {collectionDetails?.symbol} balance
      </ButtonWrapper>
    );
  }
  return (
    <ButtonWrapper
      onClick={() => {
        clickFun?.()?.();
      }}
    >
      {type} {collectionDetails?.symbol}
    </ButtonWrapper>
  );
};
