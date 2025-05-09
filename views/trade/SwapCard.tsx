import { Box, Card, CardHeader } from "@mui/material";
import Tabs from "@/components/tabs/Tabs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChainId, Token } from "@uniswap/sdk-core";
import { zeroAddress } from "viem";
import TokenProvider from "../../context/token-provider";
import { useRouter } from "next/router";
import { BaseTokenById, ChainNameById } from "@/constants/chain";
import Preloader from "@/components/elements/Preloader";
import { useQuery } from "@tanstack/react-query";
import { getCollections } from "@/services/collections";
import TokenCard from "./swap/token-card";
import TokenCardOkx from "./swap/token-card-okx";
import TypeTab from "./type-tab";
import { BatchBalanceResult } from "@/services/zora/swap/balance";
import { useBatchBalanceQuery } from "@/services/zora/swap/balance404";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { ethers } from "ethers";
import { formatWeiToToken } from "./erc20z-swap/swap-card";
import { AlchemyRpcUrl } from "@/configs/chain";
const tabs = ["Buy", "Sell"];
export type TabType = "Buy" | "Sell";
interface iSwapCard {
  symbol?: string;
  erc20Address: string;
  logoUrl?: string;
  decimals: number;
  chainId: number;
  hasLogo: boolean;
}
function SwapCard({
  symbol,
  decimals,
  erc20Address,
  hasLogo,
  logoUrl,
  chainId,
}: iSwapCard) {
  const [activeTab, setActiveTab] = useState<TabType>("Buy");
  const [initFlag, setInitFlag] = useState<boolean>(false);
  const { wallets } = useWallets();
  const wallet = useMemo(() => wallets?.[0], [wallets]);
  const { user } = usePrivy();
  const address = useMemo(() => user?.wallet?.address, [user]);

  const erc404Token = useMemo(
    () =>
      chainId &&
      erc20Address &&
      new Token(chainId, erc20Address?.toString(), decimals, symbol, symbol),
    [erc20Address, chainId, symbol, decimals],
  );

  const baseTokens = useMemo(
    () => chainId && BaseTokenById?.[chainId],
    [chainId],
  );
  const {
    data: batchBalance,
    isLoading,
    error,
    refetch: refectBalance,
  } = useBatchBalanceQuery({
    userAddress: address || "",
    erc20Address: erc20Address || "",
    chainId: chainId || 0,
  });

  useEffect(() => {
    if (initFlag) {
      refectBalance();
    }
  }, [initFlag, refectBalance]);

  if (!(baseTokens && erc404Token)) {
    return <Preloader />;
  }
  return (
    <Card
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        color: "white",
      }}
    >
      <TypeTab
        decimals={decimals}
        mode={activeTab}
        setMode={(val) => {
          setActiveTab(val as TabType);
          setInitFlag(true);
        }}
        batchBalance={batchBalance}
      />
      {/* <CardHeader
        title={
          <Tabs
            widthFull
            items={tabs}
            onChange={(val) => {
              setActiveTab(val as TabType);
              setInitFlag(true);
            }}
          />
        }
      /> */}
      <TokenProvider initialToken={baseTokens?.[0]}>
        <TokenCardOkx
          baseTokens={baseTokens || []}
          erc20Address={erc20Address || ""}
          hasLogo={hasLogo}
          logoUrl={logoUrl}
          type={activeTab}
          chainId={chainId}
          initFlag={initFlag}
          setInitFlag={setInitFlag}
          currentToken={erc404Token}
          symbol={symbol || ""}
          batchBalance={batchBalance}
        />
      </TokenProvider>
    </Card>
  );
}

export default SwapCard;
