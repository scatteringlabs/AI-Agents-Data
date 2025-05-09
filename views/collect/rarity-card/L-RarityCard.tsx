import styles from "./rarity-card.module.css";
import numeral from "numeral";
import { Box, Typography } from "@mui/material";

interface TraitItem {
  percentage?: number;
  label?: string;
  value?: string;
  type?: number;
}

interface RarityCardProps {
  address?: string;
  tokenId?: string;
  chainId?: string | number;
  type: "popover" | "normal";
  traits?: any[];
}

export default function RarityCard({ type, traits }: RarityCardProps) {
  const isPopover = type === "popover";

  const _traits: TraitItem[] | undefined = traits;

  return (
    <Box
      className={`product-item traits ${styles.cardWrapper} ${isPopover ? styles.popover : ""}`}
    >
      <div>
        <div
          className={`content ${styles.content}`}
          style={{ fontFamily: "Poppins" }}
        >
          {_traits?.map((item, idx) => (
            <Box
              className="trait-item"
              key={idx}
              sx={{
                p: { md: "12px !important", xs: "8px !important" },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontSize: { md: "14px !important", xs: "10px !important" },
                }}
              >
                {item.label}
              </Typography>
              <div className={`title ${styles.trailItemTitle}`}>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: {
                      md: "16px !important",
                      xs: "12px !important",
                    },
                  }}
                >
                  {item.value}
                </Typography>
              </div>
              <Typography
                variant="body2"
                sx={{
                  fontSize: { md: "14px !important", xs: "10px !important" },
                }}
              >
                {numeral(item.percentage).format("0.00%")} have this trait
              </Typography>
            </Box>
          ))}
        </div>
      </div>
    </Box>
  );
}
