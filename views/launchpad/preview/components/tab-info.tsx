import { Box, Grid } from "@mui/material";
import InfoTab from "../info-tab";
import { PreviewDesc, PreviewTitle } from "../../create/require-text";
import TradesTable from "@/views/trade/trades-table";
import { geckoNetworkName, getETHPrice } from "@/services/tokens";
import { base } from "viem/chains";
import HolderTable from "@/views/trade/okx-stat/position-table";
import Market from "@/views/collect/Market";
import WalletPage from "@/views/trade/evm/wallet/WalletPage";
import { useQuery } from "@tanstack/react-query";
import { getCollectionBySlug } from "@/services/collections";
import { useEffect, useMemo, useState } from "react";
import SwapTxTable from "./swap-txs-table";
import { BaseSID } from "../../create/tokenService";
import MembersTable from "./top-holder";
import { TokenEntity } from "@/services/graphql/all-token";
import LMarket from "@/views/collect/L-Market";
import LWalletPage from "@/views/trade/evm/wallet/L-WalletPage";
import { WETH_ADDRESS } from "@uniswap/universal-router-sdk";
import { fetchTokenPrices, TokenPrices } from "@/services/gecko";
import { getErc721TotalSupply } from "@/services/launchpad/claim";
import { BigNumber, ethers } from "ethers";

const slug = "colorpepe";

const TabInfo = ({
  overview,
  teamInfo,
  tokenAddress,
  price,
  tokenSymbol,
  info,
  refetchTrigger,
  level,
}: {
  teamInfo?: string;
  overview?: string;
  tokenAddress?: string;
  price?: string;
  tokenSymbol?: string;
  info?: TokenEntity;
  refetchTrigger?: number;
  level: number;
}) => {
  const { data } = useQuery({
    queryKey: ["getETHPrice"],
    queryFn: () => getETHPrice(),
  });

  const ethPrice = useMemo(() => data?.data?.eth_usd || 0, [data]);
  const [activeTab, setActiveTab] = useState<
    "trade" | "holder" | "overview" | "wallet" | "nft"
  >("trade");
  // const { data: collectionDetails, isLoading: detailsLoading } = useQuery({
  //   queryKey: ["getCollectionBySlug"],
  //   queryFn: () =>
  //     getCollectionBySlug({
  //       slug,
  //     }),
  // });
  const showOverView = useMemo(
    () => Boolean(teamInfo || overview),
    [teamInfo, overview],
  );
  // useEffect(() => {
  //   if (showOverView) {
  //     setActiveTab("trade");
  //   }
  // }, [showOverView]);
  const { creator, tokenVault } = info || {};
  const currentPriceUSD = useMemo(() => {
    if (!info?.currentPrice) {
      return "0";
    }

    // 将小数截取到最多18位
    let currentPriceStr = info.currentPrice.toString();
    if (currentPriceStr.includes(".")) {
      const [integerPart, fractionalPart] = currentPriceStr.split(".");
      currentPriceStr =
        fractionalPart.length > 18
          ? `${integerPart}.${fractionalPart.slice(0, 18)}`
          : currentPriceStr;
    }

    const factor = BigNumber.from("1000000000000000000");
    const num = BigNumber.from(ethers.utils.parseUnits(currentPriceStr, 18)); // 将截取后的小数部分转为整数形式
    const multiplier = BigNumber.from(
      ethers.utils.parseUnits(ethPrice?.toString(), 18),
    );

    return ethers.utils.formatEther(
      num.mul(multiplier).div(factor)?.toString(),
    );
  }, [info?.currentPrice, ethPrice]);

  return (
    <>
      <Grid item xs={12} sx={{ pb: 4 }}>
        <InfoTab
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          showOverView={showOverView}
          level={level}
          nftMinted={Number(info?.erc721TotalSupply || "0")}
        />
        {activeTab === "overview" ? (
          <>
            {overview ? (
              <Box
                sx={{
                  backgroundColor: "#171525",
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 255, 255, 0.10)",
                }}
              >
                <PreviewTitle sx={{ pl: 2, pt: 2 }}>
                  Collection story
                </PreviewTitle>
                <PreviewDesc sx={{ p: 2 }}>{overview}</PreviewDesc>
              </Box>
            ) : null}
            {teamInfo ? (
              <Box
                sx={{
                  backgroundColor: "#171525",
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 255, 255, 0.10)",
                  mt: 2,
                }}
              >
                <PreviewTitle sx={{ pl: 2, pt: 2 }}>NFT Info</PreviewTitle>
                <PreviewDesc sx={{ p: 2 }}>{teamInfo}</PreviewDesc>
              </Box>
            ) : null}
          </>
        ) : null}

        {activeTab === "holder" ? (
          <MembersTable
            activeTab="holder"
            address={tokenAddress}
            chainId={base.id}
            total={"1000000000"}
            price={price || ""}
            tokenVault={tokenVault || ""}
            creator={creator || ""}
            show={activeTab === "holder"}
          />
        ) : null}
        {activeTab === "trade" ? (
          <SwapTxTable
            tokenAddress={tokenAddress}
            chainId={BaseSID}
            tokenSymbol={tokenSymbol}
          />
        ) : null}
        {activeTab === "nft" ? (
          <Box sx={{ height: 500, overflowY: "auto" }}>
            <LMarket info={info} />
          </Box>
        ) : null}
        {activeTab === "wallet" ? (
          <LWalletPage
            tokenAddress={tokenAddress}
            priceUSD={currentPriceUSD}
            refetchTrigger={refetchTrigger}
          />
        ) : null}
      </Grid>
    </>
  );
};

export default TabInfo;
