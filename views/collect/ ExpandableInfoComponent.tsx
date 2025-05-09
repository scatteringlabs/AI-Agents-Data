import React, { useState } from "react";
import { Box, Typography, Collapse, IconButton, Grid } from "@mui/material";
import Iconify from "@/components/iconify";
import { LabelValueText } from "./DetailBar";

interface InfoItem {
  label: string;
  value?: string | number | JSX.Element;
}

interface ExpandableInfoComponentProps {
  infoItems: InfoItem[];
}

const ExpandableInfoComponent: React.FC<ExpandableInfoComponentProps> = ({
  infoItems,
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <Box
      sx={{
        border: "1px solid #333",
        borderRadius: 2,
        py: 2,
        px: 0,
        position: "relative",
        background: "#020410",
      }}
    >
      <Grid container spacing={0} alignItems="center">
        {infoItems.slice(0, 4).map((item, index) => (
          <Grid item xs={3} key={index}>
            <LabelValueText label={item.label} value={item?.value || ""} />
          </Grid>
        ))}
      </Grid>
      <IconButton
        onClick={handleToggle}
        sx={{
          position: "absolute",
          left: "calc( 50% -  24px )",
          bottom: -24,
          zIndex: 8,
        }}
      >
        {expanded ? (
          <Iconify
            icon="material-symbols-light:expand-circle-up-outline"
            color="#B054FF"
            sx={{ width: 32, height: 32 }}
          />
        ) : (
          <Iconify
            icon="material-symbols-light:expand-circle-down-outline-rounded"
            color="#B054FF"
            sx={{ width: 32, height: 32 }}
          />
        )}
      </IconButton>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Grid container spacing={0} alignItems="center" sx={{ mt: 2 }}>
          {infoItems.slice(4, 8).map((item, index) => (
            <Grid item xs={3} key={index}>
              <LabelValueText label={item.label} value={item?.value || ""} />
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={0} alignItems="center" sx={{ mt: 2 }}>
          {infoItems.slice(8, 10).map((item, index) => (
            <Grid item xs={3} key={index}>
              <LabelValueText label={item.label} value={item?.value || ""} />
            </Grid>
          ))}
        </Grid>
      </Collapse>
    </Box>
  );
};

export default ExpandableInfoComponent;
