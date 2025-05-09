import {
  Box,
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import TokenBalance from "../token-balance";
import { InputWrapper } from "../wrapper";
import AvatarCard from "@/components/collections/avatar-card";
import { Token } from "@uniswap/sdk-core";
import { ChangeEventHandler, useCallback, useEffect, useMemo } from "react";
import { useSolActiveToken } from "@/context/hooks/useSolActiveToken";
import { getTokenLogoURL } from "@/utils/token";
import SolTokenBalance from "./sol-token-balance";
import { getMint } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { BigNumber, ethers } from "ethers";

interface iTokenInput {
  chainId: number;
  solBalance: number | string | null;
  tokenBalance: number | string | null;
  activeTokenBalance: number | string | null;
  inputValue: string;
  erc20Address: string;
  token: Token;
  baseTokens?: Token[];
  showMax?: boolean;
  isNative?: boolean;
  hasLogo?: boolean;
  tokenBalanceLoading?: boolean;
  inputTitle: string;
  symbol: string;
  handleMaxPayValue?: (value: string) => void;
  handleInputValueChange?: ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  >;
}
const selectStyle = {
  // minWidth: 100,
  p: 1,
  bgcolor: "transparent",
  color: "white",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "transparent",
  },
  "& .MuiSelect-select": {
    bgcolor: "transparent",
    color: "white",
    paddingRight: "20px !important",
  },
  "& .MuiInputBase-input": {
    padding: 0,
  },
  "& .MuiSvgIcon-root": {
    color: "white",
  },
  "&:hover": {
    color: "#fff",
    background: "rgba(255, 255, 255, 0.05)",
  },
  border: "none",
  boxShadow: "none",
  ".MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
};

