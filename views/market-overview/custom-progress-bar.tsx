import { Box } from "@mui/material";

const CustomProgressBar = ({ percent }: { percent: number }) => {
  return (
    <Box sx={{ height: 10, display: "flex", mx: 2 }}>
      <Box
        sx={{
          width: `${percent}%`,
          background: "#00B912",
          borderRadius: "10px 0 0 10px",
          position: "relative",
          "&:after": {
            content: '""',
            position: "absolute",
            right: "0px",
            top: "0px",
            width: "0px",
            height: "0px",
            borderRight: "12px solid #DC2626",
            borderTop: "10px solid #00B912",
          },
        }}
      />

      <Box
        sx={{
          width: `${100 - percent}%`,
          background: "#DC2626",
          borderRadius: "0 10px 10px 0",
        }}
      />
    </Box>
  );
};

export default CustomProgressBar;
