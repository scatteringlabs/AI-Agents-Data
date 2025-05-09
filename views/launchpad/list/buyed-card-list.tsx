import { Box, Container, Skeleton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getProjectDetailsBatch, Project } from "../create/tokenService";
import { Text } from "../create/require-text";
import { useUserBalanceAndToken } from "@/services/graphql/user-tokens";
import { useMemo } from "react";
import BuyedCard from "./buyed-card";
import { TokenEntity, useAllTokenList } from "@/services/graphql/all-token";
import { NoDataSearched } from "@/components/search-not-found/no-data-searched";
import { usePrivy } from "@privy-io/react-auth";

export type TokenProject = TokenEntity & Project & { balance: string };

const BuyedCardList = () => {
  const { user } = usePrivy();
  const address = useMemo(() => user?.wallet?.address, [user]);

  const { data, isLoading: userLoading } = useUserBalanceAndToken(
    address as string,
  );
  const addrs = useMemo(
    () => data?.user?.members?.map((i) => i.token.id?.toLowerCase()) || [],
    [data],
  );

  const { data: projectDetails, isLoading: projectLoading } = useQuery({
    queryKey: ["projectDetails", addrs],
    queryFn: () => getProjectDetailsBatch(addrs),
  });

  const { data: all, isLoading: allLoading } = useAllTokenList();

  const combiData = useMemo(
    () =>
      projectDetails?.data?.map?.((p) => {
        const info = all?.tokenEntities?.find(
          (i) => i.addr?.toLowerCase() === p.token_address?.toLowerCase(),
        );
        const balance = data?.user?.members.find(
          (i) => i.token.id?.toLowerCase() === p.token_address?.toLowerCase(),
        )?.balance;
        return {
          ...p,
          ...info,
          balance,
        } as TokenProject;
      }),
    [projectDetails, all, data],
  );

  const isLoading = userLoading || projectLoading || allLoading;

  return (
    <Container maxWidth="lg" sx={{ minHeight: 200, overflowX: "scroll" }}>
      <Box sx={{ minWidth: 1000 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 2,
            padding: "20px",
            columnGap: 2,
          }}
        >
          <Text sx={{ width: "400px" }}>collection</Text>
          <Text sx={{ width: "200px", textAlign: "center" }}>Price</Text>
          <Text sx={{ width: "200px", textAlign: "center" }}>Quantity</Text>
          <Text sx={{ width: "200px", textAlign: "center" }}>value</Text>
          <Text sx={{ width: "200px", textAlign: "center" }}>operate</Text>
        </Box>

        {!combiData?.length && !isLoading ? (
          <NoDataSearched title="No Hybrids Held" />
        ) : null}

        {isLoading
          ? Array.from(new Array(5)).map((_, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  columnGap: 2,
                  padding: "10px 20px",
                  background: "rgba(255,255,255,0.05)",
                  alignItems: "center",
                  borderRadius: 1,
                  mb: 2,
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", width: "400px" }}
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
                </Box>

                <Skeleton
                  variant="rectangular"
                  width={200}
                  height={40}
                  sx={{ background: "#331f44" }}
                />
                <Skeleton
                  variant="rectangular"
                  width={200}
                  height={40}
                  sx={{ background: "#331f44" }}
                />
                <Skeleton
                  variant="rectangular"
                  width={200}
                  height={40}
                  sx={{ background: "#331f44" }}
                />
                <Skeleton
                  variant="rectangular"
                  width={200}
                  height={40}
                  sx={{ background: "#331f44" }}
                />
              </Box>
            ))
          : combiData?.map?.((p) => (
              <BuyedCard
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
              />
            ))}
      </Box>
    </Container>
  );
};

export default BuyedCardList;
