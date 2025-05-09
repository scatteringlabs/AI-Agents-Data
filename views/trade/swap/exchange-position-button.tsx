import { Box } from "@mui/material";

interface iExchangePositionButton {
  handleExchange: () => void;
}
const ExchangePositionButton = ({
  handleExchange,
}: iExchangePositionButton) => {
  return (
    <Box
      component="img"
      src="/assets/images/trade/exchange.svg"
      alt=""
      onClick={handleExchange}
      sx={{
        position: "absolute",
        left: "calc( 50% - 16px )",
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: "#AF54FF",
        bottom: "-24px",
        cursor: "pointer",
      }}
    />
  );
};

export default ExchangePositionButton;
