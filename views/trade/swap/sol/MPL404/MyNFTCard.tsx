import { DasApiAsset } from "@metaplex-foundation/digital-asset-standard-api";
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
import Link from "next/link";
import { useState } from "react";
interface iMyNFTCard {
  nftInfo: DasApiAsset;
  handleToggleNft: (id: string) => void;
  selectedNfts: string[];
}
const MyNFTCard = ({ nftInfo, handleToggleNft, selectedNfts }: iMyNFTCard) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Grid item xs={6} sm={3} md={2} key={nftInfo.id}>
      <Link href={`/assets/solana/${nftInfo?.id}`}>
        <Card
          onClick={() => handleToggleNft(nftInfo?.id as string)}
          sx={{ cursor: "pointer", position: "relative", p: 1, pb: 0 }}
        >
          <Box sx={{ position: "relative" }}>
            {!imageLoaded && (
              <Skeleton
                variant="rectangular"
                width="100%"
                height={200}
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
              image={`https://img-cdn.magiceden.dev/rs:fill:640:0:0/plain/${nftInfo?.content?.files?.[0]?.uri}`}
              alt={nftInfo?.content?.metadata?.name}
              onLoad={() => setImageLoaded(true)}
              sx={{
                borderRadius: 1,
                minHeight: { md: 200, xs: 148 },
                width: "100%",
              }}
            />
          </Box>

          <CardContent sx={{ px: 1, mt: !imageLoaded ? 4 : 0 }}>
            <Typography
              variant="body2"
              sx={{
                color: "#fff",
                fontSize: 16,
                fontWeight: 500,
              }}
            >
              {nftInfo?.content?.metadata?.name}
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
