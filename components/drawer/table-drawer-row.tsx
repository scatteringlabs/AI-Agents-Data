import { Box, Typography, styled } from "@mui/material";
import TableSortText from "../button/draw-sort-text";
import { Collection } from "@/types/collection";
import AvatarCard from "../collections/avatar-card";
import { getTokenLogoURL } from "@/utils/token";
import { formatNumberWithKM, formatUSD } from "@/utils/format";
import PriceChangeText from "../collections/price-change-text";
import { useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import VerifiedIcon from "@/views/collect/verified-icon";
import { ChainIdByName } from "@/constants/chain";
import { useGlobalState } from "@/context/GlobalStateContext";

const TableCell = styled(Box)`
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
const TableCell1 = styled(Box)`
  width: 160px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;
interface iTableDrawerRow {
  item: Collection;
  collectionAddress: string;
  title: string;
  closeDialog?: () => void;
}
export const TableDrawerRow = ({
  item,
  collectionAddress,
  title,
  closeDialog,
}: iTableDrawerRow) => {
  const router = useRouter();
  const handleClick = useCallback(() => {
    const { chain_id, slug } = item;
    router.push(`/${ChainIdByName?.[Number(chain_id)]}/${slug}`);
    closeDialog?.();
  }, [router, closeDialog, item]);
  const isSelected = useMemo(
    () =>
      item?.erc20_address?.toLowerCase() ===
        collectionAddress?.toString()?.toLowerCase() ||
      item?.slug === collectionAddress?.toString(),
    [item, collectionAddress],
  );
  return (
    <Box
      key={item.rank}
      data-wow-delay="0s"
      sx={{
        px: "0px !important",
        py: "6px !important",
        borderRadius: "0px !important",
        cursor: "pointer",
        background: isSelected ? "rgba(255, 255, 255, 0.05)" : "transparent",
        "&:hover": {
          background: "rgba(255, 255, 255, 0.05)",
        },
      }}
      onClick={handleClick}
    >
      <Box
        className="wow fadeInUp fl-row-ranking"
        sx={{
          px: "20px !important",
          py: "6px !important",
        }}
      >
        <TableCell1 sx={{}}>
          <AvatarCard
            hasLogo={item.has_logo || !!item?.logo_url}
            logoUrl={
              item?.logo_url
                ? item?.logo_url
                : getTokenLogoURL({
                    chainId: item?.chain_id || 1,
                    address: item?.erc20_address,
                  })
            }
            symbol={item.symbol}
            chainId={item.chain_id}
            size={40}
            mr={0}
          />{" "}
          <Box sx={{ ml: { md: 2, xs: 1 } }}>
            <Typography
              variant="h4"
              sx={{
                fontSize: {
                  md: "14px !important",
                  xs: "12px !important",
                },
                color: "#fff",
                display: "flex",
                alignItems: "center",
                textTransform: "uppercase",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
                maxWidth: { md: 100, xs: 60 },
              }}
            >
              {item?.is_verified ? (
                <span style={{ marginRight: "6px" }}>
                  <VerifiedIcon size={16} />
                </span>
              ) : null}
              {item.symbol}
              <img
                src="/images/twitter.svg"
                alt="Twitter"
                style={{
                  width: "16px",
                  height: "16px",
                  marginLeft: "8px",
                }}
              />
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: 12,
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: { md: 100, xs: 60 },
                overflow: "hidden",
                color: isSelected
                  ? "rgba(255, 255, 255,0.8)"
                  : "rgba(255, 255, 255,0.3)",
              }}
            >
              {item.name}
            </Typography>
          </Box>
        </TableCell1>
        <TableCell sx={{ width: { md: 80, xs: 60 } }}>
          <Typography
            sx={{
              fontSize: {
                md: "14px !important",
                xs: "12px !important",
              },
            }}
            className="price gem"
            variant="h6"
          >
            {formatUSD(item.price_in_usd)}
          </Typography>
        </TableCell>
        <TableCell
          className={`${Number(item.price_change_in_24hours || item?.price_change) < 0 ? "danger" : "success"}`}
        >
          <PriceChangeText
            priceChange={
              Number(item.price_change_in_24hours) || Number(item?.price_change)
            }
          />
        </TableCell>
        <TableCell>
          <Typography
            sx={{
              fontSize: {
                md: "14px !important",
                xs: "12px !important",
              },
            }}
            className="price gem"
            variant="h6"
          >
            {formatNumberWithKM(item.total_volume_in_6hours, "$")}
          </Typography>
        </TableCell>
      </Box>
    </Box>
  );
};
