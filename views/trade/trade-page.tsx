import TradingInfoCard from "@/views/trade/pool-info/TradingInfoCard";
import TradingView from "@/views/trade/trading-view/TradingView";
import {
  Grid,
  Box,
  Stack,
  Typography,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SwapCard from "@/views/trade/SwapCard";
import { useQuery } from "@tanstack/react-query";
import { geckoNetworkName, getPoolInfo } from "@/services/tokens";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import { ChainNameById } from "@/constants/chain";
import TokenPriceProvider from "@/context/token-price-provider";
import PoolInfoCard from "@/views/trade/pool-info/PoolInfoCard";
import Link from "next/link";
import TradesTable from "./trades-table";
import HolderTable from "./okx-stat/position-table";
import { ButtonWrapper } from "@/components/button/wrapper";
import TableTabs from "./table-tabs";
import { PreviewDesc, PreviewTitle } from "../launchpad/create/require-text";
import OverviewItem from "./overview-item";
import { CollectionDetails } from "@/types/collection";

interface iTrade {
  chainId: number;
  status: number;
  erc20Address: string;
  collectionDetails?: CollectionDetails;
  type: string;
  priceInUsd: string;
  logoUrl?: string;
}
const Trade = ({
  chainId,
  erc20Address,
  status,
  collectionDetails,
  type,
  priceInUsd,
  logoUrl,
}: iTrade) => {
  const theme = useTheme();

  const isMd = useMediaQuery(theme.breakpoints.down(750));

  const [activeTab, setActiveTab] = useState<"trade" | "holder" | "overview">(
    "trade",
  );
  const { data, isLoading } = useQuery({
    queryKey: ["PoolInfo", { chainId, erc20Address }],
    queryFn: () =>
      getPoolInfo({
        chain_id: chainId,
        token_contract_address: erc20Address.toString(),
      }),
    enabled: Boolean(chainId && erc20Address),
  });

  if (
    !chainId ||
    !erc20Address ||
    !data?.data?.item ||
    !data?.data?.item?.base_asset_address
  ) {
    return null;
  }
  return (
    <Box sx={{ flexGrow: 1, padding: 0, mb: 2 }}>
      <Grid container spacing={2}>
        <TokenPriceProvider>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={8}
            // sx={{ position: "sticky", top: "170px" }}
          >
            {status === 1 ? (
              <>
                <Stack flexDirection="row" sx={{ mb: 2 }}>
                  <TradingInfoCard
                    poolInfo={data?.data?.item}
                    loading={isLoading}
                    priceInUsd={priceInUsd}
                    collectionDetails={collectionDetails}
                  />
                </Stack>
                <TradingView
                  loading={isLoading}
                  poolAddress={data?.data?.item?.pool_address}
                  chainId={chainId}
                  symbol={data?.data?.item?.base_asset_symbol}
                  tokenPrice={Number(data?.data?.item?.base_asset_price_usd)}
                />
                {!isMd ? (
                  <Card
                    sx={{
                      background: "rgba(255, 255, 255, 0)",
                      color: "white",
                      flexGrow: 1,
                      mt: 1,
                    }}
                  >
                    <CardContent
                      sx={{
                        // overflowX: { xs: "scroll", md: "initial" },
                        pb: "16px !important",
                        px: 0,
                      }}
                    >
                      <TableTabs
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        statusFlags={collectionDetails?.status_flags}
                      />
                      <TradesTable
                        activeTab={activeTab}
                        pool={data?.data?.item?.pool_address}
                        network={geckoNetworkName?.[chainId]}
                        chainId={chainId}
                        symbol={data?.data?.item?.base_asset_symbol}
                        toSymbol={data?.data?.item?.quote_asset_symbol}
                        decimals={data?.data?.item?.base_asset_decimals || 18}
                        address={data?.data?.item?.base_asset_address || ""}
                        quoteToken={
                          data?.data?.item?.base_asset_address >
                          data?.data?.item?.quote_asset_address
                            ? "token0"
                            : "token1"
                        }
                      />
                      <HolderTable
                        activeTab={activeTab}
                        network={geckoNetworkName?.[chainId]}
                        address={data?.data?.item?.base_asset_address}
                        chainId={chainId}
                        total={data?.data?.item?.total_supply}
                        price={data?.data?.item?.base_asset_price_usd}
                      />
                    </CardContent>
                    {activeTab === "overview" ? (
                      <>
                        {" "}
                        <OverviewItem
                          title="Collection Story"
                          value={collectionDetails?.collection_story || "-"}
                        />
                        <OverviewItem
                          title="NFT Info"
                          value={collectionDetails?.nft_info || "-"}
                        />
                      </>
                    ) : null}
                  </Card>
                ) : null}

                {/* <TransferTable
                  chainShortName={geckoNetworkName?.[chainId]}
                  tokenContractAddress={data?.data?.item?.base_asset_address}
                  chainId={chainId}
                />
                <TransactionStats
                  chainShortName={geckoNetworkName?.[chainId]}
                  tokenContractAddress={data?.data?.item?.base_asset_address}
                  chainId={chainId}
                /> */}
              </>
            ) : (
              <Card
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  color: "white",
                  height: { md: 736, xs: 300 },
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  component="img"
                  sx={{ maxWidth: { md: 560, xs: "50%" } }}
                  src="/assets/images/trade/no-data.png"
                />
              </Card>
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={4}>
            <SwapCard
              symbol={data?.data?.item?.base_asset_symbol?.toUpperCase()}
              decimals={data?.data?.item?.base_asset_decimals || 18}
              erc20Address={data?.data?.item?.base_asset_address}
              hasLogo={data?.data?.item?.has_logo || false}
              chainId={chainId}
              logoUrl={logoUrl}
            />
            {isMd ? (
              <Card
                sx={{
                  background: "rgba(255, 255, 255, 0)",
                  color: "white",
                  flexGrow: 1,
                  mt: 1,
                }}
              >
                <CardContent
                  sx={{
                    // overflowX: { xs: "scroll", md: "initial" },
                    pb: "16px !important",
                    px: 0,
                  }}
                >
                  {" "}
                  <Box sx={{ display: "flex" }}>
                    <ButtonWrapper
                      sx={{
                        background:
                          activeTab === "trade"
                            ? "#af54ff"
                            : "rgba(255,255,255,0.0)",
                        border:
                          activeTab === "trade"
                            ? "1px solid #af54ff"
                            : "1px solid rgba(255,255,255,0.3)",
                        color:
                          activeTab === "trade"
                            ? "rgba(255,255,255,1)"
                            : "rgba(255,255,255,0.4)",
                        fontWeight: activeTab === "trade" ? 700 : 500,
                        borderRadius: "8px",
                        padding: { md: "10px 20px", xs: "10px 10px" },
                        fontSize: { md: 16, xs: 14 },
                        m: 0,
                        mr: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onClick={() => {
                        setActiveTab("trade");
                      }}
                    >
                      <Box sx={{ mr: 1 }}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M15.653 3.56664L17.0224 1.90625L17.9868 2.70162L16.6173 4.36201L15.653 3.56664ZM13.977 9.37883H13.6496L11.2766 8.57121L11.6793 7.38781L13.8565 8.12883H13.977V9.37883ZM8.24477 13.3177L5.81469 10.9415L6.08012 10.6702L5.63402 10.2314L6.24301 9.61223L9.11859 12.4239L8.24477 13.3177ZM1.9082 17.481L3.19803 15.0415L4.30303 15.6258L3.01318 18.0652L1.9082 17.481Z"
                            fill={
                              activeTab === "trade"
                                ? "#fff"
                                : "rgba(255,255,255,0.3)"
                            }
                          />
                          <path
                            d="M6.85586 16.866H3.10547V9.17617H6.85586V16.866ZM4.35547 15.616H5.60586V10.4262H4.35547V15.616ZM16.9146 13.125H13.1447V3.03125H16.9146V13.125ZM14.3947 11.875H15.6646V4.28125H14.3947V11.875ZM11.8061 16.866H8.05547V3.12148H11.8059V16.866H11.8061ZM9.30547 15.616H10.5559V4.37148H9.30547V15.616Z"
                            fill={
                              activeTab === "trade"
                                ? "#fff"
                                : "rgba(255,255,255,0.3)"
                            }
                          />
                          <path
                            d="M4.64062 7.84434H5.34375V9.99805H4.64062V7.84434ZM4.64062 16.2258H5.34375V18.1359H4.64062V16.2258ZM9.6498 16.2258H10.3529V18.1359H9.6498V16.2258ZM9.6498 1.91016H10.3529V3.82031H9.6498V1.91016ZM14.6467 1.91016H15.3498V3.82031H14.6467V1.91016ZM14.6467 12.4984H15.3498V14.4086H14.6467V12.4984Z"
                            fill={
                              activeTab === "trade"
                                ? "#fff"
                                : "rgba(255,255,255,0.3)"
                            }
                          />
                        </svg>
                      </Box>
                      Transactions
                    </ButtonWrapper>
                    <ButtonWrapper
                      sx={{
                        background:
                          activeTab === "holder"
                            ? "#af54ff"
                            : "rgba(255,255,255,0.0)",
                        border:
                          activeTab === "holder"
                            ? "1px solid #af54ff"
                            : "1px solid rgba(255,255,255,0.3)",
                        color:
                          activeTab === "holder"
                            ? "rgba(255,255,255,1)"
                            : "rgba(255,255,255,0.4)",
                        fontWeight: activeTab === "holder" ? 700 : 500,
                        fontSize: { md: 16, xs: 14 },
                        borderRadius: "8px",
                        padding: { md: "10px 20px", xs: "10px 10px" },
                        m: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onClick={() => {
                        setActiveTab("holder");
                      }}
                    >
                      <Box sx={{ mr: 1 }}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="21"
                          height="20"
                          viewBox="0 0 21 20"
                          fill="none"
                        >
                          <path
                            d="M18.6641 17.5781C18.9877 17.5781 19.25 17.8404 19.25 18.1641C19.25 18.4877 18.9877 18.75 18.6641 18.75H2.33594C2.01232 18.75 1.75 18.4877 1.75 18.1641C1.75 17.8404 2.01232 17.5781 2.33594 17.5781H18.6641ZM12.8438 1.25C13.491 1.25 14.0156 1.77467 14.0156 2.42188V15.8203C14.0156 16.4675 13.491 16.9922 12.8438 16.9922H8.15625C7.50904 16.9922 6.98438 16.4675 6.98438 15.8203V2.42188C6.98438 1.77467 7.50904 1.25 8.15625 1.25H12.8438ZM5.85156 4.29688C6.17518 4.29688 6.4375 4.5592 6.4375 4.88281C6.4375 5.20318 6.18039 5.4635 5.86125 5.46867L5.85156 5.46875H2.92188V15.8203H5.85156C6.17518 15.8203 6.4375 16.0826 6.4375 16.4062C6.4375 16.7266 6.18039 16.9869 5.86125 16.9922H2.92188C2.28113 16.9922 1.76051 16.478 1.75016 15.8397L1.75 15.8203V5.46875C1.75 4.82801 2.26422 4.30738 2.9025 4.29703L2.92188 4.29688H5.85156ZM18.0781 7.16797L18.0975 7.16813C18.7358 7.17848 19.25 7.6991 19.25 8.33984V15.8203L19.2498 15.8397C19.2395 16.478 18.7189 16.9922 18.0781 16.9922H15.1388C14.8196 16.9869 14.5625 16.7266 14.5625 16.4062C14.5625 16.0826 14.8248 15.8203 15.1484 15.8203H18.0781V8.33984H15.1484L15.1388 8.33977C14.8196 8.33459 14.5625 8.07428 14.5625 7.75391C14.5625 7.43029 14.8248 7.16797 15.1484 7.16797H18.0781ZM12.8438 2.42188H8.15625V15.8203H12.8438V2.42188ZM16.1855 9.32422C16.7871 9.32422 17.1816 9.60547 17.1816 10.125C17.1816 10.4141 17.0254 10.6406 16.7129 10.7656V10.7852C17.0371 10.8828 17.2754 11.1172 17.2754 11.4922C17.2754 12.0352 16.7793 12.3398 16.2012 12.3398C15.7402 12.3398 15.416 12.1797 15.2051 11.9336L15.5254 11.4961C15.7012 11.6641 15.9043 11.7773 16.1309 11.7773C16.4004 11.7773 16.5762 11.6641 16.5762 11.4453C16.5762 11.1953 16.4434 11.0469 15.834 11.0469V10.5586C16.3301 10.5586 16.4863 10.4062 16.4863 10.1758C16.4863 9.97656 16.3691 9.86719 16.1543 9.86719C15.959 9.86719 15.8105 9.95703 15.6348 10.1094L15.2832 9.68359C15.5527 9.45703 15.8418 9.32422 16.1855 9.32422ZM4.7207 6.43359C5.2832 6.43359 5.67383 6.79297 5.67383 7.34766C5.67383 7.84766 5.24414 8.39844 4.79883 8.84766C4.94336 8.82812 5.14258 8.80859 5.27148 8.80859H5.80664V9.39453H3.79102V8.99609C4.51758 8.33594 5.00586 7.80859 5.00586 7.38672C5.00586 7.12109 4.85742 6.97656 4.62695 6.97656C4.42773 6.97656 4.27148 7.10938 4.13477 7.25781L3.75586 6.88281C4.04102 6.58203 4.30664 6.43359 4.7207 6.43359ZM10.9277 3.46094V5.80469H11.4512V6.36719H9.61523V5.80469H10.2324V4.15234H9.69727V3.72266C10.0098 3.66406 10.2129 3.58594 10.416 3.46094H10.9277Z"
                            fill={
                              activeTab === "holder"
                                ? "#fff"
                                : "rgba(255,255,255,0.3)"
                            }
                          />
                        </svg>
                      </Box>
                      Top Holders
                    </ButtonWrapper>
                  </Box>
                  <TradesTable
                    activeTab={activeTab}
                    pool={data?.data?.item?.pool_address}
                    network={geckoNetworkName?.[chainId]}
                    chainId={chainId}
                    symbol={data?.data?.item?.base_asset_symbol}
                    toSymbol={data?.data?.item?.quote_asset_symbol}
                    decimals={data?.data?.item?.base_asset_decimals || 18}
                    address={data?.data?.item?.base_asset_address || ""}
                    quoteToken={
                      data?.data?.item?.base_asset_address >
                      data?.data?.item?.quote_asset_address
                        ? "token0"
                        : "token1"
                    }
                  />
                  <HolderTable
                    activeTab={activeTab}
                    network={geckoNetworkName?.[chainId]}
                    address={data?.data?.item?.base_asset_address}
                    chainId={chainId}
                    total={data?.data?.item?.total_supply}
                    price={data?.data?.item?.base_asset_price_usd}
                  />
                  <OverviewItem
                    title="Collection Story"
                    value={collectionDetails?.collection_story || "-"}
                  />
                </CardContent>
              </Card>
            ) : null}
            <PoolInfoCard
              poolInfo={data?.data?.item}
              chainId={chainId}
              status={status}
              collectionAddress={erc20Address}
              type={type}
              conversionRatio={collectionDetails?.conversion_ratio || 0}
            />
          </Grid>
        </TokenPriceProvider>
      </Grid>
    </Box>
  );
};

export default Trade;
