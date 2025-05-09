import AvatarCard from "@/components/collections/avatar-card";
import { Box, Typography } from "@mui/material";
import { EditButton, Text } from "../create/require-text";
import { CollectionTypeColor } from "@/constants/color";
import Link from "next/link";
import { useRouter } from "next/router";

interface iDraftCard {
  id: string;
  name: string;
  symbol: string;
  logoUrl: string;
  tag: string;
}

const DraftCard = ({ name, symbol, id, logoUrl, tag }: iDraftCard) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/launchpad/edit/${id}`, undefined, { shallow: true });
  };
  return (
    <Box
      onClick={handleClick}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        background: "rgba(255,255,255,0.05)",
        px: "20px",
        py: "10px",
        alignItems: "center",
        borderRadius: "6px",
        cursor: "pointer",
        border: "1px solid transparent",
        mb: 2,
        "&:hover": {
          border: "1px solid rgba(255, 255, 255,0.1)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          columnGap: 2,
        }}
      >
        <Box
          component="img"
          src={logoUrl}
          alt={symbol}
          width={60}
          height={60}
          sx={{ borderRadius: "50%" }}
        />
        <Box>
          <Text
            sx={{ fontSize: 16, fontWeight: 600, color: "#fff", opacity: 1 }}
          >
            {name}
          </Text>
          <Text>{symbol}</Text>
        </Box>
        <Typography
          sx={{
            border: "1px solid",
            fontSize: "12px",
            padding: "4px 8px",
            borderColor: CollectionTypeColor?.[tag],
            borderRadius: "6px",
            color: CollectionTypeColor?.[tag],
          }}
        >
          {tag}
        </Typography>
      </Box>
      <EditButton sx={{ padding: "12px 14px" }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="none"
        >
          <g clip-path="url(#clip0_6828_24190)">
            <path
              d="M9.99511 10.9276L11.8873 10.0596C12.0297 9.99321 12.1479 9.88402 12.2254 9.74726L15.0226 4.90168C15.048 4.85871 15.0646 4.8111 15.0714 4.76164C15.0781 4.71218 15.075 4.66187 15.062 4.61366C15.0491 4.56544 15.0267 4.52028 14.9961 4.48084C14.9655 4.44139 14.9274 4.40844 14.8839 4.38392L12.9736 3.28093C12.9306 3.25553 12.883 3.23896 12.8335 3.2322C12.7841 3.22543 12.7338 3.2286 12.6855 3.24152C12.6373 3.25444 12.5922 3.27685 12.5527 3.30743C12.5133 3.33802 12.4803 3.37617 12.4558 3.41965L9.65095 8.27812C9.57443 8.40483 9.53846 8.55189 9.54785 8.69961L9.6699 10.7312C9.67293 10.8025 9.71538 10.8798 9.78133 10.9177C9.84729 10.9556 9.92537 10.9571 9.99511 10.9276ZM14.3957 1.55859L15.6496 2.28179C15.8237 2.38232 15.9507 2.54789 16.0027 2.74209C16.0548 2.93629 16.0275 3.1432 15.927 3.31731L15.7375 3.64556C15.6872 3.73261 15.6044 3.79613 15.5073 3.82215C15.4102 3.84817 15.3068 3.83455 15.2197 3.78429L13.3094 2.68205C13.2223 2.63179 13.1588 2.549 13.1328 2.4519C13.1068 2.3548 13.1204 2.25135 13.1707 2.16429L13.3602 1.83605C13.4607 1.66194 13.6263 1.53489 13.8205 1.48286C14.0147 1.43083 14.2216 1.45807 14.3957 1.55859Z"
              fill="white"
            />
            <path
              d="M8.54257 7.98047C8.7609 7.98047 8.97771 7.98502 9.19148 7.99336L8.94283 9.00917C8.81096 9.0055 8.67904 9.00373 8.54712 9.00386C5.49968 9.00386 3.02837 10.0121 3.02837 11.1719C3.02837 12.3318 5.49968 13.2718 8.54712 13.2718C11.5946 13.2718 14.0659 12.3318 14.0659 11.1719C14.0659 10.6777 13.6171 10.2107 12.8658 9.83774L13.4526 8.83481C14.9884 9.45946 15.9565 10.3722 15.9565 11.3918C15.9565 13.2794 12.6362 14.8031 8.54257 14.8031C4.45658 14.8031 1.13623 13.2794 1.13623 11.3918C1.13623 9.50419 4.45658 7.98047 8.54257 7.98047Z"
              fill="white"
            />
          </g>
          <defs>
            <clipPath id="clip0_6828_24190">
              <rect
                width="16"
                height="16"
                fill="white"
                transform="translate(0.700684)"
              />
            </clipPath>
          </defs>
        </svg>
        Edit Draft
      </EditButton>
    </Box>
  );
};

export default DraftCard;
