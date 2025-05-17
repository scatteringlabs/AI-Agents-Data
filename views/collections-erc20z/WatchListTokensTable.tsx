import DynamicTabs from "@/components/tabs/DynamicTabs";
import { ERC20ZTopTableHeader } from "./table/table-header";
import { useFavorites } from "@/hooks/useFavorites";
import { useQuery } from "@tanstack/react-query";
import { getZoraTokenTypes } from "@/services/tokens";
import { useCallback, useMemo, useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import Iconify from "@/components/iconify";
import {
  getFavorCollections,
  getCollectionBySlug,
} from "@/services/collections";
import { useSort } from "@/context/erc20z-token-sort-provider";
import { SortFieldMap } from "./table-config";
import Erc20ZTokenTableRow from "./table/table-row";

interface WatchListTokensTableProps {
  chainId: string;
  selectedTime: string;
  onTokenClick?: (slug: string, chain_id: number) => void;
  isRightPanelCollapsed?: boolean;
}

const WatchListTokensTable: React.FC<WatchListTokensTableProps> = ({
  chainId,
  selectedTime,
  onTokenClick,
  isRightPanelCollapsed,
}) => {
  const [selectedTabName, setSelectedTabName] = useState<string>("");
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [hasSelectedFirstToken, setHasSelectedFirstToken] = useState(false);

  const { favorites } = useFavorites();
  const { sortOrder = "desc", sortedField = "1h Chg" } = useSort();

  // 监听排序变化，重置选中状态
  useEffect(() => {
    setHasSelectedFirstToken(false);
    setSelectedRow(null);
  }, [sortOrder, sortedField, selectedTabName]);

  const { data: tokenTypes } = useQuery({
    queryKey: ["getZoraTokenTypes"],
    queryFn: () => getZoraTokenTypes(),
  });
  const tokens = useMemo(() => {
    let t = favorites?.map((f) => ({
      address: f?.address,
      chain_id: f?.chain_id,
    }));
    if (Number(chainId) !== -1) {
      t = t?.filter((i) => Number(i.chain_id) === Number(chainId));
    }
    return t;
  }, [favorites, chainId]);

  const { data: favorCollections } = useQuery({
    queryKey: [
      "getFavorCollections",
      { tokens, selectedTabName, sortOrder, sortedField },
    ],
    queryFn: () =>
      getFavorCollections({
        tokens,
        page: 1,
        type_name: selectedTabName === "All" ? "" : selectedTabName,
        page_size: 100,
        sort_direction: sortOrder || "desc",
        sort_field: SortFieldMap[sortedField || "1h Chg"],
      }),
    enabled: Boolean(tokens?.length),
  });

  // 为每个代币获取详细信息
  const { data: detailedCollections } = useQuery({
    queryKey: ["getDetailedCollections", favorCollections?.data?.list],
    queryFn: async () => {
      if (!favorCollections?.data?.list) return [];
      const detailedList = await Promise.all(
        favorCollections.data.list.map(async (item) => {
          if (!item.slug) return item;
          try {
            const details = await getCollectionBySlug({ slug: item.slug });
            return {
              ...item,
              twitter_username:
                details?.data?.item?.twitter_username || item.twitter_username,
              creator_x_username:
                details?.data?.item?.creator_x_username ||
                item.creator_x_username,
              project_url: details?.data?.item?.project_url,
            };
          } catch (error) {
            console.error("Failed to fetch details for", item.slug, error);
            return item;
          }
        }),
      );
      return detailedList;
    },
    enabled: Boolean(favorCollections?.data?.list?.length),
  });

  const handleDynamicTabsChange = useCallback((id: number, name: string) => {
    setSelectedTabName(name);
  }, []);

  const displayCollections =
    detailedCollections || favorCollections?.data?.list;

  // 默认选中第一行数据
  useEffect(() => {
    if (!hasSelectedFirstToken && displayCollections?.[0] && onTokenClick) {
      const firstToken = displayCollections[0];
      setSelectedRow(firstToken.rank);
      onTokenClick(firstToken.slug, firstToken.chain_id);
      setHasSelectedFirstToken(true);
    }
  }, [displayCollections, hasSelectedFirstToken, onTokenClick]);

  const handleRowClick = (rank: number, slug: string, chainId: number) => {
    setSelectedRow(rank);
    if (onTokenClick) {
      onTokenClick(slug, chainId);
    }
  };

  return (
    <div className="widget-content-tab pt-2 pb-4">
      <DynamicTabs
        total={favorCollections?.data?.total_count || 0}
        tabs={[{ rank: 0, name: "All" }].concat(tokenTypes?.data?.list || [])}
        onChange={handleDynamicTabsChange}
      />
      <div className="widget-content-inner">
        <div className="widget-table-ranking">
          <ERC20ZTopTableHeader selectedTime={selectedTime} />
          <div
            className="table-ranking-content"
            style={{ minHeight: "calc(100vh - 400px)" }}
          >
            {favorites?.length === 0 ? (
              <Box
                sx={{
                  height: "100%",
                  minHeight: "301px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#888",
                  textAlign: "center",
                  px: 2,
                }}
              >
                <Iconify
                  icon="material-symbols-light:star-outline"
                  width={48}
                  height={48}
                  color="#ccc"
                />
                <Typography variant="h5" sx={{ mt: 2 }}>
                  No tokens in your watchlist
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Click the star icon on any token to add it here.
                </Typography>
              </Box>
            ) : (
              displayCollections?.map((item) => (
                <Erc20ZTokenTableRow
                  key={item.erc20_address}
                  item={item}
                  selectedTime={selectedTime}
                  onClick={() =>
                    handleRowClick(item.rank, item.slug, item.chain_id)
                  }
                  isSelected={selectedRow === item.rank}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchListTokensTable;
