import { Box, styled } from "@mui/material";
import TableSortText from "../button/draw-sort-text";

const Column = styled(Box)`
  width: 100px;
  display: flex;
  justify-content: flex-end;
  font-size: 12;
`;
const Column1 = styled(Box)`
  width: 160px;
  display: flex;
  justify-content: flex-start;
  font-size: 12;
`;
interface iTableSearchHeader {
  title: string;
}
export const TableSearchHeader = ({ title }: iTableSearchHeader) => {
  return (
    <Box
      data-wow-delay="0s"
      className="wow fadeInUp table-ranking-heading table-token-heading"
      sx={{
        px: "20px !important",
        py: "10px !important",
        background: "#0E111C",
        borderRadius: "0px !important",
        width: "100% !important",
      }}
    >
      <Column1 sx={{}}>
        <h3>{title === "TRADE" ? "Tokens" : "Collections"}</h3>
      </Column1>
      <Column>
        <TableSortText title="Price" />
      </Column>
      <Column>
        <TableSortText title="24h Chg" />
      </Column>
      <Column>
        <TableSortText title="24h Vol" />
      </Column>
    </Box>
  );
};
