import {
  Box,
  Card,
  CardHeader,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import ImagePreviewer from "./image-previewer";
import {
  DisplayLabel,
  DisplayValue,
  PreviewDesc,
  PreviewTitle,
  StyledBox,
} from "../create/require-text";
import { useMemo, useState } from "react";
import InfoTab from "./info-tab";
import Tabs from "@/components/tabs/Tabs";
import { ButtonWrapper, InputWrapper } from "@/views/trade/swap/wrapper";
import { BaseTokenById } from "@/constants/chain";
import AvatarCard from "@/components/collections/avatar-card";
import { getTokenLogoURL } from "@/utils/token";
import { menuItemStyle, selectStyle } from "@/views/trade/swap/token-input";
import { zeroAddress } from "viem";
import HolderTable from "@/views/trade/okx-stat/position-table";
import { geckoNetworkName } from "@/services/tokens";
import { arbitrum, base } from "viem/chains";
import TradesTable from "@/views/trade/trades-table";
import WalletPage from "@/views/trade/evm/wallet/WalletPage";
import Market from "@/views/collect/Market";
import { useQuery } from "@tanstack/react-query";
import { getCollectionBySlug } from "@/services/collections";
import { BaseSID, ProjectData } from "../create/tokenService";
import MediaInfo from "./components/media-info";
import InfoCard from "./components/info-card";
import { TokenEntity } from "@/services/graphql/all-token";
import { formatAddress, formatNumberToString } from "@/utils/format";
import SunSvg from "./components/svgs/sun";
import { useAccount } from "wagmi";
import { chainIdToName } from "@/utils";

const tabs = ["Buy", "Sell"];
const QuoteTokenCard = ({
  tokenSymbol,
  logo,
  projectDetails,
}: {
  tokenSymbol: string;
  logo?: File | null;
  projectDetails?: ProjectData;
}) => (
  <Stack flexDirection="row" alignItems="center">
    <Box>
      <AvatarCard
        hasLogo
        symbol={tokenSymbol}
        logoUrl={
          logo
            ? URL.createObjectURL(logo)
            : `https://dme30nyhp1pym.cloudfront.net/assets/${projectDetails?.collection_logo}`
        }
        chainId={1}
        size={40}
        mr={1}
      />
    </Box>
    <Typography variant="h4" sx={{ fontSize: { md: 24, xs: 16 } }}>
      {tokenSymbol}
    </Typography>
  </Stack>
);
const BaseTokenCard = () => (
  <Stack flexDirection="row" alignItems="center">
    <FormControl fullWidth>
      <Select
        className="test-select"
        labelId="select-label"
        id="select"
        value={zeroAddress}
        placeholder="Select token"
        sx={selectStyle}
        MenuProps={{
          sx: {
            "& .MuiList-root": {
              bgcolor: "#0E111C",
              py: 0,
              px: 1,
            },
            "& .MuiMenu-list": {},
          },
        }}
      >
        {BaseTokenById?.[1]?.map((t) => (
          <MenuItem key={t.address} value={t.address} sx={menuItemStyle}>
            <Stack
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <AvatarCard
                  hasLogo={true}
                  symbol={t?.symbol || ""}
                  logoUrl={getTokenLogoURL({
                    chainId: 1,
                    address: t.address,
                  })}
                  chainId={1}
                  size={40}
                  mr={1}
                />
              </Box>
              <Typography variant="h4" sx={{ fontSize: { md: 24, xs: 16 } }}>
                {t.symbol}
              </Typography>
            </Stack>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Stack>
);
const slug = "colorpepe";
interface iLaunchpadPreviewPage {
  fileList: string[];
  banner?: File | null;
  preview?: File | null;
  logo?: File | null;
  tokenSymbol: string;
  collectionName: string;
  description?: string;
  teamInfo?: string;
  overview?: string;
  tokenQuantity: number | string;
  nftQuantity: number | string;
  conversionRatio: number | string;
  projectDetails?: ProjectData;
  loading: boolean;
}
const LaunchpadPreviewPage = ({
  fileList,
  banner,
  preview,
  logo,
  tokenQuantity,
  nftQuantity,
  conversionRatio,
  tokenSymbol,
  collectionName,
  description,
  teamInfo,
  overview,
  projectDetails,
  loading,
}: iLaunchpadPreviewPage) => {
  const { data: collectionDetails, isLoading: detailsLoading } = useQuery({
    queryKey: ["getCollectionBySlug"],
    queryFn: () =>
      getCollectionBySlug({
        slug,
      }),
  });
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<
    "trade" | "holder" | "overview" | "wallet" | "nft"
  >("overview");
  const [type, setType] = useState("Buy");
  // const infoList = useMemo(
  //   () => [
  //     { label: "Token Quantity", value: tokenQuantity },
  //     { label: "NFT quantity", value: nftQuantity },
  //     {
  //       label: "Conversion Ratio(1NFT=How Many Tokens) ",
  //       value: conversionRatio,
  //     },
  //     { label: "Tokens for sale", value: Number(tokenQuantity) * 0.8 },
  //     { label: "Tokens for DEX LP", value: Number(tokenQuantity) * 0.2 },
  //   ],
  //   [tokenQuantity, nftQuantity, conversionRatio],
  // );
  const infoList = useMemo(
    () => [
      { label: "Token Quantity", value: formatNumberToString(tokenQuantity) },
      { label: "NFT Quantity", value: formatNumberToString(nftQuantity) },
      {
        label: "Conversion Ratio (1NFT = How Many Tokens)",
        value: conversionRatio,
      },
      { label: "Tokens for Sale", value: Number(tokenQuantity) * 0.8 },
      { label: "Tokens for DEX LP", value: Number(tokenQuantity) * 0.2 },
      { label: "Contract Address", value: "0xaaaaabbbb", type: "address" },
      { label: "Token Standard", value: "Hybrid Meme" },
      { label: "Chain", value: chainIdToName(BaseSID?.toString()) },
    ],
    [tokenQuantity, nftQuantity, conversionRatio],
  );

  return (
    <Box sx={{ px: "100px", background: "#0A0A0A", pb: "160px", pt: "40px" }}>
      <Box
        sx={{
          height: 400,
          backgroundColor: "#12122C",
          borderRadius: "8px",
          overflow: "hidden",
          position: "absolute",
          width: "calc( 100% - 200px )",
          left: 100,
          top: 60,
          zIndex: 0,
          "&:after": {
            content: '""',
            width: "100%",
            height: "100%",
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 1,
            background:
              "linear-gradient(180deg, rgba(1, 4, 16, 0.00) 0%, #010410 100%)",
          },
        }}
      >
        {banner || projectDetails?.banner_image ? (
          <Box
            component="img"
            src={
              banner
                ? URL.createObjectURL(banner)
                : `https://dme30nyhp1pym.cloudfront.net/assets/${projectDetails?.banner_image}`
            }
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : null}
        {/* <Box
          component="img"
          src="/assets/images/launchpad/test4.png"
          sx={{
            position: "absolute",
            width: "90%",
            // height: "200px",
            zIndex: 8,
            left: "5%",
            top: 250,
          }}
        /> */}
      </Box>
      <Box
        sx={{
          position: "absolute",
          width: "calc( 100% - 300px )",
          // height: "200px",
          zIndex: 8,
          left: "150px",
          top: 260,
          display: "flex",
          justifyContent: "space-between",
          columnGap: 4,
        }}
      >
        <Box
          sx={{
            width: "55%",
            display: "flex",
            justifyContent: "flex-start",
            columnGap: 2,
          }}
        >
          <Box
            sx={{
              width: "152px",
              height: "152px",
              borderRadius: "50%",
              background: "#aaa",
            }}
            component="img"
            src={
              logo
                ? URL.createObjectURL(logo)
                : `https://dme30nyhp1pym.cloudfront.net/assets/${projectDetails?.collection_logo}`
            }
          />
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                columnGap: 2,
              }}
            >
              <Box
                component="span"
                sx={{
                  color: "#fff",
                  fontFamily: "Poppins",
                  fontSize: "32px",
                  fontStyle: "normal",
                  fontWeight: "700",
                  lineHeight: "140%" /* 22.4px */,
                  textTransform: "uppercase",
                }}
              >
                {tokenSymbol}
              </Box>

              <Box
                component="span"
                sx={{
                  color: "rgba(255, 255, 255,0.6)",
                  fontFamily: "Poppins",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: "400",
                  lineHeight: "140%",
                }}
              >
                {collectionName}
              </Box>
            </Box>
            <Box sx={{ display: "flex", mb: 1 }}>
              <MediaInfo info={projectDetails} />
            </Box>
            <Box
              component="span"
              sx={{
                color: "rgba(255, 255, 255,0.6)",
                fontFamily: "Poppins",
                fontSize: "12px",
                fontStyle: "normal",
                fontWeight: "400",
                lineHeight: "140%",
              }}
            >
              {description}
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            width: "45%",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.10)",
            background: "rgba(0, 0, 0, 0.50)",
            padding: "20px",
          }}
        >
          <Typography
            sx={{
              color: "#FFF",
              fontFamily: "Poppins",
              fontSize: "16px",
            }}
          >
            Total:
          </Typography>

          <Box
            sx={{
              opacity: 0.9,
              background: "#0E111C",
              width: "100%",
              borderRadius: "33px",
              height: "20px",
              my: 2,
            }}
          >
            <Box
              sx={{
                borderRadius: "33px 0 0 33px",
                background: "#00B912",
                width: "70%",
                height: "100%",
              }}
            ></Box>
          </Box>
          <Typography sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box
              component="span"
              sx={{
                color: "#00B912",
                fontFamily: "Poppins",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: "600",
                lineHeight: "140%" /* 22.4px */,
                textTransform: "capitalize",
              }}
            >
              68.80% Sold 68.80 ETH
            </Box>

            <Box
              component="span"
              sx={{
                color: "#FFF",
                fontFamily: "Poppins",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: "500",
                lineHeight: "140%",
              }}
            >
              680.65M/800M
            </Box>
          </Typography>
          <Typography
            sx={{
              color: "rgba(255, 255, 255,0.6)",
              fontFamily: "Poppins",
              fontSize: "12px",
              mt: 1,
            }}
          >
            CA:HyD9T5nchxuWKLbx4Dy6gEMPdGvPrw2fTgo7DzBpump
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              sx={{
                color: "rgba(255, 255, 255,0.6)",
                fontFamily: "Poppins",
                fontSize: "14px",
                mt: 1,
                display: "flex",
                columnGap: 1,
                alignItems: "center",
              }}
            >
              <SunSvg />
              <Typography sx={{ textTransform: "capitalize", fontSize: 14 }}>
                Created by{" "}
                <span
                  style={{
                    color: "#b054ff",
                    paddingRight: "4px",
                    fontWeight: "bold",
                    textDecoration: "underline",
                  }}
                >
                  {formatAddress(address)}
                </span>
                1 day ago
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Box>
      <Grid container spacing={2}>
        {/* 顶部横幅 */}
        <Grid item xs={12}>
          <Box
            sx={{
              height: 400,
              // backgroundColor: "#12122C",
              borderRadius: "8px",
              overflow: "hidden",
              mb: 4,
            }}
          />
        </Grid>

        {/* 左侧部分 (图片和基本信息) */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            {/* 图片区域 */}

            <Grid item xs={12}>
              <Box
                sx={{
                  // height: 400,
                  backgroundColor: "#171525",
                  borderRadius: "8px",
                  overflow: "hidden",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {fileList?.length ? (
                  <ImagePreviewer images={fileList} />
                ) : (
                  projectDetails?.nft_media_images && (
                    <ImagePreviewer
                      images={
                        projectDetails?.nft_media_images
                          ? projectDetails?.nft_media_images
                              ?.split(",")
                              ?.map(
                                (i) =>
                                  `https://dme30nyhp1pym.cloudfront.net/assets/${i}`,
                              ) || []
                          : []
                      }
                    />
                  )
                )}
              </Box>
            </Grid>
            {!fileList?.length ? (
              <Grid item xs={12}>
                <Box
                  sx={{
                    // height: 400,
                    backgroundColor: "#171525",
                    borderRadius: "8px",
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      // paddingBottom: "100%",
                      height: "100%",
                      aspectRatio: "1/1",
                      backgroundColor: "#171525",
                      borderRadius: "8px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={
                        preview
                          ? URL.createObjectURL(preview)
                          : `https://dme30nyhp1pym.cloudfront.net/assets/${projectDetails?.pre_reveal_image}`
                      }
                      alt="Selected Preview"
                      style={{
                        height: "100%",
                        width: "100%",
                        aspectRatio: "1/1",
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            ) : null}
            {/* 基本信息 */}
            <Grid item xs={12}>
              <PreviewTitle
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  columnGap: 1,
                  my: 2,
                  pl: 1,
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="16"
                  viewBox="0 0 20 16"
                  fill="none"
                >
                  <path
                    d="M17.1202 16H2.87979C1.29237 16 0 14.676 0 13.0498V2.95019C0 2.16081 0.299927 1.42139 0.843697 0.864325C1.38015 0.314754 2.12143 0 2.87979 0H17.1202C17.8883 0 18.6125 0.30726 19.1563 0.864325L19.2904 1.0267C19.7488 1.56628 20 2.25074 20 2.95019V13.0498C20 13.7493 19.7488 14.4312 19.2904 14.9733C18.7393 15.6278 17.9468 16 17.1202 16ZM2.87979 1.4139C2.48232 1.4139 2.09705 1.57877 1.81663 1.86354C1.53377 2.15332 1.37771 2.54052 1.37771 2.95269V13.0523C1.37771 13.9016 2.05072 14.5911 2.87979 14.5911H17.1202C17.5543 14.5911 17.9566 14.4012 18.2492 14.054C18.4199 13.8517 18.6223 13.5144 18.6223 13.0523V2.95019C18.6223 2.48806 18.4199 2.15082 18.2492 1.95098L18.1395 1.81358C17.8981 1.57127 17.5226 1.4114 17.1202 1.4114H2.87979V1.4139Z"
                    fill="white"
                  />
                  <path
                    d="M7.39321 7.78107H4.3403C3.66485 7.78107 3.11133 7.21651 3.11133 6.52205V4.80589C3.11133 4.11143 3.66241 3.54688 4.3403 3.54688H7.39321C8.06866 3.54688 8.62218 4.11143 8.62218 4.80589V6.52205C8.62218 7.21651 8.07109 7.78107 7.39321 7.78107ZM4.49148 6.36967H7.24691V4.95827H4.49148V6.36967ZM14.9158 7.29395H10.9582C10.5778 7.29395 10.2706 6.97919 10.2706 6.5895C10.2706 6.1998 10.5778 5.88505 10.9582 5.88505H14.9158C15.2962 5.88505 15.6034 6.1998 15.6034 6.5895C15.6034 6.97919 15.2962 7.29395 14.9158 7.29395ZM15.818 11.4282H4.1818C3.8014 11.4282 3.49416 11.1135 3.49416 10.7238C3.49416 10.3341 3.8014 10.0193 4.1818 10.0193H15.818C16.1984 10.0193 16.5056 10.3341 16.5056 10.7238C16.5056 11.1135 16.1984 11.4282 15.818 11.4282Z"
                    fill="white"
                  />
                </svg>
                Basic Information
              </PreviewTitle>
              <Box
                sx={{
                  backgroundColor: "#171525",
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 255, 255, 0.10)",
                }}
              >
                {infoList?.map((i) => (
                  <Box
                    key={i.label}
                    display="flex"
                    justifyContent="space-between"
                    sx={{
                      borderBottom: "1px solid rgba(255, 255, 255, 0.10)",
                      p: 2,
                    }}
                  >
                    <DisplayLabel>{i.label}</DisplayLabel>
                    <DisplayValue>{i.value}</DisplayValue>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Grid>

        {/* 右侧部分 (图表和交易) */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <InfoCard
                loading={false}
                info={
                  {
                    symbol: projectDetails?.token_symbol,
                    currentPrice: "0.000000001",
                    initPrice: "0.0000000001",
                  } as TokenEntity
                }
                vol="100 ETH"
                logo={
                  logo
                    ? URL.createObjectURL(logo)
                    : `https://dme30nyhp1pym.cloudfront.net/assets/${projectDetails?.collection_logo}`
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Box component="img" src="/assets/images/launchpad/test2.jpg" />
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  backgroundColor: "#171525",
                  borderRadius: "8px",
                  padding: 2,
                }}
              >
                <Box sx={{ width: "400px" }}>
                  <Tabs
                    widthFull
                    items={tabs}
                    onChange={(val) => {
                      setType(val);
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    columnGap: 2,
                    mt: 4,
                  }}
                >
                  <InputWrapper
                    sx={{
                      width: "100%",
                      position: "relative",
                      padding: { md: "10px 16px", xs: "10px 10px" },
                    }}
                  >
                    <Stack
                      flexDirection="row"
                      justifyContent="space-between"
                      sx={{ px: { md: 2, xs: 0 }, py: { md: 2, xs: 1 } }}
                    >
                      <Typography
                        variant="h5"
                        sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                      >
                        Pay
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          color: "rgba(255, 255, 255, 0.6)",
                          display: "flex",
                          alignItems: "center",
                          fontSize: { md: 14, xs: 12 },
                        }}
                      >
                        Balance: 222
                        <Typography
                          variant="body2"
                          sx={{
                            display: "inline-block",
                            color: "#AF54FF",
                            fontSize: { md: 14, xs: 12 },
                            ml: 1,
                            cursor: "pointer",
                          }}
                        >
                          max
                        </Typography>
                      </Typography>
                    </Stack>

                    <Stack
                      flexDirection="row"
                      justifyContent="space-between"
                      sx={{ px: { md: 2, xs: 0 }, pt: { md: 2, xs: 1 } }}
                    >
                      <OutlinedInput
                        placeholder="0"
                        className="swap-input"
                        // type="number"
                        inputProps={{ min: "0" }}
                        // inputProps={{ min: stepValue, step: stepValue }}
                        sx={{
                          input: {
                            width: {
                              md: "200px !important",
                              xs: "calc(100vw - 200px) !important",
                            },
                            fontSize: {
                              md: "30px !important",
                              xs: "20px !important",
                            },
                          },
                        }}
                      />
                      {type === "Buy" ? (
                        <BaseTokenCard />
                      ) : (
                        <QuoteTokenCard
                          tokenSymbol={tokenSymbol}
                          logo={logo}
                          projectDetails={projectDetails}
                        />
                      )}
                    </Stack>
                    {/* <ExchangePositionButton handleExchange={handleExchange} /> */}
                  </InputWrapper>
                  <InputWrapper
                    sx={{
                      position: "relative",
                      width: "100%",
                      padding: { md: "10px 16px", xs: "10px 10px" },
                    }}
                  >
                    <Stack
                      flexDirection="row"
                      justifyContent="space-between"
                      sx={{ px: { md: 2, xs: 0 }, py: { md: 2, xs: 1 } }}
                    >
                      <Typography
                        variant="h5"
                        sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                      >
                        Receive
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          color: "rgba(255, 255, 255, 0.6)",
                          display: "flex",
                          alignItems: "center",
                          fontSize: { md: 14, xs: 12 },
                        }}
                      >
                        Balance: 1111
                      </Typography>
                    </Stack>

                    <Stack
                      flexDirection="row"
                      justifyContent="space-between"
                      sx={{ px: { md: 2, xs: 0 }, pt: { md: 2, xs: 1 } }}
                    >
                      <OutlinedInput
                        placeholder="0"
                        className="swap-input"
                        // type="number"
                        inputProps={{ min: "0" }}
                        // inputProps={{ min: stepValue, step: stepValue }}
                        sx={{
                          input: {
                            width: {
                              md: "200px !important",
                              xs: "calc(100vw - 200px) !important",
                            },
                            fontSize: {
                              md: "30px !important",
                              xs: "20px !important",
                            },
                          },
                        }}
                      />
                      {type === "Buy" ? (
                        <QuoteTokenCard
                          tokenSymbol={tokenSymbol}
                          logo={logo}
                          projectDetails={projectDetails}
                        />
                      ) : (
                        <BaseTokenCard />
                      )}
                    </Stack>
                    {/* <ExchangePositionButton handleExchange={handleExchange} /> */}
                  </InputWrapper>
                </Box>
                <Box display="flex" justifyContent="center">
                  <ButtonWrapper
                    onClick={() => {}}
                    sx={{ width: "auto", py: 1, px: "80px" }}
                  >
                    {type} {tokenSymbol}
                  </ButtonWrapper>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <InfoTab
                setActiveTab={setActiveTab}
                activeTab={activeTab}
                level={1}
              />
              {activeTab === "overview" ? (
                <>
                  <Box
                    sx={{
                      backgroundColor: "#171525",
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 255, 255, 0.10)",
                    }}
                  >
                    <PreviewTitle sx={{ pl: 2, pt: 2 }}>
                      Collection Story
                    </PreviewTitle>
                    <PreviewDesc sx={{ p: 2 }}>{overview}</PreviewDesc>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: "#171525",
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 255, 255, 0.10)",
                      mt: 2,
                    }}
                  >
                    <PreviewTitle sx={{ pl: 2, pt: 2 }}>NFT Info</PreviewTitle>
                    <PreviewDesc sx={{ p: 2 }}>{teamInfo}</PreviewDesc>
                  </Box>
                </>
              ) : null}
              {activeTab === "trade" ? (
                <TradesTable
                  activeTab={activeTab}
                  pool={"0x35d118267e730215311c720058d350b0a1dc721e"}
                  network={geckoNetworkName?.[base.id]}
                  chainId={base.id}
                  symbol="SSS"
                  toSymbol="ETH"
                  decimals={18}
                  address={"0x5ca0c41a50fcfec85b91bb4ca5b024b36d9bb120"}
                  quoteToken={"token0"}
                />
              ) : null}
              {activeTab === "holder" ? (
                <HolderTable
                  activeTab="holder"
                  network={geckoNetworkName?.[base.id]}
                  address={"0x5ca0c41a50fcfec85b91bb4ca5b024b36d9bb120"}
                  chainId={base.id}
                  total={"10000000000"}
                  price={"0.001"}
                />
              ) : null}
              {activeTab === "nft" ? (
                <Box sx={{ height: 700, overflowY: "auto" }}>
                  <Market islug={slug} preview={preview} />
                </Box>
              ) : null}
              {activeTab === "wallet" ? (
                <WalletPage
                  setActiveTab={() => {}}
                  collectionDetails={collectionDetails?.data?.item}
                />
              ) : null}
            </Grid>
          </Grid>
        </Grid>

        {/* 底部详细信息区域 */}
      </Grid>
    </Box>
  );
};

export default LaunchpadPreviewPage;
