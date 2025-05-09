// components/SwapDialog.tsx
import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Typography,
  Box,
  TextField,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { CollectionDetails } from "@/types/collection";
import { Deployment } from "@/utils/generated/accounts/deployment";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { initializeUmi, swapTokenToNFT } from "@/utils/umi";
import { getTokenBalance } from "@/utils/sol/token";
import { publicKey } from "@metaplex-foundation/umi";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { DasApiAssetList } from "@metaplex-foundation/digital-asset-standard-api";
import { toast } from "react-toastify";
import { ButtonWrapper } from "@/components/button/wrapper";
import AvatarCard from "@/components/collections/avatar-card";
import { getTokenLogoURL } from "@/utils/token";
import { sleep } from "../sol-token-card";

interface SwapDialogProps {
  open: boolean;
  onClose: () => void;
  refetch?: () => void;
  collectionDetails?: CollectionDetails;
  deploymentData?: Deployment;
  assetsList?: DasApiAssetList;
}

const SwapDialog: React.FC<SwapDialogProps> = ({
  open,
  onClose,
  collectionDetails,
  deploymentData,
  assetsList,
  refetch,
}) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [amount, setAmount] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [swapLoading, setSwapLoading] = useState<boolean>(false);

  const [tokenBalance, setTokenBalance] = useState(0);
  const handleAmountChange = (value: number) => {
    if (value > 5) {
      toast.warn(`You can exchange up to 5 NFTs at most`);
      return;
    }
    if (value <= 0) {
      return;
    }
    if (value > Number(deploymentData?.escrowNonFungibleCount)) {
      toast.warn(
        `Escrow Contract just have ${Number(deploymentData?.escrowNonFungibleCount)} NFTs`,
      );
      return;
    }
    setAmount(value);
  };
  const getUserBalance = useCallback(async () => {
    if (!connection?.rpcEndpoint) {
      return;
    }
    if (!wallet?.connected) {
      return;
    }
    try {
      setLoading(true);
      const tokenBalance = await getTokenBalance(
        connection,
        publicKey(wallet?.publicKey?.toString() || ""),
        deploymentData?.fungibleMint || "",
      );
      setTokenBalance(tokenBalance?.balance || 0);
    } catch (error) {
      console.error("Error during Metaplex operations:", error);
    } finally {
      setLoading(false);
    }
  }, [connection, wallet, deploymentData]);
  const updateInfo = useCallback(() => {
    refetch?.();
    getUserBalance();
    onClose();
  }, [getUserBalance, refetch, onClose]);
  useEffect(() => {
    getUserBalance();
  }, [getUserBalance, open]);

  const handleSwap = useCallback(async () => {
    if (
      Number(amount * Number(deploymentData?.limitPerMint)) >
      Number(tokenBalance)
    ) {
      toast.error("Insufficient token balance");
      return;
    }
    try {
      if (!deploymentData?.fungibleMint) {
        return;
      }
      if (!collectionDetails?.symbol) {
        return;
      }
      if (!assetsList?.items?.[0]?.id) {
        return;
      }
      if (!connection?.rpcEndpoint) {
        return;
      }
      if (!wallet?.connected) {
        return;
      }
      setSwapLoading(true);
      const umi = await initializeUmi(connection?.rpcEndpoint);
      umi.use(walletAdapterIdentity(wallet));
      const idList =
        assetsList?.items?.slice(0, amount).map((item) => item.id) || [];
      const res = await swapTokenToNFT(
        umi,
        idList,
        collectionDetails?.escrow_address,
        deploymentData?.fungibleMint?.toString(),
      );
      if (res) {
        // await sleep(3000);
        updateInfo();
        toast.success("Swap success!");
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setSwapLoading(false);
    }
  }, [
    connection,
    wallet,
    assetsList,
    amount,
    updateInfo,
    collectionDetails,
    deploymentData,
    tokenBalance,
  ]);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: { md: "16px", xs: "14px" },
            color: "#fff",
            fontFamily: "Poppins",
            fontWeight: 600,
          }}
        >
          Swap Tokens For NFTs
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ position: "relative" }}>
        {swapLoading ? (
          <Box
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "rgba(0,0,0,0.3)",
              zIndex: 3,
              backdropFilter: "blur(1px)",
            }}
          >
            <CircularProgress />
          </Box>
        ) : null}
        <Box
          sx={{
            display: "flex",
            alignItems: { md: "flex-start", xs: "center" },
            borderTop: "1px solid rgba(255, 255, 255,0.1)",
            paddingTop: "20px",
            flexDirection: { md: "row", xs: "column" },
            // justifyContent: "center",
          }}
        >
          <img
            src="/assets/images/swap/exchange.png"
            alt="NFT"
            style={{ width: 240, height: 240, marginRight: 16 }}
          />
          <Box sx={{ width: "100%", mt: { md: 0, xs: 2 } }}>
            <Typography
              sx={{
                fontFamily: "Poppins",
                fontSize: 16,
                fontWeight: 600,
                color: "rgb(255, 255, 255)",
              }}
            >
              {collectionDetails?.name}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontSize: 12,
                  fontWeight: 400,
                  color: "rgba(255, 255, 255,0.6)",
                  mt: 2,
                }}
              >
                Conversion Rate:{" "}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontSize: 12,
                  fontWeight: 400,
                  color: "rgba(255, 255, 255,1)",
                  mt: 2,
                }}
              >
                1NFT = {Number(deploymentData?.limitPerMint)}{" "}
                {collectionDetails?.symbol}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontSize: 12,
                  fontWeight: 400,
                  color: "rgba(255, 255, 255,0.6)",
                  mt: 2,
                }}
              >
                Conversion Fee (0%):
              </Typography>
              {/* Charged by Creator */}
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontSize: 12,
                  fontWeight: 400,
                  color: "rgba(255, 255, 255,1)",
                  mt: 2,
                }}
              >
                0 {collectionDetails?.symbol}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontSize: 12,
                  fontWeight: 400,
                  color: "rgba(255, 255, 255,0.6)",
                  mt: 2,
                }}
              >
                Platform Fee (0%):
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontSize: 12,
                  fontWeight: 400,
                  color: "rgba(255, 255, 255,1)",
                  mt: 2,
                }}
              >
                0
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                my: 2,
                p: 2,
                borderRadius: "4px",
                background: "rgba(255, 255, 255,0.1)",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontSize: 12,
                  fontWeight: 400,
                  color: "rgba(255, 255, 255,1)",
                }}
              >
                Get
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontSize: 12,
                  fontWeight: 400,
                  color: "rgba(255, 255, 255,1)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleAmountChange(amount - 1)}
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0 8C0 12.4182 3.58185 16 8 16C12.4182 16 16 12.4182 16 8C16 3.58185 12.4182 0 8 0C3.58185 0 0 3.58185 0 8ZM4.32734 7.37187C3.9744 7.37187 3.68828 7.65799 3.68828 8.01094C3.68828 8.36388 3.9744 8.65 4.32734 8.65H11.6727C12.0256 8.65 12.3117 8.36388 12.3117 8.01094C12.3117 7.65799 12.0256 7.37187 11.6727 7.37187H4.32734Z"
                    fill="#AF54FF"
                  />
                </svg>
                <span style={{ margin: "0 10px" }}>{amount} NFT</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleAmountChange(amount + 1)}
                >
                  <g opacity="1" clip-path="url(#clip0_5376_18641)">
                    <path
                      d="M8 16C3.58185 16 0 12.4182 0 8C0 3.58185 3.58185 0 8 0C12.4182 0 16 3.58185 16 8C16 12.4182 12.4182 16 8 16ZM11.6923 7.38462H8.61539V4.30769C8.61539 4.14448 8.55055 3.98796 8.43514 3.87255C8.31974 3.75714 8.16321 3.69231 8 3.69231C7.83679 3.69231 7.68026 3.75714 7.56486 3.87255C7.44945 3.98796 7.38462 4.14448 7.38462 4.30769V7.38462H4.30769C4.14448 7.38462 3.98796 7.44945 3.87255 7.56486C3.75714 7.68026 3.69231 7.83679 3.69231 8C3.69231 8.16321 3.75714 8.31974 3.87255 8.43514C3.98796 8.55055 4.14448 8.61539 4.30769 8.61539H7.38462V11.6923C7.38462 11.8555 7.44945 12.012 7.56486 12.1274C7.68026 12.2429 7.83679 12.3077 8 12.3077C8.16321 12.3077 8.31974 12.2429 8.43514 12.1274C8.55055 12.012 8.61539 11.8555 8.61539 11.6923V8.61539H11.6923C11.8555 8.61539 12.012 8.55055 12.1274 8.43514C12.2429 8.31974 12.3077 8.16321 12.3077 8C12.3077 7.83679 12.2429 7.68026 12.1274 7.56486C12.012 7.44945 11.8555 7.38462 11.6923 7.38462Z"
                      fill="#AF54FF"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_5376_18641">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </Typography>
              {/* <TextField
                type="number"
                value={amount}
                onChange={handleAmountChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">NFT</InputAdornment>
                  ),
                  inputProps: { min: 1 },
                }}
                sx={{ width: "100px", border: "none" }}
              /> */}
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: "4px",
                border: "1px solid rgba(255, 255, 255,0.4)",
                p: 2,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontSize: 12,
                    fontWeight: 400,
                    color: "rgba(255, 255, 255,1)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Pay
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontSize: 16,
                    fontWeight: 400,
                    color: "rgba(255, 255, 255,1)",
                    display: "flex",
                    alignItems: "center",
                    mt: 2,
                  }}
                >
                  {Number(
                    amount * Number(deploymentData?.limitPerMint),
                  ).toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}{" "}
                </Typography>
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontSize: 12,
                    fontWeight: 400,
                    color:
                      Number(amount * Number(deploymentData?.limitPerMint)) >
                      Number(tokenBalance)
                        ? "red"
                        : "rgba(255, 255, 255,1)",
                    textAlign: "right",
                  }}
                >
                  Balance:{" "}
                  {Number(tokenBalance).toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}{" "}
                  {collectionDetails?.symbol}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "rgba(255, 255, 255,1)",
                    textAlign: "right",
                    mt: 2,
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <AvatarCard
                    hasLogo={true}
                    // logoUrl={getTokenLogoURL({
                    //   chainId: collectionDetails?.chain_id,
                    //   address: collectionDetails?.erc20_address,
                    //   size: 28,
                    // })}
                    logoUrl={collectionDetails?.logo_url || ""}
                    chainId={collectionDetails?.chain_id}
                    symbol={collectionDetails?.symbol || ""}
                    size={28}
                    showChain={false}
                    mr={1}
                  />
                  {collectionDetails?.symbol}
                </Typography>
              </Box>
            </Box>
            <ButtonWrapper
              sx={{ color: "#fff", px: 2, py: 1, my: 2, borderRadius: 1 }}
              onClick={handleSwap}
            >
              Swap
            </ButtonWrapper>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SwapDialog;
