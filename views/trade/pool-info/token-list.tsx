import AvatarCard from "@/components/collections/avatar-card";
import Iconify from "@/components/iconify";
import { ChainIdByName } from "@/constants/chain";
import { getCollections } from "@/services/collections";
import { getTokenLogoURL } from "@/utils/token";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
interface iTokenList {
  toggleDrawer: () => void;
  tokenAddress: string;
}
const TokenList = ({ toggleDrawer, tokenAddress }: iTokenList) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["collections"],
    queryFn: () =>
      getCollections({
        page: 1,
        page_size: 200,
        sort_field: "volume",
        type_name: "",
        chain_id: "",
      }),
  });
  return (
    <Box
      sx={{
        background: "rgba(0, 0, 0, 1)",
        color: "#fff",
        padding: "20px",
        borderRight: "1px solid rgb(255 255 255 / 0.1)",
        cursor: "pointer",
      }}
      role="presentation"
      // onClick={() => toggleDrawer(false)}
    >
      <Box
        sx={{ my: 2 }}
        onClick={() => {
          toggleDrawer();
        }}
      >
        <IconButton
          aria-label="close"
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            zIndex: 1,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Iconify
            icon="solar:close-circle-line-duotone"
            sx={{ width: 24, height: 24 }}
          />
        </IconButton>
      </Box>

      <List>
        {data?.data?.list?.map((item, index) => (
          <Link key={item.erc20_address} href={`/collection/${item.slug}`}>
            <ListItem
              sx={{
                background:
                  item?.erc20_address?.toLowerCase() ===
                  tokenAddress?.toString()?.toLowerCase()
                    ? "#AF54FF"
                    : "none",
                border: "1px solid rgb(255 255 255 / 0.1)",
                my: 1,
                borderRadius: 1,
                "&:hover": {
                  border: "1px solid #AF54FF",
                },
              }}
            >
              <AvatarCard
                hasLogo={item?.has_logo}
                symbol={item.symbol}
                logoUrl={getTokenLogoURL({
                  chainId: item?.chain_id || 1,
                  address: item?.erc20_address,
                })}
                chainId={item.chain_id}
                size={40}
              />
              <ListItemButton>
                <ListItemText
                  primary={<Typography variant="h5">{item.name}</Typography>}
                />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );
};

export default TokenList;
