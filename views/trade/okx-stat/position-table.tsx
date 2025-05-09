import React, { useCallback, useMemo } from "react";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { formatAddress, formatTokenFixedto } from "@/utils/format";
import { SCAN_URL_ID } from "@/constants/url";
import { useHolders } from "@/services/codex-holder";
import { NoDataSearched } from "@/components/search-not-found/no-data-searched";

interface HolderTableProps {
  address: string;
  network: string;
  activeTab: string;
  chainId: number;
  total: string;
  price: string;
}

const HolderTable = ({
  address,
  network,
  chainId,
  activeTab,
  total,
  price,
}: HolderTableProps) => {
  const {
    data = { pages: [] },
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useHolders({
    address,
    networkId: Number(chainId) === 10000 ? 1399811149 : Number(chainId),
    input: {
      tokenId: `${address}:${Number(chainId) === 10000 ? 1399811149 : Number(chainId)}`,
    },
  });

  const loadMoreItems = (startIndex: number, stopIndex: number) => {
    if (isLoading || !hasNextPage) return Promise.resolve();

    return fetchNextPage().then(() => undefined);
  };

  const isItemLoaded = useCallback(
    (index: number) => {
      const page = data?.pages?.[Math.floor(index / 30)];
      return !!page?.data?.holders?.items?.[index % 30];
    },
    [data],
  );

  const headers = useMemo(
    () => [
      { label: "#", width: 100 },
      { label: "Address", width: 150 },
      { label: "%", width: 150 },
      { label: "Amount", width: 150 },
      { label: "Value", width: 150 },
    ],
    [],
  );

  const Row = ({ index, style }: ListChildComponentProps) => {
    const page = data?.pages?.[Math.floor(index / 30)];
    const row = page?.data?.holders?.items?.[index % 30];
    const percent = (Number(row?.shiftedBalance) / Number(total)) * 100;
    const value = Number(row?.shiftedBalance) * Number(price);
    if (!row) {
      return null;
    }

    return (
      <Box
        key={row.walletId}
        style={style}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "20px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          backgroundColor: "#0f111c",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Poppins",
            color: "#FFF",
            fontSize: 14,
            width: 100,
          }}
        >
          {index + 1}
        </Typography>
        <Link
          href={`${SCAN_URL_ID[chainId || "1"]}address/${row.walletId?.split(":")?.[0]}`}
          target="_blank"
          style={{
            color: "#00B912",
            textDecoration: "underline",
            fontFamily: "Poppins",
            fontSize: 14,
            width: "150px",
          }}
        >
          {formatAddress(row.walletId?.split(":")?.[0])}
        </Link>
        <Typography
          sx={{
            fontFamily: "Poppins",
            color: "#FFF",
            fontSize: 14,
            width: 150,
          }}
        >
          {percent >= 0.01 ? percent.toFixed(2) : "< 0.01"}%
        </Typography>
        <Typography
          sx={{
            fontFamily: "Poppins",
            color: "#FFF",
            fontSize: 14,
            width: 150,
          }}
        >
          {formatTokenFixedto(row?.shiftedBalance || 0)}
        </Typography>
        <Typography
          sx={{
            fontFamily: "Poppins",
            color: "#FFF",
            fontSize: 14,
            width: 150,
          }}
        >
          ${formatTokenFixedto(value)}
        </Typography>
      </Box>
    );
  };
  const noData = useMemo(() => {
    return (
      !isLoading &&
      data?.pages?.every((page) => page?.data?.holders?.items?.length === 0)
    );
  }, [isLoading, data]);
  return (
    <Box
      sx={{
        height: activeTab === "holder" ? 500 : 0,
        opacity: activeTab === "holder" ? 1 : 0,
        mt: activeTab === "holder" ? 2 : 0,
        width: "100%",
        overflowX: { md: "inherit", xs: "scroll" },
        overflowY: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "20px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          backgroundColor: "rgb(27, 29, 40)",
          alignItems: "center",
          minWidth: 700,
        }}
      >
        {headers?.map((item) => (
          <Typography
            key={item.label}
            sx={{
              fontFamily: "Poppins",
              color: "#FFF",
              fontWeight: 500,
              width: item.width,
              fontSize: 14,
              textTransform: "uppercase",
            }}
          >
            {item.label}
          </Typography>
        ))}
      </Box>
      {noData ? (
        <NoDataSearched />
      ) : (
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={
            hasNextPage
              ? data?.pages?.reduce(
                  (acc, page) => acc + page?.data?.holders?.items?.length,
                  0,
                ) + 1
              : data?.pages.reduce(
                  (acc, page) => acc + page?.data?.holders?.items?.length,
                  0,
                )
          }
          loadMoreItems={loadMoreItems}
        >
          {({ onItemsRendered, ref }: any) => (
            <List
              height={500}
              itemCount={data?.pages.reduce(
                (acc, page) => acc + page?.data?.holders?.items?.length,
                0,
              )}
              itemSize={60}
              style={{ minWidth: 700 }}
              width="100%"
              onItemsRendered={onItemsRendered}
              ref={ref}
            >
              {Row}
            </List>
          )}
        </InfiniteLoader>
      )}
    </Box>
  );
};

export default HolderTable;
