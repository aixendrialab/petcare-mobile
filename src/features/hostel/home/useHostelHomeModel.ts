import { useEffect, useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

import type { RoleHomeModel, IconRegistry } from "@/src/components/home";
import { useAuth } from "@/src/auth";

import { fetchHostelHomeSummary } from "./api";
import { buildHostelHomeModel } from "./buildHostelHomeModel";
import type { HostelHomeSummary } from "./types";

export function useHostelHomeModel(icons: IconRegistry) {
  const router = useRouter();
  const { facilityId } = useLocalSearchParams<{ facilityId?: string }>();
  const { user } = useAuth();

  const [summary, setSummary] = useState<HostelHomeSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const displayName = user?.name?.trim() || "there";
  const greeting = `Hello, ${displayName} 👋`;

  const load = async () => {
    setIsLoading(true);
    const facility_id = facilityId ? Number(facilityId) : undefined;
    const s = await fetchHostelHomeSummary({ facility_id });
    setSummary(s);
    setIsLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facilityId]);

  const model: RoleHomeModel | null = useMemo(() => {
    if (!summary) return null;

    return buildHostelHomeModel({
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