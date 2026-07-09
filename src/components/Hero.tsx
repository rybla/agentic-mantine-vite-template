import classes from "@/components/Hero.module.css";
import type { ReactNode } from "react";

export function Hero(props: { title: ReactNode; subtitle: ReactNode }) {
  return (
    <section className={classes["hero"]}>
      <h1 className={classes["title"]}>{props.title}</h1>
      <div className={classes["heroSubtitle"]}>
        <span>{props.subtitle}</span>
      </div>
    </section>
  );
}
