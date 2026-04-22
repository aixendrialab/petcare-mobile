// src/features/vendor/home/useVendorHomeModel.ts

import { useEffect, useMemo, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";

import type { IconRegistry, RoleHomeModel } from "@/src/components/home";
import { useAuth } from "@/src/auth";

import { fetchVendorHomeSummary } from "./api";
import type { VendorHomeSummary } from "./types";
import { buildVendorHomeModel } from "./buildVendorHomeModel";

export type UseVendorHomeModelResult = {
  model: RoleHomeModel | null;
  isLoading: boolean;
  reload: () => void;
};

export function useVendorHomeModel(icons: IconRegistry): UseVendorHomeModelResult {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams<{ store_id?: string }>();

  const [summary, setSummary] = useState<VendorHomeSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    try {
      const store_id = params.store_id ? Number(params.store_id) : undefined;
      const s = await fetchVendorHomeSummary({ store_id: Number.isFinite(store_id) ? store_id : undefined });
      setSummary(s);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.store_id]);

  const model = useMemo(() => {
    if (!summary) return null;
    const name = user?.name?.trim() || "there";
    return buildVendorHomeModel({
      summary,
      router,
      icons,
      greeting: `Hello, ${name} 👋`,
      subtitle: user?.phone,
      isLoading,
    });
  }, [summary, router, icons, user, isLoading]);

  return { model, isLoading, reload: load };
}
