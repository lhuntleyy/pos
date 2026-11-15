import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { applyBranding, defaultBranding } from "./lib/branding";
import { applyTextSize, loadTextSize } from "./lib/text-size";
import { router } from "./router";
import "./index.css";

// Nanti diambil dari API (pengaturan super admin, story B-06).
applyBranding(defaultBranding);
applyTextSize(loadTextSize());

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000 } },
});

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Elemen #root tidak ada di index.html");

createRoot(rootEl).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
