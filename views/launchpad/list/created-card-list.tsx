import { Box, Container, Skeleton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { BaseSID, getProjectList, Project } from "../create/tokenService";
import { Text } from "../create/require-text";
import CreatedCard from "./created-card";
import { TokenEntity, useTokenEntities } from "@/services/graphql/token";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getUnclaimedFeesBatch } from "@/services/launchpad/claim";
import { formatWeiFixed } from "@/utils/format";
import { ethers } from "ethers";
import UploadNFTDialog from "../UploadNFTDialog";
import MediaUpdateDialog from "../update-media-dialog";
import { NoDataSearched } from "@/components/search-not-found/no-data-searched";
import { usePrivy } from "@privy-io/react-auth";

const WETH_ADDRESS = "0x4200000000000000000000000000000000000006";

type FeeInfo = { tokenFee: string; ethFee: string; tokenAddress: string };

export type CreatedTokenProject = TokenEntity & Project & FeeInfo;

const CreatedCardList = () => {
  const [open, setOpen] = useState(false);
  const [openMedia, setOpenMedia] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<CreatedTokenProject>();
  const { user } = usePrivy();
  const address = useMemo(() => user?.wallet?.address, [user]);
  const {
    data: tokens,
    isLoading: tokensLoading,
    refetch,
  } = useTokenEntities(address as string);
  const [lpFeeList, setLpFeeList] = useState<FeeInfo[]>([]);
  const {
    data: projects,
    isLoading: projectsLoading,
    refetch: refetchList,
  } = useQuery({
    queryKey: ["projects-created", address],
    queryFn: () =>
      getProjectList({
        status: 2,
        wallet_address: address as string,
        chain_id: BaseSID,
      }),
    enabled: Boolean(address),
  });

  const combiData = useMemo(
    () =>
      tokens?.tokenEntities?.map?.((t) => {
        const p = projects?.data?.find(
          (p) => t.addr?.toLowerCase() === p.token_address?.toLowerCase(),
        );
        const fee = lpFeeList?.find(
          (i) => i.tokenAddress?.toLowerCase() === t.addr?.toLowerCase(),
        );
        return {
          ...p,
          ...t,
          ...fee,
        } as CreatedTokenProject;
      }),
    [projects, tokens, lpFeeList],
  );

  const isLoading = tokensLoading || projectsLoading;

  const getLPFee = useCallback(() => {
    console.log("getLPFee");

    if (tokens?.tokenEntities?.length && address) {
      const ts = tokens?.tokenEntities
        ?.filter((i) => i.positionId !== "0")
        ?.map((i) => i.addr);

      getUnclaimedFeesBatch({ tokens: ts }).then((res: any) => {
        console.log("getUnclaimedFeesBatch", res);

        const lpFeeListTemp = res?.map(
          ({ token0, token1, token1Amount, token0Amount }: any) => {
            const tokenAddress =
              token0?.toLowerCase() === WETH_ADDRESS ? token1 : token0;
            const tokenFee =
              token0?.toLowerCase() === WETH_ADDRESS
                ? token1Amount.mul(95).div(100)
                : token0Amount.mul(95).div(100);

            const ethFee =
              token0?.toLowerCase() === WETH_ADDRESS
                ? token0Amount.mul(95).div(100)
                : token1Amount.mul(95).div(100);
            return {
              tokenFee: ethers.utils.formatUnits(tokenFee, 18),
              ethFee: ethers.utils.formatUnits(ethFee, 18),
              tokenAddress,
            };
          },
        );
        console.log("lpFeeListTemp", lpFeeListTemp);

        setLpFeeList(lpFeeListTemp);
      });
    }
  }, [tokens, address]);

  useEffect(() => {
    getLPFee();
  }, [getLPFee, tokens, address]);

  const handleFetch = useCallback(() => {
    refetch();
    refetchList();
    setTimeout(() => {
      getLPFee();
    }, 3000);
    setTimeout(() => {
      getLPFee();
    }, 10000);
    setTimeout(() => {
      getLPFee();
    }, 15000);
  }, [refetch, getLPFee, refetchList]);

  return (
    <Container maxWidth="xl" sx={{ minHeight: 200, overflowX: "scroll" }}>
      <Box sx={{ minWidth: 1440 }}>
        {" "}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 2,
            padding: "20px",
            columnGap: 2,
          }}
        >
          <Text sx={{ width: "100%" }}>collection</Text>
          <Text sx={{ width: "500px", textAlign: "right" }}>
            Swap Fee Revenue(60%)
          </Text>
          <Text sx={{ width: "800px", textAlign: "right" }}>
            LP Fee Split(95%)
          </Text>
          <Text sx={{ width: "500px", textAlign: "right" }}>
            Raised Liquidity Split(10%)
          </Text>
          <Text sx={{ width: "300px", textAlign: "right" }}>NFT Metadata</Text>
        </Box>
        {!combiData?.length && !isLoading ? (
          <NoDataSearched title="No Hybrids Created" />
        ) : null}
        {isLoading
          ? // 显示骨架屏
            Array.from(new Array(5)).map((_, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 20px",
                  columnGap: 2,
                  background: "rgba(255,255,255,0.05)",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", width: "100%" }}
                >
                  <Skeleton
                    variant="circular"
                    width={60}
                    height={60}
                    sx={{ background: "#331f44" }}
                  />
                  <Box sx={{ ml: 2 }}>
                    <Skeleton
                      variant="rectangular"
                      width={100}
                      height={20}
                      sx={{ background: "#331f44" }}
                    />
                    <Skeleton
                      variant="rectangular"
                      width={60}
                      height={20}
                      sx={{ background: "#331f44", mt: 2 }}
                    />
                  </Box>
                  <Skeleton
                    variant="rectangular"
                    width={80}
                    height={30}
                    sx={{ background: "#331f44", ml: 2 }}
                  />
                  <Skeleton
                    variant="circular"
                    width={20}
                    height={20}
                    sx={{ background: "#331f44", ml: 3 }}
                  />
                  <Skeleton
                    variant="circular"
                    width={20}
                    height={20}
                    sx={{ background: "#331f44", ml: 1 }}
                  />
                  <Skeleton
                    variant="circular"
                    width={20}
                    height={20}
                    sx={{ background: "#331f44", ml: 1 }}
                  />
                  <Skeleton
                    variant="circular"
                    width={20}
                    height={20}
                    sx={{ background: "#331f44", ml: 1 }}
                  />
                </Box>
                <Skeleton
                  variant="rectangular"
                  width={400}
                  height={40}
                  sx={{ background: "#331f44" }}
                />
                <Skeleton
                  variant="rectangular"
                  width={400}
                  height={40}
                  sx={{ background: "#331f44" }}
                />
                <Skeleton
                  variant="rectangular"
                  width={400}
                  height={40}
                  sx={{ background: "#331f44" }}
                />
                <Skeleton
                  variant="rectangular"
                  width={300}
                  height={40}
                  sx={{ background: "#331f44" }}
                />
              </Box>
            ))
          : combiData?.map?.((p) => (
              <CreatedCard
                key={p.addr}
                id={p.addr}
                logoUrl={
                  p.collection_logo
                    ? `https://dme30nyhp1pym.cloudfront.net/assets/${p.collection_logo}`
                    : ""
                }
                name={p.name}
                symbol={p.symbol}
                tag="Hybrid Meme"
                project={p}
                refetch={handleFetch}
                setUpdateInfo={setUpdateInfo}
                setOpen={setOpen}
                setOpenMedia={setOpenMedia}
              />
            ))}
      </Box>
      <UploadNFTDialog
        open={open}
        setOpen={setOpen}
        updateInfo={updateInfo}
        refetch={handleFetch}
      />
      <MediaUpdateDialog
        open={openMedia}
        setOpen={setOpenMedia}
        tokenAddress={updateInfo?.addr || ""}
        chainId={BaseSID}
        updateInfo={updateInfo}
        refetch={handleFetch}
      />
    </Container>
  );
};

export default CreatedCardList;
