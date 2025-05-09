import { getItemPopupInfo } from "@/services/collections";
import styles from "./rarity-card.module.css";
import { useQuery } from "@tanstack/react-query";
import numeral from "numeral";
import RarityCardSkeleton from "./RarityCardSkeleton";
import { Box, Typography } from "@mui/material";

interface TraitItem {
  percentage?: number;
  label?: string;
  value?: string;
  type?: number;
}

interface RarityCardProps {
  address?: string;
  tokenId?: string;
  chainId?: string | number;
  type: "popover" | "normal";
  traits?: any[];
}

const getRankPercentage = (rank?: number, total?: number) => {
  if (!total) return "--";
  if (!rank) return "0%";
  return numeral(rank / total).format("0%");
};

export default function RarityCard({
  address,
  tokenId,
  chainId,
  type,
  traits,
}: RarityCardProps) {
  const isPopover = type === "popover";
  const {
    data: res,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "popupInfo",
      {
        address,
        tokenId,
        chainId,
      },
    ],
    queryFn: () =>
      getItemPopupInfo({
        chainId: Number(chainId),
        address: address?.toString(),
        tokenId,
      }),
    enabled: Boolean(type === "popover" && chainId && address && tokenId),
  });
  const data = res?.data;

  const isShowSkeleton = type === "popover" && (!res || isLoading);

  const _traits: TraitItem[] | undefined = isPopover
    ? data?.itemTraits?.map((item) => ({
        percentage: item.percentage,
        label: item.traitType,
        value: item.traitValue,
        type: item.valueType,
      }))
    : traits;

  return (
    <Box
      className={`product-item traits ${styles.cardWrapper} ${isPopover ? styles.popover : ""}`}
    >
      {isShowSkeleton ? (
        <RarityCardSkeleton />
      ) : (
        <div>
          {type === "popover" && (
            <div>
              <div className={styles.rankInfo}>
                Rarity Rank: {data?.rank}/{data?.total}
              </div>
              <div className={styles.progress}>
                <div
                  className={styles.bar}
                  style={{ width: getRankPercentage(data?.rank, data?.total) }}
                ></div>
                <span className={styles.rankNum}>
                  {data?.rank}/{data?.total}
                </span>
              </div>
            </div>
          )}
          <div
            className={`content ${styles.content}`}
            style={{ fontFamily: "Poppins" }}
          >
            {_traits?.map((item, idx) => (
              <Box
                className="trait-item"
                key={idx}
                sx={{
                  p: { md: "12px !important", xs: "8px !important" },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { md: "14px !important", xs: "10px !important" },
                  }}
                >
                  {item.label}
                </Typography>
                <div className={`title ${styles.trailItemTitle}`}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: {
                        md: "16px !important",
                        xs: "12px !important",
                      },
                    }}
                  >
                    {item.value}
                  </Typography>
                </div>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { md: "14px !important", xs: "10px !important" },
                  }}
                >
                  {numeral(item.percentage).format("0.00%")} have this trait
                </Typography>
              </Box>
            ))}
          </div>
        </div>
      )}
    </Box>
  );
}
