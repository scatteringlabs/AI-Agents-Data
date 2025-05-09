import AvatarCard from "@/components/collections/avatar-card";
import { SecTitle } from "@/components/text";
import { Comment } from "@/services/graphql/zora/comment";
import { formatAddress } from "@/utils/format";
import { Box, Stack, Typography } from "@mui/material";
import { formatDistanceToNowStrict } from "date-fns";
import { useMemo } from "react";

const CommentCard = ({ item }: { item: Comment }) => {
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
            logoUrl={`https://zora.co/api/avatar/${item.fromAddress}`}
            symbol={"User"}
            showChain={false}
            size={32}
            mr={0}
          />
          <SecTitle>{formatAddress(item.fromAddress)}</SecTitle>
        </Stack>
        <SecTitle>
          {formatDistanceToNowStrict(
            new Date(item?.transactionInfo?.blockTimestamp),
          )}
        </SecTitle>
      </Stack>
      <SecTitle sx={{ mt: 1, fontSize: "12px" }}>{item?.comment}</SecTitle>
    </Stack>
  );
};

interface iCommentList {
  list?: Comment[];
}

const CommentList = ({ list }: iCommentList) => {
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
        <CommentCard key={c.transactionInfo?.blockTimestamp} item={c} />
      ))}
    </Stack>
  );
};
export default CommentList;
