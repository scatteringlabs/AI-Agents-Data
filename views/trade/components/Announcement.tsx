import { CollectionDetails } from "@/types/collection";
import { Box, Link, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import NextLink from "next/link";
import { components } from "./AI-Summary";

const Announcement = ({
  collectionDetails,
}: {
  collectionDetails?: CollectionDetails;
}) => {
  if (!collectionDetails?.profile && !collectionDetails?.research_report) {
    return (
      <Box
        sx={{
          p: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          mt: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontSize: 14, color: "text.secondary" }}
        >
          No data available. Please contact the team on{" "}
          <NextLink href="https://t.me/scatteringlabs" target="_blank">
            Telegram
          </NextLink>{" "}
          to get the Announcement.
        </Typography>
      </Box>
    );
  }
  return (
    <Box
      sx={{
        p: 3,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        mt: 2,
        position: "relative",
        overflow: "auto",
      }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {collectionDetails?.ai_report}
      </ReactMarkdown>
    </Box>
  );
};

export default Announcement;
