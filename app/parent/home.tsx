// app/parent/home.tsx
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Card } from "react-native-paper";

import { useAuth } from "@/src/auth";

import type { ParentPet } from "@/src/features/parent/pets/types";
import type { VaccineDueItem } from "@/src/features/vaccines/types";
import type { Order, ParentRecentConsult, ParentUpcomingAppointment, Rx } from "@/src/features/parent/types";

import { fetchParentPets } from "@/src/features/parent/pets/api";
import { fetchParentNextAppointment, fetchParentRecentConsults } from "@/src/features/parent/api";
import { fetchVaccinesDue } from "@/src/features/vaccines/api";
import { fetchMyOrders } from "@/src/features/commerce/api";
import { fetchParentPrescriptions } from "@/src/features/parent/api";

import {
  StethoscopeIcon,
  SyringeIcon,
  CalendarIcon,
  HistoryIcon,
  VideoIcon,
  UploadIcon,
  StoreIcon,
  CartOutlineIcon,
  TruckOutlineIcon,
  PillsOutlineIcon,
  BowlOutlineIcon,
  PrescriptionIcon,
} from "@/src/components/quickActions/QuickActionIcons";

import { RoleHomeShell, IconName, QuickTile, SectionDef, AppliesToItem } from "@/src/components/home/RoleHomeShell";

/** Parent-specific icon registry */
const ICONS: Record<IconName, React.ReactElement> = {
  stethoscope: <StethoscopeIcon />,
  syringe: <SyringeIcon />,
  calendar: <CalendarIcon />,
  history: <HistoryIcon />,
  video: <VideoIcon />,
  upload: <UploadIcon />,
  store: <StoreIcon />,
  cart: <CartOutlineIcon />,
  truck: <TruckOutlineIcon />,
  pills: <PillsOutlineIcon />,
  bowl: <BowlOutlineIcon />,
  prescription: <PrescriptionIcon />,
};

