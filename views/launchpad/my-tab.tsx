import React from "react";
import { Box, Typography, styled } from "@mui/material";
import { useRouter } from "next/router";
import ExploreIcon from "./svg-icon/explore";
import PortfolioIcon from "./svg-icon/portfolio";

export const TabText = styled(Typography)<{ active?: boolean }>`
  color: ${({ active }) => (active ? "#B054FF" : "rgba(255, 255, 255, 0.6)")};
  text-align: center;
  font-family: Poppins, sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px; /* 150% */
  text-transform: capitalize;
`;

export const TabBox = styled(Box)`
  width: 100%;
  margin-top: 40px;
  display: flex;
  align-items: center;
  column-gap: 16px;
`;

export const TabItem = styled(Box)<{ active?: boolean }>`
  display: flex;
  align-items: center;
  column-gap: 8px;
  cursor: pointer;
  opacity: ${({ active }) => (active ? 1 : 0.6)};
  transition: opacity 0.3s;

  svg path {
    fill: ${({ active }) => (active ? "#B054FF" : "rgba(255, 255, 255, 0.6)")};
  }
`;

interface TabProps {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const Tab: React.FC<TabProps> = ({ isActive, onClick, icon, label }) => {
  return (
    <TabItem active={isActive} onClick={onClick}>
      {icon}
      <TabText active={isActive}>{label}</TabText>
    </TabItem>
  );
};

// 示例使用
const TabComponent = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  const handleNavigation = (path: string) => {
    if (currentPath !== path) {
      router.push(path, undefined, { shallow: true });
    }
  };

  return (
    <TabBox>
      <Tab
        isActive={
          currentPath.startsWith("/launchpad/explore") ||
          currentPath === "/launchpad"
        }
        onClick={() => handleNavigation("/launchpad/explore")}
        icon={<ExploreIcon />}
        label="Explore Collections"
      />
      <Tab
        isActive={currentPath.startsWith("/launchpad/portfolio")}
        onClick={() => handleNavigation("/launchpad/portfolio/created")}
        icon={<PortfolioIcon />}
        label="My Portfolio"
      />
    </TabBox>
  );
};

export default TabComponent;
