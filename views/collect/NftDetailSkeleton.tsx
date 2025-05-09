import { Skeleton, Grid, Box } from "@mui/material";

export default function NftDetailSkeleton() {
  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ position: "relative", p: "50%" }}>
            <Skeleton
              variant="rectangular"
              height="100%"
              width="100%"
              sx={{
                background: "#331f44",
                position: "absolute",
                left: 0,
                top: 0,
                borderRadius: 2,
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Skeleton
            variant="text"
            width="20%"
            sx={{
              background: "#331f44",
              fontSize: "14px",
              mb: "10px",
            }}
          />
          <Skeleton
            variant="text"
            width="70%"
            sx={{
              background: "#331f44",
              fontSize: "32px",
              mb: "10px",
            }}
          />
          <Skeleton
            variant="text"
            width="40%"
            sx={{
              background: "#331f44",
              fontSize: "14px",
              mb: "10px",
            }}
          />
          <Skeleton
            variant="rectangular"
            height="200px"
            width="100%"
            sx={{
              background: "#331f44",
              borderRadius: 2,
              mb: "20px",
            }}
          />
          <Skeleton
            variant="rectangular"
            height="400px"
            width="100%"
            sx={{
              background: "#331f44",
              borderRadius: 2,
              mb: "20px",
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
