import { Box, Typography } from "@mui/material";

const NewTips = () => {
  return (
    <Box>
      <Typography
        sx={{
          fontFamily: "Poppins",
          fontSize: 14,
          fontWeight: 400,
          color: "rgba(255,255,255,0.6)",
          mb: 2,
        }}
      >
        Only new collections with liquidity added in the last 30 days are
        included in this list.
      </Typography>
    </Box>
  );
};

export default NewTips;
