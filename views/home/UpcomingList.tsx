import { Box, useMediaQuery, useTheme } from "@mui/material";
import Slider from "react-slick";
import { useMemo, useState } from "react";
import { useChain } from "@/context/chain-provider";
import UpcomingCard from "./UpcomingCard";

const UpcomingList = () => {
  const theme = useTheme();
  const isSM = useMediaQuery(theme.breakpoints.down("sm"));
  const isMD = useMediaQuery(theme.breakpoints.down("md"));
  const isLG = useMediaQuery(theme.breakpoints.down(1440));
  const isXL = useMediaQuery(theme.breakpoints.down(1680));
  const isXXL = useMediaQuery(theme.breakpoints.down(2160));
  const settings = useMemo(
    () => ({
      dots: true,
      infinite: true,
      slidesToShow: isSM ? 1 : isMD ? 2 : isLG ? 3 : isXL ? 4 : isXXL ? 5 : 5,
      slidesToScroll: 1,
      autoplay: false,
      centerMode: isSM,
      nextArrow: <></>,
      prevArrow: <></>,
    }),
    [isSM, isMD, isLG, isXL, isXXL],
  );
  return (
    <Box sx={{ py: 4 }}>
      <Slider {...settings}>
        {/* <UpcomingCard
          scrlnk="/collection/dune-404"
          link="https://www.dune404.com/"
          xlink="https://x.com/Dune_404"
          tglink="https://t.me/Dune_404"
          discordlink="https://discord.com/invite/dune404"
          detailsLink="https://magiceden.io/launchpad/base/dune404"
          src="/assets/images/home/upcoming/banner-2.png"
          name="DUNE404"
          tag="ERC404"
          price="0.09 ETH"
          PFPtag="PFP"
          supply="10k"
          tokenSupply="10k"
          tip="1 NFT = 1 Token"
          // noStartTime="Ended"
          startTime={new Date("2024-06-13T17:00:00+08:00").getTime()}
        /> */}
        <UpcomingCard
          link="https://www.404.pet/"
          xlink="https://x.com/AngryPetsMeme"
          src="/assets/images/home/upcoming/banner-1.png"
          name="Angry Pets"
          tag="ERC404Meme"
          price="TBD"
          PFPtag="PFP Memecoin"
          supply="10k"
          tokenSupply="4.04B "
          noStartTime="Mid July"
          tip="1 NFT = 404K Token"
        />
        {isSM ? null : <div style={{ visibility: "hidden" }}></div>}
        {isSM ? null : <div style={{ visibility: "hidden" }}></div>}
        {isSM ? null : <div style={{ visibility: "hidden" }}></div>}
        {isSM ? (
          <UpcomingCard
            link="https://www.404.pet/"
            xlink="https://x.com/AngryPetsMeme"
            src="/assets/images/home/upcoming/banner-1.png"
            name="Angry Pets"
            tag="ERC404Meme"
            price="TBD"
            PFPtag="PFP Memecoin"
            supply="10k"
            tokenSupply="4.04B "
            noStartTime="Mid July"
            tip="1 NFT = 404K Token"
          />
        ) : (
          <div style={{ visibility: "hidden" }}></div>
        )}
      </Slider>
    </Box>
  );
};

export default UpcomingList;
