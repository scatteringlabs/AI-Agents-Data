import { fetchTransactionStats } from "@/services/oklink";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { formatAddress, formatToken, formatUSD } from "@/utils/format";
import { SCAN_URL_ID } from "@/constants/url";
import { useMemo, useState } from "react";

const TransactionStats = ({
  chainShortName,
  tokenContractAddress,
  chainId,
}: {
  chainShortName: string;
  tokenContractAddress: string;
  chainId: number;
}) => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const {
    data: transactions,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["transactionStats", chainShortName, tokenContractAddress],
    queryFn: () => fetchTransactionStats(chainShortName, tokenContractAddress),
    select: (response) =>
      response?.[0].transactionAddressList.map((transaction, index) => ({
        ...transaction,
        id: index,
      })),
    enabled: Boolean(chainShortName && tokenContractAddress),
  });
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "address",
        headerName: "Address",
        flex: 1,
        renderCell: (params) => (
          <Link
            href={`${SCAN_URL_ID[chainId || "1"]}address/${params.value}`}
            target="_blank"
          >
            {formatAddress(params.value)}
          </Link>
        ),
      },
      { field: "buyCount", headerName: "Buy Count", flex: 1 },
      // {
      //   field: "buyAmount",
      //   headerName: "Buy Amount",
      //   flex: 1,
      //   renderCell: (params) => formatToken(params.value),
      // },
      { field: "sellCount", headerName: "Sell Count", flex: 1 },
      // {
      //   field: "sellAmount",
      //   headerName: "Sell Amount",
      //   flex: 1,
      //   renderCell: (params) => formatToken(params.value),
      // },
      { field: "txnCount", headerName: "Transaction Count", flex: 1 },
      // {
      //   field: "txnAmount",
      //   headerName: "Transaction Amount",
      //   flex: 1,
      //   renderCell: (params) => formatToken(params.value),
      // },
      // {
      //   field: "buyValueUsd",
      //   headerName: "Buy Value (USD)",
      //   flex: 1,
      //   renderCell: (params) => formatUSD(params.value),
      // },
      // {
      //   field: "sellValueUsd",
      //   headerName: "Sell Value (USD)",
      //   flex: 1,
      //   renderCell: (params) => formatUSD(params.value),
      // },
      // {
      //   field: "txnValueUsd",
      //   headerName: "Total Transaction Value (USD)",
      //   flex: 1,
      //   renderCell: (params) => formatUSD(params.value),
      // },
    ],
    [chainId],
  );
  return (
    <Card
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        color: "white",
        flexGrow: 1,
        mt: 2,
      }}
    >
      <CardContent
        sx={{
          overflowX: { xs: "scroll", md: "initial" },
          pb: "16px !important",
        }}
      >
        <Typography
          sx={{
            color: "#fff",
            fontSize: "16px",
            fontWeight: 500,
            fontFamily: "Poppins",
            mb: 1,
          }}
        >
          24H Top Buys/Sells Address
        </Typography>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            disableRowSelectionOnClick
            sx={{
              maxHeight: 700,
              width: "100%",
              mb: 2,
              "& .MuiDataGrid-columnHeaders": {
                fontSize: "12px",
                fontFamily: "Poppins",
              },
              "& .MuiDataGrid-cell": {
                fontSize: "12px",
                fontFamily: "Poppins",
              },
            }}
            rows={transactions || []}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 20]}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionStats;
