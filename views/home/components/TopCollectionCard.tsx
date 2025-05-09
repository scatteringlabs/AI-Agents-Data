import AvatarCard from "@/components/collections/avatar-card";
import LabelPriceText from "@/components/collections/label-price-text";
import PriceChangeText from "@/components/collections/price-change-text";
import VerifiedIcon from "@/components/icons/verified-icon";
import { ChainIdByName } from "@/constants/chain";
import { tokenIcons } from "@/constants/tokens";
import { Collection } from "@/types/collection";
import { formatNumberWithKM, formatUSD } from "@/utils/format";
import { getTokenLogoURL } from "@/utils/token";
import {
  Box,
  Grid,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";
import { useCallback } from "react";

const RankText = styled(Typography)`
  -webkit-text-stroke-width: 1;
  -webkit-text-stroke: 1px black;
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke-color: #fff;
  /* font-family: Maponrope; */
  font-size: 40px;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
  position: absolute;
  left: 120px;
  top: -10px;
  opacity: 0.6;
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, transparent 0%, #000 70%);
    pointer-events: none;
  }
`;

const formatRank = (num: string | number): string => {
  return Number(num) < 10 ? `0${num}` : num.toString();
};
const TopCollectionCard = ({
  logo_url,
  name,
  rank,
  price_in_usd,
  volume,
  price_change,
  chain_id,
  erc20_address,
  symbol,
  has_logo,
  slug,
  is_verified,
}: Collection) => {
  const router = useRouter();
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.down("md"));
  const handleClick = useCallback(() => {
    router.push(
      `/collection/${ChainIdByName?.[Number(chain_id)]}/${erc20_address}`,
    );
  }, [router, erc20_address, chain_id]);
  return (
    <Grid item xs={12} md={6} lg={4}>
      <Box
        data-wow-delay="0.1s"
        className="wow fadeInUp"
        sx={{
          position: "relative",
          px: { md: 2, xs: 1 },
          pt: { md: 2, xs: 1 },
          border: "1px solid transparent",
          boxSizing: "border-box",
          mb: { md: 0, xs: 4 },
          "&:hover": { border: "1px solid #b054ff", borderRadius: 2 },
        }}
        onClick={handleClick}
      >
        <RankText sx={{ left: { md: 120, xs: 80 }, top: { md: -10, xs: -24 } }}>
          {formatRank(rank)}
        </RankText>
        <Box
          className="tf-author-box style-2 hv-border"
          sx={{ zIndex: 1, borderRadius: "10px", cursor: "pointer" }}
        >
          <AvatarCard
            hasLogo={has_logo}
            logoUrl={getTokenLogoURL({
              chainId: chain_id || 1,
              address: erc20_address,
            })}
            symbol={symbol}
            chainId={chain_id}
          />
          <div className="author-infor ">
            <Typography
              variant="h5"
              sx={{
                fontFamily: "Poppins",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "180px",
                overflow: "hidden",
                fontSize: { md: "20px !important", xs: "18px !important" },
                display: "flex",
                alignItems: "center",
                textTransform: "uppercase",
              }}
            >
              {is_verified ? (
                <span style={{ marginRight: "6px" }}>
                  <VerifiedIcon size={20} />
                </span>
              ) : null}
              {symbol}
            </Typography>
            <LabelPriceText
              label={isMd ? "Vol" : "24 Volume"}
              price={`$${formatNumberWithKM(volume)}`}
            />
          </div>
          <Box>
            <LabelPriceText
              label="Price"
              price={`${formatUSD(price_in_usd)}`}
            />
            <PriceChangeText priceChange={price_change} />
          </Box>
        </Box>
      </Box>
    </Grid>
  );
};

export default TopCollectionCard;
