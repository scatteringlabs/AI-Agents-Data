// components/GlobalTypeSwitcher.tsx
import React, { useEffect } from "react";
import { Box } from "@mui/material";
import SwitchOption from "./SwitchOption";
import { useGlobalState } from "@/context/GlobalStateContext";
import { useRouter } from "next/router";
import { useChain } from "@/context/chain-provider";
import { useErc20ZChain } from "@/context/chain-provider-erc20z";
import { ChainIdByName, ChainNameById } from "@/constants/chain";

const GlobalTypeSwitcher: React.FC = () => {
  const router = useRouter();
  const { selectedOption, setSelectedOption } = useGlobalState();
  const { GlobalType } = router.query;
  const { chainId } = useChain();
  const { chainId: zoraChainId } = useErc20ZChain();

  useEffect(() => {
    if (GlobalType && typeof GlobalType === "string") {
      setSelectedOption(GlobalType);
    }
  }, [GlobalType, setSelectedOption, router]);

  useEffect(() => {
    if (router.isReady) {
      const { GlobalType } = router.query;
      if (
        router.pathname?.includes("/collect/") ||
        router.pathname?.includes("/erc20z/")
      ) {
        setSelectedOption("erc20z");
      }
    }
  }, [router.isReady, router.query, router.pathname, setSelectedOption]);

  const handleOptionClick = (value: string) => {
    setSelectedOption(value);

    if (value === "404s") {
      router.push(`/${value.toLowerCase()}/${ChainIdByName?.[chainId] || ""}`);
    } else {
      router.push(
        `/${value.toLowerCase()}/${ChainIdByName?.[zoraChainId] || ""}`,
      );
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", mx: { md: 2, xs: 1 } }}>
      <SwitchOption
        value="404s"
        label="404s"
        isSelected={selectedOption === "404s"}
        onClick={() => handleOptionClick("404s")}
        selectedBgColor="rgb(176, 84, 255,1)"
        borderRadius="4px 0 0 4px"
      />
      <SwitchOption
        value="erc20z"
        label="Zora ERC20z"
        isSelected={selectedOption === "erc20z"}
        onClick={() => handleOptionClick("erc20z")}
        borderRadius="0 4px 4px 0"
        selectedBgColor="rgb(176, 84, 255,1)"
        selectedColor="#fff"
      />
    </Box>
  );
};

export default GlobalTypeSwitcher;
