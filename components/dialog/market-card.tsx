import { tokenIcons } from "@/constants/tokens";
import { CollectionDetails } from "@/types/collection";
import { getTokenLogoURL } from "@/utils/token";
import { Box, Stack, Typography, styled } from "@mui/material";

export const NameText = styled(Typography)`
  color: #fff;
  text-align: center;
  font-family: Poppins;
  font-size: 50px;
  font-style: normal;
  font-weight: 600;
  line-height: 42px;
`;
const SymbolText = styled(Typography)`
  color: #fff;
  text-align: center;
  font-family: Poppins;
  font-size: 30px;
  font-style: normal;
  font-weight: 600;
  line-height: 42px; /* 105% */
  text-transform: uppercase;
  opacity: 0.6;
`;

interface iMarketCard {
  collectionDetails?: CollectionDetails;
  dialogRef: React.MutableRefObject<HTMLDivElement | null>;
}
const MarketCard = ({ collectionDetails, dialogRef }: iMarketCard) => {
  return (
    <Box ref={dialogRef} sx={{ width: 700, p: 4, background: "#010410" }}>
      <Box
        component="img"
        sx={{
          position: "absolute",
          width: "100%",
          left: 0,
          top: 0,
          height: "100%",
          zIndex: 0,
        }}
        src="/assets/images/layout-bg.png"
      />
      <Box sx={{ background: "transparent" }}>
        <Box
          component="img"
          id="logo_header"
          src="/assets/images/logo/logo.png"
          data-retina="/assets/images/logo/logo.png"
        />
        <Box
          sx={{
            position: "relative",
            margin: "20px auto",
            width: 200,
            height: 200,
          }}
        >
          <Box
            component="img"
            // src={getTokenLogoURL({
            //   chainId: collectionDetails?.chain_id || 1,
            //   address: collectionDetails?.erc20_address,
            // })}
            src={collectionDetails?.logo_url}
            alt=""
            sx={{
              width: 200,
              height: 200,
              borderRadius: "20px",
              position: "absolute",
              zIndex: 1,
            }}
          />
          <Box
            component="img"
            src={tokenIcons?.[(collectionDetails?.chain_id || 1)?.toString()]}
            alt=""
            sx={{
              width: 32,
              height: 32,
              position: "absolute",
              borderRadius: "50%",
              top: 6,
              right: 6,
              background: "#fff",
              zIndex: 2,
            }}
          />
        </Box>
      </Box>
      <Stack
        flexDirection="row"
        justifyContent="center"
        alignItems="flex-end"
        sx={{ mt: 4 }}
      >
        <NameText sx={{ mr: 2 }}>{collectionDetails?.symbol}</NameText>
        <SymbolText>{collectionDetails?.name}</SymbolText>
      </Stack>
    </Box>
  );
};

export default MarketCard;
