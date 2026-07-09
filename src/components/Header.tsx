import classes from "@/components/Header.module.css";
import { Link } from "react-router-dom";
import packageInfo from "@/package.json";
import { PageName, pages } from "@/meta";

export function Header(props: { name: PageName }) {
  PageName.parse(props.name);

  return (
    <header className={classes["header"]}>
      <div className={classes["brand"]}>
        <span>{packageInfo.name}</span>
      </div>
      <nav className={classes["nav"]}>
        <PageLink source={props.name} target="index" />
        <PageLink source={props.name} target="about" />
      </nav>
    </header>
  );
}

function PageLink(props: { source: PageName; target: PageName }) {
  PageName.parse(props.source);
  PageName.parse(props.target);

  return (
    <Link to={pages[props.target]!.route} className={classes["navLink"]}>
      [ {props.target} ]
    </Link>
  );
}
// ${classes["activeNavLinkAbout"]}
