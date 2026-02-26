import { useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";

import type { RoleHomeModel, IconRegistry } from "@/src/components/home";

import { useAuth } from "@/src/auth";

import { fetchParentPets } from "@/src/features/parent/pets/api";
import { fetchParentNextAppointment, fetchParentRecentConsults, fetchParentPrescriptions } from "@/src/features/parent/api";
import { fetchVaccinesDue } from "@/src/features/vaccines/api";
import { fetchMyOrders } from "@/src/features/commerce/api";

import type { ParentPet } from "@/src/features/parent/pets/types";
import type { ParentRecentConsult, ParentUpcomingAppointment, Rx } from "@/src/features/parent/types";
import type { VaccineDueItem } from "@/src/features/vaccines/types";
import type { OrderListItem } from "@/src/features/commerce/types";

import { buildParentHomeModel } from "./buildParentHomeModel";

export type UseParentHomeModelResult = {
  model: RoleHomeModel;
  isLoading: boolean;
  /** When some endpoints fail, we still render with partial data. */
  hasPartialFailures: boolean;
  reload: () => void;
};

export function useParentHomeModel(icons: IconRegistry): UseParentHomeModelResult {
  const router = useRouter();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [hasPartialFailures, setHasPartialFailures] = useState(false);

  const [pets, setPets] = useState<ParentPet[]>([]);
  const [nextAppt, setNextAppt] = useState<ParentUpcomingAppointment | null>(null);
  const [vaccinesDue, setVaccinesDue] = useState<VaccineDueItem[]>([]);
  const [prescriptions, setPrescriptions] = useState<Rx[]>([]);
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [recentConsults, setRecentConsults] = useState<ParentRecentConsult[]>([]);

  const load = async () => {
    setIsLoading(true);
    setHasPartialFailures(false);

    const results = await Promise.allSettled([
      fetchParentPets(),
      fetchParentNextAppointment(),
      fetchVaccinesDue(3, 30),
      fetchParentPrescriptions(10),
      fetchMyOrders(),
      fetchParentRecentConsults(5),
    ]);

    const failed = results.some((r) => r.status === "rejected");
    setHasPartialFailures(failed);

    const [petsR, nextApptR, vaccR, rxR, ordersR, recentR] = results;

    setPets(petsR.status === "fulfilled" ? petsR.value ?? [] : []);
    setNextAppt(nextApptR.status === "fulfilled" ? nextApptR.value ?? null : null);
    setVaccinesDue(vaccR.status === "fulfilled" ? vaccR.value ?? [] : []);
    setPrescriptions(rxR.status === "fulfilled" ? rxR.value ?? [] : []);
    setOrders(ordersR.status === "fulfilled" ? ordersR.value ?? [] : []);
    setRecentConsults(recentR.status === "fulfilled" ? recentR.value ?? [] : []);

    setIsLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const model = useMemo(
    () =>
      buildParentHomeModel({
        user: user ?? null,
        router,
        icons,
        pets,
        nextAppt,
        recentConsults,
        vaccinesDue,
        prescriptions,
        orders,
        isLoading,
      }),
    [
      user,
      router,
      icons,
      pets,
      nextAppt,
      recentConsults,
      vaccinesDue,
      prescriptions,
      orders,
      isLoading,
    ]
  );

  return {
    model,
    isLoading,
    hasPartialFailures,
    reload: load,
  };
}
