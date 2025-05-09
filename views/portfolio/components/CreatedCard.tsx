import AvatarCard from "@/components/collections/avatar-card";
import { ChainIdByName } from "@/constants/chain";
import { CreatedNode } from "@/services/graphql/zora/created-list";
import { chainIdToName } from "@/utils";
import { formatWeiToToken } from "@/views/trade/erc20z-swap/swap-card";
import { Box, Typography } from "@mui/material";
import Link from "next/link";

interface Media {
  mimeType: string;
  originalUri?: string;
  previewImage?: {
    small?: string;
  };
}

interface CreatedCardProps {
  item: CreatedNode;
  activeTab: string;
}

const CreatedCard: React.FC<CreatedCardProps> = ({ item, activeTab }) => {
  const imageUrl =
    item.media?.previewImage?.small ||
    item.media?.originalUri ||
    item.media?.downloadableUri ||
    "";
  const Content = () => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(255,255,255,0.05)",
        padding: "16px",
        borderRadius: "8px",
        height: 100,
        mb: 2,
        position: "relative",
        border: "1px solid rgba(255,255,255,0.1)",
        "&:hover": {
          borderColor: "rgba(255,255,255,0.2)",
        },
      }}
    >
      {/* 左侧内容 */}
      <Box sx={{ display: "flex", alignItems: "center", columnGap: 2 }}>
        {/* 显示图片 */}
        <AvatarCard
          hasLogo
          logoUrl={imageUrl}
          chainId={Number(item?.chainId) || 0}
          symbol={item?.name || ""}
          size={60}
          mr={0.2}
        />
        <Box>
          <Typography
            variant="h6"
            sx={{
              color: "#fff",
              fontFamily: "Poppins",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            {item.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.5)",
              mt: 0.4,
              fontSize: 12,
              fontFamily: "Poppins",
            }}
          >
            Min Market:{" "}
            {formatWeiToToken(item?.salesStrategy?.sale?.minimumMarketEth)} ETH
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.5)",
              mt: 0.4,
              fontSize: 12,
              fontFamily: "Poppins",
            }}
          >
            Current Market:{" "}
            <span style={{ color: "green" }}>
              {" "}
              {formatWeiToToken(
                item?.salesStrategy?.sale?.currentMarketEth,
              )}{" "}
              ETH
            </span>
          </Typography>
        </Box>
      </Box>

      {/* 右侧内容 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        {/* <Typography
        variant="body2"
        sx={{
          color: "rgba(255,255,255,1)",
          mt: 1,
          fontSize: 12,
          fontFamily: "Poppins",
        }}
      >
        {item?.salesStrategy?.sale?.state === "ACTIVE"
          ? "Minting"
          : "Ended"}
      </Typography> */}

        {/* <Typography
        variant="body2"
        sx={{
          color: "rgba(255,255,255,1)",
          mt: 1,
          fontSize: 10,
          fontFamily: "Poppins",
        }}
      >
        {item?.salesStrategy?.sale?.marketCountdown}
      </Typography> */}
        <Typography
          variant="h6"
          sx={{
            color: "#fff",
            fontFamily: "Poppins",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          Mints: {item.totalTokenMints}
        </Typography>
      </Box>
    </Box>
  );
  return item?.salesStrategy?.sale?.state === "ACTIVE" ? (
    <Content />
  ) : (
    <Link
      href={`/collect/${ChainIdByName?.[Number(item.chainId)]}/${item.address}/${item.tokenId}`}
    >
      <Content />
    </Link>
  );
};

export default CreatedCard;
