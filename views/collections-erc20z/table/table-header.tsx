import { Box, Typography, Tooltip } from "@mui/material"; // 添加Tooltip导入
import { newTableColumns, tableColumns } from "../table-config";
import SortIconButton20Z from "@/components/button/sort-icon-button-erc20z";
import NewSortLabel from "@/components/button/new-sort-icon-button";
import SortLabelAllToken from "@/components/button/sort-label-token";

interface iTableHeader {
  selectedTime?: string;
}

// 为KOL列添加Tooltip的包装组件
const KolTooltipWrapper = ({ children, title }: { children: React.ReactNode, title: string }) => {
  return (
    <Tooltip
      title="Token's X KOL followers"
      arrow
      placement="top"
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: "rgba(0, 0, 0, 0.8)",
            "& .MuiTooltip-arrow": {
              color: "rgba(0, 0, 0, 0.8)",
            },
            fontSize: "12px",
            padding: "8px 12px",
          },
        },
      }}
    >
      <Box component="span">
        {children}
      </Box>
    </Tooltip>
  );
};

// 为Projects列添加Tooltip的包装组件
const ProjectsTooltipWrapper = ({ children, title }: { children: React.ReactNode, title: string }) => {
  return (
    <Tooltip
      title="Token's X project followers"
      arrow
      placement="top"
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: "rgba(0, 0, 0, 0.8)",
            "& .MuiTooltip-arrow": {
              color: "rgba(0, 0, 0, 0.8)",
            },
            fontSize: "12px",
            padding: "8px 12px",
          },
        },
      }}
    >
      <Box component="span">
        {children}
      </Box>
    </Tooltip>
  );
};

// 为VC列添加Tooltip的包装组件
const VCTooltipWrapper = ({ children, title }: { children: React.ReactNode, title: string }) => {
  return (
    <Tooltip
      title="Token's X VC followers"
      arrow
      placement="top"
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: "rgba(0, 0, 0, 0.8)",
            "& .MuiTooltip-arrow": {
              color: "rgba(0, 0, 0, 0.8)",
            },
            fontSize: "12px",
            padding: "8px 12px",
          },
        },
      }}
    >
      <Box component="span">
        {children}
      </Box>
    </Tooltip>
  );
};

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
            ) : column.title === "KOL" ? ( // 特别处理KOL列
              <KolTooltipWrapper title={column.title}>
                <SortIconButton20Z title={column.title} />
              </KolTooltipWrapper>
            ) : column.title === "Projects" ? ( // 特别处理Projects列
              <ProjectsTooltipWrapper title={column.title}>
                <SortIconButton20Z title={column.title} />
              </ProjectsTooltipWrapper>
            ) : column.title === "VC" ? ( // 特别处理VC列
              <VCTooltipWrapper title={column.title}>
                <SortIconButton20Z title={column.title} />
              </VCTooltipWrapper>
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

// 同样修改ERC20ZNewTableHeader和ERC20ZTableHeader
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
            ) : column.title === "KOL" ? ( // 特别处理KOL列
              <KolTooltipWrapper title={column.title}>
                <NewSortLabel title={column.title} />
              </KolTooltipWrapper>
            ) : column.title === "Projects" ? ( // 特别处理Projects列
              <ProjectsTooltipWrapper title={column.title}>
                <NewSortLabel title={column.title} />
              </ProjectsTooltipWrapper>
            ) : column.title === "VC" ? ( // 特别处理VC列
              <VCTooltipWrapper title={column.title}>
                <NewSortLabel title={column.title} />
              </VCTooltipWrapper>
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
            ) : column.title === "KOL" ? ( // 特别处理KOL列
              <KolTooltipWrapper title={column.title}>
                <Typography
                  sx={{
                    fontSize: "12px !important",
                    fontWeight: 900,
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
              </KolTooltipWrapper>
            ) : column.title === "Projects" ? ( // 特别处理Projects列
              <ProjectsTooltipWrapper title={column.title}>
                <Typography
                  sx={{
                    fontSize: "12px !important",
                    fontWeight: 900,
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
              </ProjectsTooltipWrapper>
            ) : column.title === "VC" ? ( // 特别处理VC列
              <VCTooltipWrapper title={column.title}>
                <Typography
                  sx={{
                    fontSize: "12px !important",
                    fontWeight: 900,
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
              </VCTooltipWrapper>
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