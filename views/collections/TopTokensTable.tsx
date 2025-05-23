import AvatarCard from "@/components/collections/avatar-card";
import PriceChangeText from "@/components/collections/price-change-text";
import { NoCollectionSearched } from "@/components/search-not-found/no-collection-searched";
import DynamicTabs from "@/components/tabs/DynamicTabs";
import SortText from "@/components/text/sort-text";
import { ChainIdByName } from "@/constants/chain";
import { SortProvider, useSort } from "@/context/token-sort-provider";
import { getCollections } from "@/services/collections";
import { getTokenTypes } from "@/services/tokens";
import {
  formatIntNumberWithKM,
  formatNumberWithKM,
  formatUSD,
} from "@/utils/format";
import { getTokenLogoURL } from "@/utils/token";
import {
  Box,
  Grid,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useState, useTransition } from "react";
import TopCollection from "../home/TopCollection";
import TopCollectionCard from "../home/components/TopCollectionCard";
import Iconify from "@/components/iconify";
import VerifiedIcon from "@/components/icons/verified-icon";
const SortFieldMap: Record<string, string> = {
  Price: "price_in_usd",
  "Market Cap": "market_cap",
  Liquidity: "liquidity",
  "24h Chg": "price_change",
  "24h Vol": "volume",
};

interface TopTokensTableProps {
  chainId: string;
}

interface CollectionsParams {
  selectedTabId?: number;
  chainId: number;
  sortOrder?: string;
  sortedField?: string;
}
const pageSizes = [10, 25, 50, 100];

