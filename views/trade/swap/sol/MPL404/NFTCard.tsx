import { NFTHoldingMint } from "@/services/sniper";
import { DasApiAsset } from "@metaplex-foundation/digital-asset-standard-api";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";

const NFTCard = ({
  nftInfo,
  collectionName,
}: {
  nftInfo: DasApiAsset;
  collectionName: string;
}) => {
  return (
    <Card sx={{ p: "10px", pb: 0 }}>
      <CardMedia
        component="img"
        height="140"
        image={`https://img-cdn.magiceden.dev/rs:fill:640:0:0/plain/${nftInfo?.content?.files?.[0]?.uri}`}
        // image={nftInfo?.content?.files?.[0]?.uri as string}
        alt={nftInfo?.content?.metadata?.name}
      />
      <CardContent sx={{ px: 0, py: 1 }}>
        <Typography
          sx={{
            fontSize: "14px",
            fontFamily: "Poppins",
            fontWeight: 600,
            color: "#FFF",
          }}
        >
          {collectionName}
        </Typography>
        <Typography
          sx={{
            fontSize: "12px",
            fontFamily: "Poppins",
            fontWeight: 400,
            color: "rgba(255, 255, 255,0.6)",
          }}
        >
          {nftInfo?.content?.metadata?.name}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NFTCard;
