"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Box,
  Typography,
  styled,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import SingleImageUpload from "./image-upload";
import RequireText, {
  ButtonWrapper,
  CustomTextField,
  LabelText,
  TitleText,
} from "./require-text";
import LaunchpadPreviewPage from "../preview/page";
import { useAccount } from "wagmi";
import { BASE_URL_DEV } from "@/constants/url";
import { schema } from "./validation-schema";
import {
  BaseSID,
  createToken,
  ProjectData,
  updateLaunchpadProject,
  updateLaunchpadToChain,
} from "./tokenService";
import { BackIcon, ETHIcon } from "../svg-icon/back";
import ButtonActions from "./button-actions";
import CreateForm from "./create-form";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useParams, useSearchParams } from "next/navigation";
import NeedConnectCard from "@/components/need-connect-card";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { usePrivy, useWallets } from "@privy-io/react-auth";

type FormData = z.infer<typeof schema>;

const LaunchNFTForm = ({
  projectDetails,
  detailsIsLoading,
  refetch,
}: {
  projectDetails?: ProjectData;
  detailsIsLoading?: boolean;
  refetch?: any;
}) => {
  const router = useRouter();
  const p = useParams();
  const s = useSearchParams();

  const [showPreview, setShowPreview] = useState(s.get("preview"));
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [createdId, setCreatedId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // const { address } = useAccount();
  const { user, login } = usePrivy();

  const address = useMemo(() => user?.wallet?.address, [user]);
  const { wallets } = useWallets();
  const wallet = useMemo(() => wallets?.[0], [wallets]);
  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      collection_name: "",
      token_symbol: "",
      // @ts-ignore
      nft_quantity: "",
      collection_story: "",
      description: "",
      chain_id: BaseSID?.toString(),
      telegram: "",
      website: "",
      x: "",
      nft_info: "",
    },
  });
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const nftQuantity = watch("nft_quantity");
  const tokenQuantity = 1000000000;
  const tokenSymbol = watch("token_symbol");
  const collectionName = watch("collection_name");
  const description = watch("description");
  const collection_story = watch("collection_story");
  const teamInfo = watch("nft_info");
  const images = useMemo(
    () =>
      projectDetails?.nft_media_images
        ? projectDetails.nft_media_images
            ?.split(",")
            ?.map((i) => `https://dme30nyhp1pym.cloudfront.net/assets/${i}`)
        : [],
    [projectDetails],
  );
  const banner = watch("banner");
  const logo = watch("collection_logo");
  const preReveal = watch("pre_reveal");
  const conversionRatio = useMemo(() => {
    const nftQty = parseFloat(nftQuantity?.toString() || "0");
    const tokenQty = tokenQuantity;
    return nftQty > 0 ? Math.floor(tokenQty / nftQty) : 0;
  }, [nftQuantity, tokenQuantity]);

  useEffect(() => {
    if (projectDetails) {
      console.log("projectDetails", projectDetails);
      setValue("collection_name", projectDetails?.collection_name);
      setValue("token_symbol", projectDetails?.token_symbol);
      setValue("description", projectDetails?.description);
      setValue("nft_quantity", projectDetails?.nft_quantity);
      setValue("collection_story", projectDetails?.collection_story);
      setValue("nft_info", projectDetails?.nft_info);
      setValue("x", projectDetails?.x);
      setValue("telegram", projectDetails?.telegram);
      setValue("website", projectDetails?.website);
    }
  }, [projectDetails, setValue]);

  const loading = useMemo(
    () => detailsIsLoading || isLoading,
    [detailsIsLoading, isLoading],
  );
  const { openConnectModal } = useConnectModal();

  useEffect(() => {
    if (showPreview) {
      refetch?.();
    }
  }, [showPreview, refetch]);

  useEffect(() => {
    if (!address) {
      openConnectModal?.();
    }
  }, [address, openConnectModal]);

  const handleCreateToken = useCallback(async () => {
    if (!address) {
      openConnectModal?.();
      return;
    }
    if (!projectDetails?.uuid && !createdId) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      // 27ca21b7-6ee2-4d97-b635-a000e96ea59c.avif
      const { hash, address: tAddress } = await createToken(
        collectionName,
        tokenSymbol,
        address || "",
        projectDetails?.uuid || createdId,
        conversionRatio,
        `https://scattering-gateway.s3.amazonaws.com/assets/${projectDetails?.pre_reveal_image}`,
        wallet,
      );
      if (!hash) {
        return;
      }
      setTransactionHash(hash);
      if (tAddress) {
        toast.success("Token Create Successful");
      }
      const toastId = toast.loading(
        "Loading the page now… may take 3-4 seconds.",
      );
      const response = await updateLaunchpadToChain({
        id: projectDetails?.uuid || createdId,
        token_address: tAddress,
        transaction_hash: hash,
      });

      if (response.code === 1) {
        return toast.error(response.msg);
      }
      router.push(`/launchpad/base/${tAddress}`);
      toast.dismiss(toastId);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [
    address,
    collectionName,
    conversionRatio,
    createdId,
    projectDetails,
    router,
    tokenSymbol,
    openConnectModal,
    wallet,
  ]);
  return (
    <Box
      sx={{
        padding: 2,
        backgroundColor: "#070518",
        height: showPreview ? "1px" : "auto",
        overflow: "hidden",
        transition: "all 1s",
      }}
    >
      {loading ? (
        <Box
          sx={{
            position: "fixed",
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            left: 0,
            top: 0,
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={48} sx={{ color: "rgb(175, 84, 255)" }} />
        </Box>
      ) : null}
      <Box
        sx={{
          background: "#070518",
          width: "100%",
          height: "100%",
          position: "absolute",
          left: 0,
          top: 0,
          zIndex: -1,
        }}
      />
      <TitleText
        sx={{ fontSize: { md: 32, xs: 24 }, textAlign: "center", my: 4 }}
      >
        Hybrid Assets Launchpad
      </TitleText>
      <CreateForm
        methods={methods}
        setShowPreview={setShowPreview}
        conversionRatio={conversionRatio}
        projectDetails={projectDetails}
        handleCreateToken={handleCreateToken}
        setIsLoading={setIsLoading}
        setCreatedId={setCreatedId}
      />
      {showPreview ? (
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            backgroundColor: "#070518",
            height: "100vh",
            overflowY: "scroll",
            zIndex: 9,
          }}
        >
          <LaunchpadPreviewPage
            fileList={images || []}
            banner={banner}
            preview={preReveal}
            logo={logo}
            tokenQuantity={tokenQuantity}
            tokenSymbol={tokenSymbol}
            nftQuantity={nftQuantity}
            conversionRatio={conversionRatio}
            collectionName={collectionName}
            description={description}
            teamInfo={teamInfo}
            overview={collection_story}
            projectDetails={projectDetails}
            loading={loading}
          />
        </Box>
      ) : null}
      {showPreview ? (
        <ButtonActions
          id={projectDetails?.uuid || createdId}
          setShowPreview={setShowPreview}
          handleCreateToken={handleCreateToken}
        />
      ) : null}
      {loading ? (
        <Box
          sx={{
            position: "fixed",
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.6)",
            left: 0,
            top: 0,
            zIndex: 99999999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={48} sx={{ color: "rgb(175, 84, 255)" }} />
        </Box>
      ) : null}
    </Box>
  );
};

export default LaunchNFTForm;
