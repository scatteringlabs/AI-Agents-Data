import {
  Box,
  Button,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Slider from "react-slick";
import { CryptoAsset, getBanner } from "@/services/home";
import BannerCard from "./BannerCard";
import SupportCard from "./SupportCard";
import { useChain } from "@/context/chain-provider";
import LoadingCard from "./LoadingCard";
import CustomCard from "./CustomCard";
import { arbitrum } from "viem/chains";

export const PrevArrow = (props: {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  isHovered: boolean;
}) => {
  const { className, onClick, isHovered } = props;
  return (
    <div
      className={className}
      style={{
        display: "flex",
        background: "#B054FF",
        alignItems: "center",
        transition: "all 0.3s",
        width: "42px",
        height: isHovered ? "42px" : 0,
        borderRadius: "50%",
        position: "absolute",
        zIndex: 3,
        justifyContent: "center",
        opacity: isHovered ? 1 : 0,
      }}
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 34 34"
        fill="none"
      >
        <path
          d="M21.4625 29.3246L24.4375 26.1371L15.5125 17.2121L24.4375 8.28711L21.4625 5.09961L9.5625 17.2121L21.4625 29.3246Z"
          fill="white"
        />
      </svg>
    </div>
  );
};
export const NextArrow = (props: {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  isHovered: boolean;
}) => {
  const { className, style, onClick, isHovered } = props;

  return (
    <div
      className={className}
      style={{
        display: "flex",
        background: "#B054FF",
        alignItems: "center",
        width: "42px",
        height: isHovered ? "42px" : 0,
        borderRadius: "50%",
        position: "absolute",
        zIndex: 3,
        justifyContent: "center",
        transition: "all 0.3s",
        opacity: isHovered ? 1 : 0,
      }}
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 34 34"
        fill="none"
      >
        <path
          d="M12.5375 4.67539L9.5625 7.86289L18.4875 16.7879L9.5625 25.7129L12.5375 28.9004L24.4375 16.7879L12.5375 4.67539Z"
          fill="white"
        />
      </svg>
    </div>
  );
};

interface iAutoBannerInfo {
  isLoading: boolean;
  bannerList: CryptoAsset[];
}
const AutoBannerInfo = ({ isLoading, bannerList }: iAutoBannerInfo) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const { chainId } = useChain();
  let sliderRef = useRef<Slider>();
  const isSM = useMediaQuery(theme.breakpoints.down("sm"));
  const isMD = useMediaQuery(theme.breakpoints.down("md"));
  const isUpMD = useMediaQuery(theme.breakpoints.up(1440));
  const isLG = useMediaQuery(theme.breakpoints.down(1440));
  const isXL = useMediaQuery(theme.breakpoints.down(1680));
  const isXXL = useMediaQuery(theme.breakpoints.down(2160));

  const placeholderCount = useMemo(
    () => (isSM ? 1 : 4) - (bannerList?.length || 0),
    [bannerList?.length, isSM],
  );
  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    slidesToShow: isSM ? 1 : isMD ? 2 : isLG ? 3 : isXL ? 5 : isXXL ? 5 : 5,
    slidesToScroll: 1,
    autoplaySpeed: 3000,
    centerMode: true,
    nextArrow:
      !isSM && Boolean(placeholderCount <= 0) ? (
        <NextArrow isHovered={isHovered} />
      ) : (
        <></>
      ),
    prevArrow:
      !isSM && Boolean(placeholderCount <= 0) ? (
        <PrevArrow isHovered={isHovered} />
      ) : (
        <></>
      ),
  };

  const play = useCallback(() => {
    sliderRef?.current?.slickPlay();
  }, [sliderRef]);
  const pause = useCallback(() => {
    sliderRef?.current?.slickPause();
  }, [sliderRef]);

  useEffect(() => {
    console.log("bannerList?.length", bannerList?.length);

    if (bannerList?.length < 4) {
      pause();
    } else {
      play();
    }
  }, [bannerList?.length, pause, play]);

  return (
    <Box
      sx={{
        position: "relative",
        // width: { md: "100vw", xs: "100%" },
        // marginLeft: "calc(50% - 50vw)",
        // px: { md: "60px", xs: 0 },
        py: 2,
        px: 0,
        boxSizing: "border-box",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: "url(/assets/images/home/banner/banner-bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.3,
          backdropFilter: "blur(187px)",
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box
        className="slider-container"
        sx={{
          position: "relative",
          py: { md: 4, xs: 2 },
          pt: { md: 2, xs: 4 },
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        <Slider
          {...settings}
          className="banner-list"
          // @ts-ignore
          ref={sliderRef}
        >
          {isLoading
            ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                <LoadingCard key={item} />
              ))
            : bannerList?.map((item, index) => (
                <BannerCard
                  key={item?.erc20_address}
                  item={item}
                  index={index}
                />
              ))}
          {placeholderCount > 0 &&
            Array(placeholderCount)
              .fill("")
              ?.map((_, index) => (
                <div key={index} style={{ visibility: "hidden" }}></div>
              ))}
          <SupportCard />
          {/* <CustomCard
            imageUrl="/assets/images/home/banner/cheaper-banner.png"
            title="Zero Swap Fees"
            desc="Trade Hybrids on Scattering with ZERO fees"
            showIcon={false}
            showButton={false}
          /> */}
          {chainId === arbitrum.id || chainId === -1 ? (
            <CustomCard
              link="https://x.com/404_Crystal"
              imageUrl="/assets/images/home/banner/crystal-banner.png"
              title="CRYSTAL"
              desc="Powered by Scattering Team"
            />
          ) : null}
        </Slider>
      </Box>
    </Box>
  );
};

export default AutoBannerInfo;
