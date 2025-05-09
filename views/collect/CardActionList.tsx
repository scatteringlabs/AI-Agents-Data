import { IconCoin, IconTransfer } from "@/components/icons";
import styled from "@emotion/styled";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

const StyledListItemIcon = styled(ListItemIcon)(() => ({
  color: "#fff",
  minWidth: "20px",
}));
const StyledListItemText = styled(ListItemText)(() => ({
  ".MuiTypography-root": { fontSize: "14px" },
}));

export default function CardActionList() {
  return (
    <List sx={{ backgroundColor: "#0E111C", color: "#fff" }}>
      <ListItem disablePadding>
        <ListItemButton>
          <StyledListItemIcon>
            <IconCoin />
          </StyledListItemIcon>
          <StyledListItemText primary="List NFT" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton>
          <StyledListItemIcon>
            <IconTransfer />
          </StyledListItemIcon>
          <StyledListItemText primary="Transfer" />
        </ListItemButton>
      </ListItem>
    </List>
  );
}
