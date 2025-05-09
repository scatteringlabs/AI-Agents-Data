import styled from "@emotion/styled";
import {
  FormControl,
  FormControlLabel,
  FormGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";
import styles from "./index.module.css";
import Checkbox from "./Checkbox";

interface CheckboxOption {
  label: string;
  checked: boolean;
}

interface CheckboxFilterProps {
  title?: string;
  isSub?: boolean;
  count?: number;
  visible?: boolean;
  options: CheckboxOption[];
  onOptionChange: (optionIndex: number, checked: boolean) => void;
}

const CheckboxFilter: React.FC<CheckboxFilterProps> = ({
  title,
  isSub,
  count,
  visible = true,
  options,
  onOptionChange,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(visible);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="artwork loadmore-12-item-1">
      <div className="widget-category-checkbox style-1">
        <Tooltip title={""}>
          <Typography
            sx={{
              cursor: "pointer",
            }}
            variant="h5"
            className={`${isVisible ? "active" : ""} ${isSub ? styles.subTitle : ""} ${isVisible ? styles.subTitleActive : ""}`}
            onClick={toggleVisibility}
          >
            <span
              style={{ display: "inline-block" }}
              className={styles.checkboxEllipsis}
            >
              {title || "-"}
            </span>
            {count && <span className={styles.count}>{count}</span>}
          </Typography>
        </Tooltip>
        {isVisible ? (
          <div className={`content-wg-category-checkbox ${styles.options}`}>
            <FormControl component="fieldset">
              <FormGroup>
                {options.map((option, index) => (
                  <FormControlLabel
                    sx={{
                      fontSize: 18,
                      color: "#fff",
                      ".MuiFormControlLabel-label": {
                        fontSize: "14px",
                      },
                    }}
                    key={index}
                    control={
                      <Checkbox
                        checked={option.checked}
                        onChange={(e) =>
                          onOptionChange(index, e.target.checked)
                        }
                      />
                    }
                    label={
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: 14,
                          color: "#fff",
                          fontFamily: "Poppins",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "140px",
                          overflow: "hidden",
                        }}
                      >
                        {option.label}
                      </Typography>
                    }
                  />
                ))}
              </FormGroup>
            </FormControl>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CheckboxFilter;
