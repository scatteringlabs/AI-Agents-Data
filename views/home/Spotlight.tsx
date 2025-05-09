import { getSpotlight } from "@/services/home";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Slider from "react-slick";
import { useMemo, useState } from "react";
import SpotlightCard from "./SpotlightCard";
import { NextArrow, PrevArrow } from "./BannerInfo";
import { useChain } from "@/context/chain-provider";

const SpotLight = () => {
  const theme = useTheme();
  const isSM = useMediaQuery(theme.breakpoints.down("sm"));
  const isMD = useMediaQuery(theme.breakpoints.down("md"));
  const isLG = useMediaQuery(theme.breakpoints.down(1440));
  const isXL = useMediaQuery(theme.breakpoints.down(1680));
  const isXXL = useMediaQuery(theme.breakpoints.down(2160));

  const [isHovered, setIsHovered] = useState(false);
  const { chainId } = useChain();
  const { data } = useQuery({
    queryKey: ["spotlight", { chainId }],
    queryFn: () => getSpotlight(chainId),
    enabled: Boolean(chainId),
  });
  const placeholderCount = useMemo(
    () => (isSM ? 1 : 5) - (data?.data?.list?.length || 0),
    [data?.data?.list?.length, isSM],
  );
  const settings = useMemo(
    () => ({
      dots: true,
      infinite: true,
      slidesToShow: isSM ? 1 : isMD ? 2 : isLG ? 3 : isXL ? 5 : isXXL ? 5 : 5,
      slidesToScroll: 1,
      autoplay: false,
      // initialSlide: 1,
      // centerPadding: isSM ? "60px" : "0px",
      centerMode: isSM,
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
    }),
    [isSM, isHovered, placeholderCount, isMD, isLG, isXL, isXXL],
  );
  return (
    <Box
      sx={{ py: 4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Slider {...settings}>
        {data?.data?.list?.map((item) => (
          <SpotlightCard key={item?.erc20_address} item={item} />
        ))}
        {placeholderCount > 0 &&
          Array(placeholderCount)
            .fill("")
            ?.map((_, index) => (
              <div key={index} style={{ visibility: "hidden" }}></div>
            ))}
        {placeholderCount === 0 && isSM ? (
          <div style={{ visibility: "hidden" }}></div>
        ) : null}
      </Slider>
    </Box>
  );
};

export default SpotLight;
