import type { PharmacyHomeSummary } from "./types";
import { mockPharmacyHomeSummary } from "./mocks";

/**
 * Real API shape (client-side), currently returns mocked data.
 * Later: replace implementation with server call.
 */
export async function fetchPharmacyHomeSummary(params?: {
  outlet_id?: number;
}): Promise<PharmacyHomeSummary> {
  // Later:
  // return (await api.get<PharmacyHomeSummary>("/pharmacy/home", { params })).data;

  return mockPharmacyHomeSummary(params?.outlet_id ?? null);
}