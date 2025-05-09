import { Box, Grid, Skeleton } from "@mui/material";

export default function LCollectionCardSkeleton({
  mb = "30px",
  mt = "0px",
}: {
  mb?: string;
  mt?: string;
}) {
  return (
    <Box
      className="fl-item-1 col-xl-3 col-lg-4 col-md-4 col-sm-6"
      sx={{ mb, mt }}
    >
      <Skeleton
        height="100%"
        width="100%"
        variant="rectangular"
        sx={{
          background: "#331f44",
          borderRadius: 1,
          minHeight: "240px",
        }}
      />
    </Box>
  );
}
