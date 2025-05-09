import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Skeleton,
} from "@mui/material";
import SwapSection from "./SwapSection";
import NFTCard from "./NFTCard";
import { fetchNFTHolding } from "@/services/sniper";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  keypairIdentity,
  publicKey,
  PublicKey,
} from "@metaplex-foundation/umi";
import { mplHybrid } from "@/utils/plugin";
import {
  captureV1,
  EscrowV1,
  fetchEscrowV1,
  MPL_HYBRID_PROGRAM_ID,
  updateEscrowV1,
} from "@/utils/generated";
import { mplCore } from "@metaplex-foundation/mpl-core";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import bs58 from "bs58";
import {
  dasApi,
  DasApiAssetList,
} from "@metaplex-foundation/digital-asset-standard-api";
import {
  string,
  publicKey as publicKeySerializer,
} from "@metaplex-foundation/umi/serializers";
import {
  fetchEscrowData,
  getAssetsByOwner,
  getEscrowAddress,
  initializeUmi,
  searchAssets,
} from "@/utils/umi";
import SwapDialog from "./SwapTokenDialog";
import Iconify from "@/components/iconify";
import { formatAddress } from "@/utils/format";
import { toast } from "react-toastify";
import { CollectionDetails } from "@/types/collection";
import { getTokenBalance } from "@/utils/sol/token";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
// export const basecreateUmi = async () =>
//   (await createUmi()).use(mplHybrid()).use(mplCore()).use(mplTokenMetadata());
const MPL404 = ({
  slug,
  collectionDetails,
}: {
  slug: string;
  collectionDetails?: CollectionDetails;
}) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState<boolean>(true);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [escrowData, setEscrowData] = useState<EscrowV1>();
  const [assetsList, setAssetsList] = useState<DasApiAssetList>();
  // const [myAssetsList, setMyAssetsList] = useState<DasApiAssetList>();

  useEffect(() => {
    const runMetaplexOperations = async () => {
      if (!connection?.rpcEndpoint) {
        return;
      }
      if (!wallet?.connected) {
        return;
      }
      try {
        setLoading(true);
        console.log("connection?.rpcEndpoint", connection?.rpcEndpoint);

        const umi = await initializeUmi(connection?.rpcEndpoint);
        umi.use(walletAdapterIdentity(wallet));
        console.log("umi", umi);

        const escrow = getEscrowAddress(
          umi,
          collectionDetails?.collection_address || "",
        );
        console.log("escrow", escrow);
        const oEscrowData = await fetchEscrowData(umi, escrow);
        setEscrowData(oEscrowData);
        console.log("escrowData", oEscrowData);
        // const testAssets = await getAssetsByOwner(umi, escrow?.[0]);
        const oAssetsList = await searchAssets({
          umi,
          owner: escrow?.[0],
          collection: collectionDetails?.collection_address,
        });
        const tokenBalance = await getTokenBalance(
          connection,
          escrow?.[0] || "",
          collectionDetails?.erc20_address || "",
        );
        setTokenBalance(tokenBalance?.balance || 0);

        // const oMyAssetsList = await searchAssets(
        //   umi,
        //   publicKey(walletPublicKey?.toString() || ""),
        // );
        // console.log("oMyAssetsList", oMyAssetsList);

        setAssetsList(oAssetsList);
        // setMyAssetsList(oMyAssetsList);
        // console.log("testAssets", testAssets);
        console.log("assetsList", oAssetsList);
        console.log("collectionDetails", collectionDetails);
      } catch (error) {
        console.error("Error during Metaplex operations:", error);
      } finally {
        setLoading(false);
      }
    };

    runMetaplexOperations();
  }, [connection, collectionDetails, wallet]);
  return (
    <Box>
      <Box sx={{ mt: 0, mb: 4 }}>
        <Typography
          sx={{
            fontSize: { md: "14px", xs: "12px" },
            fontFamily: "Poppins",
            fontWeight: 400,
            color: "#FFF",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span>Hakoiri Collection Escrow Contract:</span>
          {loading ? (
            <Skeleton
              variant="text"
              width="10%"
              height={26}
              sx={{
                background: "#331f44",
                ml: 1,
              }}
            />
          ) : (
            <Typography
              onClick={async () => {
                await navigator.clipboard.writeText(
                  collectionDetails?.escrow_address || "",
                );
                toast.success("Copied to clipboard");
              }}
              sx={{
                fontSize: { md: "16px", xs: "12px" },
                fontFamily: "Poppins",
                fontWeight: 600,
                color: "#B054FF",
                margin: "0px 10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              {formatAddress(collectionDetails?.escrow_address)}
              <Iconify icon="tabler:copy" color="#B054FF" sx={{ ml: 0.4 }} />
            </Typography>
          )}
        </Typography>
        <SwapSection
          NFTBanlance={1000}
          tokenBanlance={Number(tokenBalance).toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
          symbol={collectionDetails?.symbol || ""}
          // myAssetsList={myAssetsList}
          escrowData={escrowData}
        />
        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          NFTs In Escrow Contract
        </Typography>
        <Grid container spacing={2}>
          {loading ? (
            <>
              {Array.from({ length: 24 }, (_, index) => index + 1).map(
                (item) => (
                  <Grid item xs={6} sm={4} md={2} key={item}>
                    <Skeleton
                      sx={{
                        background: "#331f44",
                        borderRadius: 2,
                        paddingBottom: "100%",
                        height: 0,
                      }}
                    />
                  </Grid>
                ),
              )}
            </>
          ) : (
            assetsList?.items?.map((info, index) => (
              <Grid item xs={6} sm={4} md={2} key={info?.id}>
                <NFTCard
                  nftInfo={info}
                  collectionName={collectionDetails?.name || ""}
                />
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default MPL404;
