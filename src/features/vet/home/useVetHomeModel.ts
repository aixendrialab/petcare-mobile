import { useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";

import type { RoleHomeModel, IconRegistry } from "@/src/components/home";
import { useAuth } from "@/src/auth";

import { fetchVetHomeSummary } from "./api";
import { buildVetHomeModel } from "./buildVetHomeModel";
import type { VetHomeSummary } from "./types";

export function useVetHomeModel(icons: IconRegistry) {
  const router = useRouter();
  const { user } = useAuth();

  const [summary, setSummary] = useState<VetHomeSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    const s = await fetchVetHomeSummary();
    setSummary(s);
    setIsLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const name = user?.name?.trim() || "there";
  const greeting = `Hello, Dr. ${name} 👋`;

  const model: RoleHomeModel | null = useMemo(() => {
    if (!summary) return null;
    return buildVetHomeModel({
      summary,
      router,
      icons,
      greeting,
      isLoading,
    });
  }, [summary, router, icons, greeting, isLoading]);

  return { model, isLoading, reload: load };
}