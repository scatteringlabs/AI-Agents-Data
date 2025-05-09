import EvmSlug from "@/views/slug-page/evm-page";
import SolanaSlug from "@/views/slug-page/solana-page";
import { Box } from "@mui/material";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { tokenAddress, chain, tab } = context.query;

  return {
    props: {
      tokenAddress: tokenAddress || null,
      chain: chain || null,
      tab: tab || null,
    },
  };
};

const Tabpage = ({
  tokenAddress,
  chain,
  tab,
}: {
  tokenAddress: string | null;
  chain: string | null;
  tab: string | null;
}) => {
  if (chain === "solana") {
    return <SolanaSlug token={tokenAddress || ""} chain_name={chain} />;
  } else if (chain && tokenAddress) {
    return <EvmSlug token={tokenAddress} chain_name={chain} />;
  }
};

export default Tabpage;
