import { Collection } from "@/types/collection";
import { Box, Tooltip, Avatar, Typography } from "@mui/material";
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
import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { formatIntNumberWithKM } from "@/utils/format";
import { formatDistanceToNow, parseISO } from "date-fns";
import Link from "next/link";

interface Erc20ZTokenTableRowProps {
  item: Collection;
  showDate?: boolean;
  selectedTime?: string;
  onClick?: () => void;
  isSelected?: boolean;
}

const Erc20ZTokenTableRow: React.FC<Erc20ZTokenTableRowProps> = ({
  item,
  showDate = false,
  selectedTime = "24h",
  onClick,
  isSelected = false,
}) => {
  const router = useRouter();
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);
  const topFollowers = item.top_20_followers?.slice(0, 5) || [];

  const handleClick = () => {
    if (clickTimeout) {
      // 双击事件
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      router.push(`/${ChainIdByName[item.chain_id]}/${item.slug}`);
    } else {
      // 单击事件
      const timeout = setTimeout(() => {
        setClickTimeout(null);
        onClick?.();
      }, 250);
      setClickTimeout(timeout);
    }
  };

  const formatCreatedTime = (dateString: string) => {
    try {
      if (!dateString) return "N/A";
      return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
    } catch (error) {
      return "N/A";
    }
  };

  return (
    <Box
      key={item.rank}
      data-wow-delay="0s"
      className="wow fadeInUp fl-row-ranking"
      sx={{
        cursor: "pointer",
        padding: "12px 10px !important",
        background: isSelected ? "rgba(147, 51, 234, 0.15)" : "transparent",
        borderRadius: isSelected ? "0 !important" : "6px !important",
        "&:hover": {
          background: isSelected
            ? "rgba(147, 51, 234, 0.2)"
            : "rgba(255, 255, 255, 0.05)",
          borderRadius: isSelected ? "0 !important" : "6px !important",
        },
        position: "relative",
        marginLeft: "-10px",
        "&::before": isSelected
          ? {
            content: '""',
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "4px",
            backgroundColor: "rgba(147, 51, 234, 0.8)",
          }
          : {},
      }}
      onClick={handleClick}
    >
      <TableAvatarCard item={item} />
      <CommonCol value={item.creation_date} />
      <div
        className="td4"
        style={{
          width: "120px",
          padding: "0 10px",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <div className="column">
          <div
            className="column-content"
            style={{ fontSize: "14px", color: "#ffc224" }}
          >
            {item.twitter_score !== undefined &&
              item.twitter_score !== null &&
              Number(item.twitter_score) !== -1
              ? Math.round(Number(item.twitter_score))
              : "-"}
          </div>
        </div>
      </div>
      <div
        className="td4"
        style={{
          width: "120px",
          padding: "0 10px",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <h6
          style={{
            fontSize: "14px",
            marginLeft: "4px",
            color: "rgba(255, 255, 255, 0.95)",
            fontWeight: 500,
          }}
        >
          {item.influencers_count !== undefined &&
            item.influencers_count !== null &&
            item.influencers_count !== -1
            ? item.influencers_count
            : "-"}
        </h6>
      </div>
      <div
        className="td4"
        style={{
          width: "120px",
          padding: "0 10px",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <h6
          style={{
            fontSize: "14px",
            marginLeft: "-10px",
            color: "rgba(255, 255, 255, 0.95)",
            fontWeight: 500,
          }}
        >
          {item.projects_count !== undefined && item.projects_count !== null && item.projects_count !== -1
            ? item.projects_count
            : "-"}
        </h6>
      </div>
      <div
        className="td4"
        style={{
          width: "120px",
          padding: "0 10px",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <h6
          style={{
            fontSize: "14px",
            marginLeft: "-4px",
            color: "rgba(255, 255, 255, 0.95)",
            fontWeight: 500,
          }}
        >
          {item.venture_capitals_count !== undefined &&
            item.venture_capitals_count !== null &&
            item.venture_capitals_count !== -1
            ? item.venture_capitals_count
            : "-"}
        </h6>
      </div>
      <Common$Col value={item.price_in_usd} />
      {showDate ? <CommonDate value={item.launch_timestamp} /> : null}
      <CommonPriceChangeCol value={item.price_change_in_1hours} />
      <CommonPriceChangeCol value={item.price_change_in_6hours} />
      <CommonPriceChangeCol value={item.price_change_in_24hours} />
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
      <Box
        sx={{
          display: "flex",
          gap: 0.5,
          justifyContent: "flex-end",
          paddingRight: "60px",
          minWidth: "180px",
          height: "24px",
        }}
      >
        {topFollowers && topFollowers.length > 0 ? (
          <>
            {[...Array(5)].map((_, index) => (
              <Tooltip
                key={index}
                title={topFollowers[index]?.name || "-"}
                enterDelay={0}
                leaveDelay={0}
                arrow
                placement="top"
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: "rgba(0, 0, 0, 0.9)",
                      "& .MuiTooltip-arrow": {
                        color: "rgba(0, 0, 0, 0.9)",
                      },
                      fontSize: "14px",
                      fontWeight: 500,
                      padding: "8px 16px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                      borderRadius: "4px",
                      maxWidth: "none",
                      color: "rgba(255, 255, 255, 0.95)",
                    },
                  },
                }}
              >
                {topFollowers[index] ? (
                  <Link
                    href={`https://x.com/${topFollowers[index].username}`}
                    target="_blank"
                  >
                    <Avatar
                      src={topFollowers[index].avatar}
                      alt={topFollowers[index].name}
                      sx={{ width: 20, height: 20, cursor: "pointer" }}
                    />
                  </Link>
                ) : (
                  <Avatar
                    sx={{
                      width: 20,
                      height: 20,
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                      color: "rgba(255, 255, 255, 0.5)",
                      fontSize: "12px",
                    }}
                  >
                    -
                  </Avatar>
                )}
              </Tooltip>
            ))}
          </>
        ) : (
          <>
            {[...Array(5)].map((_, index) => (
              <Avatar
                key={index}
                sx={{
                  width: 20,
                  height: 20,
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  color: "rgba(255, 255, 255, 0.5)",
                  fontSize: "12px",
                }}
              >
                -
              </Avatar>
            ))}
          </>
        )}
      </Box>
    </Box>
  );
};

export default Erc20ZTokenTableRow;
