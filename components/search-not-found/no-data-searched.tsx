import { DC } from "@/constants/mediaInfo";
import { Box, Stack, Typography } from "@mui/material";
import Link from "next/link";

export const NoDataSearched = ({ title = "No Data" }: { title?: string }) => {
  return (
    <Stack justifyContent="center" alignItems="center" sx={{ m: 4 }}>
      <Box
        src="/assets/images/tokens/no-data.svg"
        component="img"
        sx={{ width: 200, height: 200, mt: 4 }}
      />
      <Typography variant="h5" sx={{ textAlign: "center", opacity: 0.4 }}>
        {title}
      </Typography>
    </Stack>
  );
};
