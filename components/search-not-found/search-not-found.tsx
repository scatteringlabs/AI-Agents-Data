import Typography from "@mui/material/Typography";
import Paper, { PaperProps } from "@mui/material/Paper";
import { Box } from "@mui/material";

interface Props extends PaperProps {
  query?: string;
}

export default function SearchNotFound({ query, sx, ...other }: Props) {
  return query ? (
    <Box
      sx={{
        textAlign: "center",
        border: "none",
        width: "100%",
        height: "100%",
        m: 0,
        p: 0,
        ...sx,
      }}
      {...other}
    >
      <Typography
        sx={{ color: "#fff" }}
        variant="h6"
        className="font-poppins-400 tw-text-base"
      >
        No results found.
      </Typography>
    </Box>
  ) : (
    <Typography variant="body2" sx={sx} className="font-poppins-500 tw-text-xl">
      Please enter keywords
    </Typography>
  );
}
