import React from "react";
import { Box, styled, Typography } from "@mui/material";
import { useRouter } from "next/router";

export const MyButton = styled(Box)`
  border-radius: 10px;
  border: 1px rgba(255, 255, 255, 0.12);
  background: #b054ff;
  color: rgb(255, 255, 255);
  text-align: center;
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px; /* 142.857% */
  text-transform: capitalize;
  padding: 10px 20px;
  cursor: pointer;
  @media (max-width: 768px) {
    font-size: 12px;
    padding: 8px 16px;
    border-radius: 8px;
  }

  @media (max-width: 480px) {
    font-size: 10px;
    padding: 6px 12px;
    border-radius: 6px;
  }
`;

export const TableHeader = styled(Typography)`
  color: rgba(255, 255, 255, 1);
  font-variant-numeric: lining-nums proportional-nums;
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 26px; /* 185.714% */
  text-transform: capitalize;
  width: 100%;
`;

const PortfolioTabs = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  const handleNavigation = (path: string) => {
    if (currentPath !== path) {
      router.push(path, undefined, { shallow: true });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        columnGap: 2,
        width: "100%",
        mt: 4,
      }}
    >
      <MyButton
        sx={
          !currentPath.includes("/launchpad/portfolio/held")
            ? {
                background: "transparent",
                border: "1px rgba(255, 255, 255, 0.12) solid",
                color: "rgba(255, 255, 255,0.6)",
              }
            : null
        }
        onClick={() => handleNavigation("/launchpad/portfolio/held")}
      >
        Hybrids held
      </MyButton>
      <MyButton
        sx={
          !currentPath.includes("/launchpad/portfolio/created")
            ? {
                background: "transparent",
                border: "1px rgba(255, 255, 255, 0.12) solid",
                color: "rgba(255, 255, 255,0.6)",
              }
            : null
        }
        onClick={() => handleNavigation("/launchpad/portfolio/created")}
      >
        Hybrids created
      </MyButton>
      <MyButton
        sx={
          !currentPath.includes("/launchpad/portfolio/draft")
            ? {
                background: "transparent",
                border: "1px rgba(255, 255, 255, 0.12) solid",
                color: "rgba(255, 255, 255,0.6)",
              }
            : null
        }
        onClick={() => handleNavigation("/launchpad/portfolio/draft")}
      >
        Draft
      </MyButton>
    </Box>
  );
};

export default PortfolioTabs;
