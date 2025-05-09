import { useChain } from "@/context/chain-provider";
import { SortProvider } from "@/context/token-sort-provider";
import CollectionsTable from "@/views/collections/CollectionsTable";
import { Box } from "@mui/material";
export default function Collections() {
  const { chainId } = useChain();

  return (
    <Box sx={{ mt: 4 }}>
      <div className="tf-section-2 ranking">
        <div className="themesflat-container">
          <div className="row">
            <div className="col-12 mb-30">
              <div className="widget-tabs relative">
                <div className="tf-soft"></div>
                <SortProvider>
                  <CollectionsTable chainId={chainId?.toString()} />
                </SortProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}
