import AvatarCard from "@/components/collections/avatar-card";
import { geckoNetworkName, PoolInfo } from "@/services/tokens";
import {
  formatNumberWithKM,
  formatTokenFixedto,
  formatUSD,
} from "@/utils/format";
import { getTokenLogoURL } from "@/utils/token";
import { Card, CardContent, Typography, Grid, Stack, Box } from "@mui/material";
import Iconify from "@/components/iconify";
import { useMemo, useState } from "react";
import PopoverSearch from "@/components/drawer/popover-search";
import { TokenDrawer } from "@/components/drawer/token-drawer";
import { CollectionDetails } from "@/types/collection";
import TradeInfoItem from "@/views/trade/pool-info/trade-info-item";
import { TokenEntity } from "@/services/graphql/all-token";
import { BaseSID } from "../../create/tokenService";
import { ChainId } from "@uniswap/sdk-core";
import { use24HVolumeForToken } from "@/services/graphql/volume-24h";
import { useQuery } from "@tanstack/react-query";
import { fetchTokenPrices, TokenPrices } from "@/services/gecko";
import { WETH_ADDRESS } from "@uniswap/universal-router-sdk";

interface iInfoCard {
  loading: boolean;
  logo: string;
  vol?: string;
  info?: TokenEntity;
}
function InfoCard({ info, loading, logo, vol }: iInfoCard) {
  const wethAddress = useMemo(() => WETH_ADDRESS(Number(1)).toLowerCase(), []);
  const { data: tokenPrices } = useQuery<TokenPrices>({
    queryKey: ["tokenPrices"],
    queryFn: () => fetchTokenPrices(geckoNetworkName[1], wethAddress),
  });
  const ethPrice = useMemo(
    () => Number(tokenPrices?.[wethAddress]),
    [wethAddress, tokenPrices],
  );

  const {
    data = { tokenEntity: { hourData: [] } },
    error,
    isLoading,
  } = use24HVolumeForToken(
    info?.addr || "",
    Math.floor(Date.now() / 1000) - 24 * 60 * 60,
    Math.floor(Date.now() / 1000),
  );
  const [totalVolumeETH, setTotalVolumeETH] = useState(0);

  useMemo(() => {
    if (data?.tokenEntity?.hourData?.length) {
      const newTotal = data.tokenEntity.hourData.reduce((acc, hour) => {
        return acc + parseFloat(hour.hourlyVolumeETH);
      }, 0);
      setTotalVolumeETH(newTotal);
    }
  }, [data?.tokenEntity?.hourData]);
  // const totalVolumeUSD = useMemo(
  //   () => totalVolumeETH * ethPrice,
  //   [totalVolumeETH, ethPrice],
  // );
  // const currentPriceUSD = useMemo(
  //   () => Number(info?.currentPrice || 0) * ethPrice,
  //   [info?.currentPrice, ethPrice],
  // );
  const marketCapUSD = useMemo(
    () =>
      `$${formatNumberWithKM(
        Number(1000000000 || 0) * Number(info?.currentPrice || 0) * ethPrice,
      )}`,
    [info?.currentPrice, ethPrice],
  );

  return (
    <Card
      sx={{
        backgroundColor: "rgba(23, 21, 37,0.6)",
        color: "white",
        flexGrow: 1,
      }}
    >
      <CardContent
        sx={{
          overflowX: { xs: "scroll", md: "initial" },
          pb: { md: "16px !important", xs: "8px !important" },
          p: { md: "16px !important", xs: "8px !important" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Stack flexDirection="row" alignItems="center" sx={{ width: "80%" }}>
            <AvatarCard
              hasLogo
              symbol={info?.symbol || ""}
              chainId={ChainId.BASE}
              logoUrl={logo}
              size={40}
            />
            <Stack flexDirection="row" alignItems="center">
              <Typography
                variant="h4"
                component="div"
                sx={{
                  fontSize: { md: 20, xs: 16 },
                  textTransform: "uppercase",
                }}
              >
                {info?.symbol || "Unknown Token"}
              </Typography>
            </Stack>
            <Stack flexDirection="row" alignItems="center">
              <Typography
                variant="h4"
                component="div"
                sx={{
                  fontSize: { md: 20, xs: 16 },
                  textTransform: "uppercase",
                  ml: 2,
                }}
              >
                {formatTokenFixedto(info?.currentPrice)} ETH
              </Typography>
            </Stack>
          </Stack>
          {/* <Typography
            variant="h4"
            sx={{
              ml: 2,
              fontSize: { md: 20, xs: 16 },
              display: { md: "none", xs: "block" },
              color:
                Number(info?.currentPrice || 0) > 0 ? "#00B912" : "#DC2626",
            }}
          >
            {(
              ((Number(info?.currentPrice) - Number(info?.initPrice)) /
                Number(info?.initPrice)) *
              100
            )?.toFixed(2)}
          </Typography> */}
          <Grid
            container
            spacing={2}
            sx={{
              width: "100%",
              display: { md: "flex", xs: "none" },
              justifyContent: "flex-end",
            }}
          >
            <TradeInfoItem
              loading={loading}
              title="24h Change"
              textAlign="right"
              value={`${(
                ((Number(info?.currentPrice) - Number(info?.initPrice)) /
                  Number(info?.initPrice)) *
                100
              )?.toFixed(2)}%`}
              color={
                (Number(info?.currentPrice) - Number(info?.initPrice)) /
                  Number(info?.initPrice) ===
                0
                  ? "rgba(255, 255, 255, 0.6)"
                  : (Number(info?.currentPrice) - Number(info?.initPrice)) /
                        Number(info?.initPrice) >
                      0
                    ? "#00B912"
                    : "#DC2626"
              }
            />
            <TradeInfoItem
              loading={loading}
              title="24h Volume"
              value={vol ? vol : `${formatTokenFixedto(totalVolumeETH)} ETH`}
              textAlign="right"
            />
            {/* <TradeInfoItem
              loading={loading}
              title="24h Volume"
              value={`$${formatNumberWithKM(100000)}`}
            /> */}
            <TradeInfoItem
              loading={loading}
              title="Market Cap"
              value={marketCapUSD}
              // value={`${formatTokenFixedto(Number(100000000) * Number(info?.currentPrice || 0))} ETH`}
              textAlign="right"
            />
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}

export default InfoCard;
