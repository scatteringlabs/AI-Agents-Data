import { Box, Skeleton } from "@mui/material";

export const TableSkeleton = () => {
  return (
    <Box>
      {Array.from({ length: 10 }, (_, index) => index + 1).map((item) => (
        <Skeleton
          key={item}
          sx={{
            background: "#331f44",
            borderRadius: 2,
            height: 100,
          }}
        />
      ))}
    </Box>
  );
};
