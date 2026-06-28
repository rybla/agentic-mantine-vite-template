import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "@/pages/Home.page";

const router = createBrowserRouter([
  {
    path: "/agentic-mantine-vite-template",
    element: <HomePage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
