import React, { useCallback, useMemo } from "react";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { formatAddress, formatTokenFixedto } from "@/utils/format";
import { SCAN_URL_ID } from "@/constants/url";
import { NoDataSearched } from "@/components/search-not-found/no-data-searched";
import { SwapTx, useTokenSwapTxsById } from "@/services/graphql/swap-txs";
import { formatTimeDistance } from "@/views/trade/trades-table";

interface SwapTxTableProps {
  tokenAddress?: string;
  tokenSymbol?: string;
  chainId: number;
}

const SwapTxTable = ({
  tokenAddress,
  chainId,
  tokenSymbol,
}: SwapTxTableProps) => {
  const { data, isLoading, fetchNextPage, hasNextPage } = useTokenSwapTxsById(
    tokenAddress || "",
  );

  const loadMoreItems = (startIndex: number, stopIndex: number) => {
    if (isLoading || !hasNextPage) return Promise.resolve();
    return fetchNextPage().then(() => undefined);
  };

  const isItemLoaded = useCallback(
    (index: number) => {
      const page = data?.pages?.[Math.floor(index / 30)];
      return !!page?.tokenEntity?.swapTxs?.[index % 30];
    },
    [data],
  );

  const headers = useMemo(
    () => [
      { label: "DATE", width: 120 },
      { label: "TYPE", width: 100 },
      // { label: "PRICE ETH", width: 120 },
      { label: tokenSymbol, width: 120 },
      { label: "ETH VALUE", width: 120 },
      { label: "FROM", width: 120 },
      { label: "TX", width: 100 },
    ],
    [tokenSymbol],
  );

  const Row = ({ index, style }: ListChildComponentProps) => {
    const page = data?.pages?.[Math.floor(index / 30)];
    const row = page?.tokenEntity?.swapTxs?.[index % 30];

    if (!row) {
      return null;
    }

    return (
      <Box
        key={row.id}
        style={style}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          backgroundColor: "#0f111c",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Poppins",
            color: "#FFF",
            fontSize: 12,
            width: 120,
          }}
        >
          {formatTimeDistance(new Date(Number(row.timestamp) * 1000))}
        </Typography>
        <Typography
          sx={{
            fontFamily: "Poppins",
            color: Number(row.direction) === 0 ? "#00B912" : "#FF0000",
            fontSize: 12,
            width: 100,
          }}
        >
          {Number(row.direction) === 0 ? "Buy" : "Sell"}
        </Typography>
        {/* <Typography
          sx={{
            fontFamily: "Poppins",
            color: "#FFF",
            fontSize: 12,
            width: 120,
          }}
        >
          {formatTokenFixedto(row.nativeAmount)}
        </Typography> */}
        <Typography
          sx={{
            fontFamily: "Poppins",
            color: "#FFF",
            fontSize: 12,
            width: 120,
          }}
        >
          {formatTokenFixedto(row.erc20Amount)}
        </Typography>
        <Typography
          sx={{
            fontFamily: "Poppins",
            color: "#FFF",
            fontSize: 12,
            width: 120,
          }}
        >
          {formatTokenFixedto(row.nativeAmount)}
        </Typography>
        <Typography
          sx={{
            fontFamily: "Poppins",
            color: "#FFF",
            fontSize: 12,
            width: 120,
          }}
        >
          {formatAddress(row.from)}
        </Typography>
        <Link
          href={`${SCAN_URL_ID[chainId || "1"]}tx/${row.hash}`}
          target="_blank"
          style={{
            color: "#00B912",
            textDecoration: "underline",
            fontFamily: "Poppins",
            fontSize: 12,
            width: "100px",
          }}
        >
          <svg
            className="share-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 22 22"
            fill="none"
          >
            <g opacity="0.6">
              <path
                d="M19.1641 19.9414H2.87891C2.45137 19.9414 2.10547 19.5955 2.10547 19.168V2.88281C2.10547 2.45527 2.45137 2.10938 2.87891 2.10938H9.62715C10.0547 2.10938 10.4006 2.45527 10.4006 2.88281C10.4006 3.31035 10.0547 3.65625 9.62715 3.65625H3.65234V18.3945H18.3906V12.4541C18.3906 12.0266 18.7365 11.6807 19.1641 11.6807C19.5916 11.6807 19.9375 12.0266 19.9375 12.4541V19.168C19.9375 19.5955 19.5916 19.9414 19.1641 19.9414Z"
                fill="white"
              />
              <path
                d="M19.9348 2.82734V2.8166C19.9327 2.78008 19.9262 2.7457 19.9198 2.71133C19.9198 2.70918 19.9198 2.70703 19.9176 2.70488C19.909 2.66836 19.8983 2.63398 19.8854 2.59961V2.59746C19.8725 2.56309 19.8553 2.53086 19.8381 2.49863C19.8381 2.49648 19.836 2.49648 19.836 2.49434C19.8188 2.46426 19.7995 2.43418 19.778 2.40625C19.7758 2.4041 19.7737 2.3998 19.7715 2.39766C19.7608 2.38477 19.7522 2.37402 19.7415 2.36113C19.7415 2.35898 19.7393 2.35898 19.7393 2.35684C19.7286 2.34395 19.7178 2.3332 19.7049 2.32246L19.6963 2.31387C19.6856 2.30312 19.6727 2.29238 19.662 2.28164L19.6598 2.27949C19.6469 2.26875 19.634 2.25801 19.619 2.24941C19.6168 2.24727 19.6125 2.24512 19.6104 2.24297C19.5803 2.22148 19.5502 2.2043 19.518 2.18711L19.5159 2.18496C19.4815 2.16777 19.4471 2.15273 19.4106 2.14199C19.3762 2.13125 19.3397 2.12051 19.3032 2.11621C19.301 2.11621 19.2989 2.11621 19.2967 2.11406L19.2452 2.10762H19.2387C19.2237 2.10547 19.2108 2.10547 19.1958 2.10547H13.7516C13.3241 2.10547 12.9782 2.45137 12.9782 2.87891C12.9782 3.30645 13.3241 3.65234 13.7516 3.65234H17.2965L10.4752 10.4758C10.1723 10.7787 10.1723 11.2686 10.4752 11.5693C10.6256 11.7197 10.8233 11.7949 11.0231 11.7949C11.2208 11.7949 11.4184 11.7197 11.5709 11.5693L18.3901 4.74805V8.2457C18.3901 8.67324 18.736 9.01914 19.1635 9.01914C19.5911 9.01914 19.937 8.67324 19.937 8.2457V2.88105C19.937 2.86387 19.937 2.84453 19.9348 2.82734Z"
                fill="white"
              />
            </g>
          </svg>
        </Link>
      </Box>
    );
  };

  const noData = useMemo(() => {
    return (
      !isLoading &&
      data?.pages?.every((page) => page?.tokenEntity?.swapTxs?.length === 0)
    );
  }, [isLoading, data]);

  const itemCount =
    data?.pages?.reduce(
      (acc, page) => acc + page?.tokenEntity?.swapTxs?.length,
      0,
    ) || 0;

  return (
    <Box
      sx={{
        height: 500,
        mt: 2,
        width: "100%",
        overflowX: { md: "inherit", xs: "scroll" },
        overflowY: "hidden",
      }}
    >
      <Box sx={{ minWidth: "800px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            backgroundColor: "rgb(27, 29, 40)",
            alignItems: "center",
            // minWidth: 1200,
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
                fontSize: 12,
                textTransform: "uppercase",
              }}
            >
              {item.label}
            </Typography>
          ))}
        </Box>
        {noData ? (
          <NoDataSearched title="No Transactions" />
        ) : (
          <InfiniteLoader
            isItemLoaded={isItemLoaded}
            itemCount={hasNextPage ? itemCount + 1 : itemCount}
            loadMoreItems={loadMoreItems}
          >
            {({ onItemsRendered, ref }: any) => (
              <List
                height={500}
                itemCount={itemCount}
                itemSize={60}
                // style={{ minWidth: 1200 }}
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
    </Box>
  );
};

export default SwapTxTable;
