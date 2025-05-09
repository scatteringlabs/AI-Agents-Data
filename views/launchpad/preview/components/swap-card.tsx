import Tabs from "@/components/tabs/Tabs";
import { Box, Grid, Typography } from "@mui/material";
import BuyTokenInputCard from "./buy-token-input-card";
import SellTokenInputCard from "./sell-token-input-card";
import { useMemo, useState } from "react";
import { TokenEntity } from "@/services/graphql/all-token";
import { useChainId } from "wagmi";
import { BaseSID } from "../../create/tokenService";

const tabs = ["Buy", "Sell"];

const SwapCard = ({
  tokenAddress,
  tokenSymbol,
  logo,
  refetch,
  info,
  nftQuantity,
}: {
  tokenAddress: string;
  tokenSymbol: string;
  logo: string;
  refetch: () => void;
  info?: TokenEntity;
  nftQuantity?: number;
}) => {
  const [type, setType] = useState("Buy");
  const chainId = useChainId();
  const isCurrentChain = useMemo(() => chainId === BaseSID, [chainId]);
  return (
    <Grid item xs={12}>
      <Box
        sx={{
          backgroundColor: "#171525",
          borderRadius: "8px",
          padding: 2,
        }}
      >
        <Box sx={{ width: { md: "400px", xs: "100%" } }}>
          <Tabs
            widthFull
            items={tabs}
            onChange={(val) => {
              setType(val);
            }}
          />
        </Box>
        {type === "Buy" ? (
          <BuyTokenInputCard
            logo={logo}
            tokenAddress={tokenAddress}
            tokenSymbol={tokenSymbol}
            refetch={refetch}
            info={info}
            nftQuantity={nftQuantity}
            isCurrentChain={isCurrentChain}
          />
        ) : null}
        {type === "Sell" ? (
          <SellTokenInputCard
            logo={logo}
            tokenAddress={tokenAddress}
            tokenSymbol={tokenSymbol}
            refetch={refetch}
            info={info}
            nftQuantity={nftQuantity}
            isCurrentChain={isCurrentChain}
          />
        ) : null}
      </Box>
    </Grid>
  );
};

export default SwapCard;
