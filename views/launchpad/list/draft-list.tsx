import { Box, Container, Skeleton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { BaseSID, getProjectList } from "../create/tokenService";
import { Text } from "../create/require-text";
import DraftCard from "./draft-card";
import { NoDataSearched } from "@/components/search-not-found/no-data-searched";
import { usePrivy } from "@privy-io/react-auth";
import { useMemo } from "react";

const DraftList = () => {
  const { user } = usePrivy();
  const address = useMemo(() => user?.wallet?.address, [user]);
  const { data: projects, isLoading } = useQuery({
    queryKey: ["draft-projects", address],
    queryFn: () =>
      getProjectList({
        status: 1,
        wallet_address: address as string,
        chain_id: BaseSID,
      }),
    enabled: address?.toString() !== "",
  });

  return (
    <Container maxWidth="md" sx={{ minHeight: 200, overflowX: "scroll" }}>
      <Box sx={{ minWidth: 600 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 2,
            padding: "20px",
          }}
        >
          <Text>collection</Text>
          <Text>operate</Text>
        </Box>

        {!projects?.data?.length && !isLoading ? (
          <NoDataSearched title="No Draft" />
        ) : null}
        {isLoading
          ? // 显示骨架屏
            Array.from(new Array(3)).map((_, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 20px",
                  background: "rgba(255,255,255,0.05)",
                  alignItems: "center",
                  borderRadius: 1,
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
                </Box>
                <Skeleton
                  variant="rectangular"
                  width={200}
                  height={40}
                  sx={{ background: "#331f44" }}
                />
              </Box>
            ))
          : projects?.data?.map?.((p) => (
              <DraftCard
                key={p.uuid}
                id={p.uuid}
                logoUrl={`https://dme30nyhp1pym.cloudfront.net/assets/${p.collection_logo}`}
                name={p.collection_name}
                symbol={p.token_symbol}
                tag="Hybrid Meme"
              />
            ))}
      </Box>
    </Container>
  );
};

export default DraftList;
