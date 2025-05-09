import { Collection, CollectionDetails } from "@/types/collection";
import {
  Box,
  Tooltip,
  Typography,
  styled,
  tooltipClasses,
  TooltipProps,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useMemo, useState } from "react";
import CustomTooltip from "./CustomTooltip";
import Link from "next/link";
import Iconify from "@/components/iconify";
import { NameText } from "@/components/dialog/market-card";

export const TipText = styled(Typography)`
  color: #fff;
  font-variant-numeric: lining-nums proportional-nums;
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
`;
export const LinkText = styled(Link)`
  color: #b054ff;
  font-variant-numeric: lining-nums proportional-nums;
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  text-decoration-line: underline;
  text-transform: capitalize;
  cursor: pointer;
  display: inline-block;
`;
export const DialogTitleText = styled(Typography)`
  color: #fff;
  font-family: Poppins;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
`;
export const DialogContentText = styled(Typography)`
  color: #fff;
  font-family: Poppins;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
`;

const DialogDescText = styled(DialogContentText)`
  color: #fff;
  font-family: Poppins;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 30px;
`;
const VerifiedIcon = ({
  collectionDetails,
  showTip = true,
  size = 26,
}: {
  collectionDetails?: CollectionDetails | Collection;
  showTip?: boolean;
  size?: number;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const tooltipTitle = useMemo(
    () =>
      collectionDetails?.is_verified ? (
        <TipText>
          This is a verified collection.{" "}
          <LinkText href="https://forms.gle/3J4CpVtkaKBCbHzW6" target="_blank">
            Learn more
          </LinkText>
        </TipText>
      ) : (
        <TipText>
          This is an unverified collection, please go to verify.{" "}
          <LinkText href="https://forms.gle/3J4CpVtkaKBCbHzW6" target="_blank">
            Verify Now
          </LinkText>
        </TipText>
      ),
    [collectionDetails?.is_verified],
  );

  return (
    <>
      <CustomTooltip
        title={showTip ? tooltipTitle : ""}
        arrow
        placement="right-end"
      >
        <Box sx={{ cursor: "pointer" }} onClick={handleClickOpen}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={isMobile ? size * 0.6 : size}
            height={isMobile ? size * 0.6 : size}
            viewBox="0 0 26 26"
            fill="none"
          >
            <path
              d="M25.4242 11.604C25.793 11.975 26 12.4769 26 13C26 13.5231 25.793 14.025 25.4242 14.396L22.8712 16.9483V20.8974C22.8695 21.4204 22.661 21.9214 22.2912 22.2912C21.9214 22.661 21.4204 22.8695 20.8974 22.8712H16.9483L14.396 25.4242C14.025 25.793 13.5231 26 13 26C12.4768 26 11.975 25.793 11.6039 25.4242L9.05164 22.8712H5.10333C4.58024 22.8697 4.07901 22.6613 3.70907 22.2915C3.33913 21.9216 3.13053 21.4205 3.12881 20.8974V16.9483L0.575775 14.3961C0.206992 14.025 0 13.5232 0 13C0 12.4769 0.206992 11.975 0.575775 11.604L3.12879 9.05169V5.10261C3.1305 4.57953 3.3391 4.07838 3.70904 3.70857C4.07899 3.33876 4.58022 3.13034 5.1033 3.12881H9.05164L11.604 0.575775C11.975 0.206992 12.4769 0 13 0C13.5231 0 14.025 0.206992 14.396 0.575775L16.9483 3.12879H20.8974C21.4204 3.1305 21.9214 3.339 22.2912 3.70879C22.661 4.07858 22.8695 4.57963 22.8712 5.10259V9.05164L25.4242 11.604ZM13 19.4999L18.7777 8.66675H15.8889L13 14.5759L10.1112 8.66675H7.22231L13 19.4999Z"
              fill={
                collectionDetails?.is_verified
                  ? "#B054FF"
                  : "rgba(255, 255, 255,0.6)"
              }
            />
          </svg>
        </Box>
      </CustomTooltip>
      <Dialog
        sx={{
          ".MuiDialog-container": {
            width: "100%",
            ".MuiPaper-root": {
              background: "#202025",
              width: "100%",
            },
          },
        }}
        slotProps={{
          backdrop: {
            style: {
              backgroundColor: "rgba(0, 0, 0, 0.8)",
            },
          },
        }}
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            position: "relative",
            alignItems: "center",
            zIndex: 1,
            py: { md: 2, xs: 2 },
          }}
        >
          <DialogTitleText
            sx={{
              color: "#fff",
              fontSize: { md: 20, xs: 14 },
              pl: { md: 3, xs: 3 },
            }}
          >
            What does this mean?
          </DialogTitleText>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              color: "#fff",
              borderRadius: "60px",
              border: "2px solid #555",
              mr: { md: 3, xs: 3 },
              p: 0,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M8 16L16 8"
                stroke="#F7FBFA"
                stroke-width="2"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M16 16L8 8"
                stroke="#F7FBFA"
                stroke-width="2"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </IconButton>
        </Box>
        <DialogContent sx={{ pt: 0 }}>
          {collectionDetails?.is_verified ? (
            <Box
              sx={{
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255,0.1)",
              }}
            >
              <DialogContentText
                sx={{
                  display: "flex",
                  alignItems: "center",
                  borderBottom: "1px solid rgba(255, 255, 255,0.1)",
                  padding: "20px",
                }}
              >
                <span style={{ marginRight: 10 }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="26"
                    viewBox="0 0 26 26"
                    fill="none"
                  >
                    <path
                      d="M25.4242 11.604C25.793 11.975 26 12.4769 26 13C26 13.5231 25.793 14.025 25.4242 14.396L22.8712 16.9483V20.8974C22.8695 21.4204 22.661 21.9214 22.2912 22.2912C21.9214 22.661 21.4204 22.8695 20.8974 22.8712H16.9483L14.396 25.4242C14.025 25.793 13.5231 26 13 26C12.4768 26 11.975 25.793 11.6039 25.4242L9.05164 22.8712H5.10333C4.58024 22.8697 4.07901 22.6613 3.70907 22.2915C3.33913 21.9216 3.13053 21.4205 3.12881 20.8974V16.9483L0.575775 14.3961C0.206992 14.025 0 13.5232 0 13C0 12.4769 0.206992 11.975 0.575775 11.604L3.12879 9.05169V5.10261C3.1305 4.57953 3.3391 4.07838 3.70904 3.70857C4.07899 3.33876 4.58022 3.13034 5.1033 3.12881H9.05164L11.604 0.575775C11.975 0.206992 12.4769 0 13 0C13.5231 0 14.025 0.206992 14.396 0.575775L16.9483 3.12879H20.8974C21.4204 3.1305 21.9214 3.339 22.2912 3.70879C22.661 4.07858 22.8695 4.57963 22.8712 5.10259V9.05164L25.4242 11.604ZM13 19.4999L18.7777 8.66675H15.8889L13 14.5759L10.1112 8.66675H7.22231L13 19.4999Z"
                      fill={
                        collectionDetails?.is_verified
                          ? "#B054FF"
                          : "rgba(255, 255, 255,0.6)"
                      }
                    />
                  </svg>
                </span>
                Verified Collection
              </DialogContentText>
              <DialogDescText paragraph sx={{ padding: "20px", pb: 0 }}>
                This collection belongs to a verified account and has
                significant interest or sales.{" "}
                <LinkText
                  href="https://forms.gle/3J4CpVtkaKBCbHzW6"
                  target="_blank"
                >
                  Learn More
                </LinkText>
              </DialogDescText>
            </Box>
          ) : (
            <Box
              sx={{
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255,0.1)",
              }}
            >
              <DialogContentText
                sx={{
                  display: "flex",
                  alignItems: "center",
                  borderBottom: "1px solid rgba(255, 255, 255,0.1)",
                  padding: "20px",
                }}
              >
                <span style={{ marginRight: 10 }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="26"
                    viewBox="0 0 26 26"
                    fill="none"
                  >
                    <path
                      d="M25.4242 11.604C25.793 11.975 26 12.4769 26 13C26 13.5231 25.793 14.025 25.4242 14.396L22.8712 16.9483V20.8974C22.8695 21.4204 22.661 21.9214 22.2912 22.2912C21.9214 22.661 21.4204 22.8695 20.8974 22.8712H16.9483L14.396 25.4242C14.025 25.793 13.5231 26 13 26C12.4768 26 11.975 25.793 11.6039 25.4242L9.05164 22.8712H5.10333C4.58024 22.8697 4.07901 22.6613 3.70907 22.2915C3.33913 21.9216 3.13053 21.4205 3.12881 20.8974V16.9483L0.575775 14.3961C0.206992 14.025 0 13.5232 0 13C0 12.4769 0.206992 11.975 0.575775 11.604L3.12879 9.05169V5.10261C3.1305 4.57953 3.3391 4.07838 3.70904 3.70857C4.07899 3.33876 4.58022 3.13034 5.1033 3.12881H9.05164L11.604 0.575775C11.975 0.206992 12.4769 0 13 0C13.5231 0 14.025 0.206992 14.396 0.575775L16.9483 3.12879H20.8974C21.4204 3.1305 21.9214 3.339 22.2912 3.70879C22.661 4.07858 22.8695 4.57963 22.8712 5.10259V9.05164L25.4242 11.604ZM13 19.4999L18.7777 8.66675H15.8889L13 14.5759L10.1112 8.66675H7.22231L13 19.4999Z"
                      fill={
                        collectionDetails?.is_verified
                          ? "#B054FF"
                          : "rgba(255, 255, 255,0.6)"
                      }
                    />
                  </svg>
                </span>
                Unverified Collection
              </DialogContentText>
              <DialogDescText paragraph sx={{ padding: "20px" }}>
                This collection is an unverified account. {" "}
                <LinkText
                  href="https://forms.gle/3J4CpVtkaKBCbHzW6"
                  target="_blank"
                >
                  Verify Now
                </LinkText>
              </DialogDescText>
            </Box>
          )}
          <Box
            sx={{
              borderRadius: "10px",
              border: "1px solid rgba(255, 255, 255,0.1)",
              marginTop: "20px",
            }}
          >
            <DialogContentText
              sx={{
                display: "flex",
                alignItems: "center",
                borderBottom: "1px solid rgba(255, 255, 255,0.1)",
                padding: "20px",
              }}
            >
              <span style={{ marginRight: 10 }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  fill="none"
                >
                  <path
                    d="M22.5554 14.9385H14.8764C14.2073 14.9385 13.6656 15.4722 13.6656 16.1472V23.7914C13.6656 24.4663 14.2073 25 15.0198 25H22.5554C23.2245 25 23.7662 24.4663 23.7662 23.7914V16.1472C23.7662 15.4722 23.2245 14.9385 22.5554 14.9385ZM11.1006 14.9385H3.4216C2.75247 14.9385 2.2108 15.4722 2.2108 16.1472V23.7914C2.2108 24.4663 2.87992 25 3.56498 25H11.1165C11.7857 25 12.3273 24.4663 12.3273 23.7914V16.1472C12.3114 15.4722 11.7697 14.9385 11.1006 14.9385ZM11.1006 7.96926H2.2108C1.54167 7.96926 1 8.50294 1 9.17789V12.3957C1 13.0706 1.54167 13.6043 2.2108 13.6043H11.1006C11.7697 13.6043 12.3114 13.0706 12.3114 12.3957V9.17789C12.3114 8.50294 11.7697 7.96926 11.1006 7.96926ZM16.7563 7.29431C21.472 7.29431 22.5554 4.34336 21.0738 2.20863C20.6755 1.67495 19.3213 1 18.6522 1C15.4181 1.14127 12.9965 4.07652 12.9965 4.75147C12.9805 5.552 14.733 7.29431 16.7563 7.29431ZM18.5088 2.33421C19.1779 2.33421 20.2613 2.74232 20.3887 3.54284C20.5162 5.01831 19.0345 5.81884 17.2821 5.81884C15.657 5.81884 14.8605 5.14389 14.7171 4.75147C14.733 4.6102 15.5455 2.33421 18.5088 2.33421ZM9.0773 7.29431C4.36156 7.29431 3.27821 4.34336 4.75985 2.20863C5.15814 1.67495 6.51232 1 7.18144 1C10.4155 1.14127 12.8371 4.07652 12.8371 4.75147C12.8531 5.552 11.1006 7.29431 9.0773 7.29431ZM7.32483 2.33421C6.6557 2.33421 5.57236 2.74232 5.4449 3.54284C5.30152 5.01831 6.78315 5.81884 8.53563 5.81884C10.1606 5.81884 10.9572 5.14389 11.1006 4.75147C11.1006 4.6102 10.2881 2.33421 7.32483 2.33421ZM23.7662 7.96926H14.8764C14.2073 7.96926 13.6656 8.50294 13.6656 9.17789V12.3957C13.6656 13.0706 14.2073 13.6043 14.8764 13.6043H23.7662C24.4353 13.6043 24.977 13.0706 24.977 12.3957V9.17789C25.1204 8.50294 24.5787 7.96926 23.7662 7.96926Z"
                    fill="#00B912"
                  />
                </svg>
              </span>
              {collectionDetails?.is_verified
                ? "Premium Features"
                : "Unlock Premium Features By Verification"}
            </DialogContentText>
            <DialogDescText
              paragraph
              sx={{ px: "20px", pt: "20px", lineHeight: "30px" }}
            >
              <li>1. Add social media links.</li>
              <li>
                2. Upload or change the banner on the collection profile page.
              </li>
              <li>3. Upload or change the collection logo.</li>
              <li>4. Get verification badge.</li>
            </DialogDescText>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VerifiedIcon;
