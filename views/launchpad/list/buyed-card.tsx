import AvatarCard from "@/components/collections/avatar-card";
import { Box, Typography } from "@mui/material";
import { EditButton, Text } from "../create/require-text";
import { CollectionTypeColor } from "@/constants/color";
import Link from "next/link";
import { TableHeader } from "../portfolio";
import { TokenEntity } from "@/services/graphql/all-token";
import { Project } from "../create/tokenService";
import { formatTokenFixedto } from "@/utils/format";

export type TokenProject = TokenEntity & Project & { balance: string };

interface iBuyedCard {
  id: string;
  name: string;
  symbol: string;
  logoUrl: string;
  tag: string;
  project?: TokenProject;
}

const BuyedCard = ({ name, symbol, id, logoUrl, tag, project }: iBuyedCard) => {
  return (
    <Link
      href={
        // @ts-ignore
        project?.state === "1" && project?.slug
          ? `/collection/${project?.slug}`
          : `/launchpad/base/${id}`
      }
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          background: "rgba(255,255,255,0.05)",
          px: "20px",
          py: "10px",
          alignItems: "center",
          borderRadius: "6px",
          cursor: "pointer",
          border: "1px solid transparent",
          columnGap: 2,
          position: "relative",
          mb: 2,
          "&:hover": {
            border: "1px solid rgba(255, 255, 255,0.1)",
          },
        }}
      >
        {project?.state === "1" ? (
          <Box
            component="img"
            src="/assets/images/launchpad/state-logo.png"
            sx={{ position: "absolute", left: 0, top: 0, width: 56 }}
          />
        ) : null}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            columnGap: 2,
            width: "400px",
          }}
        >
          <Box
            component="img"
            src={logoUrl}
            alt={symbol}
            width={60}
            height={60}
            sx={{ borderRadius: "50%" }}
          />
          <Box>
            <Text
              sx={{ fontSize: 16, fontWeight: 600, color: "#fff", opacity: 1 }}
            >
              {name}
            </Text>
            <Text>{symbol}</Text>
          </Box>
          <Typography
            sx={{
              border: "1px solid",
              fontSize: "12px",
              padding: "4px 8px",
              borderColor: CollectionTypeColor?.[tag],
              borderRadius: "6px",
              color: CollectionTypeColor?.[tag],
            }}
          >
            {tag}
          </Typography>
        </Box>
        <TableHeader
          sx={{
            width: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            columnGap: 1,
          }}
        >
          {formatTokenFixedto(project?.currentPrice)} ETH
        </TableHeader>
        <TableHeader
          sx={{
            width: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            columnGap: 1,
          }}
        >
          {formatTokenFixedto(project?.balance)}
        </TableHeader>
        <TableHeader
          sx={{
            width: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            columnGap: 1,
          }}
        >
          {formatTokenFixedto(
            Number(project?.currentPrice) * Number(project?.balance),
          )}{" "}
          ETH
        </TableHeader>
        <Box
          sx={{
            width: "200px",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <EditButton
            sx={{
              py: 1,
              width: "100px",
              justifyContent: "center",
            }}
          >
            Trade
          </EditButton>
        </Box>
      </Box>
    </Link>
  );
};

export default BuyedCard;
