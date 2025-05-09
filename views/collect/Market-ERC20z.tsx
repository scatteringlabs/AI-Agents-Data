import { SecTitle, Title } from "@/components/text";
import { getCollectionDetail } from "@/services/collections-erc20z";
import { Box, Container, Grid, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Erc20zInfo from "./erc20z-info";
import Erc20ZTabInfo from "./erc20z-tab-info";
import { useMintComments } from "@/services/graphql/zora/comment";
import { useMintNodes } from "@/services/graphql/zora/mints";
import { ChainNameById } from "@/constants/chain";
import { fetchTokensDetails, TokenDetails } from "@/services/reservoir";
import { useSecondaryInfo } from "@/hooks/zora/use-secondary-info";
import { formatIntNumberWithKM } from "@/utils/format";

const Market1155 = () => {
  const router = useRouter();
  const [chain, setChain] = useState<string | undefined>();
  const [tokenAddress, setTokenAddress] = useState<string | undefined>();
  const [tokenId, setTokenId] = useState<number | undefined>();

  useEffect(() => {
    if (router.isReady) {
      const { chain, tokenAddress, tokenId, tab } = router.query;
      setChain(chain as string);
      setTokenAddress(tokenAddress as string);
      setTokenId(Number(tokenId));
    }
  }, [router.isReady, router.query]);
  const chainId = useMemo(() => (chain ? ChainNameById?.[chain] : 0), [chain]);
  const { data: collectionDetails, isLoading: detailsLoading } = useQuery({
    queryKey: ["collectionDetails", { tokenAddress, tokenId, chainId }],
    queryFn: () => {
      return getCollectionDetail({
        chain_id: chainId,
        mt_address: tokenAddress || "",
        token_id: tokenId || 0,
      });
    },
    enabled: Boolean(tokenId && tokenAddress && chainId),
  });

  const secondaryInfo = useSecondaryInfo(
    tokenAddress || "",
    BigInt(tokenId || 0),
  );
  console.log("collectionDetails", collectionDetails);

  const { data: tokenDetails } = useQuery<TokenDetails[]>({
    queryKey: ["tokenDetails", tokenAddress],
    queryFn: () => {
      return fetchTokensDetails(
        `${tokenAddress}:${tokenId}`,
        Number(tokenId) || 1,
      );
    },
    enabled: Boolean(tokenAddress),
  });

  const { data: mintData } = useMintNodes(
    tokenAddress || "",
    tokenId?.toString() || "",
    chain?.toUpperCase(),
    `${chain?.toUpperCase()}_MAINNET`,
  );
  const mintList = useMemo(() => {
    return mintData?.mints?.nodes.slice(0, 100);
  }, [mintData]);

  const { data: commentData } = useMintComments(
    tokenAddress || "",
    tokenId?.toString() || "",
    chain?.toUpperCase(),
    `${chain?.toUpperCase()}_MAINNET`,
  );
  const commentList = useMemo(() => {
    return commentData?.mintComments?.comments.slice(0, 100);
  }, [commentData]);
  const tokenInfo = useMemo(
    () => collectionDetails?.data?.item,
    [collectionDetails],
  );

  return (
    <Container sx={{ py: 6 }}>
      <Grid container spacing={2} rowGap={2}>
        <Grid sm={12} md={6}>
          <Stack
            sx={{
              width: 560,
              height: 560,
              border: "1px solid rgba(255, 255, 255, 0.10)",
              position: "sticky",
              top: "170px",
              borderRadius: 2,
            }}
          >
            <Box
              component="img"
              src={
                tokenInfo?.logo_url ||
                tokenDetails?.[0]?.token?.collection?.image
              }
              sx={{ objectFit: "contain", width: "100%", height: "100%" }}
            />
          </Stack>
        </Grid>
        <Grid sm={12} md={6}>
          <Stack flexDirection="row" alignItems="center" columnGap={2}>
            <Title>{tokenInfo?.symbol}</Title>
            <SecTitle>{tokenInfo?.name}</SecTitle>
          </Stack>
          <Erc20zInfo
            tokenAddress={tokenAddress || ""}
            tokenId={tokenId?.toString() || ""}
            creator={collectionDetails?.data?.item?.creator || ""}
            createdTimestamp={
              collectionDetails?.data?.item?.launch_timestamp || 0
            }
            mintsCount={formatIntNumberWithKM(
              collectionDetails?.data?.item?.total_mints || 0,
            )}
          />
          <Erc20ZTabInfo
            mintList={mintList}
            commentList={commentList}
            mintsCount={formatIntNumberWithKM(
              collectionDetails?.data?.item?.total_mints || 0,
            )}
            commentsCount={commentData?.mintComments?.comments?.length || 0}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Market1155;
