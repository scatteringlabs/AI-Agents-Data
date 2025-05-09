import { Box, Typography, styled } from "@mui/material";
import Link from "next/link";

export const Title = styled(Typography)`
  color: #fff;
  font-family: Poppins;
  font-size: 32px;
  font-style: normal;
  font-weight: 700;
  line-height: 132%;
  text-transform: uppercase;
`;
export const ShareButton = styled(Box)`
  border-radius: 32px;
  border: 1px solid #b054ff;
  color: #b054ff;
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  padding: 2px 20px 2px 12px;
  margin-right: 10px;
  cursor: pointer;
`;

export const SecTitle = styled(Typography)`
  font-family: Poppins;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 132%;
  text-transform: capitalize;
`;

export const DesText = styled(Box)`
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 156%;
  /* display: inline-block; */
`;
export const DesBoldText = styled(Typography)`
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 156%;
`;
export const WarnText = styled(Typography)`
  color: rgb(255, 255, 255, 0.6);
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

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
