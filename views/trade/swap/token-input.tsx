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
import { Token } from "@uniswap/sdk-core";
import { ChangeEventHandler, useCallback, useMemo } from "react";
import { useActiveToken } from "@/context/hooks/useActiveToken";
import { getTokenLogoURL } from "@/utils/token";
interface iTokenInput {
  chainId: number;
  inputValue: string;
  erc20Address: string;
  token: Token;
  baseTokens?: Token[];
  showMax?: boolean;
  hasLogo?: boolean;
  tokenBalanceLoading?: boolean;
  inputTitle: string;
  balance: string;
  symbol: string;
  logoUrl?: string;
  disable?: boolean;
  handleMaxPayValue?: (value: string) => void;
  handleInputValueChange?: ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  >;
}
export const selectStyle = {
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

export const menuItemStyle = {
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
  inputTitle,
  handleInputValueChange,
  handleMaxPayValue,
  balance,
  symbol,
  erc20Address,
  hasLogo,
  logoUrl,
  disable = false,
}: iTokenInput) => {
  const { activeToken, setActiveToken } = useActiveToken();
  const stepValue = useMemo(() => 10 ** -token.decimals, [token]);
  const lUrl = useMemo(
    () =>
      getTokenLogoURL({
        chainId: chainId || 1,
        address: erc20Address,
      }),
    [chainId, erc20Address],
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
      />

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
        <Stack flexDirection="row" alignItems="center">
          {baseTokens?.length ? (
            <FormControl fullWidth>
              <Select
                className="test-select"
                labelId="select-label"
                id="select"
                placeholder="Select token"
                value={activeToken?.address}
                onChange={(event) => {
                  const aToken = baseTokens?.find(
                    (t) => t.address === event.target.value,
                  );
                  aToken && setActiveToken(aToken);
                }}
                sx={selectStyle}
                MenuProps={{
                  sx: {
                    "& .MuiList-root": {
                      bgcolor: "#0E111C",
                      py: 0,
                      px: 1,
                    },
                    "& .MuiMenu-list": {},
                  },
                }}
              >
                {baseTokens?.map((t) => (
                  <MenuItem
                    key={t.address}
                    value={t.address}
                    sx={menuItemStyle}
                  >
                    <Stack
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box>
                        <AvatarCard
                          hasLogo={true}
                          symbol={t?.symbol || ""}
                          logoUrl={getTokenLogoURL({
                            chainId,
                            address: t.address,
                          })}
                          // logoUrl={collectionDetails?.logo_url || ""}
                          chainId={chainId}
                          size={40}
                          mr={1}
                        />
                      </Box>
                      <Typography
                        variant="h4"
                        sx={{ fontSize: { md: 24, xs: 16 } }}
                      >
                        {t.symbol}
                      </Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <>
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
            </>
          )}
        </Stack>
      </Stack>
      {/* <ExchangePositionButton handleExchange={handleExchange} /> */}
    </InputWrapper>
  );
};

export default TokenInput;
