"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Grid,
  Switch,
  FormControlLabel,
  Box,
  Typography,
  styled,
  InputAdornment,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import SingleImageUpload from "./image-upload";
import RequireText, {
  ButtonWrapper,
  CustomTextField,
  LabelText,
  TitleText,
} from "./require-text";
import MultiImageUpload from "./multi-image-upload";
import FormProvider from "./form-provider";
import RHFAutocomplete from "./rhf-autocomplete";
import Iconify from "@/components/iconify";
import { chains } from "./countries";
import { ETHIcon } from "../svg-icon/back";
import {
  BaseSID,
  ProjectData,
  saveLaunchpadProject,
  updateLaunchpadProject,
} from "./tokenService";
import { toast } from "react-toastify";
import { useAccount, useBalance, useChainId, useSwitchChain } from "wagmi";
import SingleImageUploadCrop from "./image-upload-crop";
import { useRouter } from "next/router";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { ethers } from "ethers";
import { usePrivy } from "@privy-io/react-auth";

const CreateForm = ({
  methods,
  setShowPreview,
  conversionRatio,
  projectDetails,
  handleCreateToken,
  setIsLoading,
  setCreatedId,
}: {
  methods: any;
  setShowPreview: any;
  conversionRatio: any;
  handleCreateToken: any;
  setCreatedId: any;
  setIsLoading: any;
  projectDetails?: ProjectData;
}) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods;
  const router = useRouter();
  const [socialMediaEnabled, setSocialMediaEnabled] = useState(false);
  const [projectOverviewEnabled, setProjectOverviewEnabled] = useState(false);
  const [bannerEnabled, setBannerEnabled] = useState(false);
  const [mediaEnabled, setMediaEnabled] = useState(false);
  const [initialBuyEnabled, setInitialBuyEnabled] = useState(false);
  // const { address } = useAccount();
  const { user } = usePrivy();
  const address = useMemo(() => user?.wallet?.address, [user]);
  const chainId = useChainId();
  const ethBalanceWei = useBalance({
    address: address as any,
    chainId: chainId,
  });
  const ethBalance = useMemo(
    () =>
      ethers.utils.formatUnits(
        ethBalanceWei?.data?.value.toString() || "0",
        18,
      ),
    [ethBalanceWei],
  );
  const isCurrentChain = useMemo(() => chainId === BaseSID, [chainId]);
  const { switchChain } = useSwitchChain();
  const { openConnectModal } = useConnectModal();
  const onSubmit = handleSubmit(async (data: any) => {
    if (!isDivisible) {
      toast.error("The amount must be divisible by 1 billion evenly.");
      return;
    }
    const toastId = toast.loading("Loading preview… may take 3–4 seconds.");
    setIsLoading(true);
    try {
      const formData = new FormData();

      formData.append("wallet_address", address as string);
      if (existingNftMedia && existingNftMedia.length > 0) {
        // existingNftMedia.forEach((img) =>
        // );
        formData.append("existing_nft_media", existingNftMedia?.join(","));
      }
      // 遍历表单数据并添加到 FormData 中
      Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key])) {
          data[key].forEach((item: any) => formData.append(key, item)); // 如果是数组，例如多个图片
        } else if (data[key] instanceof File) {
          formData.append(key, data[key]); // 如果是文件
        } else {
          if (data[key] !== "undefined") {
            formData.append(key, data[key]); // 普通字段
          }
        }
      });
      if (projectDetails?.uuid) {
        const response = await updateLaunchpadProject(
          projectDetails.uuid,
          formData,
        );
        if (response.code === 1) {
          return toast.error(response.msg);
        }
        if (response.code === 0) {
          setShowPreview(true);
        }
      } else {
        const response = await saveLaunchpadProject(formData);
        console.log("response", response?.data?.uuid);
        setCreatedId(response?.data?.uuid);
        if (response.code === 1) {
          toast.error(response.msg);
        }
        if (response?.data?.uuid) {
          router.push(`/launchpad/edit/${response?.data?.uuid}?preview=true`);
          // setShowPreview(true);
        }
      }
    } catch (error) {
      console.error(error);
      // toast.error(erro);
    } finally {
      toast.dismiss(toastId);
      setIsLoading(false);
    }
  });

  const images = watch("nft_media");
  const nftQuantity = watch("nft_quantity");
  const tokenQuantity = 1000000000;
  const projectOverview = watch("collection_story") || "";
  const teamInformation = watch("nft_info") || "";
  const collectionName = watch("collection_name") || "";
  const tokenSymbol = watch("token_symbol") || "";
  const description = watch("description") || "";
  const describeMaxLength = 1500;
  const nftInfoMaxLength = 800;
  const collectionNameMaxLength = 20;
  const symbolMaxLength = 10;
  const descriptionMaxLength = 500;
  const isDivisible = useMemo(() => {
    if (!nftQuantity || nftQuantity <= 0) {
      return true;
    }
    return tokenQuantity % nftQuantity === 0;
  }, [nftQuantity, tokenQuantity]);
  const [existingNftMedia, setExistingNftMedia] = useState<string[]>(() => {
    return projectDetails?.nft_media_images
      ? projectDetails.nft_media_images.split(",")
      : [];
  });

  useEffect(() => {
    if (projectDetails?.nft_media_images) {
      const initialImages = projectDetails.nft_media_images.split(",");
      setExistingNftMedia(initialImages);
    }
  }, [projectDetails]);
  const handleCreate = () => {
    if (Number(ethBalance) <= 0.001) {
      toast.error("Insufficient ETH balance");
      return;
    }
    handleCreateToken();
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={2} sx={{ pb: 6 }}>
        {/* 右侧部分 */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2} sx={{ pl: 2 }}>
            <Grid item xs={12} md={4}>
              <RequireText text="Collection Logo" />
              <Box>
                <SingleImageUploadCrop
                  width={350}
                  height={350}
                  onImageUpload={(file: File) =>
                    setValue("collection_logo", file)
                  }
                  tips="Size 350X350. PNG or JPG. Max 1Mb."
                  aspectRatio={1 / 1}
                  defalutImage={
                    projectDetails?.collection_logo
                      ? `https://dme30nyhp1pym.cloudfront.net/assets/${projectDetails?.collection_logo}`
                      : ""
                  }
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              {/* Collection Name */}
              <Grid item xs={12} md={12}>
                <RequireText text="Collection Name" />
                <Controller
                  name="collection_name"
                  control={control}
                  render={({ field }) => (
                    <Box position="relative">
                      <CustomTextField
                        {...field}
                        fullWidth
                        error={!!errors.collection_name}
                        inputProps={{ maxLength: collectionNameMaxLength }}
                        sx={{
                          background: "rgba(255, 255, 255, 0.05)",
                          border: !!errors.collection_name
                            ? "1px solid rgba(255, 0, 0, 0.5)"
                            : "none",
                          "& .MuiInputBase-input": {
                            fontFamily: "Poppins",
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "#FFFFFF",
                          },
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          position: "absolute",
                          bottom: "4px",
                          right: "8px",
                          color:
                            collectionName.length > collectionNameMaxLength
                              ? "#DC2626"
                              : "#999",
                          fontSize: "12px",
                          fontFamily: "Poppins",
                        }}
                      >
                        {`${collectionName.length}/${collectionNameMaxLength}`}
                      </Typography>
                    </Box>
                  )}
                />
              </Grid>
              {/* Token Symbol */}
              <Grid item xs={12} md={12}>
                <RequireText text="Token Symbol" />
                <Controller
                  name="token_symbol"
                  control={control}
                  render={({ field }) => (
                    <Box position="relative">
                      <CustomTextField
                        {...field}
                        fullWidth
                        error={!!errors.token_symbol}
                        inputProps={{
                          maxLength: symbolMaxLength,
                          onInput: (e: React.ChangeEvent<HTMLInputElement>) => {
                            e.target.value = e.target.value.toUpperCase();
                            field.onChange(e);
                          },
                        }}
                        sx={{
                          background: "rgba(255, 255, 255, 0.05)",
                          border: !!errors.token_symbol
                            ? "1px solid rgba(255, 0, 0, 0.5)"
                            : "none",
                          "& .MuiInputBase-input": {
                            fontFamily: "Poppins",
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "#FFFFFF",
                          },
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          position: "absolute",
                          bottom: "4px",
                          right: "8px",
                          color:
                            tokenSymbol.length > symbolMaxLength
                              ? "#DC2626"
                              : "#999",
                          fontSize: "12px",
                          fontFamily: "Poppins",
                        }}
                      >
                        {`${tokenSymbol.length}/${symbolMaxLength}`}
                      </Typography>
                    </Box>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <RequireText text="Chain" />
                <RHFAutocomplete
                  name="chain_id"
                  label="Chain"
                  options={chains.map((chain) => chain.id)}
                  getOptionLabel={(option) => {
                    const chain = chains.find((chain) => chain.id === option);
                    return chain ? chain.label : "";
                  }}
                  isOptionEqualToValue={(option, value) => option === value}
                  renderOption={(props, option) => {
                    const chain = chains.find((chain) => chain.id === option); // 使用 find 而不是 filter

                    if (!chain) {
                      return null;
                    }

                    return (
                      <Box
                        component="li"
                        {...props}
                        key={chain.id}
                        sx={{
                          color: "white",
                          background: "rgba(255, 255, 255, 0.00)",
                          fontSize: "16px",
                          fontFamily: "Poppins",
                          lineHeight: "30px",
                          // "&:hover": {
                          //   background: "rgba(255, 255, 255, 0.00)",
                          // },
                        }}
                      >
                        {chain.label}
                      </Box>
                    );
                  }}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <RequireText text="NFT Quantity" />
                <Controller
                  name="nft_quantity"
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      type="number"
                      placeholder="The amount must be divisible by 1 billion evenly."
                      error={!!errors.nft_quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);
                        if (value < 1) {
                          field.onChange(1); // Minimum is 1
                        } else if (value > 1e9) {
                          field.onChange(1e9); // Maximum is 1e8
                        } else {
                          field.onChange(value); // Valid range
                        }
                      }}
                      sx={{
                        background: "rgba(255, 255, 255, 0.05)",
                        border: !!errors.nft_quantity
                          ? "1px solid rgba(255, 0, 0, 0.5)"
                          : "none",
                        "& .MuiInputBase-input": {
                          fontFamily: "Poppins",
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "#FFFFFF",
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              {!isDivisible ? (
                <LabelText
                  sx={{
                    fontSize: 12,
                    color: "#DC2626",
                    textAlign: "right",
                    width: "100%",
                    lineHeight: "40px",
                  }}
                >
                  {`The amount must be divisible by 1 billion evenly.`}
                </LabelText>
              ) : null}
              <LabelText
                sx={{
                  fontSize: 12,
                  color: "#00B912",
                  textAlign: "right",
                  width: "100%",
                  lineHeight: "20px",
                }}
              >
                {`Conversion Ratio (1NFT = How Many Tokens) : ${conversionRatio}`}
              </LabelText>
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <RequireText text="Description" />
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Box position="relative">
                    <CustomTextField
                      {...field}
                      fullWidth
                      multiline
                      rows={8}
                      error={!!errors.description}
                      inputProps={{ maxLength: descriptionMaxLength }}
                      sx={{
                        background: "rgba(255, 255, 255, 0.05)",
                        border: !!errors.description
                          ? "1px solid rgba(255, 0, 0, 0.5)"
                          : "none",
                        "& .MuiInputBase-input": {
                          fontFamily: "Poppins",
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "#FFFFFF",
                        },
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        position: "absolute",
                        bottom: "4px",
                        right: "8px",
                        color:
                          description.length > descriptionMaxLength
                            ? "#DC2626"
                            : "#999",
                        fontSize: "12px",
                        fontFamily: "Poppins",
                      }}
                    >
                      {`${description.length}/${descriptionMaxLength}`}
                    </Typography>
                  </Box>
                )}
              />
            </Grid>
            {/* Chain and NFT Quantity */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    color="success"
                    checked={bannerEnabled}
                    onChange={(e) => setBannerEnabled(e.target.checked)}
                  />
                }
                label={
                  <LabelText sx={{ lineHeight: "30px" }}>
                    Collection Banner
                  </LabelText>
                }
                sx={{ color: "#FFF" }}
              />
            </Grid>
            {bannerEnabled ? (
              <Grid item xs={12} md={12} sx={{}}>
                <Box sx={{ height: 300 }}>
                  <SingleImageUploadCrop
                    width={1920}
                    height={478}
                    onImageUpload={(file: File) => setValue("banner", file)}
                    tips="Whether to upload banner, size 1920X478 PNG or JPG. Max 3Mb."
                    aspectRatio={1920 / 478}
                    defalutImage={
                      projectDetails?.banner_image
                        ? `https://dme30nyhp1pym.cloudfront.net/assets/${projectDetails?.banner_image}`
                        : ""
                    }
                  />
                </Box>
              </Grid>
            ) : null}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    color="success"
                    checked={projectOverviewEnabled}
                    onChange={(e) =>
                      setProjectOverviewEnabled(e.target.checked)
                    }
                  />
                }
                label={<LabelText>Project Overview</LabelText>}
                sx={{ color: "#FFF" }}
              />
              <LabelText
                sx={{ fontSize: 12, color: "#777E90", marginTop: "-30px" }}
              >
                {`Share your collection's story, team, roadmap, and more.`}
              </LabelText>
            </Grid>

            {/* Project Overview */}
            {projectOverviewEnabled ? (
              <>
                <Grid item xs={12}>
                  <LabelText>
                    {`Describe your collection story and why your community should buy your collection`}
                  </LabelText>

                  <Controller
                    name="collection_story"
                    control={control}
                    render={({ field }) => (
                      <Box position="relative">
                        <CustomTextField
                          {...field}
                          fullWidth
                          multiline
                          rows={4}
                          inputProps={{ maxLength: describeMaxLength }}
                          placeholder="The more information you share, the greater the possibility of a successful launch."
                          sx={{
                            background: "rgba(255, 255, 255, 0.05)",
                            "& .MuiInputBase-input": {
                              fontFamily: "Poppins",
                              fontSize: "14px",
                              fontWeight: 400,
                              color: "#FFFFFF",
                            },
                            "& .MuiInputBase-input::placeholder": {
                              fontFamily: "Poppins",
                              fontSize: "12px",
                              fontWeight: 300,
                              color: "rgba(255, 255, 255, 0.2)",
                              opacity: 1,
                            },
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            position: "absolute",
                            bottom: "4px",
                            right: "8px",
                            color:
                              projectOverview.length > describeMaxLength
                                ? "#DC2626"
                                : "#999",
                            fontSize: "12px",
                            fontFamily: "Poppins",
                          }}
                        >
                          {`${projectOverview.length}/${describeMaxLength}`}
                        </Typography>
                      </Box>
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <LabelText>NFT Info including Rarity and Utility</LabelText>

                  <Controller
                    name="nft_info"
                    control={control}
                    render={({ field }) => (
                      <Box position="relative">
                        <CustomTextField
                          {...field}
                          fullWidth
                          multiline
                          rows={4}
                          placeholder="The more information you share, the greater the possibility of a successful launch."
                          inputProps={{ maxLength: nftInfoMaxLength }}
                          sx={{
                            background: "rgba(255, 255, 255, 0.05)",
                            "& .MuiInputBase-input": {
                              fontFamily: "Poppins",
                              fontSize: "14px",
                              fontWeight: 400,
                              color: "#FFFFFF",
                            },
                            "& .MuiInputBase-input::placeholder": {
                              fontFamily: "Poppins",
                              fontSize: "12px",
                              fontWeight: 300,
                              color: "rgba(255, 255, 255, 0.2)",
                              opacity: 1,
                            },
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            position: "absolute",
                            bottom: "4px",
                            right: "8px",
                            color:
                              teamInformation.length > nftInfoMaxLength
                                ? "#DC2626"
                                : "#999",
                            fontSize: "12px",
                            fontFamily: "Poppins",
                          }}
                        >
                          {`${teamInformation.length}/${nftInfoMaxLength}`}
                        </Typography>
                      </Box>
                    )}
                  />
                </Grid>
              </>
            ) : null}

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    color="success"
                    checked={socialMediaEnabled}
                    onChange={(e) => setSocialMediaEnabled(e.target.checked)}
                  />
                }
                label={
                  <Typography sx={{ color: "#FFF", fontSize: "14px" }}>
                    Social Media Link
                  </Typography>
                }
                sx={{ color: "#FFF" }}
              />
            </Grid>
            {/* Social Media Inputs */}
            {socialMediaEnabled && (
              <>
                <Grid container spacing={2} sx={{ pl: 2 }}>
                  <Grid item md={4} xs={12}>
                    <LabelText>Twitter</LabelText>
                    <Controller
                      name="x"
                      control={control}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          fullWidth
                          sx={{
                            background: "rgba(255, 255, 255, 0.05)",
                            border: errors?.x?.message
                              ? "1px solid #DC2626"
                              : "none",
                          }}
                        />
                      )}
                    />
                    <LabelText
                      sx={{
                        fontSize: 12,
                        color: "#DC2626",
                        textAlign: "left",
                        width: "100%",
                        lineHeight: "40px",
                        textTransform: "initial",
                      }}
                    >
                      {errors?.x?.message}
                    </LabelText>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <LabelText>Telegram</LabelText>
                    <Controller
                      name="telegram"
                      control={control}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          fullWidth
                          sx={{
                            background: "rgba(255, 255, 255, 0.05)",
                            border: errors?.telegram?.message
                              ? "1px solid #DC2626"
                              : "none",
                          }}
                        />
                      )}
                    />
                    <LabelText
                      sx={{
                        fontSize: 12,
                        color: "#DC2626",
                        textAlign: "left",
                        width: "100%",
                        lineHeight: "40px",
                        textTransform: "initial",
                      }}
                    >
                      {errors?.telegram?.message}
                    </LabelText>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <LabelText>Website</LabelText>
                    <Controller
                      name="website"
                      control={control}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          fullWidth
                          sx={{
                            background: "rgba(255, 255, 255, 0.05)",
                            border: errors?.website?.message
                              ? "1px solid #DC2626"
                              : "none",
                          }}
                        />
                      )}
                    />
                    <LabelText
                      sx={{
                        fontSize: 12,
                        color: "#DC2626",
                        textAlign: "left",
                        width: "100%",
                        lineHeight: "40px",
                        textTransform: "initial",
                      }}
                    >
                      {errors?.website?.message}
                    </LabelText>
                  </Grid>
                </Grid>
              </>
            )}
            {/* <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    color="success"
                    checked={initialBuyEnabled}
                    onChange={(e) => setInitialBuyEnabled(e.target.checked)}
                  />
                }
                label={<LabelText>Initial Buy</LabelText>}
                sx={{ color: "#FFF" }}
              />
            </Grid> */}
            {initialBuyEnabled ? (
              <Grid container spacing={2} sx={{ pl: 2 }}>
                {/* Initial Buy */}
                <Grid item xs={12}>
                  <Typography sx={{ color: "#777E90", fontSize: 12, mb: 1 }}>
                    Optional: be the very first person to buy your token!
                  </Typography>
                  <Controller
                    name="initialBuy"
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        sx={{ background: "rgba(255, 255, 255, 0.05)" }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <ETHIcon />
                            </InputAdornment>
                          ),
                        }}
                        error={!!errors.initialBuy}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            ) : null}
            {/* Submit Button */}
            <Grid
              item
              xs={12}
              sx={{
                position: "fixed",
                left: 0,
                bottom: 0,
                width: "100%",
                background: "#000",
                zIndex: 99,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                pb: 2,
              }}
            >
              {projectDetails?.uuid ? (
                address ? (
                  isCurrentChain ? (
                    <ButtonWrapper
                      sx={{
                        cursor: "pointer",
                        py: 0,
                        mr: 2,
                        border: "1px solid #af54ff",
                        padding: "10px 40px",
                        borderRadius: "10px",
                      }}
                      onClick={handleCreate}
                    >
                      {Number(ethBalance) > 0.001
                        ? "Launch Collection"
                        : "Insufficient balance"}
                    </ButtonWrapper>
                  ) : (
                    <ButtonWrapper
                      onClick={() => switchChain({ chainId: BaseSID })}
                      sx={{
                        cursor: "pointer",
                        py: 0,
                        mr: 2,
                        border: "1px solid #af54ff",
                        padding: "10px 40px",
                        borderRadius: "10px",
                      }}
                    >
                      Switch Chain
                    </ButtonWrapper>
                  )
                ) : (
                  <ButtonWrapper
                    onClick={() => openConnectModal?.()}
                    sx={{
                      cursor: "pointer",
                      py: 0,
                      mr: 2,
                      border: "1px solid #af54ff",
                      padding: "10px 40px",
                      borderRadius: "10px",
                    }}
                  >
                    Connect Wallet
                  </ButtonWrapper>
                )
              ) : null}
              {address ? (
                <ButtonWrapper
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ borderRadius: "8px" }}
                >
                  Preview Collection
                </ButtonWrapper>
              ) : (
                <ButtonWrapper
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ borderRadius: "8px" }}
                  onClick={() => {
                    openConnectModal?.();
                  }}
                >
                  Connect wallet
                </ButtonWrapper>
              )}
            </Grid>
          </Grid>
        </Grid>
        {/* 左侧部分 */}
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 4, background: "rgba(105, 105, 105, 0.05)" }}>
            <RequireText text="Pre-reveal" />
            <SingleImageUploadCrop
              width={500}
              height={500}
              aspectRatio={1 / 1}
              onImageUpload={(file: File) => setValue("pre_reveal", file)}
              defalutImage={
                projectDetails?.pre_reveal_image
                  ? `https://dme30nyhp1pym.cloudfront.net/assets/${projectDetails?.pre_reveal_image}`
                  : ""
              }
              tips2="Each NFT in your collection will show your pre-reveal media until you upload and reveal your final assets. You could find your collections in My Portfolio section and upload the NFT metadata at any time."
            />
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    color="success"
                    checked={mediaEnabled}
                    onChange={(e) => setMediaEnabled(e.target.checked)}
                  />
                }
                label={
                  <LabelText sx={{ lineHeight: "30px" }}>
                    Upload Media to Show off your NFTs
                  </LabelText>
                }
                sx={{ color: "#FFF", mt: 2 }}
              />
            </Grid>
            {mediaEnabled ? (
              <>
                {" "}
                <Typography variant="body2">Up to 4 allowed.</Typography>
                <Controller
                  name="nft_media"
                  control={control}
                  render={({ field }) => (
                    <MultiImageUpload
                      setFiles={(files: File[]) => setValue("nft_media", files)}
                      files={images || []}
                      maxFiles={4}
                      defalutImages={existingNftMedia?.map(
                        (i) =>
                          `https://dme30nyhp1pym.cloudfront.net/assets/${i}`,
                      )}
                      // setNftMediaImages={setNftMediaImages}
                      onDeleteExistingImage={(index: number) => {
                        const updatedExistingImages = existingNftMedia.filter(
                          (_, i) => i !== index,
                        );
                        setExistingNftMedia(updatedExistingImages);
                      }}
                    />
                  )}
                />
              </>
            ) : null}
          </Box>
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default CreateForm;
