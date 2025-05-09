import { useState, ReactNode, useEffect, useMemo } from "react";
import styles from "./TextTruncate.module.css";
import { DesText } from "../text";
import { Box } from "@mui/material";

interface TruncateProps {
  text: string;
  btnDom?: ReactNode;
}

const TextTruncate = ({ text, btnDom }: TruncateProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isTruncated = useMemo<boolean>(() => text.length > 80, [text]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    if (!isTruncated) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  }, [isTruncated]);
  return (
    <Box
      className={`tw-flex ${isExpanded ? "tw-flex-col tw-items-start" : "tw-items-center"}`}
    >
      <div className={`${isExpanded ? "" : styles.oneLine} w-flex-shrink-0`}>
        <DesText className="tw-text-sm md:tw-text-base tw-text-inherit tw-opacity-60">
          {text}
        </DesText>
      </div>
      {isTruncated && (
        <span
          className="tw-text-pink1 tw-text-sm md:tw-text-base tw-cursor-pointer"
          onClick={toggleExpanded}
        >
          {isExpanded ? "Less" : "More"}
        </span>
      )}
    </Box>
  );
};

export default TextTruncate;
