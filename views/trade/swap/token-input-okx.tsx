import {
  Box,
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import TokenBalance from "./token-balance";
import { InputWrapper } from "./wrapper";
import AvatarCard from "@/components/collections/avatar-card";
import { ChainId, Token } from "@uniswap/sdk-core";
import { ChangeEventHandler, useCallback, useMemo } from "react";
import { useActiveToken } from "@/context/hooks/useActiveToken";
import { getTokenLogoURL } from "@/utils/token";
import { menuItemStyle, selectStyle } from "./token-input";
import { ethers } from "ethers";
import { BatchBalanceResult } from "@/services/zora/swap/balance404";
import { zeroAddress } from "viem";
interface iTokenInputOkx {
  chainId: number;
  inputValue: string;
  erc20Address: string;
  token: Token;
  baseTokens?: Token[];
  showMax?: boolean;
  hasLogo?: boolean;
  tokenBalanceLoading?: boolean;
  inputTitle: string;
  // balance: string;
  symbol: string;
  logoUrl?: string;
  disable?: boolean;
  batchBalance?: BatchBalanceResult;
  handleMaxPayValue?: (value: string) => void;
  handleInputValueChange?: ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  >;
}

const percentages = [25, 50, 75, 100];
const TokenInputOkx = ({
  chainId,
  inputValue,
  token,
  baseTokens,
  showMax = false,
  tokenBalanceLoading = false,
  inputTitle,
  handleInputValueChange,
  handleMaxPayValue,
  symbol,
  erc20Address,
  hasLogo,
  logoUrl,
  disable = false,
  batchBalance,
}: iTokenInputOkx) => {
  const lUrl = useMemo(
    () =>
      getTokenLogoURL({
        chainId: chainId || 1,
        address: erc20Address,
      }),
    [chainId, erc20Address],
  );

  const handlePercentageClick = useCallback(
    (percentage: number) => {
      const erc20BalanceWei =
        token?.symbol === "ETH" || token?.symbol === "BNB"
          ? batchBalance?.ethBalance || 0
          : batchBalance?.erc20Balance || 0;
      const balance = ethers.BigNumber.from(erc20BalanceWei)
        .mul(percentage)
        .div(100);

      handleMaxPayValue?.(
        ethers.utils.formatUnits(balance, token?.decimals) || "18",
      );
    },
    [batchBalance, handleMaxPayValue, token],
  );

  return (
    <InputWrapper
      sx={{
        position: "relative",
        padding: { md: "10px 16px", xs: "10px 10px" },
      }}
    >
      <TokenBalance
        token={token}
        title={inputTitle}
        loading={tokenBalanceLoading}
        chainId={chainId}
        handleMaxPayValue={handleMaxPayValue}
        showMax={showMax}
        batchBalance={batchBalance}
      />
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
        <FormControl>
          <OutlinedInput
            disabled={disable}
            placeholder="0"
            className="swap-input"
            // type="number"
            value={inputValue}
            inputProps={{ min: "0" }}
            // inputProps={{ min: stepValue, step: stepValue }}
            onChange={handleInputValueChange}
            sx={{
              input: {
                width: {
                  md: "200px !important",
                  xs: "calc(100vw - 200px) !important",
                },
                fontSize: { md: "30px !important", xs: "20px !important" },
              },
            }}
          />
        </FormControl>
        {baseTokens?.length === 0 ? (
          <Stack flexDirection="row" alignItems="center">
            <Box>
              {logoUrl ? (
                <AvatarCard
                  hasLogo={true}
                  symbol={symbol || ""}
                  logoUrl={logoUrl}
                  chainId={chainId}
                  size={40}
                  mr={1}
                />
              ) : (
                <AvatarCard
                  hasLogo={hasLogo}
                  symbol={symbol || ""}
                  logoUrl={lUrl}
                  chainId={chainId}
                  size={40}
                  mr={1}
                />
              )}
            </Box>
            <Typography variant="h4" sx={{ fontSize: { md: 24, xs: 16 } }}>
              {token.symbol}
            </Typography>
          </Stack>
        ) : (
          <Stack flexDirection="row" alignItems="center">
            <Box>
              <AvatarCard
                hasLogo={true}
                symbol={symbol || ""}
                logoUrl={
                  chainId === ChainId.BNB
                    ? "/assets/images/tokens/bnb-active.svg"
                    : "/assets/images/tokens/eth-active.svg"
                }
                chainId={chainId}
                size={40}
                mr={1}
              />
            </Box>
            <Typography variant="h4" sx={{ fontSize: { md: 24, xs: 16 } }}>
              {token.symbol}
            </Typography>
          </Stack>
        )}
      </Stack>
      {/* <ExchangePositionButton handleExchange={handleExchange} /> */}
    </InputWrapper>
  );
};

export default TokenInputOkx;
