import { Box, Button, styled, TextField, Typography } from "@mui/material";

export const LabelText = styled(Typography)`
  color: #fff;
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 40px; /* 85.714% */
  text-transform: capitalize;
`;
export const PreviewTitle = styled(Typography)`
  color: #fff;

  text-align: left;
  font-family: Poppins;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  text-transform: capitalize;
`;
export const PreviewDesc = styled(Typography)`
  opacity: 0.8;
  color: #fff;
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 300;
  line-height: 160%;
  letter-spacing: 0.56px;
  text-transform: lowercase;
`;

const RequireText = ({ text }: { text: string }) => {
  return (
    <LabelText
      sx={{
        color: "#FFF",
        display: "flex",
        alignItems: "center",
        columnGap: 0.6,
      }}
    >
      {text}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="5"
        height="6"
        viewBox="0 0 5 6"
        fill="none"
      >
        <path
          d="M4.49036 1.35562L4.98623 2.2246L3.07163 3L5 3.76203L4.47658 4.65775L2.80992 3.48128L3.0303 5.5H1.99725L2.20386 3.48128L0.53719 4.67112L0 3.76203L1.9146 2.98663L0 2.23797L0.509642 1.34225L2.21763 2.53209L1.99725 0.5H3.04408L2.80992 2.53209L4.49036 1.35562Z"
          fill="#DC2626"
        />
      </svg>
    </LabelText>
  );
};

export const TitleText = styled(Typography)`
  color: #fff;
  font-family: Poppins;
  font-size: 32px;
  font-style: normal;
  font-weight: 700;
  line-height: 56px; /* 175% */
  letter-spacing: -0.64px;
`;

export const SymbolText = styled(Typography)`
  color: #fff;
  font-variant-numeric: lining-nums proportional-nums;
  font-family: Poppins;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 26px; /* 144.444% */
  text-transform: uppercase;
`;
export const NameText = styled(Typography)`
  color: var(--White-Clear-White, #fff);
  font-variant-numeric: lining-nums proportional-nums;
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 132%; /* 18.48px */
  // text-transform: uppercase;
  opacity: 0.6;
`;

export const DesText = styled(Typography)`
  color: var(--White-Clear-White, #fff);
  font-variant-numeric: lining-nums proportional-nums;
  font-feature-settings:
    "liga" off,
    "clig" off;
  font-family: Poppins;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 200% */
  text-transform: capitalize;
  opacity: 0.6;

  /* 强制显示两行文本 */
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 限制显示两行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  /* 保证至少显示两行的高度 */
  min-height: 40px; /* 两行的高度，20px * 2 */
`;

export const PriceText = styled(Typography)`
  color: #00b912;
  font-family: Poppins;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 120%; /* 14.4px */
  text-transform: uppercase;
`;

export const TimeText = styled(Typography)`
  color: #fff;
  font-family: Poppins;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 120%; /* 14.4px */
  text-transform: lowercase;
  opacity: 0.6;
`;
export const Text = styled(Typography)`
  color: #fff;

  font-variant-numeric: lining-nums proportional-nums;
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 26px; /* 185.714% */
  text-transform: capitalize;
  opacity: 0.6;
`;

export const ButtonWrapper = styled(Button)`
  background: #af54ff;
  border-radius: 40px;
  text-align: center;
  color: #fff;
  font-family: Poppins;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  /* text-transform: capitalize; */
  padding: 10px;
  margin-bottom: 0px;
  cursor: pointer;
  font-weight: bold;
  max-width: 300px;
  &:hover {
    background: #9b49e8;
    color: #eaeaea;
    transition: all 0.3s ease;
  }
`;

export const CustomTextField = styled(TextField)(({ theme }) => ({
  borderRadius: "4px",
  backgroundColor: "rgba(255, 255, 255, 0.00)",
  "& .MuiInputBase-root": {
    backgroundColor: "rgba(255, 255, 255, 0.00)",
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: "4px",
    backgroundColor: "rgba(255, 255, 255, 0.00)",
    "& .MuiInputBase-input": {
      borderRadius: "4px",
      backgroundColor: "rgba(255, 255, 255, 0.00)",
    },
    "& textarea": {
      color: "#FFF",
      borderRadius: "4px",
      backgroundColor: "rgba(255, 255, 255, 0.00)",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
      backgroundColor: "rgba(255, 255, 255, 0.00)",
      // backgroundColor: "rgba(255, 255, 255, 0.05)",
      borderRadius: "4px",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#FFF",
    // backgroundColor: "#19152b",
    border: "none",
    fontSize: "12px",
    fontFamily: "Poppins",
    borderRadius: "4px",
  },
}));

export default RequireText;

export const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  color: "#fff",
  borderRadius: theme.shape.borderRadius,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

export const DisplayLabel = styled(Typography)`
  color: #fff;
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 12px; /* 85.714% */
  text-transform: capitalize;
`;

export const DisplayValue = styled(Typography)`
  color: #fff;
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 12px; /* 85.714% */
  text-transform: capitalize;
  text-align: right;
`;

export const EditButton = styled(Box)`
  color: #fff;
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 12px; /* 85.714% */
  text-transform: capitalize;
  text-align: right;
  background: #b054ff;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  column-gap: 4px;
`;
