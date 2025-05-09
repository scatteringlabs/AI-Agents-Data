import { ChainIdByName } from "@/constants/chain";
import { TokenInfo } from "@/services/reservoir-mynft";
import ContentNotAvailable from "@/views/collect/collection-card/ content-not-available";
import RarityTag from "@/views/collect/rarity-tag/RarityTag";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useMemo, useState } from "react";

interface iMyNFTCard {
  nftInfo: TokenInfo;
  handleToggleNft: (id: string) => void;
  selectedNfts: string[];
  chainId: number;
  rarity: number;
  col?: number;
}

const MyNFTCard = ({
  nftInfo,
  handleToggleNft,
  selectedNfts,
  chainId,
  rarity,
  col = 6,
}: iMyNFTCard) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardContent = useMemo(
    () => (
      <Card
        onClick={() => handleToggleNft(nftInfo?.tokenId as string)}
        sx={{
          cursor: "pointer",
          position: "relative",
          p: 1,
          pb: 0,
          backgroundColor: "#0E111C",
        }}
      >
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            image={nftInfo?.imageSmall || nftInfo?.image}
            alt={nftInfo?.name || nftInfo?.collection?.name}
            onLoad={() => setImageLoaded(true)}
            sx={{
              borderRadius: 1,
              minHeight: { md: 200, xs: 148 },
              width: "100%",
              mb: 1,
              backgroundColor: "#0E111C",
              opacity: imageLoaded ? 1 : 0,
            }}
          />
          {imageLoaded ? null : (
            <Box sx={{ minHeight: { md: 30, xs: 48 } }}>
              <ContentNotAvailable
                symbol={nftInfo?.collection?.symbol || "symbol"}
                chainId={Number(nftInfo?.chainId) || 1}
                address={nftInfo?.contract || ""}
              />
            </Box>
          )}
        </Box>

        <CardContent
          sx={{
            px: 1,
            pt: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#fff",
              fontSize: { md: 14, xs: 12 },
              fontWeight: 500,
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%",
              overflow: "hidden",
            }}
          >
            {nftInfo?.name || nftInfo?.collection?.name}
          </Typography>
          {rarity ? <RarityTag rarity={rarity} /> : null}
        </CardContent>
      </Card>
    ),
    [nftInfo, handleToggleNft, imageLoaded, rarity],
  );
  return (
    <Grid item xs={6} sm={3} md={12 / col} key={nftInfo?.tokenId}>
      {ChainIdByName?.[Number(chainId)] ? (
        <Link
          href={`/assets/${ChainIdByName?.[Number(chainId || 1)]}/${nftInfo?.contract}/${nftInfo?.tokenId}`}
        >
          {cardContent}
        </Link>
      ) : (
        cardContent
      )}
    </Grid>
  );
};

export default MyNFTCard;
