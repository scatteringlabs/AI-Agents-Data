import { getTokens } from "@/services/portfolio";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { mainnet, arbitrum } from "viem/chains";
import { readContracts } from "@wagmi/core";
import { useBalance } from "wagmi";
import { config } from "@/configs/wagmi-config";
import { erc20Abi } from "viem";
import { formatWei } from "@/utils/format";
interface Token {
  address: string;
  chainId: number;
}

interface Balance {
  tokenAddress: string;
  balance: string;
  chainId: number;
}

// The custom hook
const chainId = mainnet.id;
// function useTokenBalances() {
//   const [allBalances, setAllBalances] = useState<Balance[]>([]);
//   const { data: tokensData, isLoading: isLoadingTokens } = useQuery({
//     queryKey: ["details"],
//     queryFn: () => getTokens({}),
//   });

//   const mainnetETHBalance = useBalance({
//     address: "0xA337E7c131A1ec60dB68bD5Fde565EdEcAb8744E",
//     chainId: mainnet.id,
//   });

//   const arbitrumETHBalance = useBalance({
//     address: "0xA337E7c131A1ec60dB68bD5Fde565EdEcAb8744E",
//     chainId: arbitrum.id,
//   });

//   const allTokens: Token[] = useMemo(
//     () =>
//       tokensData?.data?.list
//         .filter(
//           (item: any) =>
//             item.address !== "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
//         )
//         .map((item: any) => ({
//           address: item.address,
//           chainId: item.chain_id,
//         })) || [],
//     [tokensData],
//   );

//   const fetchBalances = async () => {
//     // @ts-ignore
//     const contracts: any[] = allTokens.map((token) => ({
//       address: token.address,
//       abi: erc20Abi,
//       functionName: "balanceOf",
//       chainId: token.chainId,
//       args: ["0xA337E7c131A1ec60dB68bD5Fde565EdEcAb8744E"],
//     }));

//     try {
//       const results = await readContracts(config, { contracts });
//       const balances = results.map((result, index) => ({
//         tokenAddress: allTokens[index].address,
//         balance: result?.result?.toString(),
//         chainId: allTokens?.[index].chainId,
//       }));
//       setAllBalances(balances as Balance[]);
//     } catch (error) {
//       console.error("Error fetching balances:", error);
//     }
//   };

//   useEffect(() => {
//     if (allTokens.length) {
//       fetchBalances();
//     }
//   }, [allTokens]);

//   const getAmountByCA = useCallback(
//     (chainId: number, address: string): string => {
//       if (!chainId || !address) return "0";
//       if (
//         chainId === mainnet.id &&
//         address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
//       ) {
//         return mainnetETHBalance?.data?.value.toString() || "0";
//       }
//       if (
//         chainId === arbitrum.id &&
//         address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
//       ) {
//         return arbitrumETHBalance?.data?.value.toString() || "0";
//       }
//       const token = allBalances.find(
//         (balance) =>
//           balance.chainId === chainId && address === balance.tokenAddress,
//       );
//       return formatWei(token?.balance || "0");
//     },
//     [allBalances, arbitrumETHBalance, mainnetETHBalance],
//   );

//   return {
//     getAmountByCA,
//     isLoadingTokens: false,
//     allBalances,
//     tokensData,
//   };
// }

// export default useTokenBalances;
