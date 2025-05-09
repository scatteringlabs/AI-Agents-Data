import styles from "./index.module.css";
import { IconSweep } from "@/components/icons";
import Switch from "@/components/switch/Switch";

export default function CollectionFooter() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <IconSweep />
        <span>Sweep</span>
        <Switch />
      </div>
      <div></div>
    </div>
  );
}
