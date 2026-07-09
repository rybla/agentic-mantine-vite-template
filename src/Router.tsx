import { pages } from "@/meta";
import { IndexPage } from "@/pages/index.page";
import { lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const routes = Object.values(pages).map((page) => {
  const Component = lazy(async () => {
    const module = (await page.load()) as Record<
      string,
      React.ComponentType<unknown>
    >;
    const exportKey =
      Object.keys(module).find((key) => key !== "default") || "default";
    return { default: module[exportKey]! };
  });

  return { path: page.route, element: <Component /> };
});

const router = createBrowserRouter(
  [
    ...routes,
    // special routes
    {
      path: "/",
      element: <IndexPage />,
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);

export function Router() {
  return <RouterProvider router={router} />;
}
