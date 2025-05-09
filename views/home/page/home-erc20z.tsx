import AutoOpenDialog from "@/components/dialog/auto-open-dialog";
import { ChainIdByName } from "@/constants/chain";
import { useSort as useSortNew } from "@/context/new-token-sort-provider";
import { Box } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import TabTokenType from "../components/tab-token-type";
import Erc20ZTopTokensTable from "@/views/collections-erc20z/Erc20ZTopTokensTable";
import NewTips from "../components/new-tips";
import TimeFilter from "../components/hour-filter";
import { useErc20ZChain } from "@/context/chain-provider-erc20z";
import { useSort } from "@/context/erc20z-token-sort-provider";
import WatchListTokensTable from "@/views/collections-erc20z/WatchListTokensTable";
import RightPanel from "../components/RightPanel";
import { useRouter } from "next/router";

export default function HomePageErc20z() {
  const router = useRouter();
  const { chainId } = useErc20ZChain();
  const { setSortedField: setNewSortedField, sortedField: sortedFieldNew } =
    useSortNew();
  const { setSortedField, sortedField } = useSort();
  const [selectedTime, setSelectedTime] = useState<"1h" | "6h" | "24h">("24h");
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false);
  const [selectedToken, setSelectedToken] = useState<{
    slug: string;
    chain: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<"top" | "new" | "favor">("top");

  // 从 URL 参数初始化状态
  useEffect(() => {
    const { tab, time } = router.query;
    if (tab && (tab === "top" || tab === "new" || tab === "favor")) {
      setActiveTab(tab);
    }
    // if (time && (time === "1h" || time === "6h" || time === "24h")) {
    //   setSelectedTime(time);
    //   setSortedField(`${time} Vol`);
    //   setNewSortedField(`${time} Vol`);
    // }
  }, [router.query, setNewSortedField]);

  // 当右窗口隐藏时，清除选中状态
  useEffect(() => {
    if (isRightPanelCollapsed) {
      setSelectedToken(null);
    }
  }, [isRightPanelCollapsed]);

  const handleTimeChange = (time: "1h" | "6h" | "24h") => {
    setSelectedTime(time);
    if (sortedField !== `${time} Vol`) {
      setSortedField(`${time} Vol`);
    }
    if (sortedFieldNew !== `${time} Vol`) {
      setNewSortedField(`${time} Vol`);
    }
    // 更新 URL 参数
    // router.push(
    //   {
    //     pathname: router.pathname,
    //     query: { ...router.query, time },
    //   },
    //   undefined,
    //   { shallow: true },
    // );
  };

  const handleTabChange = (tab: "top" | "new" | "favor") => {
    setActiveTab(tab);
    // 更新 URL 参数
    // router.push(
    //   {
    //     pathname: router.pathname,
    //     query: { ...router.query, tab },
    //   },
    //   undefined,
    //   { shallow: true },
    // );
  };

  const handleTokenClick = async (slug: string, chain_id: number) => {
    setSelectedToken({ slug, chain: ChainIdByName[chain_id] });
    if (isRightPanelCollapsed) {
      setIsRightPanelCollapsed(false);
    }

    try {
      const response = await fetch(
        `https://api.scattering.io/api/v2/tokens/${slug}?chain_id=${chain_id}`,
      );
      if (response.ok) {
        const data = await response.json();
        if (data?.data?.item) {
          setSelectedToken((prev) => ({
            ...prev,
            ...data.data.item,
            price_change_in_24hours:
              data.data.item.price_change_in_24hours ||
              data.data.item.price_change,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching token details:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", position: "relative" }}>
      <Box
        sx={{
          p: { md: 4, xs: "16px !important" },
          width: {
            md: `calc(100% - ${isRightPanelCollapsed ? 0 : 400}px)`,
            xs: "100%",
          },
          mt: { md: 8, xs: 8 },
          transition: "width 0.3s ease",
        }}
      >
        <Box
          sx={{
            mt: 8,
            display: "flex",
            justifyContent: "space-between",
            flexDirection: { md: "row", xs: "column" },
            mb: 2,
            pr: isRightPanelCollapsed ? 0 : "140px",
            transition: "padding-right 0.3s ease",
          }}
        >
          <TabTokenType
            activeTab={activeTab}
            setActiveTab={(value) => {
              if (typeof value === "function") {
                const newValue = value(activeTab);
                handleTabChange(newValue);
              } else {
                handleTabChange(value);
              }
            }}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: { md: 0, xs: 2 },
              justifyContent: { md: "flex-end", xs: "space-between" },
              transform: isRightPanelCollapsed ? "translateX(-100px)" : "none",
              transition: "transform 0.3s ease",
              "& .MuiButton-root": {
                color: "rgba(255, 255, 255, 0.5)",
                "&.Mui-selected": {
                  color: "#fff",
                  backgroundColor: "rgba(147, 51, 234, 0.5)",
                  fontWeight: "bold",
                  boxShadow: "0 0 10px rgba(147, 51, 234, 0.7)",
                },
                "&:hover": {
                  backgroundColor: "rgba(147, 51, 234, 0.3)",
                },
              },
            }}
          >
            <TimeFilter value={selectedTime} onChange={handleTimeChange} />
          </Box>
        </Box>
        <Box
          className="col-12"
          sx={{
            px: { md: "10px", xs: "0 !important" },
            marginTop: { md: "10px !important", xs: "20px !important" },
            height: "calc(100vh - 250px)",
            display: "flex",
            flexDirection: "column",
            "& .MuiTableRow-root.Mui-selected": {
              backgroundColor: "rgba(147, 51, 234, 0.6)",
              "&:hover": {
                backgroundColor: "rgba(147, 51, 234, 0.7)",
              },
              "& .MuiTableCell-root": {
                color: "#fff",
                fontWeight: "bold",
                textShadow: "0 0 5px rgba(147, 51, 234, 0.8)",
                borderBottom: "2px solid rgba(147, 51, 234, 0.8)",
              },
              "&::before": {
                content: '""',
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "4px",
                backgroundColor: "rgba(147, 51, 234, 0.8)",
              },
            },
          }}
        >
          {activeTab === "new" ? <NewTips /> : null}
          <Box
            sx={{
              overflowY: "auto",
              overflowX: "auto",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              "&::-webkit-scrollbar": {
                height: "8px",
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
              width: "100%",
              position: "relative",
            }}
          >
            <Box
              sx={{
                minWidth: "2200px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                paddingRight: isRightPanelCollapsed ? 0 : "160px",
                position: "relative",
                overflowX: "auto",
                width: "100%",
                "& .widget-content-tab": {
                  minWidth: "2000px",
                  overflowX: "auto",
                  "&::-webkit-scrollbar": {
                    height: "8px",
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
                },
              }}
            >
              <div
                className="widget-tabs relative"
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  minWidth: "1700px",
                }}
              >
                {activeTab === "top" ? (
                  <Erc20ZTopTokensTable
                    chainId={chainId?.toString()}
                    selectedTime={selectedTime}
                    onTokenClick={handleTokenClick}
                    isRightPanelCollapsed={isRightPanelCollapsed}
                  />
                ) : null}
              </div>
              <div
                className="widget-tabs relative"
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {activeTab === "favor" ? (
                  <WatchListTokensTable
                    chainId={chainId?.toString()}
                    selectedTime={selectedTime}
                  />
                ) : null}
              </div>
            </Box>
          </Box>
        </Box>
        <AutoOpenDialog />
      </Box>
      {!isRightPanelCollapsed && (
        <RightPanel
          isCollapsed={isRightPanelCollapsed}
          onCollapse={() => setIsRightPanelCollapsed(!isRightPanelCollapsed)}
          slug={selectedToken?.slug}
          chain={selectedToken?.chain}
        />
      )}
    </Box>
  );
}
