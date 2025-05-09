import { DC } from "@/constants/mediaInfo";
import { Box, Stack, Typography } from "@mui/material";
import Link from "next/link";

export const NoCollectionSearched = () => {
  return (
    <Stack justifyContent="center" alignItems="center" sx={{ m: 4 }}>
      <Box
        src="/assets/images/tokens/no-data.svg"
        component="img"
        sx={{ width: 200, height: 200 }}
      />
      <Typography variant="h5" sx={{ textAlign: "center", opacity: 0.4 }}>
        Sorry, the collection you searched for is not listed yet.
        <br />
        Please feel free to contact us through
        <Link
          href={DC}
          target="_blank"
          style={{ margin: 4, textDecoration: "underline" }}
        >
          Discord
        </Link>
        to have it added.
      </Typography>
    </Stack>
  );
};
