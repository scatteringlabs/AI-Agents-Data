import {
  getCollectionsOwned,
  getErc20CollectionsOwned,
  getZoraUsername,
} from "@/services/zora/portfolio";
import { Box, Grid, Skeleton, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import AvatarCard from "@/components/collections/avatar-card";
import { formatAddress } from "@/utils/format";
import CopyToClipboardButton from "@/components/button/CopyToClipboardButton";
import Link from "next/link";
import { SCAN_URL_ID } from "@/constants/url";
import PortfolioCard from "./components/PortfolioCard";
import PortfolioTabs from "./components/PortfolioTabs";
import NeedConnectCard from "@/components/need-connect-card";
import { useCreatedNftGrid } from "@/services/graphql/zora/created-list";
import CreatedCard from "./components/CreatedCard";
import { useCollectedNftGrid } from "@/services/graphql/zora/collected-list";
import CollectedCard from "./components/CollectedCard";
import { usePrivy } from "@privy-io/react-auth";

const Erc20zPortfolio = () => {
  const { user } = usePrivy();
  const address = useMemo(() => user?.wallet?.address, [user]);
  const [activeTab, setActiveTab] = useState("Tokens");
  const {
    data: collectionsOwnedDataERc20Z,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["getErc20CollectionsOwned", { address }],
    queryFn: () => getErc20CollectionsOwned(address?.toString() || ""),
    enabled: !!address,
  });
  const { data: collectionsOwnedData } = useQuery({
    queryKey: ["getCollectionsOwned", { address }],
    queryFn: () => getCollectionsOwned(address?.toString() || ""),
    enabled: !!address,
  });
  const { data: usernameData } = useQuery({
    queryKey: ["getZoraUsername", { address }],
    queryFn: () =>
      getZoraUsername({ data: { address: address?.toString() || "" } }),
    enabled: !!address,
  });
  const { data: createdNfts } = useCreatedNftGrid(address?.toString() || "");
  const { data: collectedNfts } = useCollectedNftGrid(
    address?.toString() || "",
  );

  const portfolioItems = useMemo(
    () =>
      collectionsOwnedData?.result?.data
        ? Object.entries(collectionsOwnedData.result.data)
        : undefined,
    [collectionsOwnedData],
  );
  const portfolioItemsErc20z = useMemo(
    () =>
      collectionsOwnedDataERc20Z?.result?.data
        ? Object.entries(collectionsOwnedDataERc20Z.result.data)
        : undefined,
    [collectionsOwnedDataERc20Z],
  );
  if (isLoading) {
    return (
      <Box mt={4}>
        {Array.from(new Array(5)).map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            width="100%"
            height={100}
            sx={{ mb: 2, background: "rgba(255,255,255,0.1)" }}
          />
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={4} textAlign="center">
        <h3>Error fetching portfolio data</h3>
      </Box>
    );
  }

  if (!address) {
    return (
      <Box mt={4} textAlign="center">
        <NeedConnectCard tips="Please connect your wallet to view your coins." />
      </Box>
    );
  }
  console.log("collectedNfts", collectedNfts);

  return (
    <Stack>
      <Stack
        sx={{ mb: 2, columnGap: 1 }}
        flexDirection="row"
        alignItems="center"
      >
        <AvatarCard
          hasLogo
          logoUrl={`https://zora.co/api/avatar/${address}`}
          symbol={"User"}
          showChain={false}
          size={60}
          mr={0}
        />
        <Box>
          {usernameData?.result?.data ? (
            <Typography variant="h4" sx={{ color: "white", pl: 1 }}>
              {usernameData?.result?.data || ""}
            </Typography>
          ) : null}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              columnGap: 1,
              mt: 0.6,
            }}
          >
            {" "}
            <Typography variant="h5" sx={{ color: "white", pl: 1 }}>
              {formatAddress(address)}
              <CopyToClipboardButton textToCopy={address?.toString() || ""} />
            </Typography>
            <Link href={`https://zora.co/${address}`} target="_blank">
              <Box
                component="img"
                src="/assets/images/tokens/zora-active.png"
              />
            </Link>
          </Box>
        </Box>
      </Stack>
      <PortfolioTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "NFTs" ? (
        <Grid mt={4} container columnSpacing={2}>
          {portfolioItems?.map(([key, item]) =>
            item?.amountOwned > 0 ? (
              <Grid item key={key} xs={12} sm={12} md={6} lg={4}>
                {" "}
                <PortfolioCard item={item} activeTab={activeTab} />
              </Grid>
            ) : null,
          )}
        </Grid>
      ) : null}
      {activeTab === "Tokens" ? (
        <Grid mt={4} container columnSpacing={2}>
          {portfolioItemsErc20z?.map(([key, item]) =>
            item?.amountOwned > 0 ? (
              <Grid item key={key} xs={12} sm={12} md={6} lg={4}>
                {" "}
                <PortfolioCard item={item} activeTab={activeTab} />
              </Grid>
            ) : null,
          )}
        </Grid>
      ) : null}
      {activeTab === "Created" ? (
        <Grid mt={4} container columnSpacing={2}>
          {createdNfts?.profile?.createdCollectionsOrTokens?.edges?.map(
            (item) => (
              <Grid
                item
                key={item?.node?.address}
                xs={12}
                sm={12}
                md={6}
                lg={4}
              >
                {" "}
                <CreatedCard item={item?.node} activeTab={activeTab} />
              </Grid>
            ),
          )}
        </Grid>
      ) : null}
      {/* {activeTab === "Created" ? (
        <Grid mt={4} container columnSpacing={2}>
          {collectedNfts?.profile?.collectedCollectionsOrTokens?.edges?.map(
            (item) => (
              <Grid
                item
                key={item?.node?.address}
                xs={12}
                sm={12}
                md={6}
                lg={4}
              >
                {" "}
                <CollectedCard item={item?.node} activeTab={activeTab} />
              </Grid>
            ),
          )}
        </Grid>
      ) : null} */}
    </Stack>
  );
};

export default Erc20zPortfolio;
