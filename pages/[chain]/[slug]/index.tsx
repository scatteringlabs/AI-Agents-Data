import EvmSlug from "@/views/slug-page/evm-page";
import SolanaSlug from "@/views/slug-page/solana-page";
import { Box } from "@mui/material";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug, chain } = context.query;

  return {
    props: {
      slug: slug || null,
      chain: chain || null,
    },
  };
};

const Tabpage = ({
  slug,
  chain,
}: {
  slug: string | null;
  chain: string | null;
}) => {
  if (chain === "solana") {
    return <SolanaSlug slug={slug || ""} chain_name={chain} />;
  } else if (chain && slug) {
    return <EvmSlug slug={slug} chain_name={chain} />;
  }
};

export default Tabpage;
