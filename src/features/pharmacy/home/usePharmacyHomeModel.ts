import { useEffect, useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

import type { RoleHomeModel, IconRegistry } from "@/src/components/home";
import { useAuth } from "@/src/auth";

import { fetchPharmacyHomeSummary } from "./api";
import { buildPharmacyHomeModel } from "./buildPharmacyHomeModel";
import type { PharmacyHomeSummary } from "./types";

export function usePharmacyHomeModel(icons: IconRegistry) {
  const router = useRouter();
  const { outletId } = useLocalSearchParams<{ outletId?: string }>();
  const { user } = useAuth();

  const [summary, setSummary] = useState<PharmacyHomeSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const name = user?.name?.trim() || "there";
  const greeting = `Hello, ${name} 👋`;

  const load = async () => {
    setIsLoading(true);
    const outlet_id = outletId ? Number(outletId) : undefined;
    const s = await fetchPharmacyHomeSummary({ outlet_id });
    setSummary(s);
    setIsLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outletId]);

  const model: RoleHomeModel | null = useMemo(() => {
    if (!summary) return null;

    return buildPharmacyHomeModel({
      summary,
      router,
      icons,
      greeting,
      isLoading,
    });
  }, [summary, router, icons, greeting, isLoading]);

  return { model, isLoading, reload: load };
}