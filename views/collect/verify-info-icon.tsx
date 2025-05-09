import AvatarCard from "@/components/collections/avatar-card";
import { SecTitle, Title } from "@/components/text";
import { CollectionDetails } from "@/types/collection";
import { getTokenLogoURL } from "@/utils/token";
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import MediaLink from "./media-link";

export const TextLabel = styled(Typography)`
  color: #b054ff;
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 132%; /* 18.48px */
  text-transform: capitalize;
  border-radius: 10px;
  border: 1px solid rgba(176, 84, 255, 0.6);
  padding: 8px 16px;
  display: inline-block;
  cursor: pointer;
`;
const ButtonWrapper = styled(Box)`
  border-radius: 10px;
  background: #b054ff;
  cursor: pointer;
  color: #fff;
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 132%;
  text-transform: capitalize;
  display: flex;
  align-items: center;
  width: 200px;
  height: 48px;
  justify-content: center;
  margin: 0 auto;
  margin-top: 20px;
`;
export const TextDesc = styled(Typography)`
  color: #fff;
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 132%; /* 18.48px */
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;
export const TextLogo = styled(TextLabel)`
  color: #b054ff;
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  text-transform: capitalize;
  border-radius: 10px;
  border: 1px solid rgba(176, 84, 255, 0.6);
  display: inline-flex;
  align-items: center;
  width: 100%;
  justify-content: center;
