import { Box, styled } from "@mui/material";

interface DottedProgressBarProps {
  progress: number; // A number between 0 and 100
}

const Dot = styled(Box)<{ filled: boolean }>(({ filled }) => ({
  width: 12,
  height: 12,
  borderRadius: "50%",
  backgroundColor: filled ? "#B054FF" : "#3C3051", // Filled dot color vs empty dot color
  margin: "0 2px",
}));

const DottedProgressBar = ({ progress }: DottedProgressBarProps) => {
  const totalDots = 20;
  const fullDots = Math.floor(progress / 5); // Calculate how many full dots to fill
  const hasPartialDot = progress % 5 !== 0; // Check if there should be a partial dot

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        background: "#1A1527",
        padding: "5px 6px",
        borderRadius: "20px",
        justifyContent: "space-between",
      }}
    >
      {[...Array(totalDots)].map((_, index) => {
        if (index === fullDots && hasPartialDot) {
          return (
            <svg
              key={index}
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12.0005 3.37127L6.31905 6.00004L12.0005 8.62879C10.9743 10.6249 8.81577 12 6.31905 12C2.82941 12 0.000488281 9.31371 0.000488281 6C0.000488281 2.68629 2.82941 0 6.31905 0C8.81579 0 10.9743 1.37511 12.0005 3.37127Z"
                fill="#B054FF"
              />
            </svg>
          );
        }
        return <Dot key={index} filled={index < fullDots} />;
      })}
    </Box>
  );
};

export default DottedProgressBar;
