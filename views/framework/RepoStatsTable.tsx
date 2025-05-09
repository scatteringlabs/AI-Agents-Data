import { Box } from "@mui/material";
import { RepoStatsTableHeader } from "./RepoStatsTableHeader";
import { RepoStatsTableRow } from "./RepoStatsTableRow";
import { RepoStat } from "@/services/framework/list";

const columns = [
  { title: "Token", key: "token", sort: false, className: "column1" },
  { title: "Stars", key: "stars_count", sort: true, className: "column" },
  { title: "Stars Δ", key: "stars_change", sort: true, className: "column" },
  { title: "Forks", key: "forks_count", sort: true, className: "column" },
  { title: "Forks Δ", key: "forks_change", sort: true, className: "column" },
  {
    title: "Contrib",
    key: "contributors_count",
    sort: true,
    className: "column",
  },
  {
    title: "Contrib Δ",
    key: "contributors_change",
    sort: true,
    className: "column",
  },
  { title: "Repository", key: "repo", sort: false, className: "column" },
];

export const RepoStatsTable = ({
  data,
  duration,
}: {
  data: RepoStat[];
  duration: "1d" | "3d" | "7d" | "30d";
}) => {
  return (
    <Box
      sx={{
        height: "calc(100vh - 300px)",
        minHeight: "400px",
        overflowY: "auto",
        overflowX: "auto",
        "&::-webkit-scrollbar": {
          width: "8px",
          height: "8px",
        },
        "&::-webkit-scrollbar-track": {
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "rgba(255, 255, 255, 0.2)",
          borderRadius: "4px",
          "&:hover": {
            background: "rgba(255, 255, 255, 0.3)",
          },
        },
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          backgroundColor: "background.paper",
        }}
      >
        <RepoStatsTableHeader columns={columns} />
      </Box>
      <Box>
        {data.map((item) => (
          <RepoStatsTableRow
            key={item.repo_full_name}
            item={item}
            duration={duration}
          />
        ))}
      </Box>
    </Box>
  );
};
