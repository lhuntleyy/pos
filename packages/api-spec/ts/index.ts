import createClient, { type Middleware } from "openapi-fetch";
import type { components, paths } from "./schema.gen";

export type { components, paths };
export type Schemas = components["schemas"];
export type Problem = Schemas["Problem"];

export interface ApiClientOptions {
  baseUrl: string;
  /** Mengembalikan access token terbaru, atau null kalau belum masuk. */
  getAccessToken?: () => string | null | Promise<string | null>;
}

/** Klien API bertipe yang dibuat dari openapi.yaml. */
export function createApiClient({ baseUrl, getAccessToken }: ApiClientOptions) {
  const client = createClient<paths>({ baseUrl });

  if (getAccessToken) {
    const auth: Middleware = {
      async onRequest({ request }) {
        const token = await getAccessToken();
        if (token) request.headers.set("Authorization", `Bearer ${token}`);
        return request;
      },
    };
    client.use(auth);
  }

  return client;
}

export type ApiClient = ReturnType<typeof createApiClient>;
