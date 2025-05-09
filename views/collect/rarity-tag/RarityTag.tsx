import styles from "./rarity-tag.module.css";
import { IconStar } from "@/components/icons";

interface RarityTagProps {
  rarity?: string | number;
}

// 配置稀有度颜色，有顺序要求
const levelCfg = [
  { num: 10, color: "#AF54FF" },
  { num: 100, color: "#FF6838" },
  { num: 1000, color: "#00B912" },
  { num: 3000, color: "#4458da" },
];
const DEFAULT_COLOR = "#FFFFFF";

const RarityTag: React.FC<RarityTagProps> = ({ rarity }) => {
  let color = levelCfg.find((cfg) => Number(rarity) <= cfg.num)?.color;
  let isDefault = false;
  if (!color) {
    isDefault = true;
    color = DEFAULT_COLOR;
  }
  if (Number(rarity) === 0) {
    return null;
  }
  return (
    rarity !== undefined && (
      <div
        className={styles.rarityTag}
        style={{
          color,
          opacity: isDefault ? "0.6" : "1",
        }}
      >
        <span className={styles.icon}>
          <IconStar />
        </span>
        <span className={styles.rarity}>{rarity}</span>
      </div>
    )
  );
};

export default RarityTag;
