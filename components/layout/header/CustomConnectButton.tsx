import { Box, Typography } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";
const CustomConnectButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <div id="wallet-header">
                    <button
                      onClick={openConnectModal}
                      type="button"
                      id="connectbtn"
                      className=""
                    >
                      <Box sx={{ display: { md: "block", xs: "none" } }}>
                        <i
                          className="icon-wa"
                          style={{ color: "#fff", fontSize: 20 }}
                        />
                      </Box>
                      <Typography
                        sx={{
                          fontSize: { md: "12px", xs: "10px" },
                          marginRight: "px",
                          padding: "6px",
                          fontWeight: 700,
                          fontFamily: "Poppins",
                          color: "#fff",
                          lineHeight: 1,
                        }}
                      >
                        EVM Wallet
                      </Typography>
                    </button>
                  </div>
                );
              }
              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    id="connectbtn"
                    className=""
                    style={{ background: "red" }}
                  >
                    <Typography
                      sx={{
                        fontSize: { md: "12px", xs: "10px" },
                        marginRight: "px",
                        padding: "6px",
                        fontWeight: 700,
                        fontFamily: "Poppins",
                        color: "#fff",
                        lineHeight: 1,
                      }}
                    >
                      Wrong network
                    </Typography>
                  </button>
                );
              }
              return (
                <div id="wallet-header" style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={openAccountModal}
                    type="button"
                    id="connectbtn"
                    className=""
                  >
                    <Box sx={{ display: { md: "block", xs: "none" } }}>
                      <i
                        className="icon-wa"
                        style={{ color: "#fff", fontSize: 20 }}
                      />
                    </Box>
                    <Typography
                      sx={{
                        fontSize: { md: "12px", xs: "10px" },
                        marginRight: "px",
                        padding: "6px",
                        fontWeight: 700,
                        fontFamily: "Poppins",
                        color: "#fff",
                        lineHeight: 1,
                      }}
                    >
                      {account.displayName}
                    </Typography>
                  </button>
                  {/* <button
                    onClick={openAccountModal}
                    type="button"
                    className="header-button"
                  >
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ""}
                  </button> */}
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default CustomConnectButton;
