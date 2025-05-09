import { Box, Typography } from "@mui/material";
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
              xs: column?.className === "column1" ? "300px !important" : "auto",
            },
            padding: column.title === "Top Followers" ? "0 60px" : "0 5px",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            textAlign: "left",
          }}
        >
          {column.sort ? (
            column.title.includes(" Vol") ? (
              <SortIconButton20Z title={`${selectedTime} Vol`} />
            ) : (
              <SortIconButton20Z title={column.title} />
            )
          ) : (
            <Typography
              sx={{
                fontSize: "12px !important",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                color: "rgba(255, 255, 255, 0.8)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                justifyContent:
                  column.title === "Top Tweets" ? "flex-end" : "flex-start",
                textAlign: column.title === "Top Tweets" ? "right" : "left",
                width: "100%",
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
              xs: column?.className === "column1" ? "300px !important" : "auto",
            },
            padding: column.title === "Top Followers" ? "0 60px" : "0 5px",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            textAlign: "left",
          }}
        >
          {column.sort ? (
            column.title.includes(" Vol") ? (
              <NewSortLabel title={`${selectedTime} Vol`} />
            ) : (
              <NewSortLabel title={column.title} />
            )
          ) : (
            <Typography
              sx={{
                fontSize: "12px !important",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                color: "rgba(255, 255, 255, 0.8)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
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
              xs: column?.className === "column1" ? "300px !important" : "auto",
            },
            padding: column.title === "Top Followers" ? "0 60px" : "0 5px",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            textAlign: "left",
          }}
        >
          {column.sort ? (
            column.title.includes(" Vol") ? (
              <SortLabelAllToken title={`${selectedTime} Vol`} />
            ) : (
              <Typography
                sx={{
                  fontSize: "12px !important",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  color: "rgba(255, 255, 255, 0.8)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: column.key === "twitter_score" ? "120px" : "auto",
                  justifyContent:
                    column.key === "twitter_score" ? "center" : "flex-start",
                  textAlign: column.key === "twitter_score" ? "center" : "left",
                  ...(column.titleStyle || {}),
                }}
              >
                {column.title}
              </Typography>
            )
          ) : (
            <Typography
              sx={{
                fontSize: "12px !important",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                color: "rgba(255, 255, 255, 0.8)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: column.key === "twitter_score" ? "120px" : "auto",
                justifyContent:
                  column.key === "twitter_score" ? "center" : "flex-start",
                textAlign: column.key === "twitter_score" ? "center" : "left",
                ...(column.titleStyle || {}),
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
