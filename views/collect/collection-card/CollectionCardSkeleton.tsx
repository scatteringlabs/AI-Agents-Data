import { Box, Grid, Skeleton } from "@mui/material";

export default function CollectionCardSkeleton() {
  return (
    <Box
      className="fl-item-1 col-xl-2 col-lg-3 col-md-4 col-sm-6"
      sx={{ mb: "30px" }}
    >
      <Skeleton
        height="100%"
        width="100%"
        variant="rectangular"
        sx={{
          background: "#331f44",
          borderRadius: "20px",
          minHeight: "240px",
        }}
      />
    </Box>
  );
}