export default function ParentHome() {
  const router = useRouter();
  const { user } = useAuth();

  const [pets, setPets] = useState<ParentPet[]>([]);
  const [nextAppt, setNextAppt] = useState<ParentUpcomingAppointment | null>(null);
  const [vaccinesDue, setVaccinesDue] = useState<VaccineDueItem[]>([]);
  const [rx, setRx] = useState<Rx[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [recentVisits, setRecentVisits] = useState<ParentRecentConsult[]>([]);

  useEffect(() => {
    fetchParentNextAppointment().then(setNextAppt).catch(() => setNextAppt(null));
  }, []);

  useEffect(() => {
    fetchParentPets().then(setPets).catch(() => setPets([]));
    fetchVaccinesDue().then((items) => setVaccinesDue(items || [])).catch(() => setVaccinesDue([]));
    fetchMyOrders().then((items) => setOrders(items || [])).catch(() => setOrders([]));
    fetchParentPrescriptions(10).then((items) => setRx(items || [])).catch(() => setRx([]));
  }, []);

  useEffect(() => {
    (async () => {
      const data = await fetchParentRecentConsults();
      setRecentVisits(data);
    })();
  }, []);

  const displayName = user?.name?.trim() || "there";
  const greeting = `Hello, ${displayName} 👋`;
  const subtitle = user?.phone;

  /** Applies-to = pets (shell renders the strip) */
  const appliesToItems: AppliesToItem[] = useMemo(
    () =>
      pets.map((p) => ({
        key: String(p.id),
        title: p.name,
        subtitle: p.breed ?? "—",
        imageUri: p.picture_uri ?? null,
        onPress: () =>
          router.push({
            pathname: "/parent/pets/[petId]",
            params: { petId: String(p.id) },
          } as any),
      })),
    [pets, router]
  );

  /** Tiles: config-only here */
  const tilesPerRow = 3;

  const tiles: QuickTile[] = useMemo(
    () => [
      { key: "book", title: "Book a Vet", subtitle: "In-clinic or video", tone: "primary", iconName: "stethoscope", onPress: () => router.push("/parent/book" as any) },
      { key: "vacc", title: "Vaccinations", subtitle: "Schedule & history", tone: "warning", iconName: "syringe", onPress: () => router.push("/parent/vaccines" as any) },
      { key: "rx", title: "Prescriptions", subtitle: "Medicines & dosage", tone: "warning", iconName: "prescription", onPress: () => router.push("/parent/prescriptions" as any) },

      { key: "appts", title: "Appointments", subtitle: "Upcoming & past", tone: "primary", iconName: "calendar", onPress: () => router.push("/parent/appointments" as any) },
      { key: "visits", title: "Recent Visits", subtitle: "Past consultations", tone: "neutral", iconName: "history", onPress: () => router.push("/parent/visits" as any) },
      { key: "tele", title: "Televisit", subtitle: "Start a consult", tone: "primary", iconName: "video", onPress: () => router.push("/parent/televisit" as any) },

      { key: "upload", title: "Upload Report", subtitle: "PDF / Images", tone: "neutral", iconName: "upload", onPress: () => router.push("/parent/reports" as any) },
      { key: "shop", title: "Shop", subtitle: "Food • Accessories", tone: "success", iconName: "store", onPress: () => router.push("/parent/shop" as any) },
      { key: "cart", title: "Cart", subtitle: "Review items", tone: "neutral", iconName: "cart", onPress: () => router.push("/parent/cart" as any) },

      { key: "orders", title: "Orders", subtitle: "Track deliveries", tone: "neutral", iconName: "truck", onPress: () => router.push("/parent/orders" as any) },
      { key: "refill", title: "Refill Meds", subtitle: "Browse medicines", tone: "warning", iconName: "pills", onPress: () => router.push({ pathname: "/parent/shop/list", params: { category: "MEDICINE" } } as any) },
      { key: "food", title: "Order Food", subtitle: "Nutrition & diet", tone: "success", iconName: "bowl", onPress: () => router.push({ pathname: "/parent/shop/list", params: { category: "FOOD" } } as any) },
    ],
    [router]
  );

  /** Sections: title + render() stays here, layout is in shell */
  const sections: SectionDef[] = useMemo(
    () => [
      {
        key: "nextAppt",
        title: "Next Appointment",
        onSeeAll: () => router.push("/parent/appointments" as any),
        render: () =>
          !nextAppt ? (
            <Empty text="No upcoming appointments" />
          ) : (
            <Card
              onPress={() => router.push(`/parent/appointment/${nextAppt.id}` as any)}
              style={{ borderRadius: 16 }}
            >
              <View style={{ padding: 12 }}>
                <Text style={{ fontWeight: "800" }}>
                  {nextAppt.pet_name} with {nextAppt.vet_name}
                </Text>
                <Text style={{ marginTop: 6, opacity: 0.75 }}>🏥 {nextAppt.location_name}</Text>
                <Text style={{ marginTop: 4, opacity: 0.75 }}>⏰ {new Date(nextAppt.start_ts).toLocaleString()}</Text>
                <Text style={{ marginTop: 4, opacity: 0.65 }}>🎫 Booking ID: {nextAppt.slot_id}</Text>
              </View>
            </Card>
          ),
      },
      {
        key: "recentVisit",
        title: "Recent Visit",
        onSeeAll: () => router.push("/parent/consult" as any),
        render: () =>
          recentVisits.length === 0 ? (
            <Empty text="No recent consultations." />
          ) : (
            (() => {
              const rv = recentVisits[0];
              return (
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/parent/consult/[consultId]",
                      params: { consultId: String(rv.consult_id) },
                    } as any)
                  }
                  style={{ paddingVertical: 6 }}
                >
                  <Text style={{ fontWeight: "800" }}>{rv.clinic_name ?? ""}</Text>
                  <Text style={{ fontWeight: "800", marginTop: 4 }}>
                    {rv.pet_name} – {rv.vet_name}
                  </Text>
                  <Text style={{ marginTop: 4, opacity: 0.75 }}>{rv.diagnosis || "Consult completed"}</Text>
                  <Text style={{ marginTop: 4, opacity: 0.6 }}>{new Date(rv.date).toLocaleString()}</Text>
                </Pressable>
              );
            })()
          ),
      },
      {
        key: "vaccinesDue",
        title: "Vaccines Due",
        onSeeAll: () => router.push("/parent/vaccines" as any),
        render: () =>
          vaccinesDue.length === 0 ? (
            <Empty text="All caught up. We’ll remind you when due." />
          ) : (
            vaccinesDue.slice(0, 3).map((v) => (
              <Row
                key={String(v.plan_item_id)}
                primary={`${v.pet_name}: ${v.vaccine_name}`}
                secondary={`${v.status === "DUE" ? "Due" : "Upcoming"} • ${v.due_on}`}
              />
            ))
          ),
      },
      {
        key: "prescriptions",
        title: "Prescriptions",
        onSeeAll: () => router.push("/parent/prescriptions" as any),
        render: () =>
          rx.length === 0 ? <Empty text="No prescriptions yet." /> : rx.slice(0, 3).map((r) => <Row key={r.id} primary={r.drug} secondary={r.status} />),
      },
      {
        key: "orders",
        title: "Recent Orders",
        onSeeAll: () => router.push("/parent/orders" as any),
        render: () =>
          orders.length === 0 ? (
            <Empty text="Your cart is empty. Browse products →" onAction={() => router.push("/parent/cart" as any)} />
          ) : (
            orders.slice(0, 3).map((o) => <Row key={o.id} primary={`Order #${o.id}`} secondary={o.status} />)
          ),
      },
      {
        key: "rewards",
        title: "Rewards & Achievements",
        onSeeAll: () => router.push("/parent/rewards" as any),
        render: () => <Empty text="Earn points by completing care actions." />,
      },
      {
        key: "events",
        title: "Events Near You",
        onSeeAll: () => router.push("/parent/events" as any),
        render: () => <Empty text="No upcoming events. Check back soon!" />,
      },
    ],
    [router, nextAppt, recentVisits, vaccinesDue, rx, orders]
  );

  return (
    <RoleHomeShell
      role="PARENT"
      greeting={greeting}
      subtitle={subtitle}
      appliesToTitle="Your Pets"
      appliesToItems={appliesToItems}
      onAddAppliesTo={() => router.push("/parent/pets/add" as any)}
      tilesTitle="What would you like to do?"
      tilesPerRow={tilesPerRow}
      tiles={tiles}
      icons={ICONS}
      sections={sections}
    />
  );
}

/** Updated tiny helpers to be “shell-friendly” (no big borders; shell wraps them nicely) */
function Row({ primary, secondary, tertiary }: { primary: string; secondary?: string; tertiary?: string }) {
  return (
    <View style={{ paddingVertical: 10 }}>
      <Text style={{ fontWeight: "800" }}>{primary}</Text>
      {!!secondary && <Text style={{ marginTop: 4, opacity: 0.7 }}>{secondary}</Text>}
      {!!tertiary && <Text style={{ marginTop: 2, opacity: 0.6 }}>{tertiary}</Text>}
    </View>
  );
}

function Empty({ text, onAction }: { text: string; onAction?: () => void }) {
  return (
    <Pressable
      onPress={onAction}
      disabled={!onAction}
      style={{
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 14,
        backgroundColor: "rgba(17,24,39,0.04)",
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: "rgba(17,24,39,0.12)",
      }}
    >
      <Text style={{ opacity: 0.75, fontWeight: "600" }}>{text}</Text>
      {!!onAction && <Text style={{ marginTop: 6, opacity: 0.6 }}>Tap to continue</Text>}
    </Pressable>
  );
}
