import { SecTitle } from "@/components/text";
import { Box, Grid, useMediaQuery, useTheme } from "@mui/material";
import { TextLogo } from "./verify-info-icon";
import Link from "next/link";
import { CollectionDetails } from "@/types/collection";
import { iIconList } from "./media-link";

const MediaLinkList = ({
  collectionDetails,
  list,
  title,
  col,
  showBackGround = true,
}: {
  collectionDetails?: CollectionDetails;
  list?: iIconList[];
  title: string;
  col: number;
  showBackGround?: boolean;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Box
      sx={{
        mt: 1,
        display: "flex",
        alignItems: { md: "center", xs: "flex-start" },
        background: showBackGround ? "rgba(255, 255, 255,0.02)" : "none",
        padding: { md: "20px", xs: "10px" },
        borderRadius: "10px",
        flexDirection: { md: "row", xs: "column" },
      }}
    >
      <SecTitle sx={{ width: 180, mb: { md: 0, xs: 1 } }}>{title}</SecTitle>
      <Grid container spacing={isMobile ? 1 : 2}>
        {list?.map((item) => (
          <Grid key={item.key} item xs={4} md={col}>
            <Link
              href={item.link || "#"}
              target="_blank"
              style={{
                pointerEvents: item.link ? "auto" : "none",
                textDecoration: "none",
              }}
            >
              <TextLogo
                sx={{
                  fontSize: { md: 14, xs: 10 },
                  background: "none",
                  borderColor: item.link ? "#B054FF" : "rgba(255, 255, 255, 0.3)",
                  color: item.link ? "#B054FF" : "rgba(255, 255, 255, 0.3)",
                }}
              >
                <Box
                  sx={{
                    mr: { md: 1, xs: 0.4 },
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {item.icon}
                </Box>
                {item.name}
              </TextLogo>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MediaLinkList;
