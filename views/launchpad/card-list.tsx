import { Box, Grid, Skeleton, Typography } from "@mui/material";
import LCard from "./list/l-card";
import { useAllTokenList } from "@/services/graphql/all-token";
import { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getProjectDetailsBatch, ProjectData } from "./create/tokenService";
import Link from "next/link";

export const getProgress = (current: string, state: number) => {
  if (state === 1) {
    return 100;
  }
  const progress = Math.floor((Number(current) / 800000000) * 100 * 100) / 100;
  return progress;
};

const CardList = () => {
  const { data, isLoading: tLoading } = useAllTokenList();
  const addrs = useMemo(
    () => data?.tokenEntities?.map((i) => i.addr?.toLowerCase()) || [],
    [data],
  );
  const { data: projectDetails, isLoading } = useQuery({
    queryKey: ["explore"],
    queryFn: () => getProjectDetailsBatch(addrs),
    enabled: Boolean(addrs?.length),
  });

  // const combiData = useMemo(
  //   () =>
  //     data?.tokenEntities?.map?.((p) => {
  //       const info = projectDetails?.data?.find?.(
  //         (i) => i?.token_address?.toLowerCase() === p?.addr?.toLowerCase(),
  //       );
  //       return {
  //         ...p,
  //         ...info,
  //       };
  //     }) || [],
  //   [projectDetails, data],
  // );
  const combiData = useMemo(
    () =>
      data?.tokenEntities
        ?.map?.((p) => {
          const info = projectDetails?.data?.find?.(
            (i) => i?.token_address?.toLowerCase() === p?.addr?.toLowerCase(),
          );
          return {
            ...p,
            ...info,
          };
        })
        ?.sort((a, b) => {
          // 确保 is_pinned 为 true 的项目排在前面
          if (a?.is_pinned && !b?.is_pinned) return -1;
          if (!a?.is_pinned && b?.is_pinned) return 1;
          return 0;
        }) || [],
    [projectDetails, data],
  );

  return (
    <Grid container spacing={3} rowGap={0} sx={{ my: 4 }}>
      {tLoading || isLoading ? (
        [1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
          <Grid item sm={6} md={3} key={index}>
            <Box sx={{ position: "relative" }}>
              <Skeleton
                sx={{ background: "#331f44" }}
                variant="rectangular"
                width="100%"
                height={160}
              />
              <Skeleton
                sx={{
                  background: "#331f44",
                  position: "absolute",
                  left: 20,
                  top: 110,
                  borderRadius: 2,
                }}
                variant="rectangular"
                width={60}
                height={60}
              />
              <Box
                sx={{
                  border: "1px solid rgba(255, 255, 255, 0.10)",
                  borderTop: "none",
                  p: 2,
                }}
              >
                {" "}
                <Skeleton
                  sx={{ background: "#331f44", mt: 2 }}
                  width="80%"
                  height={30}
                />
                <Skeleton
                  sx={{ background: "#331f44" }}
                  width="70%"
                  height={20}
                />
                <Skeleton
                  sx={{ background: "#331f44" }}
                  width="100%"
                  height={20}
                />
                <Skeleton
                  sx={{ background: "#331f44" }}
                  width="80%"
                  height={20}
                />
              </Box>
              <Box
                sx={{
                  border: "1px solid rgba(255, 255, 255, 0.10)",
                  borderTop: "none",
                  p: 2,
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Skeleton
                    sx={{ background: "#331f44" }}
                    width="30%"
                    height={28}
                  />
                  <Skeleton
                    sx={{ background: "#331f44" }}
                    width="30%"
                    height={28}
                  />
                </Box>
                <Skeleton
                  sx={{ background: "#331f44" }}
                  width="100%"
                  height={24}
                />
              </Box>
            </Box>
          </Grid>
        ))
      ) : combiData?.length > 0 ? (
        // 显示实际数据
        combiData?.map((item) => (
          <Grid item sm={6} md={3} key={item?.id}>
            <Link
              href={
                item?.state === "1"
                  ? `/collection/base/${item?.addr}`
                  : `/launchpad/base/${item?.addr}`
              }
            >
              <LCard
                imageUrl={
                  item.banner_image
                    ? `https://d2oiecgevbfxbl.cloudfront.net/images/756x308/freeze=false/https://dme30nyhp1pym.cloudfront.net/assets/${item.banner_image}`
                    : ""
                }
                logo={`https://d2oiecgevbfxbl.cloudfront.net/images/250x250/freeze=false/https://dme30nyhp1pym.cloudfront.net/assets/${item.collection_logo}`}
                title={item?.symbol || ""}
                name={item?.name || ""}
                description={item?.description || "-"}
                progress={getProgress(item?.supply || "0", Number(item.state))}
                ethAmount={Number(
                  Number(item?.lockValue || "0")?.toPrecision(4),
                )}
                percentageIncrease={(
                  ((Number(item?.currentPrice) - Number(item?.initPrice)) /
                    Number(item?.initPrice)) *
                  100
                )?.toFixed(2)}
                userCount={Number(item?.memberCount)}
                time={formatDistanceToNow(
                  new Date(Number(item?.createTimestamp || 0) * 1000),
                )}
                link="https://example.com"
                tag="Hybrid Meme"
                preview={`https://d2oiecgevbfxbl.cloudfront.net/images/250x250/freeze=false/https://dme30nyhp1pym.cloudfront.net/assets/${item.pre_reveal_image}`}
                item={item as ProjectData}
              />
            </Link>
          </Grid>
        ))
      ) : (
        // 空数据提示
        <Grid item xs={12}>
          <Typography variant="h6" color="textSecondary" align="center">
            No data available
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default CardList;
