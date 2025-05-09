import { Box, Typography, Avatar } from "@mui/material";
import { formatIntNumberWithKM } from "@/utils/format";
import { RepoStat } from "@/services/framework/list";
import AvatarCard from "@/components/collections/avatar-card";
import { ChainNameById } from "@/constants/chain";
import Link from "next/link";

interface Props {
  item: RepoStat;
  duration: "1d" | "3d" | "7d" | "30d";
}

const TextCell = ({ children }: { children: React.ReactNode }) => (
  <Typography sx={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.8)" }}>
    {children}
  </Typography>
);

const DeltaCell = ({ value }: { value?: number }) => (
  <TextCell>
    <span
      style={{
        color: value !== undefined && value >= 0 ? "#4caf50" : "#f44336",
      }}
    >
      {value !== undefined && value > 0 ? `+${value}` : `${value || "-"}`}
    </span>
  </TextCell>
);

export const RepoStatsTableRow = ({ item, duration }: Props) => {
  return (
    <Link href={`https://github.com/${item.repo_full_name}`} target="_blank">
      <Box
        className="table-row"
        sx={{
          padding: "12px 10px",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          "&:hover": {
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "6px",
          },
        }}
      >
        {/* Token (Avatar + name + symbol) */}
        <Box
          className="column1"
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
            position: "relative",
            zIndex: 0
          }}
        >
          <AvatarCard
            hasLogo={true}
            logoUrl={item.metadata?.icon_url || item.metadata?.image}
            symbol={item.symbol}
            chainId={ChainNameById?.[item.chain]}
            size={40}
            mr={0}
          />
          <Box>
            <TextCell>{item.metadata?.name || item.symbol}</TextCell>
            <Typography variant="caption" sx={{ color: "#888" }}>
              ${item.symbol}
            </Typography>
          </Box>
        </Box>

        {/* Repo */}

        {/* Stars */}
        <Box className="column" sx={{ flex: 1 }}>
          <TextCell>{formatIntNumberWithKM(item.stars_count)}</TextCell>
        </Box>

        {/* Stars Δ */}
        <Box className="column" sx={{ flex: 1 }}>
          <DeltaCell
            value={item[`stars_change_${duration}` as keyof RepoStat] as number}
          />
        </Box>

        {/* Forks */}
        <Box className="column" sx={{ flex: 1 }}>
          <TextCell>{formatIntNumberWithKM(item.forks_count)}</TextCell>
        </Box>

        {/* Forks Δ */}
        <Box className="column" sx={{ flex: 1 }}>
          <DeltaCell
            value={item[`forks_change_${duration}` as keyof RepoStat] as number}
          />
        </Box>

        {/* Contributors */}
        <Box className="column" sx={{ flex: 1 }}>
          <TextCell>{item.contributors_count}</TextCell>
        </Box>

        {/* Contributors Δ */}
        <Box className="column" sx={{ flex: 1 }}>
          <DeltaCell
            value={
              item[
              `contributors_change_${duration}` as keyof RepoStat
              ] as number
            }
          />
        </Box>
        <Box className="column" sx={{ flex: 1 }}>
          <TextCell>{item.repo_full_name}</TextCell>
        </Box>
      </Box>
    </Link>
  );
};
