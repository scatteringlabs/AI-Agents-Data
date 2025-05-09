import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Skeleton,
} from "@mui/material";
import { fetchNFTHolding } from "@/services/sniper";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
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
  getDeploymentData,
  swapNFTtoToken22,
  initializeUmi,
  searchAssets,
} from "@/utils/umi";
import Iconify from "@/components/iconify";
import { formatAddress } from "@/utils/format";
import { toast } from "react-toastify";
import { CollectionDetails } from "@/types/collection";
import { getTokenBalance } from "@/utils/sol/token";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import NFTCard from "../MPL404/NFTCard";
import { Deployment } from "@/utils/generated/accounts/deployment";
import SwapSection from "./SwapSection";
import { NoDataSearched } from "@/components/search-not-found/no-data-searched";
// export const basecreateUmi = async () =>
//   (await createUmi()).use(mplHybrid()).use(mplCore()).use(mplTokenMetadata());
const Libreplex = ({
  collectionDetails,
}: {
  collectionDetails?: CollectionDetails;
}) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState<boolean>(true);
  const [infoLoading, setInfoLoading] = useState<boolean>(true);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [escrowData, setEscrowData] = useState<EscrowV1>();
  const [deploymentData, setDeploymentData] = useState<Deployment>();
  const [assetsList, setAssetsList] = useState<DasApiAssetList>();
  const [myAssetsList, setMyAssetsList] = useState<DasApiAssetList>();

  const fetchConnectionInfo = useCallback(async () => {
    if (!connection?.rpcEndpoint) {
      return;
    }

    if (!collectionDetails?.symbol) {
      return;
    }
    try {
      setInfoLoading(true);
      const umi = await initializeUmi(connection?.rpcEndpoint);
      umi.use(walletAdapterIdentity(wallet));
      const _deploymentData = await getDeploymentData(
        umi,
        collectionDetails?.escrow_address,
      );
      setDeploymentData(_deploymentData);

      const tokenBalance = await getTokenBalance(
        connection,
        _deploymentData?.publicKey || "",
        _deploymentData?.fungibleMint || "",
      );
      setTokenBalance(tokenBalance?.balance || 0);
    } catch (error) {
      console.error("Error during Metaplex operations:", error);
    } finally {
      setInfoLoading(false);
    }
  }, [connection, collectionDetails, wallet]);
  const fetchInfo = useCallback(async () => {
    if (!connection?.rpcEndpoint) {
      return;
    }
    if (!deploymentData) {
      return;
    }

    if (!collectionDetails?.symbol) {
      return;
    }
    try {
      setLoading(true);
      const umi = await initializeUmi(connection?.rpcEndpoint);
      umi.use(walletAdapterIdentity(wallet));

      const oAssetsList = await searchAssets({
        umi,
        owner: publicKey(collectionDetails?.escrow_address || ""),
        authority: publicKey(collectionDetails?.authority_address || ""),
      });
      console.log("deploymentData?.publicKey", deploymentData?.publicKey);
      console.log("oAssetsList", oAssetsList);

      const tokenBalance = await getTokenBalance(
        connection,
        deploymentData?.publicKey || "",
        deploymentData?.fungibleMint || "",
      );
      setTokenBalance(tokenBalance?.balance || 0);
      setAssetsList(oAssetsList);
      if (!wallet?.connected) {
        return;
      }
      const oMyAssetsList = await searchAssets({
        umi,
        owner: publicKey(wallet?.publicKey?.toString() || ""),
        authority: deploymentData?.publicKey,
      });

      setMyAssetsList(oMyAssetsList);
    } catch (error) {
      console.error("Error during Metaplex operations:", error);
    } finally {
      setLoading(false);
    }
  }, [deploymentData, connection, wallet, collectionDetails]);
  useEffect(() => {
    fetchInfo();
  }, [fetchInfo, deploymentData]);
  useEffect(() => {
    fetchConnectionInfo();
  }, [fetchConnectionInfo]);
  console.log("deploymentData", deploymentData);

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
          <span>{collectionDetails?.name} Collection Escrow Contract:</span>
          {infoLoading ? (
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
          NFTBanlance={Number(
            deploymentData?.escrowNonFungibleCount || 0,
          ).toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
          tokenBanlance={Number(tokenBalance).toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
          symbol={collectionDetails?.symbol || ""}
          myAssetsList={myAssetsList}
          assetsList={assetsList}
          fetchInfo={fetchInfo}
          deploymentData={deploymentData}
          collectionDetails={collectionDetails}
          loading={loading}
          infoLoading={infoLoading}
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
            <>
              {Number(assetsList?.total) > 0 ? (
                assetsList?.items?.map((info, index) => (
                  <Grid item xs={6} sm={4} md={2} key={info?.id}>
                    <NFTCard
                      nftInfo={info}
                      collectionName={collectionDetails?.name || ""}
                    />
                  </Grid>
                ))
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    py: 4,
                  }}
                >
                  <NoDataSearched title="No NFTs Are Found" />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default Libreplex;
