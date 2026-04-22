import { useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";

import type { RoleHomeModel, IconRegistry } from "@/src/components/home";
import { useAuth } from "@/src/auth";

import { fetchNutritionistHomeSummary } from "./api";
import { buildNutritionistHomeModel } from "./buildNutritionistHomeModel";
import type { NutritionistHomeSummary } from "./types";

export function useNutritionistHomeModel(icons: IconRegistry) {
  const router = useRouter();
  const { user } = useAuth();

  const [summary, setSummary] = useState<NutritionistHomeSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const displayName = user?.name?.trim() || "there";
  const greeting = `Hello, ${displayName} 👋`;

  const load = async () => {
    setIsLoading(true);
    const s = await fetchNutritionistHomeSummary();
    setSummary(s);
    setIsLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const model: RoleHomeModel | null = useMemo(() => {
    if (!summary) return null;

    return buildNutritionistHomeModel({
      summary,
      router,
      icons,
      greeting,
      isLoading,
    });
  }, [summary, router, icons, greeting, isLoading]);

  return {
    model,
    isLoading,
    reload: load,
  };
}