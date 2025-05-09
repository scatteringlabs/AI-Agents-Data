import { Box, Grid, Skeleton } from "@mui/material";

const CollectionInfoSkeleton = () => {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={2}>
          <Skeleton
            variant="circular"
            width={120}
            height={120}
            sx={{
              background: "#331f44",
            }}
          />
        </Grid>
        <Grid item xs={12} sm={10}>
          <Skeleton
            variant="text"
            width="20%"
            height={40}
            sx={{
              background: "#331f44",
            }}
          />
          <Skeleton
            variant="text"
            width="80%"
            height={40}
            sx={{
              background: "#331f44",
            }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Skeleton
            variant="rectangular"
            height={80}
            sx={{
              background: "#331f44",
              borderRadius: 2,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={3} sx={{ display: { xs: "none", sm: "block" } }}>
          <Skeleton
            sx={{
              background: "#331f44",
              borderRadius: 2,
            }}
            variant="rectangular"
            height={80}
          />
        </Grid>
        <Grid item xs={12} sm={3} sx={{ display: { xs: "none", sm: "block" } }}>
          <Skeleton
            sx={{
              background: "#331f44",
              borderRadius: 2,
            }}
            variant="rectangular"
            height={80}
          />
        </Grid>
        <Grid item xs={12} sm={3} sx={{ display: { xs: "none", sm: "block" } }}>
          <Skeleton
            sx={{
              background: "#331f44",
              borderRadius: 2,
            }}
            variant="rectangular"
            height={80}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CollectionInfoSkeleton;
