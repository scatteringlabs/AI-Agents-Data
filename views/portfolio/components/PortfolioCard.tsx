import AvatarCard from "@/components/collections/avatar-card";
import { ChainNameById } from "@/constants/chain";
import { ZoraCollection } from "@/services/zora/portfolio";
import { formatTokenFixedto } from "@/utils/format";
import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";

interface PortfolioCardProps {
  item: ZoraCollection;
  activeTab: string;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ item, activeTab }) => {
  return (
    <Link
      href={`/collect/${item?.collectionInfo?.chain}/${item?.collectionInfo?.nft_id?.split(".")?.[1]}/${item?.collectionInfo?.token_id}`}
    >
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
          <AvatarCard
            hasLogo
            logoUrl={item?.collectionInfo?.image_url}
            chainId={ChainNameById?.[item?.chain]}
            symbol={item?.collectionInfo?.ticker}
            size={60}
            mr={0.2}
          />
          <Box>
            {item?.collectionInfo?.secondary_activated ? (
              <Box
                component="img"
                src="/assets/images/launchpad/state-logo.png"
                sx={{ position: "absolute", left: 0, top: 0, width: 56 }}
              />
            ) : null}
            <Typography
              variant="h6"
              sx={{
                color: "#fff",
                fontFamily: "Poppins",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              {item?.collectionInfo?.ticker}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255,255,255,0.7)",
                mt: 0.4,
                fontFamily: "Poppins",
              }}
            >
              {item?.collectionInfo?.name}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                columnGap: 0.4,
                mt: 0.4,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: "green",
                  fontFamily: "Poppins",
                  fontWeight: 600,
                  fontSize: 12,
                }}
              >
                {formatTokenFixedto(
                  item?.collectionInfo?.base_token_price_native_currency,
                )}{" "}
                ETH
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "gray", fontSize: 12, fontFamily: "Poppins" }}
              >
                ($
                {formatTokenFixedto(
                  item?.collectionInfo?.base_token_price_usd,
                  2,
                )}
                )
              </Typography>
            </Box>
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
          {" "}
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,1)",
              mt: 1,
              fontSize: 16,
              fontFamily: "Poppins",
              fontWeight: 700,
            }}
          >
            {activeTab === "NFTs"
              ? item?.amountOwned
              : formatTokenFixedto(item?.amountOwned)}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "gray",
              mt: 1,
              fontSize: 14,
              fontFamily: "Poppins",
            }}
          >
            $
            {formatTokenFixedto(
              Number(item?.amountOwned) *
                Number(item?.collectionInfo?.base_token_price_usd),
              4,
            )}
          </Typography>
          {/* <Typography
            variant="body2"
            sx={{ color: "rgba(255,255,255,0.7)", mt: 1 }}
          >
            Chain: {item.chain}
          </Typography> */}
          {/* <Typography
            variant="body2"
            sx={{ color: "rgba(255,255,255,0.5)", mt: 1 }}
          >
            Last Updated: {new Date(item.lastUpdated * 1000).toLocaleString()}
          </Typography> */}
        </Box>
      </Box>
    </Link>
  );
};

export default PortfolioCard;
