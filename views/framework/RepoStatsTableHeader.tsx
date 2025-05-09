import { Box, Typography } from "@mui/material";
import SortIconButton from "@/components/button/sort-icon-button";
import { ColumnConfig } from "../collections-erc20z/table-config";

interface Props {
  columns: ColumnConfig[];
  sortComponent?: React.ComponentType<{ title: string }>;
}

export const RepoStatsTableHeader = ({
  columns,
  sortComponent: SortComponent = SortIconButton,
}: Props) => {
  return (
    <Box
      className="table-header"
      sx={{
        padding: "12px 10px",
        display: "flex",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: "rgb(27, 29, 40)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)"
      }}
    >
      {columns.map((column) => (
        <Box
          key={column.key}
          className={column.className}
          sx={{ minWidth: 100, flex: 1 }}
        >
          <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>
            {column.title}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};
