import AvatarCard from "@/components/collections/avatar-card";
import { formatUSD, formatWeiFixed } from "@/utils/format";
import { Box, Skeleton } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTokens } from "@/services/portfolio";
import { useAccount, useBalance } from "wagmi";
import { arbitrum, base, flare, mainnet } from "viem/chains";
import { erc20Abi } from "viem";
import { readContracts } from "@wagmi/core";
import { config } from "@/configs/wagmi-config";
import { OptionType } from "@/pages/portfolio";
import NFTNotFound from "@/components/nft-not-found";
import { SCAN_URL_ID } from "@/constants/url";
import Link from "next/link";
import { ChainIdByName } from "@/constants/chain";
import { getTokenLogoURL } from "@/utils/token";

interface Token {
  address: string;
  chainId: number;
}

interface Balance {
  tokenAddress: string;
  balance: string;
  chainId: number;
}
interface TokensTableProps {
  options: OptionType[];
  address: string;
}

const TokensTable = ({ options, address }: TokensTableProps) => {
  const [allBalances, setAllBalances] = useState<Balance[]>([]);
  const [amountLoading, setAmountLoading] = useState<boolean>(false);
  const checkedOption = useMemo(
    () => options.find((item) => item.checked)?.value,
    [options],
  );
  const { data: tokensData, isLoading: isLoadingTokens } = useQuery({
    queryKey: ["details", { checkedOption }],
    queryFn: () =>
      getTokens({
        chain_id: checkedOption === 0 ? undefined : checkedOption,
        page_size: 100,
      }),
  });

  const mainnetETHBalance = useBalance({
    address: address as `0x${string}`,
    chainId: mainnet.id,
  });

  const arbitrumETHBalance = useBalance({
    address: address as `0x${string}`,
    chainId: arbitrum.id,
  });
  const baseETHBalance = useBalance({
    address: address as `0x${string}`,
    chainId: base.id,
  });

  const allTokens: Token[] = useMemo(
    () =>
      tokensData?.data?.list
        ?.filter(
          (item: any) =>
            item.address !== "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        )
        ?.map((item: any) => ({
          address: item.address,
          chainId: item.chain_id,
        })) || [],
    [tokensData],
  );

  const fetchBalances = useCallback(async () => {
    // @ts-ignore
    const contracts: any[] = allTokens.map((token) => ({
      address: token.address,
      abi: erc20Abi,
      functionName: "balanceOf",
      chainId: token.chainId,
      args: [address],
    }));

    try {
      setAmountLoading(true);
      const results = await readContracts(config, { contracts });
      const balances = results.map((result, index) => ({
        tokenAddress: allTokens[index].address,
        balance: result?.result?.toString(),
        chainId: allTokens?.[index].chainId,
      }));
      setAllBalances(balances as Balance[]);
      setAmountLoading(false);
    } catch (error) {
      setAmountLoading(false);
      console.error("Error fetching balances:", error);
    }
  }, [allTokens, address]);

  useEffect(() => {
    if (allTokens.length) {
      fetchBalances();
    }
  }, [allTokens, address, fetchBalances]);

  const getAmountByCA = useCallback(
    (chainId: number, address: string, decimals: number): string => {
      if (!chainId || !address) return "0";
      if (
        chainId === mainnet.id &&
        address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
      ) {
        return formatWeiFixed(
          mainnetETHBalance?.data?.value.toString() || "0",
          decimals || 18,
        );
      }
      if (
        chainId === arbitrum.id &&
        address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
      ) {
        return formatWeiFixed(
          arbitrumETHBalance?.data?.value.toString() || "0",
          decimals || 18,
        );
      }
      if (
        chainId === base.id &&
        address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
      ) {
        return formatWeiFixed(
          baseETHBalance?.data?.value.toString() || "0",
          decimals || 18,
        );
      }
      const token = allBalances.find(
        (balance) =>
          balance.chainId === chainId && address === balance.tokenAddress,
      );
      return formatWeiFixed(token?.balance || "0", decimals || 18);
    },
    [allBalances, arbitrumETHBalance, mainnetETHBalance, baseETHBalance],
  );

  // const handleClick = useCallback(
  //   ({
  //     chainId,
  //     erc721Address,
  //   }: {
  //     chainId: number;
  //     erc721Address: string;
  //   }) => {
  //     router.push();
  //   },
  //   [router],
  // );

  const showTokenList = useMemo(
    () =>
      tokensData?.data?.list?.filter(
        (item) =>
          Number(
            getAmountByCA(item.chain_id, item.address, item.decimals || 18),
          ) > 0,
      ),
    [tokensData, getAmountByCA],
  );

  return (
    <div className="widget-content-tab pt-10" style={{ width: "100%" }}>
      <div className="widget-content-inner">
        <div className="widget-table-ranking">
          <div
            data-wow-delay="0s"
            className="wow fadeInUp table-ranking-heading"
          >
            <div className="column1">
              <h3>Tokens</h3>
            </div>
            <div className="column2">
              <h3>Price</h3>
            </div>
            <div className="column2">
              <h3>Amount</h3>
            </div>
            <div className="column2">
              <h3>Value</h3>
            </div>
          </div>
          {isLoadingTokens || amountLoading ? (
            <Box>
              {Array.from({ length: 10 }, (_, index) => index + 1).map(
                (item) => (
                  <Skeleton
                    key={item}
                    sx={{
                      background: "#331f44",
                      borderRadius: 2,
                      height: 60,
                    }}
                  />
                ),
              )}
            </Box>
          ) : (
            <div className="table-ranking-content">
              {showTokenList?.length ? (
                showTokenList?.map((item, index) => (
                  <Box
                    key={item.address}
                    data-wow-delay={`${index % 3}s`}
                    className="wow fadeInUp fl-row-ranking"
                    sx={{
                      cursor: "pointer",
                      padding: "8px 20px !important",
                      "&:hover": {
                        background: "rgba(255, 255, 255, 0.05)",
                        borderRadius: "6px !important",
                      },
                    }}
                  >
                    <div className="td1">
                      <AvatarCard
                        hasLogo={item?.has_logo}
                        symbol={item.symbol}
                        // logoUrl={getTokenLogoURL({
                        //   chainId: item?.chain_id || 1,
                        //   address: item?.address,
                        // })}
                        logoUrl={item?.logo_url}
                        chainId={item.chain_id}
                        size={32}
                        mr={1}
                      />
                      <Box>
                        <div
                          className="item-name"
                          style={{
                            fontSize: 16,
                            fontWeight: 600,
                            textTransform: "uppercase",
                          }}
                        >
                          {item.symbol}
                        </div>
                      </Box>
                    </div>
                    <div className="td2">
                      <h6 className="price gem">{formatUSD(item.price)}</h6>
                    </div>
                    <div className="td2">
                      <h6>
                        {getAmountByCA(
                          item.chain_id,
                          item.address,
                          item.decimals || 18,
                        )}
                      </h6>
                    </div>
                    <div className="td2">
                      <h6>
                        {formatUSD(
                          Number(
                            getAmountByCA(
                              item.chain_id,
                              item.address,
                              item.decimals || 18,
                            ),
                          ) * Number(item.price),
                        )}
                      </h6>
                    </div>
                  </Box>
                ))
              ) : (
                <NFTNotFound title="Sorry, no relevant tokens were found in your wallet at the moment." />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokensTable;
