import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { formatAddress, formatToken, formatUSD } from "@/utils/format";
import { fetchTransactionList } from "@/services/oklink";
import { useMemo, useState } from "react";
import { SCAN_URL_ID } from "@/constants/url";
import { Card, CardContent, Typography } from "@mui/material";

const TransferTable = ({
  chainShortName,
  tokenContractAddress,
  chainId,
}: {
  chainShortName: string;
  tokenContractAddress: string;
  chainId: number;
}) => {
  const {
    data: transactions,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["transactionList", chainShortName, tokenContractAddress],
    queryFn: () => fetchTransactionList(chainShortName, tokenContractAddress),
    select: (response) =>
      response?.[0].transactionList.map((transaction, index) => ({
        ...transaction,
        id: index,
        transactionTime: Number(transaction.transactionTime),
      })),
    enabled: Boolean(chainShortName && tokenContractAddress),
  });

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "id", headerName: "ID", flex: 0.1 },
      {
        field: "txid",
        headerName: "Transaction ID",
        flex: 0.2,
        renderCell: (params) => (
          <Link
            href={`${SCAN_URL_ID[chainId || "1"]}tx/${params.value}`}
            target="_blank"
          >
            {formatAddress(params.value)}
          </Link>
        ),
      },
      {
        field: "blockHash",
        headerName: "Block Hash",
        flex: 0.2,
        renderCell: (params) => formatAddress(params.value),
      },
      {
        field: "transactionTime",
        headerName: "Transaction Time",
        flex: 0.2,
        renderCell: (params) => new Date(params.value)?.toLocaleString(),
      },
      {
        field: "from",
        headerName: "From Address",
        flex: 0.2,
        renderCell: (params) => (
          <Link
            href={`${SCAN_URL_ID[chainId || "1"]}address/${params.value}`}
            target="_blank"
          >
            {formatAddress(params.value)}
          </Link>
        ),
      },
      {
        field: "to",
        headerName: "To Address",
        flex: 0.2,
        renderCell: (params) => (
          <Link href={`https://etherscan.io/address/${params.value}`}>
            {formatAddress(params.value)}
          </Link>
        ),
      },
      {
        field: "amount",
        headerName: "Amount",
        flex: 0.2,
        renderCell: (params) => formatToken(params.value),
      },
      { field: "state", headerName: "State", flex: 0.1 },
    ],
    [chainId],
  );

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error)
    return <div>An error occurred: {error.message}</div>;

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
          Transfers
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

export default TransferTable;
