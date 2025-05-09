import { Box, Typography } from "@mui/material";
import SortIconButton20Z from "@/components/button/sort-icon-button-erc20z";
import { agentTableColumns } from "../collections-erc20z/table-config";

interface AgentTableHeaderProps {
  sortComponent?: React.ComponentType<{ title: string }>;
}

export const AgentTableHeader = ({
  sortComponent: SortComponent = SortIconButton20Z,
}: AgentTableHeaderProps) => {
  return (
    <Box
      sx={{ padding: "12px 10px !important" }}
      data-wow-delay="0s"
      className="wow fadeInUp table-ranking-heading"
    >
      {agentTableColumns.map((column) => (
        <Box
          key={column.key}
          className={column?.className}
          sx={{
            width: {
              md: column?.className === "column1" ? "250px !important" : "auto",
              xs: column?.className === "column1" ? "200px !important" : "auto",
            },
          }}
        >
          {column.sort ? (
            <SortComponent title={column.title} />
          ) : (
            <Typography
              sx={{
                fontSize: "12px !important",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                color: "rgba(255, 255, 255, 0.8)",
              }}
            >
              {column.title}
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
};
