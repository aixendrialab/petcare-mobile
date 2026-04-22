import type { HostelHomeSummary } from "./types";
import { mockHostelHomeSummary } from "./mocks";

/**
 * Real API shape, currently backed by fake data.
 * Later replace with server call.
 */
export async function fetchHostelHomeSummary(params?: {
  facility_id?: number;
}): Promise<HostelHomeSummary> {
  // Later:
  // return (await api.get<HostelHomeSummary>("/hostel/home", { params })).data;

  return mockHostelHomeSummary(params?.facility_id ?? null);
}