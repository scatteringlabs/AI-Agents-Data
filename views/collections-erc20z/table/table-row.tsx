import { Collection } from "@/types/collection";
import { Box } from "@mui/material";
import TableAvatarCard from "../col/avatar-card";
import {
  Common$Col,
  CommonDate,
  CommonKMCol,
  CommonPriceChangeCol,
  CommonTXCol,
  CommonCol,
} from "../col/common-col";
import { ChainIdByName } from "@/constants/chain";
import { useCallback } from "react";
import { useRouter } from "next/router";
import { formatIntNumberWithKM } from "@/utils/format";

export const Erc20ZTokenTableRow = ({
  item,
  showDate = false,
  selectedTime = "24h",
}: {
  item: Collection;
  showDate?: boolean;
  selectedTime?: string;
}) => {
  const router = useRouter();

  const handleClick = useCallback(
    ({
      slug,
      chain_id,
      tokenID,
      tokenAddress,
    }: {
      slug: string;
      tokenAddress: string;
      chain_id: number;
      tokenID: number;
    }) => {
      router.push(
        `/collect/${ChainIdByName[chain_id]}/${tokenAddress}/${tokenID}`,
      );
    },
    [router],
  );
  return (
    <Box
      key={item.rank}
      data-wow-delay="0s"
      className="wow fadeInUp fl-row-ranking"
      sx={{
        cursor: "pointer",
        padding: "12px 10px !important",
        "&:hover": {
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "6px !important",
        },
      }}
      onClick={() =>
        handleClick({
          slug: item.slug,
          chain_id: item.chain_id,
          tokenAddress: item?.mt_address || "",
          tokenID: Number(item.token_id),
        })
      }
    >
      <TableAvatarCard item={item} />
      <CommonCol value={formatIntNumberWithKM(item.total_mints)} />
      <Common$Col value={item.price_in_usd} />
      {showDate ? <CommonDate value={item.launch_timestamp} /> : null}
      <CommonPriceChangeCol value={item.price_change_in_1hours} />
      <CommonPriceChangeCol value={item.price_change_in_6hours} />
      <CommonPriceChangeCol value={item.price_change_in_24hours} />
      {/* <CommonKMCol value={item.total_volume_in_24hours} />
      <CommonKMCol value={item.total_volume_in_6hours} />
      <CommonKMCol value={item.total_volume_in_1hours} /> */}
      {selectedTime === "24h" ? (
        <CommonKMCol value={item.total_volume_in_24hours} />
      ) : null}
      {selectedTime === "6h" ? (
        <CommonKMCol value={item.total_volume_in_6hours} />
      ) : null}
      {selectedTime === "1h" ? (
        <CommonKMCol value={item.total_volume_in_1hours} />
      ) : null}
      <CommonTXCol
        total={item.total_tx_count_24hours}
        value1={item.total_buy_count_24hours}
        value2={item.total_sell_count_24hours}
      />
      <CommonTXCol
        total={item.total_makers_count_24hours}
        value1={item.total_buyer_count_24hours}
        value2={item.total_seller_count_24hours}
      />
      <CommonKMCol value={item.total_liquidity} />
      <CommonKMCol value={item.market_cap} />
    </Box>
  );
};
