import { Box } from "@mui/material";
import MbCollectionInfo from "@/views/collect/MbCollectionInfo";
import CollectTabs from "@/components/tabs/CollectTabs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCollectionDetail } from "@/services/collections-erc20z";
import CollectionInfoERC20Z from "@/views/collect/CollectionInfoERC20Z";
import Market1155 from "@/views/collect/Market-ERC20z";
import TradePageErc20z from "./trade-page-erc20z";
import { ChainNameById } from "@/constants/chain";
import TradeIFrame from "./trade-page-iframe";
import MbCollectionInfoZRC20Z from "../collect/MbCollectionInfo_ZRC20Z";
import CollectTabsErc20Z from "@/components/tabs/CollectTabsErc20Z";

const tabs = ["trade", "nfts"];
export default function TradePage() {
  const router = useRouter();
  const [tab, setTab] = useState<string | undefined>();
  const [chain, setChain] = useState<string | undefined>();
  const [tokenAddress, setTokenAddress] = useState<string | undefined>();
  const [tokenId, setTokenId] = useState<number | undefined>();

  useEffect(() => {
    if (router.isReady) {
      const { chain, tokenAddress, tokenId, tab } = router.query;
      setChain(chain as string);
      setTokenAddress(tokenAddress as string);
      setTokenId(Number(tokenId));
      setTab(tab as string);
    }
  }, [router.isReady, router.query]);

  const [activeTab, setActiveTab] = useState<string>(tab || "trade");
  const { data: collectionDetails, isLoading: detailsLoading } = useQuery({
    queryKey: ["collectionDetails", { tokenAddress, tokenId, chain }],
    queryFn: () => {
      return getCollectionDetail({
        chain_id: ChainNameById?.[chain || "base"],
        mt_address: tokenAddress || "",
        token_id: tokenId || 0,
      });
    },
    enabled: Boolean(tokenId && tokenAddress),
  });

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    let newUrl = "";
    if (newTab !== "trade") {
      newUrl = `/collect/${chain}/${tokenAddress}/${tokenId}/${newTab}`;
    } else {
      newUrl = `/collect/${chain}/${tokenAddress}/${tokenId}`;
    }
    router.push(newUrl);
  };
  useEffect(() => {
    if (router?.query?.tab) {
      setActiveTab(router.query.tab?.toString());
    } else {
      setActiveTab("trade");
    }
  }, [router?.query?.tab]);
  return (
    <>
      <CollectionInfoERC20Z
        slugLoading={false}
        handleOpenDialog={() => {}}
        collectionDetails={collectionDetails?.data?.item}
      />
      <MbCollectionInfoZRC20Z
        slugLoading={false}
        handleOpenDialog={() => {}}
        collectionDetails={collectionDetails?.data?.item}
      />
      <Box
        sx={{
          position: "sticky",
          top: { md: "60px", xs: "60px" },
          zIndex: 8,
          backgroundColor: "#010410",
          pt: 1,
          pb: "32px",
        }}
      >
        <Box sx={{ display: "flex", width: "100%", mt: { md: 2, xs: 1 } }}>
          <Box sx={{ flexFlow: 1, width: { md: "100%", xs: "auto" } }}>
            <CollectTabsErc20Z
              activeTab={activeTab}
              items={tabs}
              onChange={handleTabChange}
            />
          </Box>
        </Box>
      </Box>
      {/* {activeTab === "trade" &&
      Number(collectionDetails?.data?.item?.chain_id) === ChainId.BASE ? (
        <TradePageErc20z collectionDetails={collectionDetails?.data?.item} />
      ) : null} */}
      {/* {activeTab === "trade" &&
      Number(collectionDetails?.data?.item?.chain_id) === ChainId.ZORA ? (
        <TradeIFrame collectionDetails={collectionDetails?.data?.item} />
      ) : null} */}

      {activeTab === "trade" ? (
        <TradeIFrame collectionDetails={collectionDetails?.data?.item} />
      ) : null}
      {activeTab === "nfts" ? <Market1155 /> : null}
    </>
  );
}
