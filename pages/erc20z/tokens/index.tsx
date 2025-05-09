import { ALlTokenSortProvider } from "@/context/erc20z-all-token-sort-provider";
import Erc20ZCollectionsTable from "@/views/collections-erc20z/Erc20ZCollectionsTable";
import { Box } from "@mui/material";

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
