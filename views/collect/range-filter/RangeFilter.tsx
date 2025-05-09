import { Typography } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import styles from "./index.module.css";
import Button from "@/components/button/Button";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { getCollectionsDetails } from "@/services/collections";

interface RangeFilterProps {
  visible?: boolean;
  onSubmit?: (down: number, top: number) => void;
  onClick?: () => void;
  collectionAddress: string;
  chainId: number;
  totalSupply: number;
}

export default function RangeFilter({
  visible,
  onSubmit,
  onClick,
  collectionAddress,
  chainId,
  totalSupply,
}: RangeFilterProps) {
  const defaultLow = 1;

  const toggleVisibility = () => {
    onClick?.();
  };

  const filterNumber = (val?: string) => {
    return val?.replace(/\D/g, "");
  };

  const [low, setLow] = useState<number>();
  const handleLowInput = useCallback((e: any) => {
    const val = filterNumber(e.target.value);
    setLow(Number(val));
  }, []);

  const [high, setHigh] = useState<number>();
  const handleHighInput = useCallback((e: any) => {
    const val = filterNumber(e.target.value);
    setHigh(Number(val));
  }, []);

  const getSubmitData = useCallback(() => {
    const _low = low === undefined ? defaultLow : low;
    const _high = high === undefined ? totalSupply : high;
    return { low: _low, high: _high };
  }, [low, high, defaultLow, totalSupply]);

  const canSubmit = useMemo(() => {
    const { low: _low, high: _high } = getSubmitData();
    return Boolean(_low && _high && _high <= totalSupply && _low < _high);
  }, [getSubmitData, totalSupply]);

  const handleClick = useCallback(() => {
    const { low: _low, high: _high } = getSubmitData();
    if (!canSubmit || !_high) return;
    onSubmit?.(_low, _high);
  }, [onSubmit, canSubmit, getSubmitData]);

  return (
    <div className={`artwork loadmore-12-item-1 ${styles.wrapper}`}>
      <div className="widget-category-checkbox style-1">
        <Typography
          sx={{ cursor: "pointer" }}
          variant="h5"
          className={visible ? "active" : ""}
          onClick={toggleVisibility}
        >
          RARITY
        </Typography>
        {visible && (
          <div className={styles.rangeSearch}>
            <div className={styles.rangeInput}>
              <input
                type="text"
                aria-required="true"
                required
                value={low}
                className={styles.input}
                inputMode="decimal"
                placeholder={defaultLow.toString()}
                onInput={handleLowInput}
              />
              <span className={styles.text}>to</span>
              <input
                type="text"
                aria-required="true"
                required
                value={high}
                className={styles.input}
                placeholder={totalSupply?.toString()}
                onInput={handleHighInput}
              />
            </div>
            <Button
              variant="contained"
              disabled={!canSubmit}
              onClick={handleClick}
            >
              APPLY
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
