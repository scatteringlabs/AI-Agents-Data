import { Box, Typography, Avatar } from "@mui/material";

import { useRouter } from "next/router";
import Link from "next/link";
import { formatNumberWithKM } from "@/utils/format";
import { AgentData } from "@/services/launchpad";

export const AgentTableRow = ({ item }: { item: AgentData }) => {
  const router = useRouter();

  const goToProject = `/${item.chain_id}/${item.slug}`;

  const TextCell = ({ children }: { children: React.ReactNode }) => (
    <Typography
      sx={{
        fontSize: "12px",
        color: "rgba(255, 255, 255, 0.8)",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </Typography>
  );

  const PercentCell = ({ value }: { value: string }) => (
    <TextCell>
      <span style={{ color: parseFloat(value) >= 0 ? "#4caf50" : "#f44336" }}>
        {value}%
      </span>
    </TextCell>
  );

  return (
    <Link href={goToProject}>
      <Box
        className="wow fadeInUp fl-row-ranking"
        sx={{
          padding: "12px 10px !important",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          cursor: "pointer",
          "&:hover": {
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "6px",
          },
        }}
      >
        <Box
          className="column1"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            width: { xs: "200px", md: "250px" },
          }}
        >
          <Avatar
            src={item.top_agent_logo_on_scr}
            alt={item.top_agent_name_on_scr}
          />
          <Box>
            <TextCell>{item.name}</TextCell>
            <Typography variant="caption" sx={{ color: "#888" }}>
              Top Agent: {item.top_agent_name_on_scr}
            </Typography>
          </Box>
        </Box>

        {/* <Box className="column">
          <TextCell>{item.chain_id}</TextCell>
        </Box> */}

        <Box className="td5">
          <PercentCell value={item.price_change_in_1d} />
        </Box>

        <Box className="td5">
          <PercentCell value={item.price_change_in_7d} />
        </Box>

        <Box className="td5">
          <PercentCell value={item.price_change_in_30d} />
        </Box>

        <Box className="td5">
          <TextCell>{formatNumberWithKM(item.total_protocol_fee)}</TextCell>
        </Box>

        <Box className="td5">
          <TextCell>{Number(item.agent_nums)}</TextCell>
        </Box>

        <Box className="td5">
          <TextCell>{item.total_count_on_scr}</TextCell>
        </Box>

        <Box className="td5">
          <TextCell>
            {formatNumberWithKM(item.total_market_cap_on_scr)}
          </TextCell>
        </Box>

        <Box className="td5">
          <TextCell>{item.top_agent_name_on_scr}</TextCell>
        </Box>

        <Box className="td5">
          <TextCell>
            {formatNumberWithKM(item.top_agent_market_cap_on_scr)}
          </TextCell>
        </Box>
      </Box>
    </Link>
  );
};
