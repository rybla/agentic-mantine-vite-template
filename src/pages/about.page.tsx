import { ColorSchemeToggle } from "@/components/ColorSchemeToggle/ColorSchemeToggle";
import { Welcome } from "@/components/Welcome/Welcome";
import classes from "@/pages/about.module.css";

export function AboutPage() {
  return (
    <div className={classes["page"]}>
      <Welcome />
      <ColorSchemeToggle />
    </div>
  );
}
