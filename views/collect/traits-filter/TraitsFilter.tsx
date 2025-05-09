import { Box, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import CheckboxFilter from "@/components/checkbox/CheckboxFilter";
import styles from "./index.module.css";
import { useQuery } from "@tanstack/react-query";
import { getCollectionAttr } from "@/services/collections";
import { useRouter } from "next/router";
import { CollectionAttrResp } from "@/types/collection";

interface Option {
  label: string;
  checked: boolean;
}
interface OptionCfg {
  count?: number;
  label: string;
}
export interface SelectedAttr {
  label: string;
  values: string[];
}
interface TraitsFilterProps {
  visible?: boolean;
  onChange?: (attrs: SelectedAttr[]) => void;
  onClick?: () => void;
  data?: CollectionAttrResp;
}

export default function TraitsFilter({
  visible,
  onChange,
  onClick,
  data,
}: TraitsFilterProps) {
  const toggleVisibility = () => {
    onClick?.();
  };

  const [optionsGroup, setOptionsGroup] = useState<Option[][]>([]);
  const [optionsCfg, setOptionsCfg] = useState<OptionCfg[]>([]);
  useEffect(() => {
    const _optionsGroup: Option[][] = [];
    const _optionsCfg: OptionCfg[] = [];
    data?.data?.list?.forEach((group) => {
      const label = group.key?.traitType;
      const count = group.key?.traitUniqueValues;

      if (!label || label === "#") return;

      const option: Option[] = [];
      group.values?.forEach((item) => {
        if (!item.value) return;
        option.push({
          label: item.value,
          checked: false,
        });
      });
      _optionsCfg.push({
        count,
        label: label.replace(/^\S/, ($0) => $0.toUpperCase()),
      });
      _optionsGroup.push(option);
    });
    setOptionsGroup(_optionsGroup);
    setOptionsCfg(_optionsCfg);
  }, [data]);

  const getSelectedAttrs = (
    _optionsCfg: OptionCfg[],
    _optionsGroup: Option[][],
  ) => {
    const _selectedAttrs: SelectedAttr[] = [];
    _optionsCfg.forEach((group, idx) => {
      const label = group.label;
      const options = _optionsGroup[idx];
      const values = options
        .filter((option) => option.checked)
        .map((item) => item.label);
      values.length && _selectedAttrs.push({ label, values });
    });
    return _selectedAttrs;
  };

  const handleOptionChange = useCallback(
    (groupIndex: number, optionIndex: number, checked: boolean) => {
      const options = optionsGroup[groupIndex];
      const newOptions = options.map((option, index) =>
        index === optionIndex ? { ...option, checked: checked } : option,
      );
      const _optionsGroup = [...optionsGroup];
      _optionsGroup[groupIndex] = newOptions;
      setOptionsGroup(_optionsGroup);
      onChange?.(getSelectedAttrs(optionsCfg, _optionsGroup));
    },
    [optionsGroup, onChange, optionsCfg],
  );
  if (!optionsCfg?.length) {
    return null;
  }
  return (
    <Box
      sx={{ mt: "0 !important" }}
      className={`artwork loadmore-12-item-1 ${styles.wrapper}`}
    >
      <Box className="widget-category-checkbox style-1 mb-30">
        <Typography
          sx={{ cursor: "pointer" }}
          variant="h5"
          className={visible ? "active" : ""}
          onClick={toggleVisibility}
        >
          TRAITS
        </Typography>
        {visible && (
          <Box className={styles.options}>
            {optionsCfg?.map((group, idx) => (
              <CheckboxFilter
                key={idx}
                title={group.label}
                isSub={true}
                count={group.count}
                options={optionsGroup[idx]}
                onOptionChange={(optionIndex: number, checked: boolean) =>
                  handleOptionChange(idx, optionIndex, checked)
                }
                visible={Boolean(
                  optionsGroup[idx].find((item) => item.checked),
                )}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
