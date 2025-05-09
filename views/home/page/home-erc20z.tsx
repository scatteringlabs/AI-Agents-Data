import AutoOpenDialog from "@/components/dialog/auto-open-dialog";
import { ChainIdByName } from "@/constants/chain";
import { useChain } from "@/context/chain-provider";
import {
  NewTokenSortProvider,
  useSort as useSortNew,
} from "@/context/new-token-sort-provider";
import { getBanner } from "@/services/home";
import NewTokensTable from "@/views/collections/NewTokensTable";
import TopTokensTable from "@/views/collections/TopTokensTable";
import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import TabTokenType from "../components/tab-token-type";
import Erc20ZTopTokensTable from "@/views/collections-erc20z/Erc20ZTopTokensTable";
import NewTips from "../components/new-tips";
import Erc20ZNewTokensTable from "@/views/collections-erc20z/Erc20ZNewTokensTable";
import TimeFilter from "../components/hour-filter";
import { useErc20ZChain } from "@/context/chain-provider-erc20z";
import { useSort } from "@/context/erc20z-token-sort-provider";

export default function HomePageErc20z() {
  const { chainId } = useErc20ZChain();
  const { setSortedField: setNewSortedField, sortedField: sortedFieldNew } =
    useSortNew();
  const { setSortedField, sortedField } = useSort();
  const [selectedTime, setSelectedTime] = useState<"1h" | "6h" | "24h">("24h");
  const handleTimeChange = (time: "1h" | "6h" | "24h") => {
    setSelectedTime(time);
    if (sortedField !== `${time} Vol`) {
      setSortedField(`${time} Vol`);
    }
    if (sortedFieldNew !== `${time} Vol`) {
      setNewSortedField(`${time} Vol`);
    }
  };
  const [activeTab, setActiveTab] = useState<"top" | "new">("top");
  return (
    <>
      <Box
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "space-between",
          flexDirection: { md: "row", xs: "column" },
        }}
      >
        <TabTokenType activeTab={activeTab} setActiveTab={setActiveTab} />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mt: { md: 0, xs: 2 },
            justifyContent: { md: "flex-end", xs: "space-between" },
          }}
        >
          <TimeFilter value={selectedTime} onChange={handleTimeChange} />
          <Link
            href={`/erc20z/tokens/${ChainIdByName?.[chainId] ? ChainIdByName?.[chainId] : ""}`}
          >
            <Typography
              variant="h5"
              className="font-poppins-400"
              sx={{
                borderRadius: "48px",
                background: "rgba(255, 255, 255, 0.10)",
                padding: { md: "12px 20px", xs: "12px 10px" },
                textTransform: "uppercase",
                fontFamily: "Poppins",
                fontWeight: 500,
                fontSize: { md: 14, xs: 10 },
              }}
            >
              View More
            </Typography>
          </Link>
        </Box>
      </Box>
      <Box
        className="col-12"
        sx={{
          px: { md: "10px", xs: "0 !important" },
          marginTop: { md: "10px !important", xs: "20px !important" },
        }}
      >
        {activeTab === "new" ? <NewTips /> : null}
        <div className="widget-tabs relative">
          {activeTab === "top" ? (
            <Erc20ZTopTokensTable
              chainId={chainId?.toString()}
              selectedTime={selectedTime}
            />
          ) : null}
          {activeTab === "new" ? (
            <Erc20ZNewTokensTable
              chainId={chainId?.toString()}
              selectedTime={selectedTime}
            />
          ) : null}
        </div>
      </Box>
      <AutoOpenDialog />
    </>
  );
}