`;

const VerifyInfoIcon = ({
  collectionDetails,
}: {
  collectionDetails?: CollectionDetails;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [open, setOpen] = useState<boolean>(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Box>
      <Box
        sx={{ ml: { md: 1, xs: 0 }, cursor: "pointer" }}
        onClick={handleClickOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={isMobile ? "18" : "28"}
          height={isMobile ? "18" : "28"}
          viewBox="0 0 28 28"
          fill="none"
        >
          <g clip-path="url(#clip0_3529_14767)">
            <path
              d="M13.9941 0.78125C6.70011 0.78125 0.787109 6.69423 0.787109 13.9882C0.787109 21.2821 6.70009 27.1951 13.9941 27.1951C21.288 27.1951 27.201 21.2821 27.201 13.9882C27.201 6.69423 21.288 0.78125 13.9941 0.78125ZM13.9941 25.3415C7.72378 25.3415 2.64071 20.2584 2.64071 13.9881C2.64071 7.71784 7.72378 2.63483 13.9941 2.63483C20.2643 2.63483 25.3474 7.7179 25.3474 13.9882C25.3474 20.2585 20.2643 25.3415 13.9941 25.3415Z"
              fill="#B054FF"
            />
            <path
              d="M12.3733 13.7579C12.3733 14.2495 12.5686 14.721 12.9162 15.0686C13.2638 15.4162 13.7353 15.6115 14.2269 15.6115C14.7185 15.6115 15.19 15.4162 15.5376 15.0686C15.8852 14.721 16.0805 14.2495 16.0805 13.7579C16.0805 13.5145 16.0326 13.2734 15.9394 13.0486C15.8463 12.8237 15.7097 12.6193 15.5376 12.4472C15.3655 12.2751 15.1612 12.1385 14.9363 12.0454C14.7114 11.9522 14.4703 11.9043 14.2269 11.9043C13.9835 11.9043 13.7425 11.9522 13.5176 12.0454C13.2927 12.1385 13.0883 12.2751 12.9162 12.4472C12.7441 12.6193 12.6076 12.8237 12.5144 13.0486C12.4213 13.2734 12.3733 13.5145 12.3733 13.7579ZM6.8125 13.7579C6.8125 14.2495 7.00779 14.721 7.35541 15.0686C7.70303 15.4162 8.1745 15.6115 8.66611 15.6115C9.15771 15.6115 9.62918 15.4162 9.9768 15.0686C10.3244 14.721 10.5197 14.2495 10.5197 13.7579C10.5197 13.2663 10.3244 12.7948 9.9768 12.4472C9.62918 12.0996 9.15771 11.9043 8.66611 11.9043C8.1745 11.9043 7.70303 12.0996 7.35541 12.4472C7.00779 12.7948 6.8125 13.2663 6.8125 13.7579ZM17.9341 13.7579C17.9341 14.2495 18.1294 14.721 18.477 15.0686C18.8246 15.4162 19.2961 15.6115 19.7877 15.6115C20.2793 15.6115 20.7508 15.4162 21.0984 15.0686C21.4461 14.721 21.6413 14.2495 21.6413 13.7579C21.6413 13.2663 21.4461 12.7948 21.0984 12.4472C20.7508 12.0996 20.2793 11.9043 19.7877 11.9043C19.2961 11.9043 18.8247 12.0996 18.477 12.4472C18.1294 12.7948 17.9341 13.2663 17.9341 13.7579H17.9341Z"
              fill="#B054FF"
            />
          </g>
          <defs>
            <clipPath id="clip0_3529_14767">
              <rect
                width="28"
                height="28"
                fill={
                  collectionDetails?.tiktok_url
                    ? "#B054FF"
                    : "rgba(255, 255, 255,0.6)"
                }
              />
            </clipPath>
          </defs>
        </svg>
      </Box>
      <Dialog
        sx={{
          ".MuiDialog-container": {
            width: "100%",
            ".MuiPaper-root": {
              background: "#202025",
              width: "100%",
              padding: { md: "30px", xs: "10px" },
              minWidth: { md: "986px", xs: "100vw" },
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
            alignItems: "flex-start",
            zIndex: 1,
          }}
        >
          <Stack flexDirection="row" alignItems="center">
            <AvatarCard
              hasLogo={!!collectionDetails?.logo_url}
              // logoUrl={getTokenLogoURL({
              //   chainId: collectionDetails?.chain_id,
              //   address: collectionDetails?.erc20_address,
              // })}
              logoUrl={collectionDetails?.logo_url || ""}
              chainId={collectionDetails?.chain_id}
              symbol={collectionDetails?.symbol || "#"}
              size={80}
              showChain={false}
              mr={0}
            />
            <Stack>
              <Stack flexDirection="row" alignItems="center" sx={{ ml: 2 }}>
                <Title sx={{ fontSize: { md: 32, xs: 16 } }}>
                  {collectionDetails?.symbol}
                </Title>
                <Link
                  href="https://forms.gle/3J4CpVtkaKBCbHzW6"
                  target="_blank"
                >
                  <TextLabel sx={{ ml: 2, fontSize: { md: 14, xs: 12 } }}>
                    Upload logo
                  </TextLabel>
                </Link>
              </Stack>
              <SecTitle sx={{ ml: 2, fontSize: { md: 16, xs: 14 } }}>
                {collectionDetails?.name}
              </SecTitle>
            </Stack>
          </Stack>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              color: "#fff",
              borderRadius: "60px",
              border: "2px solid #555",
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
        <DialogContent sx={{ px: 0, pb: 0 }}>
          <MediaLink collectionDetails={collectionDetails} />
          <TextDesc sx={{ fontSize: { md: 14, xs: 12 } }}>
            After you upload the info, your project will be verified
            <span style={{ marginLeft: "6px" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  d="M17.6014 8.03352C17.8567 8.29038 18 8.63784 18 9C18 9.36217 17.8567 9.70962 17.6014 9.96648L15.8339 11.7335V14.4674C15.8327 14.8295 15.6884 15.1764 15.4324 15.4324C15.1764 15.6884 14.8295 15.8327 14.4674 15.8339H11.7334L9.96647 17.6014C9.7096 17.8567 9.36215 18 8.99998 18C8.63782 18 8.29037 17.8567 8.0335 17.6014L6.26652 15.8339H3.53307C3.17094 15.8329 2.82393 15.6886 2.56782 15.4325C2.3117 15.1765 2.16729 14.8296 2.1661 14.4674V11.7334L0.398614 9.9665C0.143302 9.70963 0 9.36218 0 9.00002C0 8.63785 0.143302 8.2904 0.398614 8.03354L2.16608 6.26656V3.53258C2.16727 3.17045 2.31169 2.82349 2.5678 2.56747C2.82391 2.31145 3.17092 2.16716 3.53305 2.1661H6.26652L8.03352 0.398614C8.29038 0.143302 8.63784 0 9 0C9.36217 0 9.70962 0.143302 9.96648 0.398614L11.7335 2.16608H14.4674C14.8295 2.16727 15.1764 2.31162 15.4324 2.56763C15.6884 2.82363 15.8327 3.17051 15.8339 3.53256V6.26652L17.6014 8.03352ZM9.00001 13.4999L12.9999 6.00006H11L9.00001 10.091L7.00004 6.00006H5.00006L9.00001 13.4999Z"
                  fill="#B054FF"
                />
              </svg>
            </span>
          </TextDesc>
          <Link href="https://forms.gle/3J4CpVtkaKBCbHzW6" target="_blank">
            <ButtonWrapper>
              <span style={{ marginRight: "6px" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M5.38232 15.2734C5.21631 15.2734 5.05811 15.207 4.94092 15.0898L2.24561 12.3945C2.00146 12.1504 2.00146 11.7539 2.24561 11.5098L10.0308 3.72461C10.2046 3.55078 10.6851 3.14844 11.4214 3.14844C11.9468 3.14844 12.4409 3.35352 12.812 3.72461L13.6108 4.52344C14.3765 5.28906 14.3765 6.53711 13.6108 7.30469L12.7729 8.14453C10.5112 10.4043 8.17334 12.7402 5.82373 15.0898C5.70654 15.207 5.54834 15.2734 5.38232 15.2734ZM3.57178 11.9531L5.38232 13.7637C7.5835 11.5625 9.771 9.37695 11.8901 7.25977L12.728 6.42187C13.0073 6.14258 13.0073 5.68555 12.728 5.4082L11.9292 4.60938C11.7944 4.47461 11.6147 4.40039 11.4214 4.40039C11.1382 4.40039 10.9487 4.57422 10.9136 4.60938L3.57178 11.9531Z"
                    fill="white"
                  />
                  <path
                    d="M1.88898 16.0718C1.72492 16.0718 1.56476 16.0073 1.44757 15.8882C1.28937 15.73 1.22882 15.4995 1.28547 15.2847L2.21515 11.8179C2.27375 11.6031 2.44172 11.4331 2.65656 11.3765C2.8714 11.3179 3.10187 11.3804 3.26007 11.5386L5.79914 14.0757C5.95734 14.2339 6.01789 14.4644 5.96125 14.6792C5.90265 14.8941 5.73468 15.064 5.51984 15.1206L2.05109 16.0503C1.9964 16.064 1.94367 16.0718 1.88898 16.0718ZM3.14289 13.187L2.77375 14.562L4.1507 14.1929L3.14289 13.187ZM11.8597 8.18704C11.6976 8.18704 11.5355 8.12454 11.4144 7.99954L9.04523 5.58743C8.80304 5.34134 8.80695 4.94485 9.05304 4.70266C9.29914 4.46048 9.69562 4.46438 9.93781 4.71048L12.305 7.12454C12.5472 7.37063 12.5433 7.76712 12.2972 8.0093C12.1761 8.12649 12.0179 8.18704 11.8597 8.18704ZM18.0257 15.8843H7.85382C7.50812 15.8843 7.22882 15.605 7.22882 15.2593C7.22882 14.9136 7.50812 14.6343 7.85382 14.6343H18.0257C18.3714 14.6343 18.6507 14.9136 18.6507 15.2593C18.6507 15.605 18.3714 15.8843 18.0257 15.8843Z"
                    fill="white"
                  />
                  <path
                    d="M18.0254 13.2285H11.7109C11.3652 13.2285 11.0859 12.9492 11.0859 12.6035C11.0859 12.2578 11.3652 11.9785 11.7109 11.9785H18.0254C18.3711 11.9785 18.6504 12.2578 18.6504 12.6035C18.6504 12.9492 18.3711 13.2285 18.0254 13.2285Z"
                    fill="white"
                  />
                  <path
                    d="M18.0059 10.6211H14.1719C13.8262 10.6211 13.5469 10.3418 13.5469 9.99609C13.5469 9.65039 13.8262 9.37109 14.1719 9.37109H18.0059C18.3516 9.37109 18.6309 9.65039 18.6309 9.99609C18.6309 10.3418 18.3516 10.6211 18.0059 10.6211Z"
                    fill="white"
                  />
                </svg>
              </span>
              Upload info
            </ButtonWrapper>
          </Link>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default VerifyInfoIcon;
