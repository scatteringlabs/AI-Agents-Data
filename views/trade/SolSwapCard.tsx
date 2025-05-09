import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Token } from "@uniswap/sdk-core";
import { SolBaseTokens } from "@/constants/chain";
import Preloader from "@/components/elements/Preloader";
import SolTokenCard from "./swap/sol/sol-token-card";
import SolTokenProvider from "@/context/sol-token-provider";
import { useSolBalance } from "@/hooks/sol/useSolanaBalance";
import useSolTokenBalance from "@/hooks/sol/useTokenBalance";
import { formatTokenFixedto } from "@/utils/format";

export type TabType = "Buy" | "Sell";
interface iSolSwapCard {
  symbol?: string;
  erc20Address?: string;
  decimals: number;
  chainId: number;
  logo_url: string;
}

function SolSwapCard({
  symbol,
  decimals,
  erc20Address = "",
  logo_url,
  chainId,
}: iSolSwapCard) {
  const [activeTab, setActiveTab] = useState<TabType>("Buy");
  const [initFlag, setInitFlag] = useState<boolean>(false);
  const { balance: solBalance, refresh: refreshSolBalance } = useSolBalance();
  const { balances, refetch: refetchTokenBalance } =
    useSolTokenBalance(erc20Address);
  const tokenBalance = useMemo(() => balances?.[0]?.balance, [balances]);
  const erc404Token = useMemo(
    () => ({
      address: erc20Address,
      decimals,
      symbol: symbol,
      name: symbol,
    }),
    [erc20Address, symbol, decimals],
  );

  useEffect(() => {
    if (initFlag) {
      refetchTokenBalance();
      refreshSolBalance();
    }
  }, [initFlag, refreshSolBalance, refetchTokenBalance]);
  if (!erc404Token) {
    return <Preloader />;
  }
  return (
    <Card
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        color: "white",
      }}
    >
      <Stack
        sx={{ mx: 3, mt: 3 }}
        flexDirection="row"
        justifyContent="space-between"
      >
        <Box>
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              columnGap: 1,
              fontSize: 14,
              fontWeight: 400,
              color: "#fff",
              mt: 2,
            }}
          >
            Your Balance: {formatTokenFixedto(tokenBalance)}
          </Typography>
        </Box>
        <ButtonGroup variant="text">
          {["Buy", "Sell"].map((m) => (
            <Button
              key={m}
              onClick={() => {
                setActiveTab(m as TabType);
                setInitFlag(true);
              }}
              sx={{
                color: activeTab === m ? "#fff" : "#b0b0b0",
                backgroundColor:
                  activeTab === m ? "#9b51e0" : "rgba(255, 255, 255, 0.10)",
                fontWeight: 600,
                textTransform: "none",
                border: "none",
                padding: "8px 20px",
                fontFamily: "Poppins",
                borderRight: "1px solid #0f071c !important",
                borderLeft: "1px solid #0f071c !important",
                borderRadius: 2,
                fontSize: 14,
                "&:hover": {
                  backgroundColor: activeTab === m ? "#9b51e0" : "#333333",
                },
              }}
            >
              {m}
            </Button>
          ))}
        </ButtonGroup>
      </Stack>
      <SolTokenProvider initialToken={SolBaseTokens?.[0] as Token}>
        <SolTokenCard
          isSol={true}
          baseTokens={SolBaseTokens as Token[]}
          erc20Address={erc20Address || ""}
          type={activeTab}
          chainId={chainId}
          initFlag={initFlag}
          setInitFlag={setInitFlag}
          currentToken={erc404Token}
          symbol={symbol || ""}
          logo_url={logo_url}
          hasLogo={!!logo_url}
        />
      </SolTokenProvider>
    </Card>
  );
}

export default SolSwapCard;
