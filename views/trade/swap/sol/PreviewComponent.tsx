import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Link,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Skeleton,
  IconButton,
} from "@mui/material";
import { toast } from "react-toastify";
import Iconify from "@/components/iconify";

interface Parameters {
  name: string;
  label: string;
}
interface ActionLink {
  label: string;
  href: string;
  parameters?: Parameters[];
}

export interface BLinkApiData {
  icon: string;
  label: string;
  title: string;
  description: string;
  symbol?: string;
  setBlinkDialogOpen?: any;
  links: {
    actions?: ActionLink[];
  };
}

const PreviewComponent: React.FC<BLinkApiData> = ({
  icon,
  label,
  title,
  description,
  links,
  symbol,
  setBlinkDialogOpen,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        background: "#181818",
        borderRadius: "12px",
        border: "0.4px solid rgba(255, 255, 255,0.1)",
        position: "relative",
      }}
    >
      <IconButton
        aria-label="close"
        onClick={() => {
          setBlinkDialogOpen(false);
        }}
        sx={{
          color: "#fff",
          position: "absolute",
          width: 32,
          height: 32,
          right: "10px",
          top: "10px",
          zIndex: 2,
        }}
      >
        <Iconify
          icon="iconamoon:close"
          sx={{ width: 30, height: 30 }}
          color="#fff"
        />
      </IconButton>
      <Card
        sx={{
          width: "100%",
          maxWidth: 400,
          overflow: "hidden",
          borderRadius: "12px",
          bgcolor: "#fff",
          p: 0,
          position: "relative",
          pb: { md: 1, xs: 1 },
        }}
      >
        {!imageLoaded && (
          <Skeleton
            variant="rectangular"
            width="100%"
            sx={{
              aspectRatio: "1 / 1",
              pb: "100%",
              position: "absolute",
              background: "#331f44",
              left: 0,
              top: 0,
              zIndex: 2,
            }}
          />
        )}
        <CardMedia
          component="img"
          sx={{ width: "100%", objectFit: "cover", aspectRatio: "1 / 1" }}
          image={icon}
          alt="action-image"
          onLoad={() => setImageLoaded(true)}
        />
        <CardContent sx={{ px: 2 }}>
          <Typography
            variant="body2"
            color="#fff"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 1,
              fontSize: 12,
              // mt: 1,
            }}
          >
            <span>scattering.io</span>
            <Link
              href="https://docs.dialect.to/documentation/actions/security"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Box
                sx={{
                  bgcolor: "rgba(136,137,137,0.4)",
                  color: "#888989",
                  borderRadius: "50%",
                  p: 0.4,
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  fill="none"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M13.863 3.42 8.38 1.088a.932.932 0 0 0-.787 0L2.108 3.421c-.641.291-1.137.904-1.108 1.662 0 2.916 1.196 8.195 6.212 10.616.496.233 1.05.233 1.546 0 5.016-2.42 6.212-7.7 6.241-10.616 0-.758-.496-1.37-1.137-1.662Zm-6.33 7.35h-.582a.69.69 0 0 0-.7.7c0 .408.292.7.7.7h2.216c.379 0 .7-.292.7-.7 0-.38-.321-.7-.7-.7h-.234V8.204c0-.38-.32-.7-.7-.7H7.208a.69.69 0 0 0-.7.7c0 .408.292.7.7.7h.326v1.866Zm-.466-5.133c0 .525.408.933.933.933a.94.94 0 0 0 .933-.933A.96.96 0 0 0 8 4.704a.94.94 0 0 0-.933.933Z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </Box>
            </Link>
          </Typography>
          <Typography
            variant="h6"
            component="div"
            color="#fff"
            sx={{ fontSize: 20 }}
            gutterBottom
          >
            {title}
          </Typography>
          <Typography variant="body2" color="#fff" sx={{ mb: 0, fontSize: 12 }}>
            {description}
          </Typography>
        </CardContent>
        <CardActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: 2,
            py: 0,
          }}
        >
          {links.actions?.map((action, index) =>
            action?.parameters ? null : (
              <Box
                key={index}
                // href={action.href}
                // variant="contained"
                sx={{
                  fontSize: { md: 16, xs: 12 },
                  flex: "1 1 30%",
                  bgcolor: "#9886E5",
                  color: "#fff",
                  textAlign: "center",
                  p: { md: 1, xs: 1 },
                  borderRadius: 1,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {action.label}
              </Box>
            ),
          )}
        </CardActions>
        <Box
          sx={{
            m: { md: 2, xs: 1 },
            border: "1px solid #6d6f71",
            py: { md: 1, xs: 1 },
            px: { md: 2, xs: 1 },
            borderRadius: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: { md: 14, xs: 12 },
          }}
        >
          {links.actions?.[3]?.parameters?.[0]?.label}
          <Box
            sx={{
              bgcolor: "#9886E5",
              color: "#fff",
              textAlign: "center",
              p: 1,
              px: 2,
              borderRadius: 1,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Buy {symbol}
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default PreviewComponent;
