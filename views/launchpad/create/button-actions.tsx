import { Box, Typography } from "@mui/material";
import { ButtonWrapper } from "./require-text";
import { BackIcon } from "../svg-icon/back";
import { useRouter } from "next/router";
import { useAccount, useBalance, useChainId, useSwitchChain } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { BaseSID } from "./tokenService";
import { useMemo } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";

const ButtonActions = ({ setShowPreview, handleCreateToken, id }: any) => {
  const { address } = useAccount();
  const chainId = useChainId();

  const ethBalanceWei = useBalance({
    address: address,
    chainId: chainId,
  });
  const ethBalance = useMemo(
    () =>
      ethers.utils.formatUnits(
        ethBalanceWei?.data?.value.toString() || "0",
        18,
      ),
    [ethBalanceWei],
  );

  const isCurrentChain = useMemo(() => chainId === BaseSID, [chainId]);
  const router = useRouter();
  const { switchChain } = useSwitchChain();
  const { openConnectModal } = useConnectModal();
  const handleCreate = () => {
    if (Number(ethBalance) <= 0.001) {
      toast.error("Insufficient ETH balance");
      return;
    }
    handleCreateToken();
  };
  return (
    <>
      <Box
        sx={{
          position: "fixed",
          left: 0,
          top: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          px: "100px",
          background: "#0A0A0A",
          height: "60px",
          zIndex: 999,
        }}
      >
        <ButtonWrapper
          sx={{
            cursor: "pointer",
            background: "transparent",
            py: 0,
            my: 0,
          }}
          onClick={() => {
            setShowPreview(false);
            router.push(`/launchpad/edit/${id}`);
          }}
        >
          <BackIcon />
          <span style={{ marginLeft: "10px" }}>Back</span>
        </ButtonWrapper>
        <Typography
          sx={{
            background: "transparent",
            width: "100%",
            textAlign: "center",
            fontFamily: "Poppins",
            fontWeight: "600",
            fontSize: "20px",
            color: "#fff",
            py: 0,
          }}
        >
          Preview your page
        </Typography>
      </Box>
      <Box
        sx={{
          position: "fixed",
          background: "#0A0A0A",
          height: "88px",
          bottom: 0,
          left: 0,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          columnGap: 2,
          zIndex: 999,
        }}
      >
        {address ? (
          isCurrentChain ? (
            <ButtonWrapper
              sx={{
                cursor: "pointer",
                py: 0,
                my: 0,
                border: "1px solid #af54ff",
                padding: "10px 40px",
                borderRadius: "10px",
              }}
              onClick={handleCreate}
            >
              {Number(ethBalance) > 0.001
                ? "Launch Collection"
                : "Insufficient balance"}
            </ButtonWrapper>
          ) : (
            <ButtonWrapper
              onClick={() => switchChain({ chainId: BaseSID })}
              sx={{
                cursor: "pointer",
                py: 0,
                my: 0,
                border: "1px solid #af54ff",
                padding: "10px 40px",
                borderRadius: "10px",
              }}
            >
              Switch Chain
            </ButtonWrapper>
          )
        ) : (
          <ButtonWrapper
            onClick={() => openConnectModal?.()}
            sx={{
              cursor: "pointer",
              py: 0,
              my: 0,
              border: "1px solid #af54ff",
              padding: "10px 40px",
              borderRadius: "10px",
            }}
          >
            Connect Wallet
          </ButtonWrapper>
        )}
      </Box>
    </>
  );
};

export default ButtonActions;
