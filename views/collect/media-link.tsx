import { SecTitle } from "@/components/text";
import { Box, Grid, Stack, useMediaQuery, useTheme } from "@mui/material";
import { TextLabel, TextLogo } from "./verify-info-icon";
import Link from "next/link";
import { CollectionDetails } from "@/types/collection";
import TwitterIcon from "./media-icon/twitter-icon";
import { useMemo } from "react";
import TelegramIcon from "./media-icon/telegram-icon";
import DiscordIcon from "./media-icon/discord-icon";
import MediumIcon from "./media-icon/medium-icon";
import FacebookIcon from "./media-icon/facebook-icon";
import TikTokIcon from "./media-icon/tiktok-icon";
import RedditIcon from "./media-icon/reddit-icon";
import WarpcastIcon from "./media-icon/warpcast-icon";
import InstagramIcon from "./media-icon/instagram-icon";
import MediaLinkList from "./media-link-list";
import OpenseaIcon from "./media-icon/opensea-icon";
import MagicEdenIcon from "./media-icon/magiceden-icon";
import OkxIcon from "./media-icon/okx-icon";
import CoinGeckoIcon from "./media-icon/coingecko-icon";
import CMCIcon from "./media-icon/cmc-icon";
import DexscreenerIcon from "./media-icon/dexscreener-icon";
import DEXToolsIcon from "./media-icon/dextools-icon";
import GithubIcon from "./media-icon/github-icon";
import ProjectIcon from "./media-icon/cmc-icon copy";

export interface iIconList {
  key: string;
  name: string;
  icon: JSX.Element;
}
const MediaLink = ({
  collectionDetails,
}: {
  collectionDetails?: CollectionDetails;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const mediaList: iIconList[] = useMemo(
    () => [
      {
        key: "project_url",
        name: "Website",
        icon: <ProjectIcon collectionDetails={collectionDetails} />,
      },
      {
        key: "twitter_username",
        name: "Twitter",
        icon: <TwitterIcon collectionDetails={collectionDetails} />,
      },
      {
        key: "telegram_url",
        name: "Telegram",
        icon: <TelegramIcon collectionDetails={collectionDetails} />,
      },
      {
        key: "discord_url",
        name: "Discord",
        icon: <DiscordIcon collectionDetails={collectionDetails} />,
      },
      {
        key: "medium_url",
        name: "Medium",
        icon: <MediumIcon collectionDetails={collectionDetails} />,
      },
      {
        key: "facebook_url",
        name: "Facebook",
        icon: <FacebookIcon collectionDetails={collectionDetails} />,
      },
      {
        key: "tiktok_url",
        name: "TikTok",
        icon: <TikTokIcon collectionDetails={collectionDetails} />,
      },
      {
        key: "reddit_url",
        name: "Reddit",
        icon: <RedditIcon collectionDetails={collectionDetails} />,
      },
      {
        key: "warpcast_url",
        name: "Warpcast",
        icon: <WarpcastIcon collectionDetails={collectionDetails} />,
      },
      {
        key: "instagram_url",
        name: "Instagram",
        icon: <InstagramIcon collectionDetails={collectionDetails} />,
      },
    ],
    [collectionDetails],
  );
  const nftMarketList: iIconList[] = useMemo(
    () => [
      {
        key: "opensea_url",
        name: "OpenSea",
        icon: <OpenseaIcon collectionDetails={collectionDetails} />,
      },
      {
        key: "magiceden_url",
        name: "MagicEden",
        icon: <MagicEdenIcon collectionDetails={collectionDetails} />,
      },
      {
        key: "okxmarket_url",
        name: "OKX Market",
        icon: <OkxIcon collectionDetails={collectionDetails} />,
      },
    ],
    [collectionDetails],
  );
  const otherList: iIconList[] = useMemo(
    () => [
      {
        key: "coingecko_url",
        name: "CoinGecko",
        icon: <CoinGeckoIcon collectionDetails={collectionDetails} />,
      },
      {
        key: "coinmarketcap_url",
        name: "CMC",
        icon: <CMCIcon collectionDetails={collectionDetails} />,
      },
      {
        key: "dexscreener_url",
        name: "Dexscreener",
        icon: <DexscreenerIcon collectionDetails={collectionDetails} />,
      },
      {
        key: "dextools_url",
        name: "DEXTools",
        icon: <DEXToolsIcon collectionDetails={collectionDetails} />,
      },
      {
        key: "github_url",
        name: "Github",
        icon: <GithubIcon collectionDetails={collectionDetails} />,
      },
    ],
    [collectionDetails],
  );

  return (
    <>
      <Box sx={{ p: { md: "4px 20px", xs: "4px 10px" } }}>
        <SecTitle sx={{ mb: { md: 0, xs: 1 } }}>Banner</SecTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: "672px",
              height: { md: "166px", xs: "auto" },
              borderRadius: "10px",
              position: "relative",
              ml: { md: 10, xs: 0 },
            }}
          >
            <Box
              component="img"
              sx={{ width: "100%", maxHeight: "100%", borderRadius: "10px" }}
              src={
                isMobile
                  ? collectionDetails?.mobile_banner_url
                  : collectionDetails?.banner_url
              }
            />
            <Box
              sx={{
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(180deg, rgba(1, 4, 16, 0.00) 0%, #010410 100%)",
                borderRadius: "10px",
                position: "absolute",
                left: 0,
                top: 0,
                zIndex: 1,
              }}
            />

            <Link href="https://forms.gle/3J4CpVtkaKBCbHzW6" target="_blank">
              <TextLabel
                sx={{
                  position: "absolute",
                  right: "20px",
                  bottom: "20px",
                  zIndex: 2,
                }}
              >
                Upload banner
              </TextLabel>
            </Link>
          </Box>
        </Box>
      </Box>
      <MediaLinkList
        title="Social Links"
        list={mediaList}
        collectionDetails={collectionDetails}
        col={2.4}
      />
      <MediaLinkList
        title="NFT Marketplace"
        list={nftMarketList}
        collectionDetails={collectionDetails}
        col={2.8}
        showBackGround={false}
      />
      <MediaLinkList
        title="Other Links"
        list={otherList}
        collectionDetails={collectionDetails}
        col={2.4}
      />
    </>
  );
};

export default MediaLink;
