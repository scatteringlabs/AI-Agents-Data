import { Box, CardContent, Skeleton, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { NFTsSum, getMyNFTsSum } from "@/services/portfolio";
import { OptionType } from "@/pages/portfolio";
import AvatarCard from "@/components/collections/avatar-card";
import { getTokenLogoURL } from "@/utils/token";
import { useMemo, useState } from "react";
import { getCollectionsItems } from "@/services/collections";

interface NFTSumTableProps {
  setActiveItem: (item: NFTsSum) => void;
  activeItem: NFTsSum;
  address: string;
}

const NFTSumTable = ({
  setActiveItem,
  activeItem,
  address,
}: NFTSumTableProps) => {
  const { data: nftsData, isLoading } = useQuery({
    queryKey: ["myNFTsSum", { address }],
    queryFn: () => getMyNFTsSum(address as `0x${string}`),
  });

  const nftsums = useMemo(
    () => nftsData?.data?.reduce((acc, item) => acc + item.nums, 0),
    [nftsData],
  );

  return (
    <CardContent sx={{ p: 0 }}>
      <Stack
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          p: 3,
          cursor: "pointer",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          background:
            activeItem.contractAddress === "all"
              ? "rgba(255,255,255,0.04)"
              : "",
        }}
        onClick={() => {
          setActiveItem({
            contractAddress: "all",
            chainId: 0,
            nums: 0,
            name: "",
          });
        }}
      >
        {/* <Typography variant="h5">{allSum}</Typography> */}
        <Stack flexDirection="row" alignItems="center">
          <AvatarCard
            symbol="all"
            logoUrl="/assets/images/tokens/all-collections.svg"
            size={40}
          />
          <Typography variant="h5" sx={{ fontSize: "14px" }}>
            All Collections
          </Typography>
        </Stack>
        <Typography variant="h5">{nftsums || 0}</Typography>
      </Stack>
      {nftsData?.data?.map((item) => (
        <Stack
          key={item.contractAddress}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            p: 3,
            cursor: "pointer",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
            background:
              activeItem.contractAddress === item.contractAddress
                ? "rgba(255,255,255,0.04)"
                : "",
          }}
          onClick={() => {
            setActiveItem(item);
          }}
        >
          <Stack flexDirection="row" alignItems="center">
            <AvatarCard
              symbol={item.name}
              logoUrl={getTokenLogoURL({
                chainId: item.chainId,
                address: item.contractAddress,
              })}
              chainId={item.chainId}
              size={40}
            />
            <Typography
              variant="h5"
              sx={{
                fontFamily: "Poppins",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "100px",
                overflow: "hidden",
              }}
            >
              {item.name}
            </Typography>
          </Stack>
          <Typography variant="h5">{item.nums || 0}</Typography>
        </Stack>
      ))}
    </CardContent>
  );
};

export default NFTSumTable;
