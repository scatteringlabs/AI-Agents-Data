import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import { ethers } from "ethers";
import { saveLaunchpadProjectMedia } from "./create/tokenService";
import DialogHeader from "./components/DialogHeader";
import InputField from "./components/InputField";
import { ButtonWrapper } from "../home/BannerCard";
import { toast } from "react-toastify";
import { useWallets } from "@privy-io/react-auth";

interface MediaUpdateDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  tokenAddress: string;
  chainId: number;
  updateInfo: any;
  refetch: any;
}

const MediaUpdateDialog: React.FC<MediaUpdateDialogProps> = ({
  open,
  setOpen,
  tokenAddress,
  updateInfo,
  refetch,
}) => {
  const [twitter, setTwitter] = useState<string>(updateInfo?.x || "");
  const [telegram, setTelegram] = useState<string>(updateInfo?.telegram || "");
  const [website, setWebsite] = useState<string>(updateInfo?.website || "");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [twitterError, setTwitterError] = useState<string | null>(null);
  const [telegramError, setTelegramError] = useState<string | null>(null);
  const [websiteError, setWebsiteError] = useState<string | null>(null);
  const { wallets } = useWallets();
  const wallet = useMemo(() => wallets?.[0], [wallets]);
  const handleClose = () => {
    setOpen(false);
  };

  const validateTwitter = useCallback(() => {
    if (twitter && !twitter.startsWith("https://x.com/")) {
      setTwitterError("Twitter URL must start with https://x.com/");
    } else {
      setTwitterError(null);
    }
  }, [twitter]);

  const validateTelegram = useCallback(() => {
    if (telegram && !telegram.startsWith("https://t.me/")) {
      setTelegramError("Telegram URL must start with https://t.me/");
    } else {
      setTelegramError(null);
    }
  }, [telegram]);

  const validateWebsite = useCallback(() => {
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|" + // domain name
        "localhost|" + // or localhost
        "\\d{1,3}(\\.\\d{1,3}){3})" + // or IP
        "(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-zA-Z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-zA-Z\\d_]*)?$",
      "i",
    );
    if (website && !urlPattern.test(website)) {
      setWebsiteError("Website URL must be a valid URL.");
    } else {
      setWebsiteError(null);
    }
  }, [website]);

  const handleSave = useCallback(async () => {
    if (!tokenAddress || !window.ethereum) {
      setTwitterError("Token address is missing or MetaMask is not installed!");
      return;
    }

    // Run validations before saving
    validateTwitter();
    validateTelegram();
    validateWebsite();

    // Stop saving if there are validation errors
    if (twitterError || telegramError || websiteError) return;
    const toastId = toast.loading("Media Url Updating...");

    try {
      setIsLoading(true);
      setTwitterError(null);
      setTelegramError(null);
      setWebsiteError(null);
      const provider = await wallet?.getEthersProvider();
      const signer = provider.getSigner();

      const message = JSON.stringify({
        x: twitter,
        tg: telegram,
        website,
        chain_id: updateInfo.chain_id,
        token_address: tokenAddress,
        timestamp: Math.floor(Date.now() / 1000),
      });

      const signature = await signer.signMessage(message);
      const payload = { message, signature };
      const res = await saveLaunchpadProjectMedia(payload);

      if (res) {
        refetch?.();
        setOpen(false);
        // toast.success("Media Url Updated!");
      }
    } catch (err) {
      const errorMessage =
        (err as any)?.response?.data?.message || (err as Error).message;
      toast.error(errorMessage);
    } finally {
      toast.dismiss(toastId);
      setIsLoading(false);
    }
  }, [
    tokenAddress,
    validateTwitter,
    validateTelegram,
    validateWebsite,
    twitterError,
    telegramError,
    websiteError,
    twitter,
    telegram,
    website,
    refetch,
    updateInfo,
    setOpen,
    wallet,
  ]);

  useEffect(() => {
    setTwitter(updateInfo?.x);
    setTelegram(updateInfo?.telegram);
    setWebsite(updateInfo?.website);
  }, [updateInfo]);

  useEffect(() => {
    validateTwitter();
    validateTelegram();
    validateWebsite();
  }, [
    twitter,
    telegram,
    website,
    validateTwitter,
    validateTelegram,
    validateWebsite,
  ]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { background: "#202025", p: 2, borderRadius: 2 } }}
    >
      <DialogHeader
        collectionLogo={updateInfo?.collection_logo}
        collectionName={updateInfo?.collection_name}
        tokenSymbol={updateInfo?.token_symbol}
        onClose={handleClose}
      />
      <DialogContent>
        {isLoading && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.4)",
              zIndex: 9,
            }}
          >
            <CircularProgress size={48} sx={{ color: "rgb(175, 84, 255)" }} />
          </Box>
        )}

        <Box sx={{ display: "flex", columnGap: 2 }}>
          <InputField
            label="Website"
            value={website}
            placeholder="yourwebsite.com"
            onChange={(e) => setWebsite(e.target.value)}
            error={Boolean(websiteError)}
          />
          <InputField
            label="Twitter"
            value={twitter}
            placeholder="https://x.com/your_twitter_handle"
            onChange={(e) => setTwitter(e.target.value)}
            error={Boolean(twitterError)}
          />
          <InputField
            label="Telegram"
            value={telegram}
            placeholder="https://t.me/your_telegram_handle"
            onChange={(e) => setTelegram(e.target.value)}
            error={Boolean(telegramError)}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Typography
            color="error"
            sx={{ width: "100%", textAlign: "left", pl: 1 }}
          >
            {websiteError}
          </Typography>
          <Typography
            color="error"
            sx={{ width: "100%", textAlign: "left", pl: 1 }}
          >
            {twitterError}
          </Typography>
          <Typography
            color="error"
            sx={{ width: "100%", textAlign: "left", pl: 1 }}
          >
            {telegramError}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <ButtonWrapper
          onClick={handleClose}
          sx={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.6)",
            m: 1,
            px: 2,
            py: 0.4,
            color: "rgba(255,255,255,0.6)",
            cursor: "pointer",
            borderRadius: 1,
          }}
        >
          Cancel
        </ButtonWrapper>
        <ButtonWrapper
          onClick={handleSave}
          color="primary"
          sx={{ m: 1, px: 2, py: 0.4, cursor: "pointer", borderRadius: 1 }}
        >
          {isLoading ? "Saving..." : "Save"}
        </ButtonWrapper>
      </DialogActions>
    </Dialog>
  );
};

export default MediaUpdateDialog;
