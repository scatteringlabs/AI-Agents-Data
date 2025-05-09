import CopyToClipboardButton from "@/components/button/CopyToClipboardButton";
import { ChainNameById } from "@/constants/chain";
import { SCAN_URL_ID } from "@/constants/url";
import { PoolInfo, getLiquidityInfo } from "@/services/tokens";
import { Collection } from "@/types/collection";
import {
  formatAddress,
  formatIntNumberWithKM,
  formatNumberWithKM,
  formatToken,
} from "@/utils/format";
import MediaLink from "@/views/collect/MediaLink";
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

const StackWrapper = styled(Stack)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px 20px 10px 20px;
`;

export function a11yProps(index: number) {
  return {
    id: `pool-info-tab-${index}`,
    "aria-controls": `pool-info-tabpanel-${index}`,
  };
}
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
export function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}
interface iPoolInfoCard {
  poolInfo?: PoolInfo;
  chainId: number;
  status: number;
  conversionRatio: number;
  collectionAddress: string;
  type: string;
  collectionDetails?: Collection;
}
function PoolInfoCard({
  // poolInfo,
  chainId,
  collectionAddress,
  type,
  status,
  conversionRatio,
  collectionDetails,
}: iPoolInfoCard) {
  const router = useRouter();
  const [value, setValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const { data, isLoading } = useQuery({
    queryKey: ["getLiquidityInfo"],
    queryFn: () =>
      getLiquidityInfo({
        chain_id: chainId,
        token_contract_address: collectionAddress.toString(),
      }),
    enabled: Boolean(chainId && collectionAddress),
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
        {status === 1 ? (
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
                        ${formatNumberWithKM(liquidity.liquidity)}
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
                        {formatNumberWithKM(liquidity.base_amount)}
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
                        {formatNumberWithKM(liquidity.quote_amount)}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              </Stack>
            ))}
          </CardContent>
        ) : (
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              flexDirection: "column",
              p: 4,
            }}
          >
            <Box
              component="img"
              sx={{ maxWidth: 86 }}
              src="/assets/images/trade/no-data-pool.png"
            />
            <Typography
              variant="h4"
              sx={{
                opacity: 0.6,
                mt: 2,
                fontFamily: "DM Sans",
                fontSize: 16,
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "16px",
              }}
            >
              No Data
            </Typography>
          </CardContent>
        )}
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
            <Typography variant="h5">{collectionDetails?.address}</Typography>
          </StackWrapper> */}
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
          </StackWrapper>
          <StackWrapper>
            <Typography
              variant="h5"
              sx={{ color: " rgba(255, 255, 255, 0.6)" }}
            >
              Contract address
            </Typography>
            <Typography variant="h5">
              {formatAddress(collectionDetails?.address)}
              <CopyToClipboardButton
                textToCopy={collectionDetails?.address || ""}
              />
            </Typography>
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

export default PoolInfoCard;
