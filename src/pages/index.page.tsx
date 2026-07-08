import { ColorSchemeToggle } from "@/components/ColorSchemeToggle/ColorSchemeToggle";
import { Welcome } from "@/components/Welcome/Welcome";
import classes from "@/page/Index.module.css";

export function IndexPage() {
  return (
    <div className={classes["page"]}>
      <Welcome />
      <ColorSchemeToggle />
    </div>
  );
}
