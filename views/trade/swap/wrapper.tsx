import { Box, Stack, styled, Typography } from "@mui/material";

export const InputWrapper = styled(Stack)`
  background: rgba(87, 87, 87, 0.1);

  margin-bottom: 10px;
  border-radius: 10px;
`;
export const ButtonWrapper = styled(Box)`
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
  padding: 20px;
  margin-top: 30px;
  margin-bottom: 0px;
  cursor: pointer;
  font-weight: bold;
`;
export const TextWrapper = styled(Typography)`
  color: #fff;
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;
