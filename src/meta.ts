import z from "zod";

export const pages = Object.entries(
  import.meta.glob("./pages/**/*.page.tsx")
).reduce(
  (o, [filepath, load]) => {
    const name = fromFilepathToName(filepath);
    o[name] = {
      name,
      route: fromFilepathToRoute(filepath),
      load,
    };
    return o;
  },
  {} as {
    [name: string]: {
      name: string;
      route: string;
      load: () => Promise<unknown>;
    };
  }
);

export type PageName = z.infer<typeof PageName>;
export const PageName = z.enum(Array.from(Object.keys(pages)));

export function fromRouteToFilepath(route: string): string {
  if (route === "/") {
    route = "/index";
  }

  return `./pages${route}.page.tsx`;
}

export function fromFilepathToRoute(filepath: string): string {
  const name = fromFilepathToName(filepath);
  const route = name === "index" ? "/" : `/${name}`;
  return route;
}

export function fromFilepathToName(filepath: string): string {
  const name = filepath.match(
    /(?:\.\/)?(?:src\/)?pages\/(.*)\.page\.tsx$/
  )?.[1];
  if (name === undefined) {
    throw new Error(`Invalid page filepath: ${filepath}`);
  }
  return name;
}
