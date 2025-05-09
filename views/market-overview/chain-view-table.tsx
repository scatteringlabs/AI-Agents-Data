import { Box, Stack, Typography } from "@mui/material";
import { CardTitle, CardWrapper } from "./line-chart-view";
import { styled } from "@mui/material";
import { activeTokenIcons, tokenIcons } from "@/constants/tokens";
import { MarketToken } from "@/services/market-overview";
import { ChainIdByName, ChainNameById } from "@/constants/chain";
import { formatNumberWithKM } from "@/utils/format";

const FlexTableContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  /* background-color: #1a1a1a; */
  color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  font-family: Roboto, sans-serif;
  padding: 0px 10px;
`;

const FlexTableRow = styled(Box)`
  display: flex;
  flex-direction: row;
  padding: 16px;
  align-items: center;
  justify-content: space-between;
`;

const TableCell = styled(Box)`
  flex: 1;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-family: Poppins;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  text-transform: capitalize;
  @media (max-width: 600px) {
    font-size: 12px;
  }
`;
const TitleText = styled(Typography)`
  color: rgba(255, 255, 255, 0.6);
  font-family: Poppins;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  text-transform: capitalize;
  @media (max-width: 600px) {
    font-size: 12px;
  }
`;

const HeaderCell = styled(TableCell)`
  font-weight: bold;
  text-align: center;
  color: #fff;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  text-transform: capitalize;
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;
const ChainViewTable = ({ list }: { list: MarketToken[] }) => {
  return (
    <>
      <CardWrapper sx={{ mt: 2, mb: 4 }}>
        <Stack flexDirection="row" justifyContent="space-between">
          <CardTitle>Multi-Chain </CardTitle>
        </Stack>
        <FlexTableContainer sx={{ position: "relative", overflowX: "auto" }}>
          <Box
            sx={{
              position: "absolute",
              width: { md: "141px", xs: "94px" },
              height: { md: "45.73px", xs: "30px" },
              left: { md: "120px", xs: "80px" },
              top: "18px",
              zIndex: 1,
              opacity: 0.4,
            }}
            component="img"
            id="logo_header"
            src="/assets/images/logo/logo.png"
            data-retina="/assets/images/logo/logo.png"
          />
          <Box sx={{ minWidth: "900px" }}>
            <FlexTableRow>
              <HeaderCell sx={{ textAlign: "left" }}>Chain</HeaderCell>
              <HeaderCell>Tokens</HeaderCell>
              <HeaderCell>24h Volume</HeaderCell>
              <HeaderCell>24h Volume Change</HeaderCell>
              <HeaderCell>Weekly Volume</HeaderCell>
              <HeaderCell>Monthly Volume</HeaderCell>
              <HeaderCell sx={{ textAlign: "center", flex: 0.5 }}>
                Marketcap
              </HeaderCell>
            </FlexTableRow>
            {list?.map((item) => (
              <FlexTableRow key={item.chain_id}>
                <TableCell sx={{ textAlign: "center" }}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-start"
                  >
                    <Box
                      component="img"
                      src={activeTokenIcons?.[item.chain_id]}
                      alt="chain"
                      style={{ width: 30, height: 30, marginRight: 8 }}
                    />
                    <TitleText>{ChainIdByName?.[item?.chain_id]}</TitleText>
                  </Box>
                </TableCell>
                <TableCell>{item?.collection_count}</TableCell>
                <TableCell>
                  ${formatNumberWithKM(item?.total_volume_24h)}
                </TableCell>
                <TableCell
                  style={{
                    color:
                      Number(item?.change_volume_24h) > 0 ? "green" : "red",
                  }}
                >
                  {Number(item?.change_volume_24h).toFixed(2)}%
                </TableCell>
                <TableCell>
                  {" "}
                  ${formatNumberWithKM(item?.total_volume_7d)}
                </TableCell>
                <TableCell>
                  ${formatNumberWithKM(item?.total_volume_30d)}
                </TableCell>
                <TableCell sx={{ textAlign: "center", flex: 0.5 }}>
                  ${formatNumberWithKM(item?.total_market_cap)}
                </TableCell>
              </FlexTableRow>
            ))}
          </Box>
        </FlexTableContainer>
      </CardWrapper>
    </>
  );
};
export default ChainViewTable;
