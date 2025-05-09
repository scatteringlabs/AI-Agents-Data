import { Box } from "@mui/material";
import { newTableColumns, tableColumns } from "../table-config";
import SortIconButton20Z from "@/components/button/sort-icon-button-erc20z";
import NewSortLabel from "@/components/button/new-sort-icon-button";
import SortLabelAllToken from "@/components/button/sort-label-token";

interface iTableHeader {
  selectedTime?: string;
}
export const ERC20ZTopTableHeader = ({
  selectedTime = "24h",
}: iTableHeader) => {
  return (
    <Box
      sx={{ padding: "12px 10px !important" }}
      data-wow-delay="0s"
      className="wow fadeInUp table-ranking-heading"
    >
      {tableColumns.map((column) => (
        <Box
          key={column.key}
          className={column?.className}
          sx={{
            width: {
              md: column?.className === "column1" ? "450px !important" : "auto",
              xs: column?.className === "column1" ? "200px !important" : "auto",
            },
          }}
        >
          {column.sort ? (
            column.title.includes(" Vol") ? (
              <SortIconButton20Z title={`${selectedTime} Vol`} />
            ) : (
              <SortIconButton20Z title={column.title} />
            )
          ) : (
            <h3>{column.title}</h3>
          )}
        </Box>
      ))}
    </Box>
  );
};
export const ERC20ZNewTableHeader = ({
  selectedTime = "24h",
}: iTableHeader) => {
  return (
    <Box
      sx={{ padding: "12px 10px !important" }}
      data-wow-delay="0s"
      className="wow fadeInUp table-ranking-heading"
    >
      {newTableColumns.map((column) => (
        <Box
          key={column.key}
          className={column?.className}
          sx={{
            width: {
              md: column?.className === "column1" ? "450px !important" : "auto",
              xs: column?.className === "column1" ? "200px !important" : "auto",
            },
          }}
        >
          {column.sort ? (
            column.title.includes(" Vol") ? (
              <NewSortLabel title={`${selectedTime} Vol`} />
            ) : (
              <NewSortLabel title={column.title} />
            )
          ) : (
            <h3>{column.title}</h3>
          )}
        </Box>
      ))}
    </Box>
  );
};

export const ERC20ZTableHeader = ({ selectedTime = "24h" }: iTableHeader) => {
  return (
    <Box
      sx={{ padding: "12px 10px !important" }}
      data-wow-delay="0s"
      className="wow fadeInUp table-ranking-heading"
    >
      {tableColumns.map((column) => (
        <Box
          key={column.key}
          className={column?.className}
          sx={{
            width: {
              md: column?.className === "column1" ? "450px !important" : "auto",
              xs: column?.className === "column1" ? "200px !important" : "auto",
            },
          }}
        >
          {column.sort ? (
            column.title.includes(" Vol") ? (
              <SortLabelAllToken title={`${selectedTime} Vol`} />
            ) : (
              <SortLabelAllToken title={column.title} />
            )
          ) : (
            <h3>{column.title}</h3>
          )}
        </Box>
      ))}
    </Box>
  );
};
