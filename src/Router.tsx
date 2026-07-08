/* eslint-disable @eslint-react/static-components -- generate routes at bundle-time */

import { lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// import.meta.glob automatically creates lazy-loading import functions
// for all files matching the pattern, triggering automatic code-splitting.
const pages = import.meta.glob("./pages/**/*.page.tsx");

const routes = Object.keys(pages).flatMap((path) => {
  // Extract a clean component name or route path from the file path
  const name = path.match(/\.\/pages\/(.*)\.page\.tsx$/)?.[1];
  if (name === undefined) return [];
  const routePath =
    name.toLowerCase() === "index" ? "/" : `/${name.toLowerCase()}`;

  // Cast the glob function to a React lazy-compatible dynamic component
  const Component = lazy(
    pages[path] as () => Promise<{ default: React.ComponentType<unknown> }>
  );

  return [{ path: routePath, element: <Component /> }];
});

const router = createBrowserRouter(routes, {
  basename: import.meta.env.BASE_URL,
});

export function Router() {
  return <RouterProvider router={router} />;
}
