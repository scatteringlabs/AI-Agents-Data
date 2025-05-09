import CopyToClipboardButton from "@/components/button/CopyToClipboardButton";
import {
  formatAddress,
  formatIntNumberWithKM,
  formatNumberWithKM,
  formatToken,
  formatTokenFixedto,
} from "@/utils/format";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CardHeader,
  Divider,
  Stack,
  Box,
  Skeleton,
  Tabs,
  Tab,
  styled,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { a11yProps, CustomTabPanel } from "./PoolInfoCard";
import { getPoolInfo } from "@/services/zora/poolinfo";
import { CollectionDetailsErc20z } from "@/types/collection";

const StackWrapper = styled(Stack)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px 20px 10px 20px;
`;

interface iPoolInfoCardErc20Z {
  collectionDetails?: CollectionDetailsErc20z;
}

function PoolInfoCardErc20Z({ collectionDetails }: iPoolInfoCardErc20Z) {
  const [value, setValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const { data, isLoading } = useQuery({
    queryKey: ["getPoolInfo", { collectionDetails }],
    queryFn: () =>
      getPoolInfo({
        chain_id: collectionDetails?.chain_id || 1,
        mt_address: collectionDetails?.mt_address || "",
        token_id: collectionDetails?.token_id || 0,
      }),
    enabled: Boolean(collectionDetails),
  });

  const liquidityList = useMemo(() => data?.data?.list, [data]);

  return (
    <Card
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        color: "white",
        mt: 2,
      }}
    >
      {" "}
      <CardHeader
        title={
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              mb: "-18px",
            }}
          >
            <Tabs
              value={value}
              onChange={handleTabChange}
              aria-label="basic tabs example"
              sx={{ textAlign: "left" }}
              TabIndicatorProps={{
                style: {
                  backgroundColor: "#af54ff",
                },
              }}
            >
              <Tab
                sx={{
                  fontSize: 16,
                  textTransform: "capitalize",
                  color: "#fff",
                  textAlign: "left",
                  paddingLeft: 0,
                  // alignItems: "flex-start",
                  "&.Mui-selected": {
                    color: "#af54ff",
                  },
                  "&.Mui-focusVisible": {
                    backgroundColor: "#af54ff",
                  },
                }}
                label="Pool"
                {...a11yProps(0)}
              />
              <Tab
                sx={{
                  fontSize: 16,
                  textTransform: "capitalize",
                  color: "#fff",
                  textAlign: "left",
                  "&.Mui-selected": {
                    color: "#af54ff",
                  },
                  "&.Mui-focusVisible": {
                    backgroundColor: "#af54ff",
                  },
                }}
                label="Token Info"
                {...a11yProps(1)}
              />
            </Tabs>
          </Box>
        }
      />
      <Divider sx={{ background: "rgba(255,255,255,0.1)" }} />
      <CustomTabPanel value={value} index={0}>
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
          }}
        >
          {liquidityList?.map((liquidity, index) => (
            <Stack
              key={liquidity.pool_address}
              flexDirection="row"
              justifyContent="space-between"
              sx={{
                width: "100%",
                py: 2,
                pt: index !== 0 ? 2 : 0,
                pb: index === liquidityList.length - 1 ? 0 : 2,
                borderBottom:
                  index === liquidityList.length - 1
                    ? "unset"
                    : "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <Stack
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                {" "}
                {isLoading ? (
                  <Skeleton
                    variant="circular"
                    width={24}
                    height={24}
                    sx={{
                      background: "#331f44",
                      m: 1,
                    }}
                  />
                ) : (
                  <Box
                    component="img"
                    src={liquidity.liquidity_logo}
                    sx={{ width: 24, height: 24, m: 1 }}
                  />
                )}
                <Stack>
                  {isLoading ? (
                    <Skeleton
                      variant="text"
                      width={100}
                      height={40}
                      sx={{
                        background: "#331f44",
                      }}
                    />
                  ) : (
                    <Typography
                      variant="h5"
                      sx={{ fontSize: { md: 14, xs: 12 } }}
                    >
                      {liquidity.liquidity_name}
                    </Typography>
                  )}
                  {isLoading ? (
                    <Skeleton
                      variant="text"
                      width={100}
                      height={40}
                      sx={{
                        background: "#331f44",
                      }}
                    />
                  ) : (
                    <Typography
                      variant="h5"
                      sx={{ mt: 1, fontSize: { md: 14, xs: 12 } }}
                    >
                      ${formatTokenFixedto(liquidity.liquidity, 2)}
                    </Typography>
                  )}
                </Stack>
              </Stack>
              <Stack flexDirection="row">
                <Stack
                  sx={{
                    mx: 2,
                    textAlign: "center",
                    minWidth: { md: 80, xs: 60 },
                  }}
                >
                  {isLoading ? (
                    <Skeleton
                      variant="text"
                      width={80}
                      height={40}
                      sx={{
                        background: "#331f44",
                      }}
                    />
                  ) : (
                    <Typography
                      variant="h5"
                      sx={{
                        color: "rgba(255, 255, 255, 0.6)",
                        fontSize: { md: 14, xs: 12 },
                      }}
                    >
                      {liquidity.base_asset_symbol}
                    </Typography>
                  )}
                  {isLoading ? (
                    <Skeleton
                      variant="text"
                      width={80}
                      height={40}
                      sx={{
                        background: "#331f44",
                      }}
                    />
                  ) : (
                    <Typography
                      variant="h5"
                      sx={{ mt: 1, fontSize: { md: 14, xs: 12 } }}
                    >
                      {formatTokenFixedto(liquidity.base_amount)}
                    </Typography>
                  )}
                </Stack>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ background: "rgba(255,255,255,0.1)" }}
                />
                <Stack
                  sx={{
                    mx: 2,
                    textAlign: "center",
                    minWidth: { md: 80, xs: 60 },
                  }}
                >
                  {isLoading ? (
                    <Skeleton
                      variant="text"
                      width={80}
                      height={40}
                      sx={{
                        background: "#331f44",
                      }}
                    />
                  ) : (
                    <Typography
                      variant="h5"
                      sx={{
                        color: "rgba(255, 255, 255, 0.6)",
                        fontSize: { md: 14, xs: 12 },
                      }}
                    >
                      {liquidity.quote_asset_symbol}
                    </Typography>
                  )}
                  {isLoading ? (
                    <Skeleton
                      variant="text"
                      width={80}
                      height={40}
                      sx={{
                        background: "#331f44",
                      }}
                    />
                  ) : (
                    <Typography
                      variant="h5"
                      sx={{ mt: 1, fontSize: { md: 14, xs: 12 } }}
                    >
                      {formatTokenFixedto(liquidity.quote_amount)}
                    </Typography>
                  )}
                </Stack>
              </Stack>
            </Stack>
          ))}
        </CardContent>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Stack sx={{ my: 2 }}>
          {/* <StackWrapper>
            <Typography
              variant="h5"
              sx={{ color: " rgba(255, 255, 255, 0.6)" }}
            >
              Ticker
            </Typography>
            <Typography variant="h5">{collectionDetails?.symbol}</Typography>
          </StackWrapper>
          <StackWrapper>
            <Typography
              variant="h5"
              sx={{ color: " rgba(255, 255, 255, 0.6)" }}
            >
              Collection Name
            </Typography>
            <Typography
              variant="h5"
              sx={{
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "160px",
                overflow: "hidden",
              }}
            >
              {collectionDetails?.name}
            </Typography>
          </StackWrapper> */}
          <StackWrapper>
            <Typography
              variant="h5"
              sx={{ color: " rgba(255, 255, 255, 0.6)" }}
            >
              Contract address
            </Typography>
            <Typography variant="h5">
              {formatAddress(collectionDetails?.ft_address)}
              <CopyToClipboardButton
                textToCopy={collectionDetails?.ft_address || ""}
              />
            </Typography>
          </StackWrapper>
          <StackWrapper>
            <Typography
              variant="h5"
              sx={{ color: " rgba(255, 255, 255, 0.6)" }}
            >
              ERC1155 Address
            </Typography>
            <Typography variant="h5">
              {formatAddress(collectionDetails?.mt_address)}
              <CopyToClipboardButton
                textToCopy={collectionDetails?.mt_address || ""}
              />
            </Typography>
          </StackWrapper>
          <StackWrapper>
            <Typography
              variant="h5"
              sx={{ color: " rgba(255, 255, 255, 0.6)" }}
            >
              Pool Address
            </Typography>
            <Typography variant="h5">
              {formatAddress(collectionDetails?.pool_address)}
              <CopyToClipboardButton
                textToCopy={collectionDetails?.pool_address || ""}
              />
            </Typography>
          </StackWrapper>
          <StackWrapper>
            <Typography
              variant="h5"
              sx={{ color: " rgba(255, 255, 255, 0.6)" }}
            >
              Creator Address
            </Typography>
            <Typography variant="h5">
              {formatAddress(collectionDetails?.creator)}
              <CopyToClipboardButton
                textToCopy={collectionDetails?.creator || ""}
              />
            </Typography>
          </StackWrapper>
          <StackWrapper>
            <Typography
              variant="h5"
              sx={{ color: " rgba(255, 255, 255, 0.6)" }}
            >
              Conversion Ratio (1NFT = How Many Tokens)
            </Typography>
            <Typography variant="h5">1:1</Typography>
          </StackWrapper>
          <StackWrapper>
            <Typography
              variant="h5"
              sx={{ color: " rgba(255, 255, 255, 0.6)" }}
            >
              Total supply
            </Typography>
            <Typography variant="h5">
              {formatIntNumberWithKM(collectionDetails?.total_supply || "0")}
            </Typography>
          </StackWrapper>
        </Stack>
      </CustomTabPanel>
    </Card>
  );
}

export default PoolInfoCardErc20Z;
