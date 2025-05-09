import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { a11yProps, CustomTabPanel } from "../trade/pool-info/PoolInfoCard";
import { useState } from "react";
import CommentList from "./zora/CommentList";
import MintList from "./zora/MintList";
import { MintNode } from "@/services/graphql/zora/mints";
import { Comment } from "@/services/graphql/zora/comment";

interface iErc20ZTabInfo {
  mintList?: MintNode[];
  commentList?: Comment[];
  commentsCount: number;
  mintsCount: number | string;
}

const Erc20ZTabInfo = ({
  commentList,
  mintList,
  commentsCount,
  mintsCount,
}: iErc20ZTabInfo) => {
  const [value, setValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Stack>
      <Card
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          color: "white",
          mt: 2,
          backgroundImage: "none",
          borderRadius: "20px",
        }}
      >
        {" "}
        <CardHeader
          title={
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                mb: "-18px",
              }}
            >
              <Tabs
                value={value}
                onChange={handleTabChange}
                aria-label="basic tabs example"
                sx={{ textAlign: "left" }}
                TabIndicatorProps={{
                  style: {
                    backgroundColor: "#af54ff",
                  },
                }}
              >
                <Tab
                  sx={{
                    fontSize: 16,
                    textTransform: "capitalize",
                    color: "#fff",
                    textAlign: "left",
                    paddingLeft: 0,
                    // alignItems: "flex-start",
                    "&.Mui-selected": {
                      color: "#af54ff",
                    },
                    "&.Mui-focusVisible": {
                      backgroundColor: "#af54ff",
                    },
                  }}
                  // label="Comments"
                  label={`Comments (${commentsCount})`}
                  {...a11yProps(0)}
                />
                <Tab
                  sx={{
                    fontSize: 16,
                    textTransform: "capitalize",
                    color: "#fff",
                    textAlign: "left",
                    "&.Mui-selected": {
                      color: "#af54ff",
                    },
                    "&.Mui-focusVisible": {
                      backgroundColor: "#af54ff",
                    },
                  }}
                  label={`Mints`}
                  {...a11yProps(1)}
                />
                <Tab
                  sx={{
                    fontSize: 16,
                    textTransform: "capitalize",
                    color: "#fff",
                    textAlign: "left",
                    "&.Mui-selected": {
                      color: "#af54ff",
                    },
                    "&.Mui-focusVisible": {
                      backgroundColor: "#af54ff",
                    },
                  }}
                  label="Holders"
                  {...a11yProps(2)}
                />
              </Tabs>
            </Box>
          }
        />
        <Divider sx={{ background: "rgba(255, 255, 255, 0.05)" }} />
        <CustomTabPanel value={value} index={0}>
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              flexDirection: "column",
              p: 2,
            }}
          >
            <CommentList list={commentList} />
          </CardContent>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              flexDirection: "column",
              p: 2,
            }}
          >
            <MintList list={mintList} />
          </CardContent>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              flexDirection: "column",
              p: 4,
            }}
          >
            <Box
              component="img"
              sx={{ maxWidth: 86 }}
              src="/assets/images/trade/no-data-pool.png"
            />
            <Typography
              variant="h4"
              sx={{
                opacity: 0.6,
                mt: 2,
                fontFamily: "DM Sans",
                fontSize: 16,
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "16px",
              }}
            >
              No Data
            </Typography>
          </CardContent>
        </CustomTabPanel>
      </Card>
    </Stack>
  );
};

export default Erc20ZTabInfo;
