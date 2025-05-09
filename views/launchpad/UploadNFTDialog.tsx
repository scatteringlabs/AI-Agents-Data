import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  TextField,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  CircularProgress,
  InputBase,
  IconButton,
  styled,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ethers } from "ethers";
import AvatarCard from "@/components/collections/avatar-card";
import { CreatedTokenProject } from "./list/created-card-list";
import { TokenImplABI } from "@/interface/launchpad/abi/TokenImplABI";
import { toast } from "react-toastify";
import { ButtonWrapper } from "../home/BannerCard";
import Iconify from "@/components/iconify";
import Link from "next/link";
import { pollTransactionReceipt } from "@/services/launchpad/swap";
import { ChainId } from "@uniswap/sdk-core";
import CustomTooltip from "../collect/CustomTooltip";
import { TipText } from "../collect/verified-icon";
import { useWallets } from "@privy-io/react-auth";

const Text = styled(Typography)`
  font-family: Poppins;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: #fff;
`;

interface iUploadNFTDialog {
  open: boolean;
  setOpen: (b: boolean) => void;
  updateInfo?: CreatedTokenProject;
  refetch?: any;
}

const UploadNFTDialog = ({
  open,
  setOpen,
  updateInfo,
  refetch,
}: iUploadNFTDialog) => {
  const [selectedType, setSelectedType] = useState("0");
  const [baseURI, setBaseURI] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { wallets } = useWallets();
  const wallet = useMemo(() => wallets?.[0], [wallets]);
  const handleClose = () => {
    setOpen(false);
  };
  const validateBaseURI = useCallback(
    (value: string) => {
      if (!value) {
        return setError("Please input a base URI");
      }
      try {
        const url = new URL(value);
        if (selectedType !== "0" && !value.endsWith("/")) {
          setError("URL must end with a '/'");
        } else {
          setError(null);
        }
      } catch {
        setError("Invalid URL format");
      }
    },
    [setError, selectedType],
  );
  const handleSetURIParams = async () => {
    if (!updateInfo?.addr) {
      return;
    }
    // if (!window.ethereum) {
    //   setError("MetaMask is not installed!");
    //   return;
    // }
    if (!baseURI) {
      return;
    }

    const toastId = toast.loading("Base URI Updating...");
    try {
      setIsLoading(true);
      const provider = await wallet?.getEthersProvider();
      const signer = provider.getSigner();

      const tokenFactoryContract = new ethers.Contract(
        updateInfo?.addr,
        TokenImplABI,
        signer,
      );

      const tx = await tokenFactoryContract.setURIParams(
        baseURI,
        Number(selectedType),
      );
      console.log("Transaction sent:", tx);

      // Use pollTransactionReceipt to wait for transaction completion
      const receipt = await pollTransactionReceipt(tx.hash, ChainId.BASE, 1000);
      console.log("Transaction Successful:", receipt);
      setTransactionHash(receipt.transactionHash);

      if (receipt.transactionHash) {
        refetch?.();
        toast.success("Base URI Updated!");
        setOpen(false);
      }
    } catch (err) {
      const errorMessage = (err as any)?.reason || (err as Error).message;
      toast.error(errorMessage);
      // setError(errorMessage);
    } finally {
      toast.dismiss(toastId);
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    await handleSetURIParams();
  };
  const handleBaseURIChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBaseURI(value);
    validateBaseURI(value);
  };
  useEffect(() => {
    setError("");
    setBaseURI("");
    setIsLoading(false);
    setSelectedType("0");
  }, [open]);
  useEffect(() => {
    validateBaseURI(baseURI);
  }, [baseURI, selectedType, validateBaseURI]);
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { background: "#202025", p: 2 } }}
    >
      <DialogTitle
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          columnGap={2}
        >
          <AvatarCard
            logoUrl={
              updateInfo?.collection_logo
                ? `https://d2oiecgevbfxbl.cloudfront.net/images/250x250/freeze=false/https://dme30nyhp1pym.cloudfront.net/assets/${updateInfo?.collection_logo}`
                : ""
            }
            hasLogo={Boolean(updateInfo?.collection_logo)}
            symbol={updateInfo?.token_symbol || ""}
            size={80}
            mr={0}
          />
          <Box>
            <Text sx={{ fontSize: "18px", color: "white", fontWeight: "bold" }}>
              {updateInfo?.collection_name}
            </Text>
            <Text sx={{ color: "gray", fontSize: "14px" }}>
              {updateInfo?.token_symbol}
            </Text>
          </Box>
        </Box>
        <IconButton
          aria-label="close"
          onClick={() => {
            setOpen(false);
          }}
          sx={{ color: "gray", p: 0, mb: 6 }}
        >
          <Iconify
            icon="solar:close-circle-line-duotone"
            sx={{ width: "30px", height: "30px" }}
          />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <FormControl component="fieldset">
          {/* <Text sx={{ fontWeight: "bold", marginBottom: 2, fontSize: "16px" }}>
            Select your NFT type:
          </Text> */}
          <RadioGroup
            aria-label="nft-type"
            name="nft-type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <FormControlLabel
              value="0"
              control={<Radio />}
              label={
                <Text
                  sx={{
                    fontSize: "14px",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    columnGap: 1,
                  }}
                >
                  Type 1: All NFTs with the same media + No JSON file
                  <Tooltip
                    title={
                      <TipText>
                        All NFT metadata will have the same media
                        attachment(Image or Gif or Video) with no attributes,
                        suitable for membership cards.
                      </TipText>
                    }
                    arrow
                    placement="right-end"
                  >
                    <Box sx={{ mr: 0.6 }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <g opacity="0.3" clip-path="url(#clip0_6721_23956)">
                          <path
                            d="M16 8C16 6.41775 15.5308 4.87103 14.6518 3.55544C13.7727 2.23985 12.5233 1.21447 11.0615 0.608967C9.59966 0.00346625 7.99113 -0.15496 6.43928 0.153721C4.88743 0.462403 3.46197 1.22433 2.34315 2.34315C1.22433 3.46197 0.462403 4.88743 0.153721 6.43928C-0.15496 7.99113 0.00346625 9.59966 0.608967 11.0615C1.21447 12.5233 2.23985 13.7727 3.55544 14.6518C4.87103 15.5308 6.41775 16 8 16C10.1217 16 12.1566 15.1571 13.6569 13.6569C15.1571 12.1566 16 10.1217 16 8ZM5.88 6.14H4.76C4.75591 5.59085 4.83687 5.04438 5 4.52C5.1656 4.13894 5.41114 3.79791 5.72 3.52C6.04076 3.23605 6.41463 3.01852 6.82 2.88C7.1992 2.74462 7.5975 2.67036 8 2.66C8.82668 2.63587 9.63261 2.92115 10.26 3.46C10.5571 3.72515 10.7918 4.05271 10.9474 4.41923C11.103 4.78574 11.1756 5.18213 11.16 5.58C11.1629 5.95142 11.0879 6.31931 10.94 6.66C10.6799 7.11003 10.349 7.51522 9.96 7.86C9.59719 8.17706 9.26259 8.52503 8.96 8.9C8.78531 9.11141 8.65597 9.35649 8.58 9.62C8.52111 9.99772 8.52111 10.3823 8.58 10.76H7.4C7.38964 10.3103 7.42989 9.86076 7.52 9.42C7.60194 9.1219 7.71594 8.83355 7.86 8.56C8.09973 8.15349 8.39603 7.78312 8.74 7.46L9.74 6.42C9.95485 6.13385 10.0483 5.77456 10 5.42C9.9991 5.1952 9.95255 4.97291 9.86316 4.76664C9.77377 4.56036 9.64342 4.37439 9.48 4.22C9.28109 4.03806 9.04745 3.89821 8.79311 3.80884C8.53878 3.71948 8.26901 3.68246 8 3.7C6.62 3.7 5.88 4.52 5.88 6.14ZM7.36 12H8.66V13.38H7.36V12Z"
                            fill="white"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_6721_23956">
                            <rect width="16" height="16" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </Box>
                  </Tooltip>
                </Text>
              }
              sx={{ marginBottom: 2, mt: 2 }}
            />
            <FormControlLabel
              value="1"
              control={<Radio />}
              label={
                <Text
                  sx={{
                    fontSize: "14px",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    columnGap: 1,
                  }}
                >
                  Type 2: All NFTs with different media + No JSON file
                  <Tooltip
                    title={
                      <TipText>
                        The entire collection’s metadata will have different
                        media attachments (Image or Gif or Video) , but no
                        attributes in the metadata. This is suitable for PFPs,
                        art, or games, and all NFT marketplaces can not easily
                        fetch so they will not display attributes of each NFT
                        item.
                      </TipText>
                    }
                    arrow
                    placement="right-end"
                  >
                    <Box sx={{ mr: 0.6 }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <g opacity="0.3" clip-path="url(#clip0_6721_23956)">
                          <path
                            d="M16 8C16 6.41775 15.5308 4.87103 14.6518 3.55544C13.7727 2.23985 12.5233 1.21447 11.0615 0.608967C9.59966 0.00346625 7.99113 -0.15496 6.43928 0.153721C4.88743 0.462403 3.46197 1.22433 2.34315 2.34315C1.22433 3.46197 0.462403 4.88743 0.153721 6.43928C-0.15496 7.99113 0.00346625 9.59966 0.608967 11.0615C1.21447 12.5233 2.23985 13.7727 3.55544 14.6518C4.87103 15.5308 6.41775 16 8 16C10.1217 16 12.1566 15.1571 13.6569 13.6569C15.1571 12.1566 16 10.1217 16 8ZM5.88 6.14H4.76C4.75591 5.59085 4.83687 5.04438 5 4.52C5.1656 4.13894 5.41114 3.79791 5.72 3.52C6.04076 3.23605 6.41463 3.01852 6.82 2.88C7.1992 2.74462 7.5975 2.67036 8 2.66C8.82668 2.63587 9.63261 2.92115 10.26 3.46C10.5571 3.72515 10.7918 4.05271 10.9474 4.41923C11.103 4.78574 11.1756 5.18213 11.16 5.58C11.1629 5.95142 11.0879 6.31931 10.94 6.66C10.6799 7.11003 10.349 7.51522 9.96 7.86C9.59719 8.17706 9.26259 8.52503 8.96 8.9C8.78531 9.11141 8.65597 9.35649 8.58 9.62C8.52111 9.99772 8.52111 10.3823 8.58 10.76H7.4C7.38964 10.3103 7.42989 9.86076 7.52 9.42C7.60194 9.1219 7.71594 8.83355 7.86 8.56C8.09973 8.15349 8.39603 7.78312 8.74 7.46L9.74 6.42C9.95485 6.13385 10.0483 5.77456 10 5.42C9.9991 5.1952 9.95255 4.97291 9.86316 4.76664C9.77377 4.56036 9.64342 4.37439 9.48 4.22C9.28109 4.03806 9.04745 3.89821 8.79311 3.80884C8.53878 3.71948 8.26901 3.68246 8 3.7C6.62 3.7 5.88 4.52 5.88 6.14ZM7.36 12H8.66V13.38H7.36V12Z"
                            fill="white"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_6721_23956">
                            <rect width="16" height="16" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </Box>
                  </Tooltip>
                </Text>
              }
              sx={{ marginBottom: 2 }}
            />
            <FormControlLabel
              value="2"
              control={<Radio />}
              label={
                <Text
                  sx={{
                    fontSize: "14px",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    columnGap: 1,
                  }}
                >
                  Type 3: All NFTs with different media + JSON file
                  <Tooltip
                    title={
                      <TipText>
                        The entire collection’s metadata will have different
                        media attachments(Image or Gif or Video) , and there is
                        a JSON file that records all metadata, including the
                        attributes of each NFT item. This is suitable for PFPs,
                        art, or games, and all NFT marketplaces can easily fetch
                        and display attributes for each item.
                      </TipText>
                    }
                    arrow
                    placement="right-end"
                  >
                    <Box sx={{ mr: 0.6 }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <g opacity="0.3" clip-path="url(#clip0_6721_23956)">
                          <path
                            d="M16 8C16 6.41775 15.5308 4.87103 14.6518 3.55544C13.7727 2.23985 12.5233 1.21447 11.0615 0.608967C9.59966 0.00346625 7.99113 -0.15496 6.43928 0.153721C4.88743 0.462403 3.46197 1.22433 2.34315 2.34315C1.22433 3.46197 0.462403 4.88743 0.153721 6.43928C-0.15496 7.99113 0.00346625 9.59966 0.608967 11.0615C1.21447 12.5233 2.23985 13.7727 3.55544 14.6518C4.87103 15.5308 6.41775 16 8 16C10.1217 16 12.1566 15.1571 13.6569 13.6569C15.1571 12.1566 16 10.1217 16 8ZM5.88 6.14H4.76C4.75591 5.59085 4.83687 5.04438 5 4.52C5.1656 4.13894 5.41114 3.79791 5.72 3.52C6.04076 3.23605 6.41463 3.01852 6.82 2.88C7.1992 2.74462 7.5975 2.67036 8 2.66C8.82668 2.63587 9.63261 2.92115 10.26 3.46C10.5571 3.72515 10.7918 4.05271 10.9474 4.41923C11.103 4.78574 11.1756 5.18213 11.16 5.58C11.1629 5.95142 11.0879 6.31931 10.94 6.66C10.6799 7.11003 10.349 7.51522 9.96 7.86C9.59719 8.17706 9.26259 8.52503 8.96 8.9C8.78531 9.11141 8.65597 9.35649 8.58 9.62C8.52111 9.99772 8.52111 10.3823 8.58 10.76H7.4C7.38964 10.3103 7.42989 9.86076 7.52 9.42C7.60194 9.1219 7.71594 8.83355 7.86 8.56C8.09973 8.15349 8.39603 7.78312 8.74 7.46L9.74 6.42C9.95485 6.13385 10.0483 5.77456 10 5.42C9.9991 5.1952 9.95255 4.97291 9.86316 4.76664C9.77377 4.56036 9.64342 4.37439 9.48 4.22C9.28109 4.03806 9.04745 3.89821 8.79311 3.80884C8.53878 3.71948 8.26901 3.68246 8 3.7C6.62 3.7 5.88 4.52 5.88 6.14ZM7.36 12H8.66V13.38H7.36V12Z"
                            fill="white"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_6721_23956">
                            <rect width="16" height="16" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </Box>
                  </Tooltip>
                </Text>
              }
            />
          </RadioGroup>
        </FormControl>

        <Box
          sx={{
            marginTop: 2,
            marginBottom: 2,
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Text sx={{ fontWeight: "bold", fontSize: "16px", width: "100%" }}>
            Base URI
          </Text>
          <Text
            sx={{
              fontWeight: "bold",
              fontSize: "12px",
              width: "100%",
              color: "#777E90",
            }}
          >
            Ipfs or http link to your revealed metadata folder.
          </Text>
          {/* <TextField
            fullWidth
            placeholder="IPFS or HTTP link to your metadata folder"
            value={baseURI}
            onChange={(e) => setBaseURI(e.target.value)}
            margin="normal"
          /> */}
          <InputBase
            value={baseURI}
            onChange={handleBaseURIChange}
            fullWidth
            placeholder="IPFS or HTTP link to your metadata folder"
            sx={{
              fontFamily: "Poppins",
              color: "#fff",
              mt: 1,
              ".MuiInputBase-input": { color: "#fff", borderRadius: 1, pl: 2 },
              border: error ? "1px solid red" : "none",
              borderRadius: 1,
            }}
          />
          {error && (
            <Text
              color="error"
              sx={{ marginTop: 2, width: "100%", color: "red" }}
            >
              {error}
            </Text>
          )}
          <ButtonWrapper
            onClick={handleSubmit}
            color="primary"
            sx={{
              m: 1,
              px: 2,
              py: 0.4,
              cursor: "pointer",
              borderRadius: 1,
              width: "40%",
            }}
          >
            {isLoading ? "Processing..." : "Submit"}
          </ButtonWrapper>
        </Box>
        <Accordion sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Text sx={{ fontSize: "12px" }}>What is Base URI?</Text>
          </AccordionSummary>
          <AccordionDetails>
            <Text sx={{ fontSize: "12px", color: "#A8A8AA" }}>
              Base URI is the “folder” URL address of your NFT collection. Base
              URI + TokenId is the address to store your specific NFT’s metadata
              including the image and attributes. You can only use URI that
              starts with “https://”,”http://”.
            </Text>
            <Text sx={{ fontSize: "12px", color: "#A8A8AA", mt: 2 }}>
              Know more about{" "}
              <Link
                href="https://docs.opensea.io/docs/metadata-standards"
                target="_blank"
              >
                <span style={{ color: "#B054FF" }}>Base URI</span>
              </Link>
            </Text>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Text sx={{ fontSize: "12px" }}>How to Get Base URI?</Text>
          </AccordionSummary>
          <AccordionDetails>
            <Text sx={{ fontSize: "12px", marginTop: -3, color: "#A8A8AA" }}>
              Step1: design the attributes of your art 
              <br />
              Step2: Generate the whole collection’s image folder and json file
              <br />
              Step3: Upload the image folder and json file to the metadata
              storage platforms like IPFS or Arweave or AWS S3 to get the base
              URI. You could check the{" "}
              <Link
                href="https://developers.metaplex.com/storage-providers"
                target="_blank"
              >
                <span style={{ color: "#B054FF" }}>providers list here.</span>
              </Link>
            </Text>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Text sx={{ fontSize: "12px" }}>
              Are there any fast-track Base URI services offered by the
              Scattering team?
            </Text>
          </AccordionSummary>
          <AccordionDetails>
            <Text sx={{ fontSize: "12px", marginTop: -3, color: "#A8A8AA" }}>
              Yes. In order to lower down the creator barrier, the scattering
              team could help you: Generate the whole collection’s image folder
              and json file based on your designed attributes. ( $100USDT in 3
              hours) Upload your collection’s metadata to generate the base
              URI.($150USDT in 4 hours) If you are interested, please contact us
              with the telegram link:{" "}
              <Link href="https://t.me/blanklee123" target="_blank">
                <span style={{ color: "#B054FF" }}>
                  https://t.me/blanklee123
                </span>
              </Link>
            </Text>
          </AccordionDetails>
        </Accordion>

        {/* {transactionHash && (
          <Typography color="primary" sx={{ marginTop: 2 }}>
            Transaction Hash: {transactionHash}
          </Typography>
        )} */}
      </DialogContent>

      {/* <DialogActions>
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
      
      </DialogActions> */}
    </Dialog>
  );
};

export default UploadNFTDialog;
