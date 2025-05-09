interface ColumnConfig {
  title: string;
  key: string;
  className?: string;
  sort: boolean;
}
const commonColumns: ColumnConfig[] = [
  {
    title: "Tokens",
    key: "collections",
    sort: false,
    className: "column1",
  },
  { title: "Mints", key: "total_mints", sort: true, className: "column2" },
  { title: "Price", key: "price", sort: true, className: "column2" },
];

const tokenColumns: ColumnConfig[] = [
  { title: "1h Chg", key: "1h_chg", sort: true, className: "column" },
  { title: "6h Chg", key: "6h_chg", sort: true, className: "column" },
  { title: "24h Chg", key: "24h_chg", sort: true, className: "column" },
  // { title: "1h Vol", key: "1h_vol", sort: true, className: "column" },
  // { title: "6h Vol", key: "6h_vol", sort: true, className: "column" },
  { title: "24h Vol", key: "24h_vol", sort: true, className: "column" },
  {
    title: "24h TXs",
    key: "24h_sell_buy_tx_count",
    sort: true,
    className: "column",
  },
  { title: "24h Makers", key: "24h_makers", sort: true, className: "column" },
  // {
  //   title: "24h tx count",
  //   key: "24h_tx_count",
  //   sort: true,
  //   className: "column",
  // },
  // {
  //   title: "24h seller/buyer count",
  //   key: "24h_seller_buyer_count",
  //   sort: true,
  //   className: "column",
  // },
  { title: "Liquidity", key: "liquidity", sort: true, className: "column" },
  { title: "Market Cap", key: "market_cap", sort: true, className: "column" },
];
export const tableColumns: ColumnConfig[] = commonColumns.concat(tokenColumns);

export const SortFieldMap: Record<string, string> = {
  Mints: "total_mints",
  Price: "price_in_usd",
  "Market Cap": "market_cap",
  Liquidity: "total_liquidity",
  "1h Chg": "price_change_in_1hours",
  "6h Chg": "price_change_in_6hours",
  "24h Chg": "price_change_in_24hours",
  "24h Vol": "total_volume_in_24hours",
  "6h Vol": "total_volume_in_6hours",
  "1h Vol": "total_volume_in_1hours",
  "24h Makers": "total_makers_count_24hours",
  Date: "launch_timestamp",
};

export const newTableColumns: ColumnConfig[] = commonColumns
  .concat([
    { title: "Date", key: "launch_timestamp", sort: true, className: "column" },
  ])
  .concat(tokenColumns);
