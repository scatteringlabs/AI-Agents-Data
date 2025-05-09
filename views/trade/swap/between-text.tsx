import { Stack, Tooltip, Typography } from "@mui/material";
interface iBetweenText {
  lText?: number | string;
  rText?: number | string;
  tip?: number | string;
}
const BetweenText = ({ lText, rText, tip }: iBetweenText) => (
  <Stack
    flexDirection="row"
    alignItems="center"
    justifyContent="space-between"
    sx={{ my: 1 }}
  >
    <Typography variant="h5" color="white">
      {lText}
    </Typography>
    <Tooltip title={tip} placement="top-start">
      <Typography variant="h5" color="white">
        {rText}
      </Typography>
    </Tooltip>
  </Stack>
);

export default BetweenText;
