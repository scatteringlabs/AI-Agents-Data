import { NoCollectionSearched } from "@/components/search-not-found/no-collection-searched";
import { getCollections } from "@/services/collections-erc20z";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useSort } from "@/context/erc20z-token-sort-provider";
import { SortFieldMap } from "./table-config";
import { ERC20ZTopTableHeader } from "./table/table-header";
import { TableSkeleton } from "./table/table-skeleton";
import { Erc20ZTokenTableRow } from "./table/table-row";
import DynamicTabs from "@/components/tabs/DynamicTabs";
import { getZoraTokenTypes } from "@/services/tokens";

interface Erc20ZTopTokensTableProps {
  chainId: string;
  selectedTime: string;
}

const Erc20ZTopTokensTable: React.FC<Erc20ZTopTokensTableProps> = ({
  chainId,
  selectedTime,
}) => {
  const [paseSize, setPaseSize] = useState<number>(100);
  const { sortOrder = "desc", sortedField = "24h Vol" } = useSort();
  const [selectedTabId, setSelectedTabID] = useState<number>(0);

  const { data: collections, isLoading } = useQuery({
    queryKey: [
      "collections",
      { paseSize, sortedField, chainId, sortOrder, selectedTabId },
    ],
    queryFn: () =>
      getCollections({
        page: 1,
        page_size: paseSize,
        sort_field: SortFieldMap[sortedField || "24h Vol"],
        parent_type_id: selectedTabId,
        chain_id: Number(chainId) === -1 ? "" : Number(chainId) || 1,
        sort_direction: sortOrder || "desc",
      }),
  });
  const { data: tokenTypes } = useQuery({
    queryKey: ["getZoraTokenTypes", { chainId }],
    queryFn: () => getZoraTokenTypes(Number(chainId)),
  });
  const handleDynamicTabsChange = useCallback((id: number) => {
    setSelectedTabID(id);
  }, []);

  return (
    <div className="widget-content-tab pt-2 pb-4">
      <DynamicTabs
        total={collections?.data?.total_count || 0}
        tabs={[{ id: 0, name: "All" }].concat(tokenTypes?.data?.list || [])}
        onChange={handleDynamicTabsChange}
      />
      <div className="widget-content-inner">
        <div className="widget-table-ranking">
          <ERC20ZTopTableHeader selectedTime={selectedTime} />
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <div
              className="table-ranking-content"
              style={{ minHeight: "500px" }}
            >
              {collections?.data?.list?.map((item) => (
                <Erc20ZTokenTableRow
                  item={item}
                  key={item.erc20_address}
                  selectedTime={selectedTime}
                />
              ))}

              {collections?.data?.list?.length === 0 ? (
                <NoCollectionSearched />
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Erc20ZTopTokensTable;
