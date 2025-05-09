import CheckboxFilter from "@/components/checkbox/CheckboxFilter";
import { useCallback, useState } from "react";
import RangeFilter from "../range-filter/RangeFilter";
import TraitsFilter from "../traits-filter/TraitsFilter";
import MDivider, { DividerProps } from "@mui/material/Divider";
import styled from "@emotion/styled";
import styles from "./index.module.css";
import { SelectedAttr } from "../traits-filter/TraitsFilter";
import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { getCollectionAttr } from "@/services/collections";
import { CollectionAttrResp } from "@/types/collection";

export interface Filters {
  rarityDown?: number;
  rarityTop?: number;
  attrs?: SelectedAttr[];
}

interface FilterPanelProps {
  onChange?: (filters: Filters) => void;
  data?: CollectionAttrResp;
  collectionAddress: string;
  chainId: number;
  totalSupply: number;
  showRankFilter?: boolean;
}

const Divider = styled(MDivider)<DividerProps>({
  borderColor: "rgba(255, 255, 255, 0.08)",
});

export default function FilterPanel({
  onChange,
  data,
  collectionAddress,
  chainId,
  totalSupply,
  showRankFilter = true,
}: FilterPanelProps) {
  const [statusOptions, setStatusOptions] = useState([
    { label: "SHOW ALLl", checked: false },
    { label: "ONLY BUY NOW", checked: false },
  ]);
  const statusOptionChange = useCallback(
    (optionIndex: number, checked: boolean) => {
      const newOptions = statusOptions.map((option, index) =>
        index === optionIndex
          ? { ...option, checked: checked }
          : { ...option, checked: false },
      );
      setStatusOptions(newOptions);
    },
    [statusOptions],
  );

  const [active, setActive] = useState({
    range: false,
    trait: true,
  });

  const [rarityRange, setRarityRange] = useState({ down: 0, top: 0 });
  const [attrs, setAttrs] = useState<SelectedAttr[]>([]);

  const traitsChange = useCallback(
    (selectedAttrs: SelectedAttr[]) => {
      const _filter: Filters = { attrs: selectedAttrs };
      if (active.range) {
        _filter.rarityDown = rarityRange.down;
        _filter.rarityTop = rarityRange.top;
      }
      onChange?.(_filter);
      setAttrs(selectedAttrs);
    },
    [active.range, onChange, rarityRange.down, rarityRange.top],
  );

  const rangeChange = useCallback(
    (down: number, top: number) => {
      const _filter: Filters = { rarityDown: down, rarityTop: top };
      if (active.trait) {
        _filter.attrs = attrs;
      }
      onChange?.(_filter);
      setRarityRange({ down, top });
    },
    [active.trait, attrs, onChange],
  );

  if (!data?.data?.list?.length) {
    return null;
  }

  return (
    <Box
      sx={{
        maxHeight: "calc(100vh - 300px)",
        overflowY: "scroll",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {/* <div className={styles.statusWrapper}>
        <CheckboxFilter
          title="STATUS"
          options={statusOptions}
          onOptionChange={statusOptionChange}
        />
      </div>
      <Divider /> */}
      {showRankFilter ? (
        <>
          <RangeFilter
            collectionAddress={collectionAddress}
            chainId={chainId}
            visible={active.range}
            onSubmit={rangeChange}
            onClick={() => setActive({ range: !active.range, trait: false })}
            totalSupply={totalSupply}
          />
          <Divider />
        </>
      ) : null}
      <TraitsFilter
        data={data}
        visible={active.trait}
        onChange={traitsChange}
        onClick={() => setActive({ range: false, trait: !active.trait })}
      />
    </Box>
  );
}
