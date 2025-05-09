import { IconDot, IconLightning } from "@/components/icons";
import { Box, Popover, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import CardActionList from "./CardActionList";

interface HoverButtonProps {
  type?: "buy" | "sell" | "connect";
}

export default function HoverButton({ type }: HoverButtonProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const theme = useTheme();
  const isDpwnMd = useMediaQuery(theme.breakpoints.down("md"));
  if (!type) return null;

  if (type === "sell") {
    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
      setAnchorEl(event.currentTarget);
    };
    const handlePopoverClose = () => {
      setAnchorEl(null);
    };

    const popoverClick = (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
    };

    const sellBtnClick = (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
    };

    return (
      <Box sx={{ display: "flex", gap: "6px" }}>
        <div className="button-place-bid">
          <span
            className="tf-button"
            style={{ backgroundColor: "#AF54FF" }}
            onClick={sellBtnClick}
          >
            <span>Instant Sell</span>
          </span>
        </div>
        <div>
          <Box className="button-place-bid">
            <span
              className="tf-button"
              style={{
                backgroundColor: "#AF54FF",
                width: "auto",
                padding: "7px",
                color: "#010410",
              }}
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
            >
              <IconDot />
            </span>
          </Box>
        </div>
        <Popover
          sx={{
            pointerEvents: "none",
          }}
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: 110,
            horizontal: "right",
          }}
          disableScrollLock
          onClick={popoverClick}
        >
          <CardActionList />
        </Popover>
      </Box>
    );
  }

  return (
    <div className="button-place-bid">
      <a href="#" className="tf-button" style={{ backgroundColor: "#AF54FF" }}>
        <IconLightning />
        <span>Buy</span>
      </a>
    </div>
  );
}
