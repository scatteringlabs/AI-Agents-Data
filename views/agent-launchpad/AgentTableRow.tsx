import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import { formatIntNumberWithKM, formatNumberWithKM } from "@/utils/format";
import { AgentData } from "@/services/launchpad";
import AvatarCard from "@/components/collections/avatar-card";
import { ChainIdByName, ChainNameById } from "@/constants/chain";

export const AgentTableRow = ({ item }: { item: AgentData }) => {
  const router = useRouter();
  const goToProject = `/${ChainIdByName?.[item.chain_id]}/${item.slug}`;

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

  const NumberCell = ({ value }: { value: number }) => (
    <TextCell>{formatIntNumberWithKM(value.toString())}</TextCell>
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
          <AvatarCard
            hasLogo={true}
            logoUrl={item.logo_url}
            symbol={item.name}
            chainId={item.chain_id}
            size={40}
            mr={0}
            showChain={true}
          />
          <Box>
            <TextCell>{item.name}</TextCell>
            {/* <Typography variant="caption" sx={{ color: "#888" }}>
              {item.slug}
            </Typography> */}
          </Box>
        </Box>

        <Box className="td5">
          <NumberCell value={item.agent_nums_in_1d} />
        </Box>

        <Box className="td5">
          <NumberCell value={item.agent_nums_in_7d} />
        </Box>

        <Box className="td5">
          <NumberCell value={item.agent_nums_in_30d} />
        </Box>

        <Box className="td5">
          <NumberCell value={item.total_agent_nums} />
        </Box>

        <Box className="td5">
          <TextCell>{formatNumberWithKM(item.total_revenue)}</TextCell>
        </Box>
      </Box>
    </Link>
  );
};