const menuItemStyle = {
  // paddingTop: "0px !important",
  "&.MuiMenuItem-root": {
    bgcolor: "#0E111C",
    color: "white",
    padding: "10px",
    "&:hover": {
      color: "#fff",
      bgcolor: "#1c2030",
    },
    "&.Mui-selected": {
      bgcolor: "#0E111C",
      color: "#fff",
    },
  },
};
const TokenInput = ({
  chainId,
  inputValue,
  token,
  baseTokens,
  showMax = false,
  tokenBalanceLoading = false,
  isNative = false,
  inputTitle,
  handleInputValueChange,
  handleMaxPayValue,
  symbol,
  erc20Address,
  hasLogo,
  solBalance,
  tokenBalance,
  activeTokenBalance,
}: iTokenInput) => {
  const logoUrl = useMemo(
    () =>
      getTokenLogoURL({
        chainId: chainId || 1,
        address: erc20Address,
      }),
    [chainId, erc20Address],
  );
  const handlePercentageClick = useCallback(
    (percentage: number) => {
      handleMaxPayValue?.(
        baseTokens?.length
          ? // 处理 solBalance 的情况
            ethers.utils.formatUnits(
              BigNumber.from(
                Math.floor(Number(solBalance) * 10 ** token?.decimals),
              ) // 转换为整数形式
                .mul(percentage) // 乘以百分比
                .div(100), // 除以 100 恢复百分比运算
              token?.decimals, // 转换为可读字符串
            )
          : // 处理 tokenBalance 的情况
            ethers.utils.formatUnits(
              BigNumber.from(
                Math.floor(Number(tokenBalance) * 10 ** token?.decimals),
              ) // 转换为整数形式
                .mul(percentage) // 乘以百分比
                .div(100), // 恢复百分比运算
              token?.decimals, // 转换为可读字符串
            ),
      );
    },
    [handleMaxPayValue, tokenBalance, solBalance, baseTokens, token],
  );
  // const handlePercentageClick = useCallback(
  //   (percentage: number, decimals: number) => {
  //     console.log("percentage", percentage);
  //     console.log("decimals", decimals);

  //     // 将浮点数 solBalance 转换为整数形式
  //     const solBalanceBN = BigNumber.from(
  //       Math.round(Number(solBalance) * 10 ** decimals) || 0,
  //     );
  //     const tokenBalanceBN = BigNumber.from(
  //       Math.round(Number(tokenBalance) * 10 ** decimals) || 0,
  //     );

  //     // 将 percentage 转换为整数
  //     const percentageBN = BigNumber.from(Math.round(percentage * 1e4)); // 4 位小数精度
  //     const precision = BigNumber.from(10).pow(decimals); // 动态精度

  //     if (baseTokens?.length) {
  //       // 处理 solBalance 的情况
  //       const result = solBalanceBN
  //         .mul(percentageBN)
  //         .div(BigNumber.from(1e6).mul(precision)); // (solBalance * percentage) / 100
  //       handleMaxPayValue?.(result.toString());
  //     } else {
  //       // 处理 tokenBalance 的情况
  //       const result = tokenBalanceBN
  //         .mul(percentageBN)
  //         .div(BigNumber.from(1e6).mul(precision)); // (tokenBalance * percentage) / 100
  //       handleMaxPayValue?.(result.toString());
  //     }
  //   },
  //   [handleMaxPayValue, tokenBalance, solBalance, baseTokens],
  // );
  return (
    <InputWrapper
      sx={{
        position: "relative",
        padding: { md: "10px 16px", xs: "10px 10px" },
      }}
    >
      <SolTokenBalance
        title={inputTitle}
        loading={tokenBalanceLoading}
        handleMaxPayValue={handleMaxPayValue}
        showMax={showMax}
        isNative={isNative}
        erc20Address={erc20Address}
        solBalance={solBalance}
        tokenBalance={tokenBalance}
        activeTokenBalance={activeTokenBalance}
      />
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ px: { md: 1, xs: 0 }, pt: 0, columnGap: "10px !important" }}
      >
        {[25, 50, 75, 100].map((percentage) => (
          <Typography
            key={percentage}
            variant="body2"
            onClick={() => handlePercentageClick(percentage)}
            sx={{
              display: "inline-block",
              color: "#AF54FF",
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
            placeholder="0"
            className="swap-input"
            // type="number"
            value={inputValue}
            inputProps={{ min: "0" }}
            // inputProps={{ min: stepValue, step: stepValue }}
            onChange={handleInputValueChange}
            sx={{
              p: 1,
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
        <Stack flexDirection="row" alignItems="center">
          {baseTokens?.length ? (
            // <FormControl fullWidth>
            //   <Select
            //     className="test-select"
            //     labelId="select-label"
            //     id="select"
            //     placeholder="Select token"
            //     value={activeToken?.address}
            //     onChange={(event) => {
            //       const aToken = baseTokens?.find(
            //         (t) => t.address === event.target.value,
            //       );
            //       aToken && setActiveToken(aToken);
            //     }}
            //     sx={selectStyle}
            //     MenuProps={{
            //       sx: {
            //         "& .MuiList-root": {
            //           bgcolor: "#0E111C",
            //           py: 0,
            //           px: 1,
            //         },
            //         "& .MuiMenu-list": {},
            //       },
            //     }}
            //   >
            //     {baseTokens?.map((t) => (
            //       <MenuItem
            //         key={t.address}
            //         value={t.address}
            //         sx={menuItemStyle}
            //       >
            //         <Stack
            //           flexDirection="row"
            //           alignItems="center"
            //           justifyContent="space-between"
            //         >
            //           <Box>
            //             <AvatarCard
            //               hasLogo={true}
            //               symbol={t?.symbol || ""}
            //               logoUrl={getTokenLogoURL({
            //                 chainId,
            //                 address: t.address,
            //               })}
            //               chainId={chainId}
            //               size={40}
            //               mr={1}
            //             />
            //           </Box>
            //           <Typography
            //             variant="h4"
            //             sx={{
            //               fontSize: { md: 24, xs: 16 },
            //               textTransform: "uppercase",
            //             }}
            //           >
            //             {t.symbol}
            //           </Typography>
            //         </Stack>
            //       </MenuItem>
            //     ))}
            //   </Select>
            // </FormControl>
            <>
              {" "}
              <Box>
                <AvatarCard
                  hasLogo={hasLogo}
                  symbol={symbol || ""}
                  logoUrl={getTokenLogoURL({
                    chainId,
                    address: "So11111111111111111111111111111111111111112",
                  })}
                  chainId={chainId}
                  size={40}
                  mr={1}
                />
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontSize: { md: 24, xs: 16 },
                  textTransform: "uppercase",
                }}
              >
                SOL
              </Typography>
            </>
          ) : (
            <>
              <Box>
                <AvatarCard
                  hasLogo={hasLogo}
                  symbol={symbol || ""}
                  logoUrl={logoUrl}
                  chainId={chainId}
                  size={40}
                  mr={1}
                />
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontSize: { md: 24, xs: 16 },
                  textTransform: "uppercase",
                }}
              >
                {symbol}
              </Typography>
            </>
          )}
        </Stack>
      </Stack>
      {/* <ExchangePositionButton handleExchange={handleExchange} /> */}
    </InputWrapper>
  );
};

export default TokenInput;
