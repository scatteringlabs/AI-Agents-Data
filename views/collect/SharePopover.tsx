import Iconify from "@/components/iconify";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  Snackbar,
  styled,
} from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCopyToClipboard } from "react-use";
import { toast } from "react-toastify";

interface SharePopoverProps {
  anchorEl: HTMLElement | null;
  id: string;
  name?: string;
  onClose?: () => void;
}

const StyledListItemIcon = styled(ListItemIcon)(() => ({
  color: "#fff",
  minWidth: "20px",
  marginRight: "10px",
}));
const StyledListItemText = styled(ListItemText)(() => ({
  ".MuiTypography-root": { fontSize: "14px" },
  ":hover": {
    color: "#af54ff",
    transition: "all 0.3s ease-in-out",
  },
}));

export default function SharePopover({
  anchorEl,
  id,
  onClose,
  name,
}: SharePopoverProps) {
  const open = Boolean(anchorEl);
  const [copyState, copyToClipboard] = useCopyToClipboard();
  const [currentUrl, setCurrentUrl] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);
  useEffect(() => {
    if (copyState.value) {
      toast.success("Copied to clipboard");
    }
  }, [copyState]);

  const copyLink = () => {
    copyToClipboard(window.location.href);
    onClose?.();
  };
  return (
    <>
      <Popover
        id={open ? id : undefined}
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{ paper: { sx: { backgroundColor: "transparent" } } }}
      >
        <List sx={{ backgroundColor: "#0E111C", color: "#fff" }}>
          <ListItem disablePadding onClick={copyLink}>
            <ListItemButton>
              <StyledListItemIcon>
                <Iconify icon="ic:baseline-add-link" />
              </StyledListItemIcon>
              <StyledListItemText primary="Copy link" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <Link
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out the ${name} NFT collection on @scattering_io`)}&url=${encodeURIComponent(currentUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ListItemButton>
                <StyledListItemIcon>
                  <Iconify icon="fa6-brands:x-twitter" />
                </StyledListItemIcon>
                <StyledListItemText primary="Share on twitter" />
              </ListItemButton>
            </Link>
          </ListItem>
        </List>
      </Popover>
    </>
  );
}
