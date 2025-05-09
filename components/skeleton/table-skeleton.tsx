import { Box, Skeleton } from "@mui/material";

interface iTableSkeleton {
  length?: number;
  height?: number;
}
export const TableSkeleton = ({
  length = 10,
  height = 100,
}: iTableSkeleton) => {
  return (
    <Box>
      {Array.from({ length }, (_, index) => index + 1).map((item) => (
        <Skeleton
          key={item}
          sx={{
            background: "#331f44",
            borderRadius: 2,
            height,
          }}
        />
      ))}
    </Box>
  );
};
