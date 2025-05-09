import { ChainIdByName } from "@/constants/chain";
import { useChain } from "@/context/chain-provider";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import { OwnedNft } from "alchemy-sdk";
import Link from "next/link";
import { useState } from "react";
interface iMyNFTCard {
  nftInfo: OwnedNft;
  handleToggleNft: (id: string) => void;
  selectedNfts: string[];
  chainId: number;
}
const MyNFTCard = ({
  nftInfo,
  handleToggleNft,
  selectedNfts,
  chainId,
}: iMyNFTCard) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Grid item xs={6} sm={3} md={2} key={nftInfo?.tokenId}>
      <Link
        href={`/assets/${ChainIdByName?.[Number(chainId || 1)]}/${nftInfo?.contract?.address}/${nftInfo?.tokenId}`}
      >
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
            {!imageLoaded && (
              <Skeleton
                variant="rectangular"
                width="100%"
                sx={{
                  aspectRatio: "1 / 1",
                  pb: "100%",
                  position: "absolute",
                  background: "#331f44",
                  left: 0,
                  top: 0,
                  zIndex: 2,
                  width: { md: 280, xs: 148 },
                  height: { md: 280, xs: 148 },
                  borderRadius: 1,
                }}
              />
            )}
            <CardMedia
              component="img"
              image={nftInfo?.image?.cachedUrl}
              alt={nftInfo?.contract?.name}
              onLoad={() => setImageLoaded(true)}
              sx={{
                borderRadius: 1,
                minHeight: { md: 200, xs: 148 },
                width: "100%",
                mb: 1,
                backgroundColor: "#0E111C",
              }}
            />
          </Box>

          <CardContent sx={{ px: 1, pt: 1 }}>
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
              {nftInfo?.name}
              {/* {` #${nftInfo?.tokenId}`} */}
            </Typography>
          </CardContent>
          {/* <Checkbox
          checked={selectedNfts.includes(nftInfo?.id)}
          sx={{ position: "absolute", top: 8, right: 8 }}
        /> */}
        </Card>
      </Link>
    </Grid>
  );
};

export default MyNFTCard;
