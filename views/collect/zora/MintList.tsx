import AvatarCard from "@/components/collections/avatar-card";
import { SecTitle } from "@/components/text";
import { Mint, MintNode } from "@/services/graphql/zora/mints";
import { formatAddress } from "@/utils/format";
import { Box, Stack, Typography } from "@mui/material";

const MintCard = ({ item }: { item: Mint }) => {
  return (
    <Stack
      sx={{
        width: "100%",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        px: 2,
        py: 1,
        borderRadius: 2,
        mb: 1,
      }}
    >
      <Stack
        flexDirection="row"
        sx={{ width: "100%" }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack
          flexDirection="row"
          sx={{ columnGap: 1 }}
          justifyContent="space-between"
          alignItems="center"
        >
          <AvatarCard
            hasLogo
            logoUrl={`https://zora.co/api/avatar/${item.toAddress}`}
            symbol={"User"}
            showChain={false}
            size={32}
            mr={0}
          />
          <SecTitle>{formatAddress(item.toAddress)}</SecTitle>
        </Stack>
        <SecTitle>{item?.quantity}</SecTitle>
      </Stack>
    </Stack>
  );
};

interface iMintList {
  list?: MintNode[];
}

const MintList = ({ list }: iMintList) => {
  if (!list?.length) {
    return (
      <>
        <Box
          component="img"
          sx={{ maxWidth: 86 }}
          src="/assets/images/trade/no-data-pool.png"
        />
        <Typography
          variant="h4"
          sx={{
            opacity: 0.6,
            mt: 2,
            fontFamily: "DM Sans",
            fontSize: 16,
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "16px",
          }}
        >
          No Data
        </Typography>
      </>
    );
  }
  return (
    <Stack sx={{ maxHeight: 400, overflowY: "scroll", width: "100%" }}>
      {list?.map((c) => (
        <MintCard
          key={c.mint?.transactionInfo?.blockTimestamp}
          item={c?.mint}
        />
      ))}
    </Stack>
  );
};
export default MintList;
