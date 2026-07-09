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

// export const pageImports = Object.entries(
//   import.meta.glob("./pages/**/*.page.tsx")
// ).reduce(
//   (o, [filepath, import_]) => {
//     const route = fromFilepathToRoute(filepath);
//     if (route === undefined) {
//       throw new Error(`Invalid page filepath: ${filepath}`);
//     }
//     o[route] = import_;
//     return o;
//   },
//   {} as { [route: string]: () => Promise<unknown> }
// );

// // import.meta.glob automatically creates lazy-loading import functions
// // for all files matching the pattern, triggering automatic code-splitting.
// export const pageRoutes = Object.keys(pageImports).flatMap((filepath) => {
//   const route = fromFilepathToRoute(filepath);
//   if (route === undefined) {
//     return [];
//   }

//   return route;
// });

export function fromRouteToFilepath(route: string): string {
  if (route === "/") {
    route = "/index";
  }

  return `./pages${route}.page.tsx`;
}

export function fromFilepathToRoute(filepath: string): string {
  const name = fromFilepathToName(filepath);
  const route = name === "/index" ? "/" : `/${name}`;
  return route;
}

export function fromFilepathToName(filepath: string): string {
  // (?:.\/)?(?:src\/)?
  const name = filepath;
  if (name === undefined) {
    throw new Error(`Invalid page filepath: ${filepath}`);
  }
  return name;
}
