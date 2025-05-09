export interface ColumnConfig {
  title: string;
  key: string;
  className?: string;
  sort: boolean;
  titleStyle?: React.CSSProperties;
}
const commonColumns: ColumnConfig[] = [
  {
    title: "Tokens",
    key: "collections",
    sort: false,
    className: "column1",
    titleStyle: { fontWeight: 900 },
  },
  {
    title: "Created",
    key: "creation_date",
    sort: true,
    className: "column2",
    titleStyle: { fontWeight: 900 },
  },
  {
    title: "Twitter Score",
    key: "twitter_score",
    sort: true,
    className: "column2",
    titleStyle: { fontWeight: 900 },
  },
  {
    title: "KOL",
    key: "influencers_count",
    sort: true,
    className: "column2",
    titleStyle: { fontWeight: 900 },
  },
  {
    title: "Projects",
    key: "projects_count",
    sort: true,
    className: "column2",
    titleStyle: { fontWeight: 900 },
  },
  {
    title: "Venture",
    key: "venture_capitals_count",
    sort: true,
    className: "column2",
    titleStyle: { fontWeight: 900 },
  },
  { title: "Price", key: "price", sort: true, className: "column2" },
  // { title: "Mints", key: "total_mints", sort: true, className: "column2" },
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
export const tableColumns: ColumnConfig[] = commonColumns
  .concat(tokenColumns)
  .concat([
    {
      key: "top_tweets",
      title: "Top Followers",
      className: "column-top-tweets",
      sort: false,
    },
  ]);

export const SortFieldMap: Record<string, string> = {
  // Mints: "total_mints",
  Created: "creation_date",
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
  "Twitter Score": "twitter_score",
  KOL: "influencers_count",
  Projects: "projects_count",
  Venture: "venture_capitals_count",
};

export const newTableColumns: ColumnConfig[] = commonColumns
  .concat([
    { title: "Date", key: "launch_timestamp", sort: true, className: "column" },
  ])
  .concat(tokenColumns);

export const agentTableColumns: ColumnConfig[] = [
  {
    title: "Project",
    key: "name",
    sort: false,
    className: "column1",
    titleStyle: { fontWeight: 900 },
  },
  // {
  //   title: "Chain ID",
  //   key: "chain_id",
  //   sort: true,
  //   className: "column",
  // },
  {
    title: "1D Change",
    key: "price_change_in_1d",
    sort: true,
    className: "column",
  },
  {
    title: "7D Change",
    key: "price_change_in_7d",
    sort: true,
    className: "column",
  },
  {
    title: "30D Change",
    key: "price_change_in_30d",
    sort: true,
    className: "column",
  },
  {
    title: "Total Fee",
    key: "total_protocol_fee",
    sort: true,
    className: "column",
  },
  {
    title: "Total Count",
    key: "agent_nums",
    sort: true,
    className: "column",
  },
  {
    title: "Total Count (SCR)",
    key: "total_count_on_scr",
    sort: true,
    className: "column",
  },
  {
    title: "Total Market Cap",
    key: "total_market_cap_on_scr",
    sort: true,
    className: "column",
  },
  {
    title: "Name (SCR)",
    key: "top_agent_name_on_scr",
    sort: false,
    className: "column",
  },
  {
    title: "Top Market Cap",
    key: "top_agent_market_cap_on_scr",
    sort: true,
    className: "column",
  },
];
