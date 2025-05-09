import { Box, Button, Typography, Grid, Stack } from "@mui/material";
import SwapDialog from "./SwapTokenDialog";
import { useEffect, useState } from "react";
import SwapNFTDialog from "./SwapNFTDialog";
import { DasApiAssetList } from "@metaplex-foundation/digital-asset-standard-api";
import { EscrowV1, MPL_HYBRID_PROGRAM_ID } from "@/utils/generated";
import useTokenBalance from "@/hooks/sol/useTokenBalance";
import { publicKey } from "@metaplex-foundation/umi";
import { PublicKey } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { MPL_CORE_PROGRAM_ID } from "@metaplex-foundation/mpl-core";
import {
  getMint,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { toast } from "react-toastify";

interface SwapCardProps {
  title: string;
  amount: string;
  buttonText: string;
  conversionText: string;
  handleOpen: () => void;
  icon: any;
}
const SwapCard: React.FC<SwapCardProps> = ({
  title,
  amount,
  buttonText,
  conversionText,
  handleOpen,
  icon,
}) => {
  return (
    <Grid item xs={12} md={6}>
      <Box
        sx={{
          backgroundColor: "#7F00EE",
          borderRadius: 2,
          position: "relative",
        }}
      >
        <Stack
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-end"
          sx={{
            position: "relative",
            zIndex: 1,
            overflow: "hidden",
            p: 2,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              right: 0,
              top: 0,
              backgroundColor: "#AF54FF",
              height: "195.805px",
              width: "507.615px",
              borderRadius: "507.615px",
              opacity: 0.5,
              filter: "blur(50px)",
              zIndex: -1,
            }}
          />
          <Box>
            <Typography
              sx={{
                fontSize: { md: "16px", xs: "12px" },
                fontFamily: "Poppins",
                fontWeight: 500,
                color: "#FFF",
                display: "flex",
                alignItems: "center",
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                fontSize: { md: "24px", xs: "14px" },
                fontFamily: "Poppins",
                fontWeight: 600,
                color: "#FFF",
                display: "flex",
                alignItems: "center",
                mt: 1,
              }}
            >
              <span style={{ marginRight: "4px" }}> {icon}</span>
              {amount}
            </Typography>
          </Box>
          <Box
            onClick={handleOpen}
            sx={{
              backgroundColor: "#FFF",
              color: "#8800FF",
              height: "40px",
              p: 2,
              display: "flex",
              alignItems: "center",
              borderRadius: 2,
              fontFamily: "Poppins",
              fontSize: { md: "14px", xs: "10px" },
              fontWeight: 700,
              cursor: "pointer",
              // cursor: "not-allowed",
              // opacity: 0.6,
            }}
          >
            {buttonText}
          </Box>
        </Stack>
        <Box
          sx={{
            backgroundColor: "#5e35b1",
            py: 1,
            px: 2,
            borderRadius: "0 0 8px 8px",
          }}
        >
          <Typography
            variant="body2"
            color="white"
            sx={{
              fontSize: { md: "16px", xs: "12px" },
              fontFamily: "Poppins",
              fontWeight: 500,
              color: "#FFF",
              opacity: 0.8,
            }}
          >
            {conversionText}
          </Typography>
        </Box>
      </Box>
    </Grid>
  );
};
const SwapSection = ({
  symbol,
  tokenBanlance,
  NFTBanlance,
  myAssetsList,
  escrowData,
}: {
  symbol: string;
  tokenBanlance: string;
  NFTBanlance: number;
  myAssetsList?: DasApiAssetList;
  escrowData?: EscrowV1;
}) => {
  const { connection } = useConnection();
  const wallet = useWallet();

  // const { balances } = useTokenBalance(
  //   escrowData?.token?.toString() || "",
  //   new PublicKey("GPVxe7LFhNz5MEwSV6rXRvj66MQhzQqbvdox7CViCmGb"),
  // );
  // console.log("balances", balances);

  const [open, setOpen] = useState(false);
  const [openNFTdialog, setOpenNFTdialog] = useState(false);

  const handleOpen = () => {
    if (!wallet.connected) {
      return toast?.warn(" Please connect wallet");
    }
    setOpen(true);
  };
  const handleOpenNFTdialog = () => {
    if (!wallet.connected) {
      return toast?.warn(" Please connect wallet");
    }
    setOpenNFTdialog(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenNFTdialog(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!connection) {
          return;
        }
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          new PublicKey("HGR9rduAVa2zadsW8J14jb2BKAGEzEZneaade9xahor1"),
          {
            programId: TOKEN_PROGRAM_ID,
          },
        );
        for (const { account } of tokenAccounts.value) {
          const tokenAmount = account.data.parsed.info.tokenAmount.uiAmount;
          const mintAddress = account.data.parsed.info.mint;
          console.log("mintAddress", mintAddress, tokenAmount);

          if (
            "HACK8WdQNJdvBrKExA7tP7WAMaNKYugQ8H7qKSxRQrpy" ===
            account.data.parsed.info.mint
          ) {
            const mintInfo = await getMint(
              connection,
              new PublicKey(mintAddress),
              "confirmed",
              TOKEN_PROGRAM_ID,
            );

            console.log("1111", {
              mintAddress: mintAddress,
              balance: tokenAmount,
              decimals: mintInfo.decimals,
              programId: TOKEN_PROGRAM_ID.toString(),
            });
          }
        }
        console.log("tokenAccounts", tokenAccounts);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchData();
  }, [connection]);
  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={2}>
        <SwapCard
          title="NFTs in Escrow Contract"
          amount={`${NFTBanlance} NFTs`}
          buttonText="Swap Tokens For NFTs"
          conversionText={`Convert: ${(Number(escrowData?.amount) + Number(escrowData?.feeAmount)) / 1e9} ${symbol} => 1 NFT`}
          handleOpen={handleOpen}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
            >
              <path
                d="M2.81641 20.7766C2.83828 20.7703 2.86016 20.7609 2.88516 20.7547C2.86016 20.7641 2.83828 20.7703 2.81641 20.7766ZM4.16016 20.4891C4.19141 20.4859 4.22578 20.4797 4.25703 20.4766C4.22266 20.4797 4.19141 20.4859 4.16016 20.4891Z"
                fill="#CFE07D"
              />
              <path
                d="M28.9129 7.27812C28.5598 6.61562 27.9691 6.12812 27.2504 5.90937L15.4879 2.325C15.2223 2.24375 14.9473 2.20312 14.6723 2.20312C14.0816 2.20312 13.4941 2.39375 13.016 2.74375C12.5191 3.10625 12.1598 3.60938 11.9816 4.19687L11.6035 5.44062H13.2379L13.4785 4.65C13.641 4.1125 14.141 3.76562 14.6754 3.76562C14.7941 3.76562 14.916 3.78437 15.0379 3.81875L20.3598 5.44062H20.3973C20.9879 5.44062 21.5379 5.625 21.991 5.9375L26.8066 7.40312C27.4629 7.60312 27.8379 8.30625 27.6379 8.9625L23.2004 23.4969V26.9687C23.2004 27.725 22.9004 28.4125 22.4129 28.9187C22.4879 28.875 22.5629 28.825 22.6348 28.775C23.1316 28.4125 23.491 27.9094 23.6691 27.3219L29.1223 9.41562C29.341 8.70312 29.2691 7.94062 28.9129 7.27812Z"
                fill="white"
              />
              <path
                d="M12.0161 15.1508C11.9317 15.3102 11.8005 15.4133 11.6661 15.4258L9.65358 15.7164C8.87858 15.8477 8.57233 16.8133 9.12546 17.3883L10.5692 18.8445C10.6848 18.9664 10.7411 19.1289 10.713 19.2758L10.363 21.3383C10.238 22.1445 11.0442 22.7539 11.7286 22.3664L13.5161 21.4008C13.6598 21.3164 13.8098 21.3164 13.9473 21.3977L15.7442 22.3695C16.4223 22.7539 17.2286 22.1445 17.1067 21.3414L16.7567 19.2789C16.7411 19.1164 16.7942 18.9508 16.9005 18.8383L18.3411 17.3883C18.8973 16.8102 18.5911 15.8445 17.8192 15.7164L15.813 15.4258C15.6536 15.3914 15.5161 15.2883 15.4567 15.157L14.5692 13.2602C14.2286 12.5227 13.2317 12.5227 12.8911 13.2602L12.0161 15.1508Z"
                fill="white"
              />
              <path
                d="M21.3848 29.7914H6.08789C4.96914 29.7914 4.05664 28.8789 4.05664 27.7602V7.44141C4.05664 6.32266 4.96914 5.41016 6.08789 5.41016H21.3848C22.5035 5.41016 23.416 6.32266 23.416 7.44141V27.7602C23.416 28.8789 22.5035 29.7914 21.3848 29.7914ZM6.08789 6.97266C5.83477 6.97266 5.61914 7.18828 5.61914 7.44141V27.7602C5.61914 28.0133 5.83477 28.2289 6.08789 28.2289H21.3848C21.6379 28.2289 21.8535 28.0133 21.8535 27.7602V7.44141C21.8535 7.18828 21.6379 6.97266 21.3848 6.97266H6.08789Z"
                fill="white"
              />
            </svg>
          }
        />
        <SwapCard
          title="Tokens in Escrow Contract"
          amount={`${tokenBanlance} ${symbol}`}
          buttonText="Swap NFTs For Tokens"
          conversionText={`Convert: 1 NFT => ${Number(escrowData?.amount) / 1e9} ${symbol}`}
          handleOpen={handleOpenNFTdialog}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
            >
              <path
                d="M15.9993 2.66797C23.3633 2.66797 29.3327 8.6373 29.3327 16.0013C29.3327 23.3653 23.3633 29.3346 15.9993 29.3346C8.63535 29.3346 2.66602 23.3653 2.66602 16.0013C2.66602 8.6373 8.63535 2.66797 15.9993 2.66797ZM15.9993 5.33464C10.108 5.33464 5.33268 10.11 5.33268 16.0013C5.33268 21.8926 10.108 26.668 15.9993 26.668C21.8907 26.668 26.666 21.8926 26.666 16.0013C26.666 10.11 21.8907 5.33464 15.9993 5.33464ZM15.0567 10.3446C15.3067 10.0947 15.6458 9.95425 15.9993 9.95425C16.3529 9.95425 16.692 10.0947 16.942 10.3446L21.656 15.058C21.78 15.1818 21.8783 15.3289 21.9454 15.4907C22.0125 15.6526 22.0471 15.8261 22.0471 16.0013C22.0471 16.1765 22.0125 16.35 21.9454 16.5119C21.8783 16.6738 21.78 16.8208 21.656 16.9446L16.9427 21.658C16.8189 21.7819 16.6718 21.8803 16.5099 21.9474C16.3481 22.0145 16.1746 22.049 15.9993 22.049C15.8241 22.049 15.6506 22.0145 15.4888 21.9474C15.3269 21.8803 15.1798 21.7819 15.056 21.658L10.3427 16.9446C10.2187 16.8208 10.1204 16.6738 10.0533 16.5119C9.98617 16.35 9.95163 16.1765 9.95163 16.0013C9.95163 15.8261 9.98617 15.6526 10.0533 15.4907C10.1204 15.3289 10.2187 15.1818 10.3427 15.058L15.0567 10.3446ZM15.9987 13.1726L13.1707 16.0006L15.9987 18.8293L18.8273 16.0006L15.9987 13.1726Z"
                fill="white"
              />
            </svg>
          }
        />
        <SwapDialog open={open} onClose={handleClose} />
        <SwapNFTDialog
          open={openNFTdialog}
          onClose={handleClose}
          myAssetsList={myAssetsList}
          escrowData={escrowData}
        />
      </Grid>
    </Box>
  );
};

export default SwapSection;
