import { createRootRoute, createRoute, createRouter, Outlet } from "@tanstack/react-router";
import { AppShell } from "./components/AppShell";
import { ComingSoon } from "./pages/ComingSoon";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";

const rootRoute = createRootRoute({ component: Outlet });

const appLayout = createRoute({ getParentRoute: () => rootRoute, id: "app", component: AppShell });

const page = <TPath extends string>(path: TPath, title: string, story: string, sprint: string) =>
  createRoute({
    getParentRoute: () => appLayout,
    path,
    component: () => <ComingSoon title={title} story={story} sprint={sprint} />,
  });

const homeRoute = createRoute({ getParentRoute: () => appLayout, path: "/", component: HomePage });
const loginRoute = createRoute({ getParentRoute: () => rootRoute, path: "/masuk", component: LoginPage });

const routeTree = rootRoute.addChildren([
  appLayout.addChildren([
    homeRoute,
    page("/produk", "Produk", "K-01", "sprint 1"),
    page("/stok", "Stok", "ST-01, ST-02", "sprint 4"),
    page("/stok-opname", "Stok opname", "ST-03", "sprint 4"),
    page("/laporan", "Laporan", "L-01, L-02", "sprint 5"),
    page("/karyawan", "Karyawan", "A-04, A-05", "sprint 1 dan 5"),
    page("/pengaturan", "Pengaturan", "A-02, A-03, H-03", "sprint 1 dan 5"),
  ]),
  loginRoute,
]);

export const router = createRouter({ routeTree, defaultPreload: "intent" });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
