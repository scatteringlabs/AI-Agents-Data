import { CollectionDetails } from "@/types/collection";
import { Box, Link, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import NextLink from "next/link";
import Image from "next/image";

export const components = {
  h1: ({ ...props }) => (
    <Typography
      variant="h4"
      sx={{
        color: "white",
        fontWeight: "bold",
        my: 2,
        fontSize: "16px !important",
      }}
      {...props}
    />
  ),
  h2: ({ ...props }) => (
    <Typography
      variant="h5"
      sx={{
        color: "white",
        fontWeight: "bold",
        my: 2,
        fontSize: "16px !important",
      }}
      {...props}
    />
  ),
  h3: ({ ...props }) => (
    <Typography
      variant="h3"
      sx={{
        color: "white",
        fontWeight: "bold",
        my: 2,
        fontSize: "14px !important",
      }}
      {...props}
    />
  ),
  h4: ({ ...props }) => (
    <Typography
      variant="h4"
      sx={{
        color: "white",
        fontWeight: "bold",
        my: 1,
        fontSize: "14px !important",
      }}
      {...props}
    />
  ),
  h5: ({ ...props }) => (
    <Typography
      variant="h5"
      sx={{
        color: "white",
        fontWeight: "bold",
        my: 2,
        fontSize: "14px !important",
      }}
      {...props}
    />
  ),
  p: ({ ...props }) => (
    <Typography
      variant="body2"
      sx={{
        lineHeight: 2,
        color: "#FFFFFFB3",
        fontSize: 14,
        mb: 3,
      }}
      {...props}
    />
  ),
  a: ({ ...props }) => (
    <Link
      sx={{ color: "primary.main", textDecoration: "underline" }}
      {...props}
    />
  ),
  li: ({ ...props }) => (
    <Typography
      component="li"
      sx={{
        ml: 2,
        color: "#FFFFFFB3",
        fontSize: 14,
        mb: 1,
      }}
      {...props}
    />
  ),
};

const AISummary = ({
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
          to get the AI summary.
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
      <Typography
        variant="h4"
        sx={{ color: "white", fontWeight: "bold", my: 2, fontSize: 16 }}
      >
        Project Description
      </Typography>
      <NextLink href="https://alva.xyz/" target="_blank">
        <Box
          sx={{
            color: "gay",
            fontWeight: "bold",
            m: 2,
            position: "absolute",
            right: 0,
            top: 0,
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            columnGap: 1,
          }}
        >
          Powered by{" "}
          <Box
            component="img"
            src="https://alva-static.b-cdn.net/prd/_next/static/media/logo.601dc343.png"
            sx={{
              width: { md: 20, xs: 20 },
            }}
            alt="alva"
          />
          Alva
        </Box>
      </NextLink>
      <Typography variant="body2" sx={{ fontSize: 14, color: "#FFFFFFB3" }}>
        {collectionDetails?.profile}
      </Typography>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {collectionDetails?.research_report}
      </ReactMarkdown>
    </Box>
  );
};

export default AISummary;
