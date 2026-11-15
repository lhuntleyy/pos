import { createApiClient } from "@pos/api-spec";

export const apiBaseUrl: string = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

/** Token disimpan di memori. Refresh token akan memakai cookie httpOnly (story A-01). */
let accessToken: string | null = null;
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const api = createApiClient({ baseUrl: apiBaseUrl, getAccessToken: () => accessToken });
