import api from "@/src/api";
import { ProviderProfile, ProviderRole } from "./types";

export async function fetchMyProvider(role: ProviderRole): Promise<ProviderProfile | null> {
  const res = await api.get(`/providers/me?role=${role}`);
  return res.data?.provider ?? null;
}

export async function upsertMyProvider(role: ProviderRole, provider: Partial<ProviderProfile>) {
  return api.post(`/providers/me?role=${role}`, provider);
}
