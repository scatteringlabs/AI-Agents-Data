import React, { Dispatch, SetStateAction } from "react";
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

interface iPortfolioTabs {
  setActiveTab: Dispatch<SetStateAction<string>>;
  activeTab: string;
}

const PortfolioTabs = ({ setActiveTab, activeTab }: iPortfolioTabs) => {
  const router = useRouter();
  const currentPath = router.pathname;

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
          activeTab === "Tokens"
            ? null
            : {
                background: "transparent",
                border: "1px rgba(255, 255, 255, 0.12) solid",
                color: "rgba(255, 255, 255,0.6)",
              }
        }
        onClick={() => {
          setActiveTab("Tokens");
        }}
      >
        Tokens Held
      </MyButton>
      <MyButton
        sx={
          activeTab === "NFTs"
            ? null
            : {
                background: "transparent",
                border: "1px rgba(255, 255, 255, 0.12) solid",
                color: "rgba(255, 255, 255,0.6)",
              }
        }
        onClick={() => {
          setActiveTab("NFTs");
        }}
      >
        NFTs Held
      </MyButton>

      <MyButton
        sx={
          activeTab === "Created"
            ? null
            : {
                background: "transparent",
                border: "1px rgba(255, 255, 255, 0.12) solid",
                color: "rgba(255, 255, 255,0.6)",
              }
        }
        onClick={() => {
          setActiveTab("Created");
        }}
      >
        Created
      </MyButton>
    </Box>
  );
};

export default PortfolioTabs;
