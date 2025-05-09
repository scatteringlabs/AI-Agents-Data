import { ERC20ZSortProvider } from "@/context/erc20z-token-sort-provider";
import { NewTokenSortProvider } from "@/context/new-token-sort-provider";
import { SortProvider } from "@/context/token-sort-provider";
import { ALlTokenSortProvider } from "@/context/erc20z-all-token-sort-provider";
import LaunchpadPage from "@/views/agent-launchpad/launchpad-page";

const Page = () => {
  return (
    <NewTokenSortProvider>
      <ERC20ZSortProvider>
        <SortProvider>
          <ALlTokenSortProvider>
            <LaunchpadPage />
          </ALlTokenSortProvider>
        </SortProvider>
      </ERC20ZSortProvider>
    </NewTokenSortProvider>
  );
};
export default Page;
