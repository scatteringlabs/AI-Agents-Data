import Tabs from "@/components/tabs/Tabs";
import { TokenEntity } from "@/services/graphql/all-token";

import {
  Box,
  CircularProgress,
  Grid,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import BaseTokenCard from "./BaseTokenCard";
import QuoteTokenCard from "./QuoteTokenCard";
import { InputWrapper, TextWrapper } from "@/views/trade/swap/wrapper";
import { ButtonWrapper } from "../../create/require-text";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  useAccount,
  useBalance,
  useChainId,
  useContractRead,
  useSwitchChain,
  useWalletClient,
} from "wagmi";
import { erc20Abi } from "viem";
import { formatTokenFixedto, formatWei, formatWeiFixed } from "@/utils/format";
import { debounce } from "lodash";
import {
  executeSwap,
  getETHAmountInForToken,
  getTokenAmountOutForETH,
} from "@/services/launchpad/swap";
import { ethers } from "ethers";
import { BaseSID } from "../../create/tokenService";
import { useEthersProvider } from "@/services/launchpad/clientToProvider";
import { baseSepolia } from "viem/chains";
import { useEthersSigner } from "@/services/launchpad/clientToSigner";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { toast } from "react-toastify";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";
import { getETHPrice } from "@/services/tokens";
const percentages = [25, 50, 75, 100];

