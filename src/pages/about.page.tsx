import { ColorSchemeToggle } from "@/components/ColorSchemeToggle/ColorSchemeToggle";
import { Welcome } from "@/components/Welcome/Welcome";
import classes from "@/page/About.module.css";

export function AboutPage() {
  return (
    <div className={classes["page"]}>
      <Welcome />
      <ColorSchemeToggle />
    </div>
  );
}
