import { IconArrowLeft } from "@/components/icons";
import { Box, Button } from "@mui/material";
import styles from "./collect.module.css";
import CollectionSearch from "./CollectionSearch";
import CollectionSelect from "./CollectionSelect";

interface Props {
  onFilterClick?: () => void;
  filterIcon?: JSX.Element;
}

export default function CollectionFilter({ filterIcon, onFilterClick }: Props) {
  const selectOptions = [
    { label: "Low to High", value: 0 },
    { label: "High to Low", value: 1 },
  ];

  return (
    <Box
      className="tw-flex tw-gap-6"
      sx={{ overflowX: "scroll", scrollbarWidth: "none" }}
    >
      <Button
        className={`${styles.filterBtn} tw-p-6 tw-text-sm md:tw-text-base tw-flex-shrink-0`}
        variant="contained"
        startIcon={filterIcon || IconArrowLeft()}
        onClick={() => onFilterClick?.()}
      >
        FILTERS
      </Button>
      <CollectionSearch />
      <div className="w-flex-shrink-0">
        <CollectionSelect options={selectOptions} />
      </div>
    </Box>
  );
}
