import React, { Dispatch, SetStateAction } from "react";
import { Box, Grid, Typography, Button, Skeleton } from "@mui/material";
import { CardData } from ".";
import { CollectionStats } from "@/services/sniper";

const AssetCard = ({
  cardData,
  cardLoading,
  setActiveTab,
  col = 4,
}: {
  cardData: CardData[];
  cardLoading: boolean;
  setActiveTab: any;
  col?: number;
}) => {
  return (
    <Grid container spacing={2}>
      {cardData.map((card, index) => (
        <Grid item xs={12} sm={6} md={col} lg={col} xl={col} key={index}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#0E111C",
              color: "#FFFFFF",
              borderRadius: 2,
              p: "20px",
              height: "100%",
            }}
          >
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                {card.icon}
                <Typography
                  sx={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255,0.6)",
                    fontFamily: "Poppins",
                    fontWeight: 500,
                    pl: 0.6,
                  }}
                >
                  {card.title}
                </Typography>
              </Box>
              {cardLoading ? (
                <Skeleton
                  variant="text"
                  width="100%"
                  height={40}
                  sx={{
                    background: "#331f44",
                  }}
                />
              ) : (
                <Typography
                  sx={{
                    fontSize: 24,
                    color: "rgba(255, 255, 255,1)",
                    fontFamily: "Poppins",
                    fontWeight: 500,
                  }}
                >
                  {card.value}
                </Typography>
              )}
            </Box>
            {card.hasButton && (
              <Button
                onClick={() => {
                  setActiveTab();
                }}
                variant="contained"
                sx={{
                  backgroundColor: cardLoading ? "#AF54FF" : "#AF54FF",
                  color: "#FFFFFF",
                  px: 3,
                  py: 0.8,
                  fontSize: { md: 16, xs: 14 },
                  "&:hover": {
                    backgroundColor: "#AF54FF",
                  },
                  mt: 2,
                }}
              >
                Swap
              </Button>
            )}
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default AssetCard;
