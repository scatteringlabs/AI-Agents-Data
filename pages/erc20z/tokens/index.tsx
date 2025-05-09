import DynamicTabs from "@/components/tabs/DynamicTabs";
import { useErc20ZChain } from "@/context/chain-provider-erc20z";
import {
  useSort,
  ALlTokenSortProvider,
} from "@/context/erc20z-all-token-sort-provider";
import { getZoraTokenTypes } from "@/services/tokens";
import Erc20ZCollectionsTable from "@/views/collections-erc20z/Erc20ZCollectionsTable";
import TimeFilter from "@/views/home/components/hour-filter";
import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

function Collections() {
  return (
    <Box sx={{ mt: 4 }}>
      <div className="tf-section-2 ranking">
        <div className="themesflat-container">
          <div className="row">
            <div className="col-12 mb-30">
              <div className="widget-tabs relative">
                <Erc20ZCollectionsTable />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}

const Page = () => (
  <ALlTokenSortProvider>
    <Collections />
  </ALlTokenSortProvider>
);
export default Page;
