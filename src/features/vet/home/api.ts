import { VetHomeSummary } from "./types";
import { MOCK_VET_HOME_SUMMARY } from "./mock";

export async function fetchVetHomeSummary(
  clinicId?: number
): Promise<VetHomeSummary> {
  // Later:
  // return api.get<VetHomeSummary>(`/vet/home/summary?clinic_id=${clinicId}`);

  return new Promise((resolve) =>
    setTimeout(() => resolve(MOCK_VET_HOME_SUMMARY), 300)
  );
}