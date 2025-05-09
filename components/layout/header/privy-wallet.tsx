import {
  Box,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  ButtonGroup,
  Button,
  Tooltip,
} from "@mui/material";
import {
  useLogin,
  usePrivy,
  useSolanaWallets,
  useWallets,
} from "@privy-io/react-auth";
import { toast } from "react-toastify";
import { useEffect, useMemo, useState } from "react";
import Blockie from "@/components/blockie";
import { SecTitle } from "@/components/text";
import AvatarCard from "@/components/collections/avatar-card";
import { useRouter } from "next/router";
import CustomConnectButton from "./CustomConnectButton";
import { formatAddress } from "@/utils/format";
import CopyToClipboardButton from "@/components/button/CopyToClipboardButton";
import { useGlobalState } from "@/context/GlobalStateContext";
import Iconify from "@/components/iconify";
import CustomTooltip from "@/components/tooltip/CustomTooltip";

const PrivyLogin = () => {
  const { selectedOption } = useGlobalState();
  const { wallets } = useWallets();
  const { wallets: solanaWallets } = useSolanaWallets();
  const [mode, setMode] = useState<string>("ethereum");

  const { ready, authenticated, user, logout, login, connectWallet } =
    usePrivy();

  const chainType = useMemo(() => user?.wallet?.chainType, [user]);
  const address = useMemo(() => user?.wallet?.address, [user]);
  const router = useRouter();
  const { tokenAddress = "", chain } = router.query;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  const handleMenuClose = () => {
    if (!address) {
      return;
    }
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
  };

  const handlePortfolio = () => {
    if (!authenticated) return;

    router.push(`/erc20z/portfolio/${user?.wallet?.address}`);
    setAnchorEl(null);
  };

  useEffect(() => {
    console.log("token, chain", tokenAddress, chain);
  }, [tokenAddress, chain]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleSwitch = async () => {
    try {
      const res = await logout();
      console.log("res", res);
      setTimeout(() => login(), 300);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return address ? (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
        {selectedOption !== "404s" ? (
          <AvatarCard
            hasLogo
            logoUrl={`https://zora.co/api/avatar/${address}`}
            symbol={"User"}
            showChain={false}
            size={40}
            mr={0}
          />
        ) : (
          <Box sx={{ width: 40, borderRadius: "100%", overflow: "hidden" }}>
            <Blockie address={address} />
          </Box>
        )}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        sx={{
          mt: "45px",
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <ButtonGroup variant="text" sx={{ mx: 2, mt: 1 }}>
          {["ethereum", "solana"].map((m) => (
            <Button
              key={m}
              onClick={() => setMode(m)}
              sx={{
                color: mode === m ? "#fff" : "#b0b0b0",
                backgroundColor:
                  mode === m ? "#9b51e0" : "rgba(255, 255, 255, 0.10)",
                fontWeight: 600,
                textTransform: "none",
                border: "none",
                padding: { md: "8px 20px", xs: "10px 4px" },
                fontFamily: "Poppins",
                borderRight: "1px solid #0f071c !important",
                borderLeft: "1px solid #0f071c !important",
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: mode === m ? "#9b51e0" : "#333333",
                },
              }}
            >
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: { md: 12, xs: 9 },
                  textTransform: "capitalize",
                }}
              >
                {m}
              </Typography>
            </Button>
          ))}
        </ButtonGroup>

        {mode === "ethereum" && wallets?.length && (
          <Box sx={{ px: "20px", py: "12px" }}>
            {[wallets?.[0]]?.map((wallet, index) => (
              <Box
                key={index}
                sx={{
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  mb: 1,
                  fontSize: 14,
                  background: index === 0 ? "rgba(155, 81, 224,0.4)" : "none",
                  p: 1,
                  borderRadius: 1,
                  border:
                    index === 0
                      ? "1px solid #9b51e0"
                      : "1px solid rgba(0,0,0,0.3)",
                }}
              >
                <Box
                  component="img"
                  src={wallet?.meta?.icon}
                  sx={{ width: 16, mr: 1 }}
                />
                {formatAddress(wallet?.address)}
                <CustomTooltip
                  title={
                    <Typography sx={{ fontSize: 14 }}>Copy Address</Typography>
                  }
                >
                  <Iconify
                    onClick={() => copyToClipboard(wallet.address)}
                    icon="tabler:copy"
                    sx={{
                      cursor: "pointer",
                      ml: 1,
                      borderRadius: "50%",
                      p: "2px",
                    }}
                  />
                </CustomTooltip>
              </Box>
            ))}
          </Box>
        )}
        {mode === "solana" && solanaWallets?.length && (
          <Box sx={{ px: "20px", py: "12px" }}>
            {[solanaWallets?.[0]]?.map((wallet, index) => (
              <Box
                key={index}
                sx={{
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  mb: 1,
                  fontSize: 14,
                  background: index === 0 ? "rgba(155, 81, 224,0.4)" : "none",
                  p: 1,
                  borderRadius: 1,
                  border:
                    index === 0
                      ? "1px solid #9b51e0"
                      : "1px solid rgba(0,0,0,0.3)",
                }}
              >
                <Box
                  component="img"
                  src={wallet?.meta?.icon}
                  sx={{ width: 16, mr: 1 }}
                />
                {formatAddress(wallet?.address)}
                <CustomTooltip
                  title={
                    <Typography sx={{ fontSize: 14 }}>Copy Address</Typography>
                  }
                >
                  <Iconify
                    onClick={() => copyToClipboard(wallet.address)}
                    icon="tabler:copy"
                    sx={{
                      cursor: "pointer",
                      ml: 1,
                      borderRadius: "50%",
                      p: "2px",
                    }}
                  />
                </CustomTooltip>
              </Box>
            ))}
          </Box>
        )}

        {mode === "ethereum" && wallets?.length === 0 ? (
          <MenuItem
            onClick={() => {
              connectWallet({
                walletList: [
                  "detected_wallets",
                  "metamask",
                  "coinbase_wallet",
                  "okx_wallet",
                  "rainbow",
                  "zerion",
                  "cryptocom",
                  "uniswap",
                ],
              });
            }}
            sx={{ px: "20px" }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {" "}
              <Iconify
                icon="mingcute:wallet-line"
                sx={{
                  cursor: "pointer",
                  mr: 1,
                  borderRadius: "50%",
                  p: "2px",
                }}
              />
              <SecTitle
                variant="h5"
                textAlign="center"
                sx={{
                  color: "white",
                }}
              >
                Connect wallet
              </SecTitle>
            </Box>
          </MenuItem>
        ) : null}
        {mode === "solana" && solanaWallets?.length === 0 ? (
          <MenuItem
            onClick={() => {
              connectWallet({ walletList: ["phantom"] });
            }}
            sx={{ px: "20px" }}
          >
            {" "}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {" "}
              <Iconify
                icon="mingcute:wallet-line"
                sx={{
                  cursor: "pointer",
                  mr: 1,
                  borderRadius: "50%",
                  p: "2px",
                }}
              />
              <SecTitle
                variant="h5"
                textAlign="center"
                sx={{
                  color: "white",
                }}
              >
                Connect wallet
              </SecTitle>
            </Box>
          </MenuItem>
        ) : null}

        {selectedOption !== "404s" ? (
          <MenuItem onClick={handlePortfolio}>
            <SecTitle sx={{ color: "rgba(255,255,255,1)" }} textAlign="center">
              My Portfolio
            </SecTitle>
          </MenuItem>
        ) : null}
        <MenuItem onClick={handleLogout} sx={{ px: "20px" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {" "}
            <Iconify
              icon="material-symbols:logout"
              sx={{
                cursor: "pointer",
                mr: 1,
                borderRadius: "50%",
                p: "2px",
              }}
            />
            <SecTitle sx={{ color: "white" }} textAlign="center">
              Logout
            </SecTitle>
          </Box>
        </MenuItem>
      </Menu>
    </Box>
  ) : (
    <Typography
      onClick={handleLogin}
      sx={{
        padding: { md: "10px 20px", xs: "8px 8px" },
        background: "#b054ff",
        color: "#fff",
        fontSize: { md: 14, xs: 8 },
        cursor: "pointer",
        borderRadius: 1,
        fontFamily: "Poppins",
        fontWeight: 600,
      }}
    >
      Connect{" "}
      <Box
        component="span"
        sx={{ display: { md: "inline-block", xs: "none" } }}
      >
        Wallet
      </Box>
    </Typography>
  );
};

export default PrivyLogin;
