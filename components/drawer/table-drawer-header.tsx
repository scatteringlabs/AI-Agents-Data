import { Box, styled } from "@mui/material";
import TableSortText from "../button/draw-sort-text";

const Column = styled(Box)`
  width: 80px;
  display: flex;
  justify-content: flex-end;
`;
const Column1 = styled(Box)`
  width: 160px;
  display: flex;
  justify-content: flex-start;
`;
interface iTableDrawerHeader {
  title: string;
}
export const TableDrawerHeader = ({ title }: iTableDrawerHeader) => {
  return (
    <Box
      data-wow-delay="0s"
      className="wow fadeInUp table-ranking-heading table-token-heading"
      sx={{ px: "0px !important" }}
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
