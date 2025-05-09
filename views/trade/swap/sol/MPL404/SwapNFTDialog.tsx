import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Typography,
  Box,
  Grid,
  Collapse,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DasApiAssetList } from "@metaplex-foundation/digital-asset-standard-api";
import MyNFTCard from "./CheckMyNFTCard";
import {
  getEscrowAddress,
  initializeUmi,
  runReleaseV1,
  swapNFTtoToken22,
} from "@/utils/umi";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { EscrowV1 } from "@/utils/generated";
import { publicKey } from "@metaplex-foundation/umi";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { CollectionDetails } from "@/types/collection";
import { Deployment } from "@/utils/generated/accounts/deployment";
import { NoDataSearched } from "@/components/search-not-found/no-data-searched";
import Iconify from "@/components/iconify";
import BetweenText from "../../between-text";
import { toast } from "react-toastify";
import { sleep } from "../sol-token-card";

interface NftItem {
  id: number;
  name: string;
  imageUrl: string;
}

interface SwapNFTDialogProps {
  open: boolean;
  onClose: () => void;
  refetch?: () => void;
  myAssetsList?: DasApiAssetList;
  escrowData?: EscrowV1;
  collectionDetails?: CollectionDetails;
  deploymentData?: Deployment;
  loading?: boolean;
}

const SwapNFTDialog: React.FC<SwapNFTDialogProps> = ({
  open,
  onClose,
  myAssetsList,
  escrowData,
  collectionDetails,
  deploymentData,
  refetch,
  loading,
}) => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [expanded, setExpanded] = useState(false);
  const [swapLoading, setSwapLoading] = useState<boolean>(false);

  const [tokenBalance, setTokenBalance] = useState(0);
  const [selectedNfts, setSelectedNfts] = useState<string[]>([]);
  const handleToggleNft = (id: string) => {
    setSelectedNfts((prev) =>
      prev.includes(id) ? prev.filter((nftId) => nftId !== id) : [...prev, id],
    );
  };
  const handleSwap = async () => {
    try {
      if (!collectionDetails?.escrow_address || !deploymentData?.fungibleMint) {
        return;
      }
      if (!selectedNfts?.[0]) {
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
      const res = await swapNFTtoToken22(
        umi,
        selectedNfts,
        collectionDetails?.escrow_address,
        deploymentData?.fungibleMint,
      );
      if (res) {
        // await sleep(3000);
        refetch?.();
        onClose();
        toast.success("Swap success!");
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setSelectedNfts([]);
      setSwapLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
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
          Swap NFTs For Tokens
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
            borderTop: "1px solid rgba(255, 255, 255,0.1)",
            paddingTop: "20px",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontWeight: 400,
              fontSize: 14,
              color: "rgb(255, 255, 255)",
            }}
          >
            My NFTs{" "}
            <span style={{ color: "#AF54FF", fontWeight: 600 }}>
              {myAssetsList?.total}
            </span>
          </Typography>
          {myAssetsList?.total === 0 && !loading ? (
            <NoDataSearched title="No NFTs Are Found" />
          ) : (
            <Grid container spacing={2} sx={{ mt: 0 }}>
              {myAssetsList?.items?.map((nftInfo) => (
                <MyNFTCard
                  key={nftInfo.id}
                  selectedNfts={selectedNfts}
                  handleToggleNft={handleToggleNft}
                  nftInfo={nftInfo}
                />
              ))}
            </Grid>
          )}
          <Accordion
            sx={{
              boxShadow: "none",
              m: 0,
              mt: 2,
              background: "rgba(255,255,255,0.1)",
              ".MuiAccordionSummary-root": {
                px: 2,
                mx: 0,
              },
              ".MuiAccordionSummary-content": {
                margin: 0,
                padding: 0,
              },
            }}
          >
            <AccordionSummary
              expandIcon={
                <Iconify
                  icon="ri:arrow-drop-down-line"
                  sx={{
                    color: "#fff",
                    p: 0,
                  }}
                />
              }
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    fontSize: { md: 14, xs: 10 },
                  }}
                >
                  {`Get `}
                  {collectionDetails?.symbol}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    fontSize: { md: 14, xs: 10 },
                  }}
                >
                  {" "}
                  {Number(
                    selectedNfts?.length * Number(deploymentData?.limitPerMint),
                  ).toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}{" "}
                  {collectionDetails?.symbol}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 2 }}>
              <BetweenText
                lText="Conversion Fee (0%)"
                rText={`0 ${collectionDetails?.symbol}`}
                tip="collectionDetails"
              />
              <BetweenText
                lText="Platform Fee (0%)"
                rText={`0 ${collectionDetails?.symbol}`}
              />
            </AccordionDetails>
          </Accordion>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              mt: 2,
            }}
          >
            <Box
              sx={{
                background: "#B054FF",
                borderRadius: 1,
                p: 1.2,
                width: 140,
                textAlign: "center",
                mr: 2,
                fontSize: 14,
                fontWeight: 800,
                fontFamily: "Poppins",
                cursor: "pointer",
              }}
              onClick={handleSwap}
            >
              Swap ({selectedNfts.length})
            </Box>
            <Box
              sx={{
                borderRadius: 1,
                p: 1.2,
                width: 140,
                textAlign: "center",
                border: "1px solid rgba(255,255,255,0.6)",
                fontSize: 14,
                fontWeight: 800,
                fontFamily: "Poppins",
                cursor: "pointer",
              }}
              onClick={onClose}
            >
              Cancel
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SwapNFTDialog;
