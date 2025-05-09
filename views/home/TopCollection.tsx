import {
  Box,
  Grid,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import TopCollectionCard from "./components/TopCollectionCard";
import DropDownMenu from "./components/DropDownMenu";
import { useCallback, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCollections } from "@/services/collections";
import MenuTabsWithIcon from "@/components/tabs/menu-tabs-with-icon";
import { topCollectionTab } from "@/constants/options";
import Link from "next/link";
import ChainFilter from "./components/ChainFilter";
const TopCollection = () => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"));
  const [selectedChain, setSelectedChain] = useState<string>("-1");
  const handleChainChange = (newChain: string) => {
    setSelectedChain(newChain);
  };
  const [selectedTab, setSelectedTab] = useState<"volume" | "price_change">(
    "price_change",
  );
  const { data, isLoading, error } = useQuery({
    queryKey: ["collections", { sort_field: selectedTab, selectedChain }],
    queryFn: () =>
      getCollections({
        page: 1,
        page_size: 9,
        sort_field: selectedTab,
        chain_id:
          Number(selectedChain) === -1 ? "" : Number(selectedChain) || 1,
      }),
  });

  const handleTabChange = useCallback((key: string) => {
    setSelectedTab(key === "Gainers" ? "price_change" : "volume");
  }, []);

  return (
    <Box sx={{ my: 10 }}>
      <div className="tf-section-4 seller-grid ">
        <div className="themesflat-container">
          <Grid container>
            <Grid item sm={12} md={8.4}>
              <MenuTabsWithIcon
                tabs={topCollectionTab}
                onChange={handleTabChange}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={3.6}
              sx={{
                display: "flex",
                justifyContent: { md: "flex-end", xs: "flex-start" },
                alignItems: "center",
              }}
            >
              <ChainFilter
                selectedChain={selectedChain}
                onChainChange={handleChainChange}
              />
              <Link href="/404s/tokens">
                <Typography
                  variant="h5"
                  className="font-poppins-400"
                  sx={{
                    borderRadius: "48px",
                    background: "#0d111c",
                    padding: { md: "18px 30px", xs: "20px 20px" },
                    textTransform: "uppercase",
                    fontSize: { md: 14, xs: 10 },
                  }}
                >
                  View More
                </Typography>
              </Link>
            </Grid>
          </Grid>
          {isLoading ? (
            <Grid container spacing={2} sx={{ mt: 4 }}>
              {Array.from({ length: 12 }, (_, index) => index + 1).map(
                (item) => (
                  <Grid item xs={12} md={6} lg={4} key={item} sx={{ p: 0 }}>
                    <Skeleton
                      sx={{
                        background: "#331f44",
                        borderRadius: 2,
                        height: 100,
                      }}
                    />
                  </Grid>
                ),
              )}
            </Grid>
          ) : (
            <Grid
              container
              spacing={isMd ? 4 : 0}
              sx={{ mt: 4, minHeight: { md: 400, xs: "auto" } }}
            >
              {data?.data?.list?.map((item) => (
                <TopCollectionCard key={item?.rank} {...item} />
              ))}
            </Grid>
          )}
        </div>
      </div>
    </Box>
  );
};

export default TopCollection;