const RankText = styled(Typography)`
  color: #fff;
  font-family: Poppins;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 26px;
  text-transform: capitalize;
`;
const TopTokensTable: React.FC<TopTokensTableProps> = ({ chainId }) => {
  const theme = useTheme();
  const [isPending, startTransition] = useTransition();
  const isMd = useMediaQuery(theme.breakpoints.up("md"));
  const [selectedTab, setSelectedTab] = useState<string>("All");
  const [selectedTabId, setSelectedTabID] = useState<number>(0);
  const [paseSize, setPaseSize] = useState<number>(10);
  const router = useRouter();
  const { sortOrder = "desc", sortedField = "24h Vol" } = useSort();
  const handleClick = useCallback(
    ({
      erc20_address,
      chain_id,
    }: {
      erc20_address: string;
      chain_id: number;
    }) => {
      router.push(
        `/collection/${ChainIdByName?.[Number(chain_id)]}/${erc20_address}`,
      );
    },
    [router],
  );
  const { data: tokenTypes } = useQuery({
    queryKey: ["tokenTypes", { chainId }],
    queryFn: () => getTokenTypes(Number(chainId)),
  });

  const handleTabChange = useCallback((key: string) => {
    startTransition(() => {
      setSelectedTab(key);
    });
  }, []);

  const handleDynamicTabsChange = useCallback((id: number) => {
    startTransition(() => {
      setSelectedTabID(id);
    });
  }, []);

  const handlePaseSizeChange = useCallback((size: number) => {
    startTransition(() => {
      setPaseSize(size);
    });
  }, []);

  const { data: collections, isLoading } = useQuery({
    queryKey: [
      "collections",
      { paseSize, sortedField, selectedTabId, chainId, sortOrder },
    ],
    queryFn: () =>
      getCollections({
        page: 1,
        page_size: paseSize,
        sort_field: SortFieldMap[sortedField || "24h Vol"],
        chain_id: Number(chainId) === -1 ? "" : Number(chainId) || 1,
        sort_direction: sortOrder || "desc",
      }),
  });

  return (
    <>
      <DynamicTabs
        total={collections?.data?.total_count || 0}
        tabs={[{ rank: 0, name: "All" }].concat(tokenTypes?.data?.list || [])}
        onChange={handleDynamicTabsChange}
      />
      {paseSize !== 12 ? (
        <div className="widget-content-tab pt-10">
          <div className="widget-content-inner">
            <div className="widget-table-ranking">
              <Box
                sx={{ padding: "12px 10px !important" }}
                data-wow-delay="0s"
                className="wow fadeInUp table-ranking-heading"
              >
                {/* <Box className="column0" sx={{ width: "10px" }}>
                  <h3>#</h3>
                </Box> */}
                <div className="column1">
                  <h3>Collections</h3>
                </div>
                <div className="column2">
                  <SortText title="Price" />
                </div>
                <div className="column">
                  <SortText title="24h Chg" />
                </div>
                <div className="column">
                  <SortText title="24h Vol" />
                </div>
                <div className="column">
                  <SortText title="Liquidity" />
                </div>
                <div className="column">
                  <SortText title="Market Cap" />
                </div>
              </Box>
              {isLoading && paseSize !== 12 ? (
                <Box>
                  {Array.from({ length: 10 }, (_, index) => index + 1).map(
                    (item) => (
                      <Skeleton
                        key={item}
                        sx={{
                          background: "#331f44",
                          borderRadius: 2,
                          height: 100,
                        }}
                      />
                    ),
                  )}
                </Box>
              ) : (
                <div
                  className="table-ranking-content"
                  style={{ minHeight: "500px" }}
                >
                  {collections?.data?.list?.map((item) => (
                    <Box
                      key={item.rank}
                      data-wow-delay="0s"
                      className="wow fadeInUp fl-row-ranking"
                      sx={{
                        cursor: "pointer",
                        padding: "12px 10px !important",
                        "&:hover": {
                          background: "rgba(255, 255, 255, 0.05)",
                          borderRadius: "6px !important",
                        },
                      }}
                      onClick={() =>
                        handleClick({
                          erc20_address: item.erc20_address,
                          chain_id: item.chain_id,
                        })
                      }
                    >
                      {/* <Box className="td0" sx={{ width: "10px" }}>
                        <div className="item-rank">
                          <RankText>{item.rank}</RankText>
                        </div>
                      </Box> */}
                      <div className="td1">
                        <RankText>{item.rank}.</RankText>

                        <AvatarCard
                          hasLogo={true}
                          logoUrl={item?.logo_url}
                          symbol={item.symbol}
                          chainId={item.chain_id}
                          size={48}
                        />
                        <Box>
                          <div
                            className="item-name"
                            style={{
                              marginBottom: "0px",
                              fontSize: 16,
                              padding: "6px 0px",
                              display: "flex",
                              alignItems: "center",
                              textTransform: "uppercase",
                            }}
                          >
                            {item?.is_verified ? (
                              <span style={{ marginRight: "6px" }}>
                                <VerifiedIcon size={16} />
                              </span>
                            ) : null}
                            {item.symbol}
                            {item.twitter_username && (
                              <Link 
                                href={`https://twitter.com/${item.twitter_username}`} 
                                target="_blank"
                                style={{
                                  marginLeft: '8px',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <img 
                                  src="/images/twitter.svg" 
                                  alt="Twitter" 
                                  style={{
                                    width: '16px',
                                    height: '16px',
                                    transition: 'opacity 0.2s',
                                  }}
                                  onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'}
                                  onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                                />
                              </Link>
                            )}
                          </div>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: 12,
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: "200px",
                              overflow: "hidden",
                            }}
                          >
                            {item.name}
                          </Typography>
                        </Box>
                        <Typography
                          sx={{
                            border: "1px solid",
                            fontSize: "12px",
                            padding: "4px 8px",
                            borderColor: item?.collection_type?.color,
                            borderRadius: "6px",
                            color: item?.collection_type?.color,
                          }}
                        >
                          {item?.collection_type?.name || ""}
                        </Typography>
                      </div>
                      <div className="td2">
                        <h6 className="price gem">
                          {/* <i className="icon-gem" /> */}
                          {formatUSD(item.price_in_usd)}
                        </h6>
                      </div>
                      <div
                        className={`td3 ${Number(item.price_change) < 0 ? "danger" : "success"}`}
                      >
                        <PriceChangeText priceChange={item.price_change} />
                      </div>
                      <div
                        className={`td4 ${item.volume_change ? "danger" : "success"}`}
                      >
                        <h6>{formatNumberWithKM(item.volume, "$")}</h6>
                      </div>
                      <div className="td5">
                        <h6>{formatNumberWithKM(item.liquidity, "$")}</h6>
                      </div>
                      <div className="td6">
                        <h6>{formatNumberWithKM(item.market_cap, "$")}</h6>
                      </div>
                    </Box>
                  ))}

                  {collections?.data?.list?.length === 0 ? (
                    <NoCollectionSearched />
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
      {isLoading && paseSize === 12 ? (
        <Grid container spacing={2} sx={{ mt: 4 }}>
          {Array.from({ length: 12 }, (_, index) => index + 1).map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item} sx={{ p: 0 }}>
              <Skeleton
                sx={{
                  background: "#331f44",
                  borderRadius: 2,
                  height: 100,
                }}
              />
            </Grid>
          ))}
        </Grid>
      ) : paseSize === 12 ? (
        <Grid
          container
          spacing={isMd ? 4 : 0}
          sx={{ mt: 4, minHeight: { md: 400, xs: "auto" } }}
        >
          {collections?.data?.list?.map((item) => (
            <TopCollectionCard key={item?.rank} {...item} />
          ))}
        </Grid>
      ) : null}
      <Stack flexDirection="row" alignItems="center" sx={{ mt: 4, mb: 6 }}>
        <Typography
          sx={{
            mr: 1,
            color: "rgba(255, 255, 255,0.6)",
            fontFamily: "Poppins",
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: "500",
          }}
        >
          Show top
        </Typography>
        {pageSizes?.map((size) => (
          <Typography
            onClick={() => handlePaseSizeChange(size)}
            sx={{
              background: "rgba(255,255,255,0.1)",
              p: 1.4,
              m: "1px",
              fontSize: "12px",
              cursor: "pointer",
              color: paseSize === size ? "#B054FF" : "",
            }}
            key={size}
          >
            {size}
          </Typography>
        ))}
        <Typography
          onClick={() => handlePaseSizeChange(12)}
          sx={{
            background: "rgba(255,255,255,0.1)",
            p: 1.3,
            m: "1px",
            cursor: "pointer",
            color: paseSize === 12 ? "#B054FF" : "",
          }}
        >
          <Iconify icon="gridicons:grid" />
        </Typography>
      </Stack>
    </>
  );
};

export default TopTokensTable;
