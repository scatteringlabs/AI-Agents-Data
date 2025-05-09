import { Box, Grid, Skeleton } from "@mui/material";

export default function RarityCardSkeleton() {
  return (
    <Box>
      <div>
        <Skeleton
          variant="text"
          width="30%"
          height="40px"
          sx={{
            background: "#331f44",
            mb: "10px",
          }}
        />
        <Skeleton
          variant="text"
          width="625px"
          height="40px"
          sx={{
            background: "#331f44",
            mb: "20px",
          }}
        />
      </div>
      <Grid container spacing={2}>
        {Array.from({ length: 6 }, (_, index) => index).map((item) => (
          <Grid key={item} item xs={4}>
            <Skeleton
              variant="rectangular"
              height="90px"
              width="100%"
              sx={{
                background: "#331f44",
                borderRadius: 2,
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
