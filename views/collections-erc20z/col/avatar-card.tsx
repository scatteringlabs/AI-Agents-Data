import AvatarCard from "@/components/collections/avatar-card";
import { Collection } from "@/types/collection";
import { getTokenLogoURL } from "@/utils/token";
import {
  Box,
  styled,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const RankText = styled(Typography)`
  color: #fff;
  font-family: Poppins;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 26px;
  text-transform: capitalize;
`;

const TableAvatarCard = ({ item }: { item: Collection }) => {
  const theme = useTheme();
  const isDpwnMd = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Box
      className="td1"
      sx={{ width: { md: "450px !important", xs: "200px !important" } }}
    >
      <RankText sx={{ display: { md: "block", xs: "none" } }}>
        {item.rank}.
      </RankText>

      <AvatarCard
        hasLogo={!!item?.logo_url}
        logoUrl={
          item?.logo_url
            ? item?.logo_url
            : getTokenLogoURL({
                chainId: item?.chain_id || 1,
                address: item?.erc20_address,
              })
        }
        symbol={item.symbol || "unknown"}
        chainId={item.chain_id}
        size={isDpwnMd ? 60 : 48}
        mr={isDpwnMd ? 0 : 0.4}
      />
      <Box>
        <Box
          className="item-name"
          sx={{
            marginBottom: "6px",
            fontSize: 16,
            padding: "6px 0px",
            display: "flex",
            alignItems: "center",
            textTransform: "uppercase",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: { md: "240px", xs: "80px" },
            overflow: "hidden",
          }}
        >
          {item.symbol || "unknown"}
        </Box>
        <Typography
          variant="body2"
          sx={{
            fontSize: 12,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: { md: "220px", xs: "80px" },
            overflow: "hidden",
          }}
        >
          {item.name || "unknown"}
        </Typography>
      </Box>
      {item?.zora_coin_type?.name ? (
        <Typography
          sx={{
            border: "1px solid",
            fontSize: "12px",
            padding: "4px 8px",
            borderColor: item?.zora_coin_type?.color,
            borderRadius: "6px",
            color: item?.zora_coin_type?.color,
            display: { md: "block", xs: "none" },
          }}
        >
          {item?.zora_coin_type?.name || ""}
        </Typography>
      ) : null}
    </Box>
  );
};

export default TableAvatarCard;
