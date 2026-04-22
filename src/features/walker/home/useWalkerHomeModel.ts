import { useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";

import type { RoleHomeModel, IconRegistry } from "@/src/components/home";
import { useAuth } from "@/src/auth";

import { fetchWalkerHomeSummary } from "./api";
import { buildWalkerHomeModel } from "./buildWalkerHomeModel";
import type { WalkerHomeSummary } from "./types";

export function useWalkerHomeModel(icons: IconRegistry) {
  const router = useRouter();
  const { user } = useAuth();

  const [summary, setSummary] = useState<WalkerHomeSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const displayName = user?.name?.trim() || "there";
  const greeting = `Hello, ${displayName} 👋`;

  const load = async () => {
    setIsLoading(true);
    const s = await fetchWalkerHomeSummary();
    setSummary(s);
    setIsLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const model: RoleHomeModel | null = useMemo(() => {
    if (!summary) return null;

    return buildWalkerHomeModel({
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