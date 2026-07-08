import { ColorSchemeToggle } from "@/components/ColorSchemeToggle/ColorSchemeToggle";
import { Welcome } from "@/components/Welcome/Welcome";
import classes from "@/pages/about.module.css";
import { Title, Text } from "@mantine/core";

export function AboutPage() {
  return (
    <div className={classes["page"]}>
      <Title>
        <Text>About</Text>
      </Title>
      <Welcome />
      <ColorSchemeToggle />
    </div>
  );
}
