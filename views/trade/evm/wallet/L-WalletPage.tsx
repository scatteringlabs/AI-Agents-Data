import {
  Box,
  CircularProgress,
  Grid,
  InputBase,
  Typography,
} from "@mui/material";
import {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { NoDataSearched } from "@/components/search-not-found/no-data-searched";
import { useRouter } from "next/router";
import AssetCard from "../../swap/sol/wallet/AssetCard";
import { useAccount, useContractRead } from "wagmi";
import { erc20Abi } from "viem";
import { formatTokenFixedto, formatWei } from "@/utils/format";
import { fetchNFTs } from "@/utils/alchemy";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import NeedConnectCard from "@/components/need-connect-card";
import { fetchUserNFTs } from "@/services/reservoir-mynft";
import useInfiniteScroll from "react-infinite-scroll-hook";
import MyNFTCard from "./ReservoirNFTCard";
import { BaseSID } from "@/views/launchpad/create/tokenService";
import { BigNumber, ethers } from "ethers";
import LCollectionCardSkeleton from "@/views/collect/collection-card/LCollectionCardSkeleton";
export interface CardData {
  icon: JSX.Element;
  title: string;
  value: string | number;
  hasButton?: boolean;
}

const LWalletPage = ({
  tokenAddress,
  priceUSD,
  refetchTrigger,
}: {
  tokenAddress?: string;
  priceUSD?: string;
  refetchTrigger?: number;
}) => {
  const { isConnected, address } = useAccount();
  const {
    data: nfts,
    error,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["nfts", { address }],
    queryFn: () =>
      fetchNFTs(address as string, BaseSID?.toString(), tokenAddress || ""),
    enabled: !!address,
  });
  const {
    data: itemsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    refetch: refetchList,
    isFetching,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["userNFTs", { address }],
    queryFn: ({ pageParam = "" }) => {
      return fetchUserNFTs({
        userAddress: address as `0x${string}`,
        collection: tokenAddress,
        limit: 20,
        sortBy: "acquiredAt",
        continuation: pageParam,
        includeTopBid: true,
        includeRawData: true,
        excludeSpam: true,
        chainId: BaseSID,
        normalizeRoyalties: false,
      });
    },
    initialPageParam: "",
    refetchInterval: 3000,
    getNextPageParam: (lastPage) => {
      return lastPage?.continuation || undefined;
    },
    enabled: Boolean(address) && isConnected && Boolean(tokenAddress),
  });
  const [sentryRef] = useInfiniteScroll({
    loading: isFetchingNextPage,
    hasNextPage,
    onLoadMore: fetchNextPage,
    disabled: isError,
    rootMargin: "0px 0px 100px 0px",
  });

  const {
    data: tokenBalance,
    refetch: refetchTokenBalance,
    isLoading: tokenBalanceLoading,
    error: tokenError,
  } = useContractRead({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    args: [address as `0x${string}`],
    functionName: "balanceOf",
    chainId: BaseSID,
  });
  useEffect(() => {
    if (refetchTrigger !== undefined) {
      refetch();
      refetchTokenBalance();
      refetchList();
    }
  }, [refetchTrigger]);
  const tokenAmount = useMemo(
    () => (tokenBalance ? ethers.utils.formatUnits(tokenBalance, 18) : ""),
    [tokenBalance],
  );
  const tokenValue = useMemo(() => {
    if (!tokenAmount || !priceUSD) {
      return "0.00";
    }

    const amount = ethers.utils.parseUnits(tokenAmount.toString(), 18);
    const price = ethers.utils.parseUnits(priceUSD.toString(), 18);

    const value = amount.mul(price).div(BigNumber.from("1000000000000000000"));

    return ethers.utils.formatUnits(value, 18);
  }, [tokenAmount, priceUSD]);
  const cardData: CardData[] = useMemo(
    () => [
      {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <g opacity="0.6" clip-path="url(#clip0_5287_22814)">
              <path
                d="M14.3778 8.05759C17.0564 8.05759 19.3153 8.97713 19.4852 10.4564H19.4952V17.6028H19.4852C19.3153 19.0821 17.0564 20.0016 14.3778 20.0016C11.6991 20.0016 9.44025 19.0821 9.27034 17.6028H9.26034V10.4564H9.27034C9.44025 8.97713 11.6991 8.05759 14.3778 8.05759ZM10.6197 15.8837V17.4129C10.6197 17.4829 10.6696 17.5728 10.7596 17.6728L10.7796 17.6928C10.9195 17.8327 11.1594 17.9926 11.5092 18.1325C12.2488 18.4524 13.2783 18.6323 14.3778 18.6323C15.4772 18.6323 16.5067 18.4424 17.2463 18.1325C17.5862 17.9826 17.8261 17.8327 17.976 17.6928L17.996 17.6728C18.0859 17.5728 18.1359 17.4929 18.1359 17.4229V15.8837C17.1964 16.3834 15.847 16.6633 14.3778 16.6633C12.9085 16.6633 11.5592 16.3834 10.6197 15.8837ZM8.30082 0.101562C12.4587 0.101562 15.897 1.55084 15.897 3.69976V3.63979V6.96813C15.897 7.33795 15.5972 7.64779 15.2174 7.64779C14.8475 7.64779 14.5477 7.34794 14.5377 6.98812V5.8287C13.1584 6.74824 10.8595 7.29797 8.30082 7.29797C5.73211 7.29797 3.44325 6.74824 2.06394 5.8187V8.99712C2.06394 9.19702 2.17388 9.41691 2.39377 9.6368L2.42376 9.66678C2.46374 9.70676 2.51371 9.74674 2.55369 9.78672L2.59368 9.81671L2.71362 9.90666L2.75359 9.93665C2.83355 9.99662 2.91352 10.0466 3.00347 10.0966L3.05344 10.1266C3.07344 10.1365 3.08343 10.1465 3.10342 10.1565L3.1534 10.1865C3.18338 10.1965 3.20337 10.2165 3.23336 10.2265L3.29333 10.2565L3.3533 10.2865L3.41327 10.3165C3.42326 10.3165 3.43325 10.3265 3.44325 10.3265L3.50322 10.3564C3.53321 10.3664 3.56319 10.3864 3.59318 10.3964L3.65315 10.4264C3.66314 10.4264 3.67314 10.4364 3.68313 10.4364C4.18288 10.6463 4.76259 10.8262 5.39228 10.9561L5.49223 10.9761C6.3518 11.146 7.31132 11.236 8.31082 11.236C8.68063 11.236 8.99048 11.5358 8.99048 11.9157C8.99048 12.2855 8.69063 12.5953 8.31082 12.5953C5.7421 12.5953 3.45325 12.0456 2.07393 11.1161V14.2645C2.07393 14.4644 2.18388 14.6843 2.40377 14.9042L2.43375 14.9341C2.47373 14.9741 2.52371 15.0141 2.56369 15.0541L2.60367 15.0841L2.72361 15.174L2.76359 15.204C2.84355 15.264 2.92351 15.314 3.01346 15.3639L3.06344 15.3939C3.08343 15.4039 3.09343 15.4139 3.11342 15.4239L3.16339 15.4539C3.19337 15.4639 3.21337 15.4839 3.24335 15.4939L3.30332 15.5239L3.36329 15.5538L3.42326 15.5838C3.43326 15.5838 3.44325 15.5938 3.45325 15.5938L3.51322 15.6238C3.5432 15.6338 3.57319 15.6538 3.60317 15.6638L3.66314 15.6938C3.67314 15.6938 3.68313 15.7038 3.69313 15.7038C4.19288 15.9137 4.77259 16.0936 5.40227 16.2235L5.50222 16.2435C6.36179 16.4134 7.32131 16.5034 8.32081 16.5034C8.69063 16.5034 9.00047 16.8032 9.00047 17.183C9.00047 17.5628 8.70062 17.8627 8.32081 17.8627C4.26284 17.8627 0.894524 16.4834 0.734604 14.4244H0.724609V3.66978C0.734604 1.54084 4.1529 0.101562 8.30082 0.101562ZM18.1359 12.4454C17.1964 12.9451 15.847 13.225 14.3778 13.225C12.9085 13.225 11.5592 12.9451 10.6197 12.4454V14.0846C10.6197 14.1545 10.6696 14.2445 10.7596 14.3444L10.7796 14.3644C10.9195 14.5044 11.1594 14.6643 11.5092 14.8042C12.2488 15.1241 13.2783 15.304 14.3778 15.304C15.4772 15.304 16.5067 15.1141 17.2463 14.8042C17.5862 14.6543 17.8261 14.5044 17.976 14.3644L17.996 14.3444C18.0859 14.2445 18.1359 14.1645 18.1359 14.0946V12.4454ZM14.3778 9.40691C13.2683 9.40691 12.2488 9.59682 11.5092 9.90666C11.1694 10.0566 10.9295 10.2065 10.7796 10.3464L10.7596 10.3664C10.6596 10.4664 10.6197 10.5563 10.6197 10.6263C10.6197 10.6963 10.6696 10.7862 10.7596 10.8862L10.7796 10.9062C10.9195 11.0461 11.1594 11.206 11.5092 11.3459C12.2488 11.6658 13.2783 11.8457 14.3778 11.8457C15.4772 11.8457 16.5067 11.6558 17.2463 11.3459C17.5862 11.196 17.8261 11.0461 17.976 10.9062L17.996 10.8862C18.0959 10.7862 18.1359 10.6963 18.1359 10.6263C18.1359 10.5563 18.0859 10.4664 17.996 10.3664L17.976 10.3464C17.8361 10.2065 17.5962 10.0466 17.2463 9.90666C16.5067 9.59682 15.4872 9.40691 14.3778 9.40691ZM8.30082 1.45089C7.30132 1.45089 6.3418 1.54084 5.48223 1.71076L5.38228 1.73075C4.7526 1.86068 4.17289 2.04059 3.67313 2.25049C3.66314 2.25049 3.65315 2.26048 3.64315 2.26048L3.57318 2.30046C3.5432 2.31046 3.51322 2.33045 3.48323 2.34044L3.42326 2.37043C3.41327 2.37043 3.40327 2.38042 3.39328 2.38042L3.3333 2.41041L3.27333 2.44039L3.21337 2.47038C3.18338 2.48037 3.16339 2.50036 3.1334 2.51036L3.08343 2.54034C3.06344 2.55034 3.05345 2.56033 3.03346 2.57033L2.98348 2.60031C2.89352 2.65029 2.81357 2.70026 2.7336 2.76023L2.70362 2.79022L2.58368 2.88017L2.55369 2.90016C2.50372 2.94014 2.46374 2.98012 2.42376 3.0201L2.39377 3.05009C2.17388 3.26998 2.06394 3.48987 2.06394 3.68977C2.06394 3.88967 2.17388 4.10956 2.39377 4.32945L2.42376 4.35943C2.46374 4.39941 2.51371 4.43939 2.55369 4.47937L2.59368 4.50936L2.71362 4.59931L2.75359 4.6293C2.83355 4.68927 2.91352 4.73924 3.00347 4.78922L3.05344 4.8192C3.07344 4.8292 3.08343 4.83919 3.10342 4.84919L3.1534 4.87917C3.18338 4.88917 3.20337 4.90916 3.23336 4.91915L3.29333 4.94914L3.3533 4.97912L3.41327 5.00911C3.42326 5.00911 3.43325 5.0191 3.44325 5.0191L3.50322 5.04909C3.53321 5.05908 3.56319 5.07907 3.59318 5.08907L3.65315 5.11905L3.68313 5.12905C4.18288 5.33894 4.76259 5.51885 5.39228 5.64879L5.49223 5.66878C6.3518 5.8387 7.31132 5.92865 8.31082 5.92865C9.31032 5.92865 10.2698 5.8387 11.1294 5.66878L11.2294 5.64879C11.859 5.51885 12.4388 5.33894 12.9385 5.12905C12.9485 5.12905 12.9585 5.11905 12.9685 5.11905L13.0285 5.08907C13.0584 5.07907 13.0884 5.05908 13.1184 5.04909L13.1784 5.0191C13.1884 5.0191 13.1984 5.00911 13.2084 5.00911L13.2683 4.97912L13.3283 4.94914L13.3883 4.91915C13.4183 4.90916 13.4383 4.88917 13.4682 4.87917L13.5182 4.84919C13.5382 4.83919 13.5482 4.8292 13.5682 4.8192L13.5982 4.79921C13.6881 4.74924 13.7681 4.69926 13.848 4.63929L13.888 4.60931L14.008 4.51935L14.0479 4.48937C14.0979 4.44939 14.1379 4.40941 14.1779 4.36943L14.2079 4.33944C14.4278 4.11955 14.5377 3.89966 14.5377 3.69976C14.5377 3.49986 14.4278 3.27997 14.2079 3.06008L14.1779 3.0301C14.1379 2.99012 14.0879 2.95014 14.0479 2.91016L14.008 2.88017L13.888 2.79022L13.848 2.76023C13.7681 2.70026 13.6881 2.65029 13.5982 2.60031L13.5482 2.57033C13.5282 2.56033 13.5182 2.55034 13.4982 2.54034L13.4482 2.51036C13.4183 2.50036 13.3983 2.48037 13.3683 2.47038L13.3083 2.44039L13.2483 2.41041L13.1884 2.38042C13.1784 2.38042 13.1684 2.37043 13.1584 2.37043L13.0984 2.34044C13.0684 2.33045 13.0385 2.31046 13.0085 2.30046L12.9485 2.27048L12.9185 2.26048C12.4188 2.05059 11.8391 1.87068 11.2094 1.74074L11.1094 1.72075C10.2498 1.55084 9.29033 1.45089 8.30082 1.45089Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_5287_22814">
                <rect width="20" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>
        ),
        title: "Token Amount",
        value: `${formatTokenFixedto(tokenAmount)}`,
        // hasButton: true,
      },
      {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <g opacity="0.6">
              <path
                d="M9.96512 18.4366C9.73571 18.4366 9.5066 18.3208 9.39153 18.0921L5.71989 7.42062C5.60397 7.19131 5.71989 7.07612 5.83571 6.84702L9.62253 1.91301C9.73834 1.79709 9.85184 1.68359 10.081 1.68359C10.3101 1.68359 10.4255 1.79941 10.5396 1.91301L14.3264 6.84702C14.4422 6.96284 14.4422 7.19152 14.4422 7.42062L10.5409 18.0921C10.4251 18.3214 10.1964 18.4366 9.96734 18.4366H9.96512ZM6.86698 7.30586L9.96544 16.1417L13.1788 7.30586L10.0802 3.28909L6.86698 7.30586Z"
                fill="white"
              />
              <path
                d="M1.24316 6.84375H18.1112V7.99189H1.24316V6.84375Z"
                fill="white"
              />
              <path
                d="M9.96506 18.4351C9.84925 18.4351 9.62057 18.3193 9.50655 18.2057L0.900376 7.87798C0.784559 7.64856 0.670958 7.41946 0.900376 7.18951L4.91714 1.79582C5.03295 1.6799 5.14645 1.56641 5.37566 1.56641H14.6706C14.9 1.56641 15.0152 1.68222 15.1292 1.79582L19.146 7.18941C19.2617 7.41872 19.2617 7.64792 19.146 7.87787L10.5396 18.32C10.3103 18.32 10.0812 18.4359 9.96601 18.4359L9.96506 18.4351ZM2.04768 7.53327L9.96549 16.9429L17.8834 7.41914L14.3262 2.71392H5.60518L2.0481 7.53337L2.04768 7.53327Z"
                fill="white"
              />
            </g>
          </svg>
        ),
        title: "Token Value",
        value: `$${formatTokenFixedto(tokenValue)}`,
        // value: `$${Number(tokenValue).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      },
      {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <g opacity="0.6">
              <path
                d="M7.32275 9.99781C7.796 9.99781 8.24987 9.80981 8.58451 9.47517C8.91915 9.14053 9.10715 8.68666 9.10715 8.2134C9.10715 7.74015 8.91915 7.28628 8.58451 6.95164C8.24987 6.617 7.796 6.429 7.32275 6.429C6.84949 6.429 6.39562 6.617 6.06098 6.95164C5.72634 7.28628 5.53834 7.74015 5.53834 8.2134C5.53834 8.68666 5.72634 9.14053 6.06098 9.47517C6.39562 9.80981 6.84949 9.99781 7.32275 9.99781ZM18.4753 5.0907L9.99935 0.183594L1.52344 5.0907V14.9049L9.99935 19.812L18.4753 14.9049V5.0907ZM9.99935 2.24547L16.6909 6.11941V12.2578L12.6206 9.81669L5.5089 15.1503L3.30784 13.8762V6.11941L9.99935 2.24547ZM9.99935 17.7501L7.18713 16.1219L12.7313 11.9642L16.2983 14.1037L9.99935 17.7501Z"
                fill="white"
              />
            </g>
          </svg>
        ),
        title: "NFTs Amount",
        value: nfts?.totalCount || 0,
      },
    ],
    [tokenAmount, tokenValue, nfts],
  );
  const skeletonCards = Array.from({ length: 4 }, (_, index) => index + 1).map(
    (item) => <LCollectionCardSkeleton key={item} mb="0px" mt="20px" />,
  );
  return (
    <Box>
      <AssetCard
        cardData={cardData}
        cardLoading={false}
        setActiveTab={() => {}}
      />
      <Typography
        sx={{
          fontSize: 24,
          color: "#AF54FF",
          fontFamily: "Poppins",
          fontWeight: 600,
          mt: 2,
        }}
      >
        My NFTs{" "}
        {isFetching && isConnected ? (
          <CircularProgress
            size={18}
            sx={{ color: "rgb(175, 84, 255)", ml: 1 }}
          />
        ) : null}
      </Typography>
      <Grid
        container
        spacing={2}
        sx={{
          mb: 4,
          mt: 0.4,
          // minHeight: 100,
          height: itemsData?.pages?.[0]?.tokens?.length && !isLoading ? 700 : 0,
          overflowY: "scroll",
        }}
      >
        {isConnected ? (
          itemsData?.pages.map((group, idx) => (
            <Fragment key={idx}>
              {group?.tokens?.map((card, carIdx) => (
                <MyNFTCard
                  key={card.token.tokenId}
                  selectedNfts={[]}
                  handleToggleNft={() => {}}
                  nftInfo={card.token}
                  rarity={card.token.rarityRank}
                  chainId={BaseSID}
                  col={4}
                />
              ))}
            </Fragment>
          ))
        ) : (
          <NeedConnectCard />
        )}
        {isFetchingNextPage || isLoading ? skeletonCards : null}
        {/* {skeletonCards} */}
        <div ref={sentryRef} />
      </Grid>
      {!itemsData?.pages?.[0]?.tokens?.length && !isLoading && isConnected ? (
        <NoDataSearched title="No NFTs Are Found" />
      ) : null}
      {isConnected ? null : <NeedConnectCard />}
    </Box>
  );
};

export default LWalletPage;
