import type { WalkerHomeSummary } from "./types";
import { mockWalkerHomeSummary } from "./mocks";

/**
 * Real API surface. Currently returns mocked data.
 * Later replace implementation with server-backed call.
 */
export async function fetchWalkerHomeSummary(): Promise<WalkerHomeSummary> {
  // Later:
  // return (await api.get<WalkerHomeSummary>("/walker/home")).data;

  return mockWalkerHomeSummary();
}