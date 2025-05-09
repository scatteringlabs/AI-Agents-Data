import Button from "@/components/button/Button";
import VerifiedIcon from "@/components/icons/verified-icon";
import { activeTokenIcons, tokenIcons } from "@/constants/tokens";
import { useChain } from "@/context/chain-provider";
import { CryptoAsset } from "@/services/home";
import { Box, Typography, styled } from "@mui/material";
import Link from "next/link";
import { useState } from "react";

const Title = styled(Typography)`
  color: #fff;
  font-variant-numeric: lining-nums proportional-nums;
  font-family: Poppins;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 26px; /* 130% */
  text-transform: capitalize;
  @media (max-width: 600px) {
    font-size: 16px;
  }
`;
const Desc = styled(Typography)`
  color: rgba(255, 255, 255, 0.6);
  font-variant-numeric: lining-nums proportional-nums;
  font-family: Poppins;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 166.667% */
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;
const ButtonWrapper = styled(Box)`
  border-radius: 10px;
  background: #b054ff;
  margin: 10px 16px;
  padding: 10px;
  color: #fff;
  margin-top: 0;
  font-variant-numeric: lining-nums proportional-nums;
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
  text-align: center;
`;

export interface iCustomCard {
  link?: string; // link改为可选类型
  imageUrl: string;
  title: string;
  desc: string;
  btnText?: string;
  fz?: number;
  showIcon?: boolean;
  showButton?: boolean; // 新增showButton参数
}

const CustomCard = ({
  link,
  imageUrl,
  title,
  desc,
  btnText = "Explore Collection",
  fz = 12,
  showIcon = true,
  showButton = true, // 默认值为true
}: iCustomCard) => {
  const [isHovered, setIsHovered] = useState(false);

  const CardContent = (
    <Box
      sx={{
        borderRadius: "10px",
        position: "relative",
        border: "1px solid rgba(255, 255, 255,0.3)",
        cursor: link ? "pointer" : "default", // 如果没有传递link, 则不显示指针手势
        overflow: "hidden",
        mx: { md: 1, xs: 0.4 },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box
        sx={{
          width: "100%",
          transform: isHovered ? "scale(1.2)" : "scale(1)",
          transition: "all 0.5s",
        }}
        component="img"
        src={imageUrl}
      />
      <Box
        sx={{
          background: isHovered
            ? "linear-gradient(180deg, rgba(1, 4, 16, 0.00) 0%, rgba(0, 0, 0,0.8) 50%)"
            : "linear-gradient(180deg, rgba(1, 4, 16, 0.0) 0%, rgba(0, 0, 0,1) 93%)",
          width: "100%",
          height: isHovered ? "100%" : "32.22%",
          position: "absolute",
          left: "0px",
          bottom: "0px",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "16px",
            width: "100%",
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Title sx={{ display: "flex", alignItems: "center" }}>
              {showIcon ? (
                <span style={{ marginRight: "6px" }}>
                  <VerifiedIcon size={18} />
                </span>
              ) : null}
              {title}
            </Title>
            <Box
              sx={{
                width: "100%",
              }}
            >
              <Desc
                sx={
                  isHovered
                    ? {
                        fontSize: fz,
                        color: "rgba(255, 255, 255, 1)",
                      }
                    : {
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        width: "100%",
                        maxWidth: "calc( 100% - 16px)",
                        overflow: "hidden",
                        fontSize: fz,
                        color: "rgba(255, 255, 255, 0.6)",
                      }
                }
              >
                {desc}
              </Desc>
            </Box>
          </Box>
        </Box>
        {showButton && ( // 控制是否显示按钮
          <ButtonWrapper
            sx={{
              height: isHovered ? "auto" : 0,
              padding: isHovered ? "10px 16px" : 0,
              margin: isHovered ? "10px" : 0,
              mt: 0,
              overflow: "hidden",
              transition: "all 0.5s",
            }}
          >
            {btnText}
          </ButtonWrapper>
        )}
      </Box>
    </Box>
  );

  return link ? <Link href={link}>{CardContent}</Link> : CardContent; // 如果没有传递link, 则不跳转
};

export default CustomCard;
