// src/features/vendor/home/api.ts
// NOTE: This is a "real" API function signature, but currently returns mocked data.
// Swap the implementation to call your backend endpoint later.

import type { VendorHomeSummary } from "./types";
import { mockVendorHomeSummary } from "./mock";

export async function fetchVendorHomeSummary(params?: { store_id?: number | null }): Promise<VendorHomeSummary> {
  // Later:
  // const res = await api.get<VendorHomeSummary>("/vendor/home/summary", { params: { store_id: params?.store_id } });
  // return res.data;

  const storeId = params?.store_id ?? 101;
  return mockVendorHomeSummary(storeId);
}
