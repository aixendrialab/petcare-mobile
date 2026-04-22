import type { NutritionistHomeSummary } from "./types";
import { mockNutritionistHomeSummary } from "./mocks";

/**
 * Real API shape (client-side), currently returns mock data.
 * Later replace implementation with server API.
 */
export async function fetchNutritionistHomeSummary(): Promise<NutritionistHomeSummary> {
  // Later:
  // return (await api.get<NutritionistHomeSummary>("/nutritionist/home")).data;

  return mockNutritionistHomeSummary();
}