const BuyTokenInputCard = ({
  tokenAddress,
  tokenSymbol,
  logo,
  refetch,
  info,
  nftQuantity,
  isCurrentChain,
}: {
  tokenAddress: string;
  tokenSymbol: string;
  logo: string;
  refetch: () => void;
  info?: TokenEntity;
  nftQuantity?: number;
  isCurrentChain?: boolean;
}) => {
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { openConnectModal } = useConnectModal();
  const { user, login } = usePrivy();
  const address = useMemo(() => user?.wallet?.address, [user]);
  const { wallets } = useWallets();
  const wallet = useMemo(() => wallets?.[0], [wallets]);
  // const { data: walletClient } = useWalletClient();
  // const signer = useEthersSigner({ chainId: baseSepolia.id });
  const [loading, setLoading] = useState<boolean>(false);
  const ethBalance = useBalance({
    address: address as any,
    chainId: chainId,
  });
  const ethBalanceFormatted = useMemo(
    () =>
      formatTokenFixedto(
        ethers.utils.formatUnits(ethBalance?.data?.value.toString() || "0", 18),
      ),
    [ethBalance],
  );
  const sxdToken = useMemo(() => 800000000 - Number(info?.supply), [info]); // max token
  const [userInputTokenAmount, setUserInputTokenAmount] = useState<string>(""); // user want token

  const overAmountError = useMemo(
    () => Number(userInputTokenAmount) > Number(sxdToken),
    [sxdToken, userInputTokenAmount],
  );
  const oneNFTTokenAmount = useMemo(
    () => 1000000000 / (nftQuantity || 0),
    [nftQuantity],
  );
  const NFTAmount = useMemo(
    () => Number(userInputTokenAmount) / oneNFTTokenAmount,
    [userInputTokenAmount, oneNFTTokenAmount],
  );
  const overNFTAmountError = useMemo(() => NFTAmount > 100, [NFTAmount]);
  const [ethAmount, setEthAmount] = useState<string>("");
  const [maxBuyEthAmount, setMaxBuyEthAmount] = useState<string>("");
  const overETHBalanceError = useMemo(
    () =>
      Number(ethAmount) >
      Number(
        ethers.utils.formatUnits(ethBalance?.data?.value.toString() || "0", 18),
      ),
    [ethAmount, ethBalance],
  );
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
    chainId: chainId,
  });
  const tokenAmount = useMemo(
    () =>
      formatTokenFixedto(
        ethers.utils.formatUnits(tokenBalance?.toString() || "0", 18),
      ),
    [tokenBalance],
  );
  const { data: dataPrice } = useQuery({
    queryKey: ["getETHPrice"],
    queryFn: () => getETHPrice(),
  });
  const ethPrice = useMemo(() => dataPrice?.data?.eth_usd, [dataPrice]);
  const handleSearch = useMemo(
    () =>
      debounce(async (value: string) => {
        if (tokenAddress) {
          setLoading(true);
          const res = await getETHAmountInForToken({
            tokenAddress,
            tokenAmount: value,
          });
          setEthAmount(res?.ethPaid || "");
          setLoading(false);
        }
      }, 500),
    [tokenAddress],
  );
  const handleSearchETH = useMemo(
    () =>
      debounce(async (value: string) => {
        if (tokenAddress) {
          setLoading(true);
          const res = await getTokenAmountOutForETH({
            tokenAddress,
            ethAmount: value,
          });
          setUserInputTokenAmount(res?.tokensReceived || "");
          setLoading(false);
        }
      }, 500),
    [tokenAddress],
  );
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setUserInputTokenAmount(value);
    handleSearch(value);
  };
  const handleETHChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEthAmount(value);
    handleSearchETH(value);
  };
  useEffect(() => {
    return () => {
      handleSearch.cancel();
    };
  }, [handleSearch]);
  useEffect(() => {
    return () => {
      handleSearchETH.cancel();
    };
  }, [handleSearchETH]);
  const handlePercentageClick = useCallback(
    (percentage: number) => {
      const balance = ethers.BigNumber.from(ethBalance?.data?.value.toString())
        .mul(percentage)
        .div(100);
      setEthAmount(ethers.utils.formatUnits(balance?.toString()));
      handleSearchETH(ethers.utils.formatUnits(balance?.toString()));
    },
    [ethBalance, handleSearchETH, setEthAmount],
  );
  const handleSwap = useCallback(async () => {
    if (!tokenAddress) {
      return;
    }
    const toastId = toast.loading("Buying tokens...");
    setLoading(true);
    await executeSwap({
      isBuy: true,
      tokenAddr: tokenAddress,
      recipient: address as string,
      amountIn: ethAmount,
      amountOutMinimum: userInputTokenAmount,
      wallet,
    });
    refetchTokenBalance();
    refetch();
    setUserInputTokenAmount("");
    setEthAmount("");
    setLoading(false);
    toast.dismiss(toastId);
  }, [
    tokenAddress,
    address,
    ethAmount,
    userInputTokenAmount,
    refetchTokenBalance,
    refetch,
    wallet,
  ]);
  const handleMax = useCallback(() => {
    const amount = ethers.utils.formatUnits(
      ethBalance?.data?.value.toString() || "0",
      18,
    );
    setEthAmount(amount);
    handleSearchETH(amount);
  }, [setEthAmount, ethBalance, handleSearchETH]);

  useEffect(() => {
    getETHAmountInForToken({
      tokenAddress,
      tokenAmount: sxdToken?.toString(),
    }).then((res) => {
      setMaxBuyEthAmount(res?.ethPaid || "");
    });
  }, [sxdToken, tokenAddress]);

  const handleMaxToken = useCallback(() => {
    const amount = sxdToken.toString() || "0";
    setUserInputTokenAmount(amount);
    handleSearch(amount);
  }, [setUserInputTokenAmount, sxdToken, handleSearch]);
  const isSoldOut = useMemo(
    () => Number(info?.supply) === 800000000,
    [info?.supply],
  );
  return (
    <Box sx={{ position: "relative" }}>
      {loading ? (
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(0,0,0,0.01)",
            zIndex: 2,
          }}
        >
          <CircularProgress size={46} sx={{ color: "rgb(175, 84, 255)" }} />
        </Box>
      ) : null}
      <TextWrapper sx={{ mt: 2 }}>
        There are still{" "}
        <span
          style={{
            color: "#b054ff",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          {formatTokenFixedto(sxdToken)} {info?.symbol}
        </span>{" "}
        (
        <span
          style={{
            color: "#b054ff",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          {formatTokenFixedto(maxBuyEthAmount)}&nbsp;ETH
        </span>{" "}
        to fill) available for sale in the pool.{" "}
        <span
          onClick={handleMaxToken}
          style={{
            color: "#b054ff",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Buy All
        </span>
      </TextWrapper>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          columnGap: 2,
          mt: 2,
          position: "relative",
          flexDirection: { md: "row", xs: "column" },
        }}
      >
        <InputWrapper
          sx={{
            width: "100%",
            position: "relative",
            border: overETHBalanceError ? "1px solid #DC2626" : "none",
            padding: { md: "10px 16px", xs: "10px 10px" },
          }}
        >
          <Stack
            flexDirection="row"
            justifyContent="space-between"
            sx={{ px: { md: 2, xs: 0 }, py: { md: 2, xs: 1 } }}
          >
            <Typography variant="h5" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
              Pay
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                display: "flex",
                alignItems: "center",
                fontSize: { md: 14, xs: 12 },
              }}
            >
              Balance: {ethBalanceFormatted}
              <Typography
                variant="body2"
                sx={{
                  display: "inline-block",
                  color: "#AF54FF",
                  fontSize: { md: 14, xs: 12 },
                  ml: 1,
                  cursor: "pointer",
                }}
                onClick={handleMax}
              >
                max
              </Typography>
            </Typography>
          </Stack>
          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ px: { md: 1, xs: 0 }, pt: 0, columnGap: "10px !important" }}
          >
            {percentages.map((percentage) => (
              <Typography
                key={percentage}
                variant="body2"
                onClick={() => handlePercentageClick(percentage)}
                sx={{
                  display: "inline-block",
                  color: "#AF54FF", // 可根据设计调整颜色
                  fontSize: { md: 10, xs: 8 },
                  ml: { md: 1, xs: 0 },
                  cursor: "pointer",
                  border: "1px solid #AF54FF",
                  px: { md: 1, xs: 0.6 },
                  py: 0.6,
                  borderRadius: 1,
                }}
              >
                {percentage}%
              </Typography>
            ))}
          </Box>
          <Stack
            flexDirection="row"
            justifyContent="space-between"
            sx={{ px: { md: 2, xs: 0 }, pt: { md: 2, xs: 1 } }}
          >
            <OutlinedInput
              placeholder="0"
              className="swap-input"
              value={ethAmount}
              onChange={handleETHChange}
              // type="number"
              inputProps={{ min: "0" }}
              // inputProps={{ min: stepValue, step: stepValue }}
              sx={{
                input: {
                  width: {
                    md: "200px !important",
                    xs: "calc(100vw - 200px) !important",
                  },
                  fontSize: {
                    md: "30px !important",
                    xs: "20px !important",
                  },
                },
              }}
            />
            <BaseTokenCard />
          </Stack>
          {/* <ExchangePositionButton handleExchange={handleExchange} /> */}
        </InputWrapper>
        {/* <InputWrapper
          sx={{
            position: "relative",
            width: "100%",
            border: overAmountError ? "1px solid #DC2626" : "none",
            padding: { md: "10px 16px", xs: "10px 10px" },
          }}
        >
          <Stack
            flexDirection="row"
            justifyContent="space-between"
            sx={{
              px: { md: 2, xs: 0 },
              py: { md: 2, xs: 1 },
            }}
          >
            <Typography variant="h5" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
              Receive
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                display: "flex",
                alignItems: "center",
                fontSize: { md: 14, xs: 12 },
              }}
            >
              Balance: {tokenAmount}
            </Typography>
          </Stack>

          <Stack
            flexDirection="row"
            justifyContent="space-between"
            sx={{
              px: { md: 2, xs: 0 },
              pt: { md: 2, xs: 1 },
            }}
          >
            <OutlinedInput
              placeholder="0"
              className="swap-input"
              inputProps={{ min: "0" }}
              sx={{
                input: {
                  width: {
                    md: "200px !important",
                    xs: "calc(100vw - 200px) !important",
                  },
                  fontSize: {
                    md: "30px !important",
                    xs: "20px !important",
                  },
                },
              }}
              value={userInputTokenAmount}
              onChange={handleChange}
            />
            <QuoteTokenCard tokenSymbol={tokenSymbol} logo={logo} />
          </Stack>
        </InputWrapper> */}
      </Box>
      <Typography
        sx={{
          display: "flex",
          justifyContent: "space-between",
          // px: 1,
          py: 1,
          fontSize: { md: 14, xs: 12 },
          color: "rgba(255,255,255,1)",
        }}
      >
        <span>{`You'll Get`}</span>
        <span>
          {formatTokenFixedto(userInputTokenAmount)}{" "}
          {info?.symbol?.toUpperCase()}
          ($
          {formatTokenFixedto(Number(ethPrice) * Number(ethAmount), 2)})
        </span>
      </Typography>
      {overAmountError ? (
        <TextWrapper sx={{ color: "#DC2626" }}>
          There are only{" "}
          <span style={{ fontSize: 14, fontWeight: 600 }}>
            {formatTokenFixedto(sxdToken)} {info?.symbol}
          </span>{" "}
          available for sale in the bonding curve.{" "}
          <span
            onClick={handleMaxToken}
            style={{
              color: "#b054ff",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Buy All
          </span>
        </TextWrapper>
      ) : null}
      {!overAmountError && overNFTAmountError ? (
        <TextWrapper sx={{ color: "#F5870E" }}>
          Due to EVM gas limits, your current purchase will result in the
          transfer of over 100 NFTs in a single batch. This may lead to a high
          gas fee or a higher chance of transaction failure. You could try
          splitting it into multiple smaller transactions.
        </TextWrapper>
      ) : null}
      <Box display="flex" justifyContent="center">
        {address ? (
          isCurrentChain ? (
            isSoldOut ? (
              <ButtonWrapper
                sx={{
                  width: "auto",
                  py: 1,
                  px: "40px",
                  background: "gray",
                  "&:hover": {
                    background: "gray",
                  },
                }}
              >
                {`Sold Out`}
              </ButtonWrapper>
            ) : ethAmount ? (
              <ButtonWrapper
                disabled={overAmountError || overETHBalanceError}
                onClick={handleSwap}
                sx={{ width: "auto", py: 1, mt: 1, px: "40px" }}
              >
                {overETHBalanceError
                  ? "Insuffcient Balance"
                  : `Buy ${tokenSymbol}`}
              </ButtonWrapper>
            ) : (
              <ButtonWrapper
                disabled
                sx={{ width: "auto", py: 1, mt: 1, px: "40px" }}
              >
                Enter an amount
              </ButtonWrapper>
            )
          ) : (
            <ButtonWrapper
              onClick={() => switchChain({ chainId: BaseSID })}
              sx={{ width: "auto", py: 1, mt: 1, px: "40px" }}
            >
              Switch Chain
            </ButtonWrapper>
          )
        ) : (
          <ButtonWrapper
            onClick={() => login?.()}
            sx={{ width: "auto", py: 1, mt: 1, px: "40px" }}
          >
            Connect Wallet
          </ButtonWrapper>
        )}
      </Box>
    </Box>
  );
};

export default BuyTokenInputCard;
