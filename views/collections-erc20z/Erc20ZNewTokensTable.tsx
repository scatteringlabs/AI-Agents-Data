import AvatarCard from "@/components/collections/avatar-card";
import PriceChangeText from "@/components/collections/price-change-text";
import DynamicTabs from "@/components/tabs/DynamicTabs";
import SortText from "@/components/button/new-sort-icon-button";
import { ChainIdByName } from "@/constants/chain";
import { useSort } from "@/context/new-token-sort-provider";
import { getCollections, getNewCollections } from "@/services/collections";
import { getTokenTypes, getZoraTokenTypes } from "@/services/tokens";
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
import { useCallback, useState } from "react";
import TopCollection from "../home/TopCollection";
import TopCollectionCard from "../home/components/TopCollectionCard";
import Iconify from "@/components/iconify";
import VerifiedIcon from "@/components/icons/verified-icon";
import { formatDistanceToNow, format } from "date-fns";
import { NoDataSearched } from "@/components/search-not-found/no-data-searched";
import { getNewTokens } from "@/services/collections-erc20z";
import { ERC20ZNewTableHeader } from "./table/table-header";
import { TableSkeleton } from "./table/table-skeleton";
import { SortFieldMap } from "./table-config";
import Erc20ZTokenTableRow from "./table/table-row";

interface Erc20ZNewTokensTableProps {
  chainId: string;
  selectedTime: string;
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
const Erc20ZNewTokensTable: React.FC<Erc20ZNewTokensTableProps> = ({
  chainId,
  selectedTime,
}) => {
  const theme = useTheme();

  const isMd = useMediaQuery(theme.breakpoints.up("md"));
  const [selectedTab, setSelectedTab] = useState<string>("All");
  const [selectedTabId, setSelectedTabID] = useState<number>(0);
  const [paseSize, setPaseSize] = useState<number>(100);
  const router = useRouter();
  const { sortOrder = "desc", sortedField = "24h Vol" } = useSort();
  const handleClick = useCallback(
    ({
      tokenId,
      tokenAddress,
      chain_id,
    }: {
      tokenAddress: string;
      tokenId: number;
      chain_id: number;
    }) => {
      router.push(
        `/collect/${ChainIdByName?.[chain_id]}/${tokenAddress}/${tokenId}/`,
      );
    },
    [router],
  );
  const { data: tokenTypes } = useQuery({
    queryKey: ["getZoraTokenTypes"],
    queryFn: () => getZoraTokenTypes(),
  });

  const handleTabChange = useCallback((key: string) => {
    setSelectedTab(key);
  }, []);
  const handleDynamicTabsChange = useCallback((id: number) => {
    setSelectedTabID(id);
  }, []);

  const { data: collections, isLoading } = useQuery({
    queryKey: [
      "newCollections",
      { paseSize, sortedField, selectedTabId, chainId, sortOrder },
    ],
    queryFn: () =>
      getNewTokens({
        page: 1,
        page_size: paseSize,
        sort_field: SortFieldMap[sortedField || "1h Chg"],
        chain_id: Number(chainId) === -1 ? "" : Number(chainId) || 1,
        sort_direction: sortOrder || "desc",
      }),
  });

  return (
    <div className="widget-content-tab pt-10 pb-4">
      <DynamicTabs
        total={collections?.data?.total_count || 0}
        tabs={[{ rank: 0, name: "All" }].concat(tokenTypes?.data?.list || [])}
        onChange={handleDynamicTabsChange}
      />
      <div className="widget-content-inner">
        <div className="widget-table-ranking">
          <ERC20ZNewTableHeader selectedTime={selectedTime} />
          {isLoading && paseSize !== 12 ? (
            <TableSkeleton />
          ) : (
            <div
              className="table-ranking-content"
              style={{ minHeight: "500px" }}
            >
              {collections?.data?.list?.map((item) => (
                <Erc20ZTokenTableRow
                  item={item}
                  key={item.ft_address}
                  showDate
                />
              ))}

              {collections?.data?.list?.length === 0 ? (
                <NoDataSearched />
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Erc20ZNewTokensTable;
