import { Box } from "@mui/material";
import { PreviewDesc, PreviewTitle } from "../launchpad/create/require-text";

const OverviewItem = ({ title, value }: { title: string; value: string }) => {
  return (
    <Box
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: "8px",
        border: "1px solid rgba(255, 255, 255, 0.10)",
        mb: 2,
      }}
    >
      <PreviewTitle sx={{ pl: 2, pt: 2 }}>{title}</PreviewTitle>
      <PreviewDesc sx={{ p: 2 }}>{value}</PreviewDesc>
    </Box>
  );
};

export default OverviewItem;
