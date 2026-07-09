import classes from "@/components/Footer.module.css";
import { useMantineColorScheme } from "@mantine/core";

export function Footer() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <footer className={classes["footer"]}>
      <span>STYLING ENGINE: NEO_BRUTALIST_v2.6</span>
      <button
        type="button"
        className={classes["colorToggle"]}
        onClick={() => toggleColorScheme()}
      >
        THEME: {colorScheme.toUpperCase()}
      </button>
    </footer>
  );
}
