import { Box, IconButton, ButtonGroup, Button } from "@mui/material";
import { useEffect, useState } from "react";
import SolanaPageRight from "@/views/slug-page/solana-page-right";
import EvmPageRight from "@/views/slug-page/evm-page-right";
import Iconify from "@/components/iconify";
import AISummary from "@/views/trade/components/AI-Summary";

interface RightPanelProps {
  isCollapsed: boolean;
  onCollapse: () => void;
  slug?: string;
  chain?: string;
}

const RightPanel: React.FC<RightPanelProps> = ({
  isCollapsed,
  onCollapse,
  slug,
  chain,
}) => {
  const [content, setContent] = useState<React.ReactNode>(null);
  const [activeTab, setActiveTab] = useState<"trade" | "ai">("trade");

  useEffect(() => {
    if (activeTab === "ai") {
      setContent(<AISummary />);
      return;
    }

    if (!slug || !chain) {
      setContent(
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          Select a token to view details
        </Box>,
      );
      return;
    }

    if (chain === "solana") {
      setContent(<SolanaPageRight slug={slug} chain_name={chain} />);
    } else {
      setContent(<EvmPageRight slug={slug} chain_name={chain} />);
    }
  }, [slug, chain, activeTab]);

  return (
    <Box
      sx={{
        display: { md: "block", xs: "none" },
        width: isCollapsed ? 0 : 500,
        height: "calc(100vh - 80px)",
        position: "fixed",
        right: 0,
        top: 80,
        backgroundColor: "background.paper",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        transition: "width 0.3s ease",
        zIndex: 100,
        overflowY: "auto",
        overflowX: "hidden",
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-track": {
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "rgba(255, 255, 255, 0.2)",
          borderRadius: "4px",
          "&:hover": {
            background: "rgba(255, 255, 255, 0.3)",
          },
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          position: "relative",
          minHeight: "100%",
          overflow: "visible",
        }}
      >
        <IconButton
          onClick={onCollapse}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            zIndex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <Iconify
            icon={
              isCollapsed
                ? "material-symbols:chevron-left"
                : "material-symbols:chevron-right"
            }
            sx={{ color: "text.primary" }}
          />
        </IconButton>

        <Box
          sx={{
            position: "relative",
            width: "100%",
            minHeight: "100%",
            overflow: "visible",
          }}
        >
          {content}
        </Box>
      </Box>
    </Box>
  );
};

export default RightPanel;
