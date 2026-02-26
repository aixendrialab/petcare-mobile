// app/vet/home-demo.tsx
// Vet Home demo screen using the new RoleHomeShell architecture.
// Hard-coded data to match the polished mockup (mobile-first).

import React, { useMemo, useState } from "react";
import { useRouter } from "expo-router";

import {
  RoleHomeShell,
  type RoleHomeModel,
  type IconName,
} from "@/src/components/home";

import {
  StethoscopeIcon,
  CalendarIcon,
  HistoryIcon,
  VideoIcon,
  StoreIcon,
  CartOutlineIcon,
  PrescriptionIcon,
} from "@/src/components/quickActions/QuickActionIcons";

/**
 * NOTE: Today the shared IconName union is parent-centric.
 * For the demo, we map vet tiles to existing icons.
 * (Later we can expand IconName + icon registry with vet-specific glyphs.)
 */
const ICONS: Record<IconName, React.ReactElement> = {
  stethoscope: <StethoscopeIcon />,
  syringe: <StethoscopeIcon />,
  calendar: <CalendarIcon />,
  history: <HistoryIcon />,
  video: <VideoIcon />,
  upload: <StethoscopeIcon />,
  store: <StoreIcon />,
  cart: <CartOutlineIcon />,
  truck: <StoreIcon />,
  pills: <PrescriptionIcon />,
  bowl: <StoreIcon />,
  prescription: <PrescriptionIcon />,
};

type Clinic = {
  id: string;
  name: string;
  city: string;
  waiting: number;
  inConsult: number;
  upcoming: number;
};

export default function VetHomeDemo() {
  const router = useRouter();

  const clinics: Clinic[] = useMemo(
    () => [
      { id: "c1", name: "Paws & Claws Clinic", city: "Gurgaon", waiting: 3, inConsult: 2, upcoming: 8 },
      { id: "c2", name: "Happy Tails Clinic", city: "New Delhi", waiting: 2, inConsult: 1, upcoming: 5 },
      { id: "c3", name: "Pet Zone Clinic", city: "Noida", waiting: 5, inConsult: 1, upcoming: 11 },
    ],
    []
  );

  const [activeClinicId, setActiveClinicId] = useState<string>(clinics[0]?.id ?? "c1");
  const activeClinic = clinics.find((c) => c.id === activeClinicId) ?? clinics[0];

  const model: RoleHomeModel = useMemo(() => {
    const billedToday = 18400;
    const pendingInvoices = 3;
    const refunds = 1;

    const waiting = activeClinic?.waiting ?? 0;
    const inConsult = activeClinic?.inConsult ?? 0;
    const upcoming = activeClinic?.upcoming ?? 0;
    const totalAppts = 18; // demo constant

    const headerSummary = `Today: ${totalAppts} appts • ${waiting} waiting • ${inConsult} in consult • ₹${(
      billedToday / 1000
    ).toFixed(1)}k billed`;

    return {
      role: "VET",
      icons: ICONS,
      header: {
        greeting: "Hello, Dr. Asha Rao 👋",
        subtitle: `${activeClinic?.name ?? "Clinic"} • ${activeClinic?.city ?? ""}`,
        roleBadge: { label: "Vet" },
        summary: { text: headerSummary, tone: "neutral" },
        actions: {
          showBell: true,
          onPressBell: () => router.push("/vet/settings" as any),
          showProfile: true,
          onPressProfile: () => router.push("/vet/profile" as any),
        },
      },
      secondaryContext: {
        title: "Clinics",
        showStatus: true,
        items: clinics.map((c) => {
          const status = c.waiting >= 5 ? "overdue" : c.waiting >= 2 ? "dueSoon" : "ok";
          return {
            key: c.id,
            title: c.name,
            subtitle: c.city,
            imageUri: null,
            status,
            badges: [
              { text: `${c.waiting} waiting`, tone: c.waiting >= 5 ? "warning" : "neutral" },
              { text: `${c.inConsult} consult`, tone: "primary" },
              { text: `${c.upcoming} upc`, tone: "neutral" },
            ],
            onPress: () => setActiveClinicId(c.id),
          };
        }),
        onAdd: {
          label: "Add Clinic",
          onPress: () => router.push("/vet/settings" as any),
        },
      },
      attention: {
        title: "Now",
        maxVisible: 4,
        items: [
          {
            key: "waiting",
            iconName: "history",
            tone: "warning",
            title: `${waiting} patients waiting`,
            subtitle: "Longest wait • 12m",
            cta: { text: "Open queue", onPress: () => router.push("/vet/queue" as any) },
          },
          {
            key: "arrived",
            iconName: "calendar",
            tone: "warning",
            title: "4 arrived",
            subtitle: "2 new since 10:30",
            cta: { text: "Start", onPress: () => router.push("/vet/queue" as any) },
          },
          {
            key: "labs",
            iconName: "prescription",
            tone: "primary",
            title: "3 results pending",
            subtitle: "1 flagged abnormal",
            cta: { text: "Review", onPress: () => router.push("/vet/consult" as any) },
          },
          {
            key: "stock",
            iconName: "store",
            tone: "success",
            title: "2 low-stock items",
            subtitle: "Amoxicillin • Rabies vaccine",
            cta: { text: "Inventory", onPress: () => router.push("/vet/store" as any) },
          },
        ].filter((x) => {
          // Hide empty counters in demo if clinic has 0 waiting.
          if (x.key === "waiting" && waiting === 0) return false;
          return true;
        }),
      },
      actions: {
        title: "What would you like to do?",
        grid: { tilesPerRow: 3, maxVisible: 6 },
        seeAll: { onPress: () => router.push("/vet/home" as any) },
        tiles: [
          {
            key: "checkin",
            title: "Check-in",
            iconName: "stethoscope",
            tone: "primary",
            onPress: () => router.push("/vet/checkin" as any),
          },
          {
            key: "queue",
            title: "Queue",
            iconName: "history",
            tone: "warning",
            badgeText: String(waiting),
            badgeTone: waiting >= 5 ? "warning" : "neutral",
            onPress: () => router.push("/vet/queue" as any),
          },
          {
            key: "inventory",
            title: "Inventory",
            iconName: "store",
            tone: "success",
            badgeText: "2",
            badgeTone: "warning",
            onPress: () => router.push("/vet/store" as any),
          },
          {
            key: "televisit",
            title: "Televisit",
            iconName: "video",
            tone: "primary",
            badgeText: "1",
            badgeTone: "primary",
            onPress: () => router.push("/vet/consult" as any),
          },
          {
            key: "appointments",
            title: "Appointments",
            iconName: "calendar",
            tone: "neutral",
            badgeText: String(upcoming),
            badgeTone: "neutral",
            onPress: () => router.push("/vet/schedule" as any),
          },
          {
            key: "labsTile",
            title: "Labs",
            iconName: "prescription",
            tone: "primary",
            badgeText: "3",
            badgeTone: "primary",
            onPress: () => router.push("/vet/consult" as any),
          },
        ],
      },
      sections: {
        items: [
          {
            key: "queueSnapshot",
            title: "Queue",
            accent: { iconName: "history", tone: "warning", label: "Now" },
            onSeeAll: () => router.push("/vet/queue" as any),
            content: {
              kind: "rows",
              rows: [
                {
                  key: "q1",
                  primary: "Bella • 12m • Vaccination",
                  secondary: "Owner: Ram",
                  leftIconName: "history",
                  onPress: () => router.push("/vet/queue" as any),
                },
                {
                  key: "q2",
                  primary: "Rocky • 8m • Skin issue",
                  secondary: "Owner: Priya",
                  leftIconName: "history",
                  onPress: () => router.push("/vet/queue" as any),
                },
                {
                  key: "q3",
                  primary: "Luna • In consult • Fever",
                  secondary: "Owner: Suresh",
                  leftIconName: "history",
                  onPress: () => router.push("/vet/consult" as any),
                },
              ],
            },
          },
          {
            key: "todaySchedule",
            title: "Today's Schedule",
            accent: { iconName: "calendar", tone: "neutral", label: "Today" },
            onSeeAll: () => router.push("/vet/schedule" as any),
            content: {
              kind: "rows",
              rows: [
                { key: "s1", primary: "Open", secondary: "18" },
                { key: "s2", primary: "Completed", secondary: "8" },
                { key: "s3", primary: "Upcoming", secondary: "6" },
                { key: "s4", primary: "Cancelled", secondary: "1" },
              ],
            },
          },
          {
            key: "billing",
            title: "Billing",
            accent: { iconName: "cart", tone: "success", label: "Today" },
            onSeeAll: () => router.push("/vet/invoices" as any),
            content: {
              kind: "rows",
              rows: [
                { key: "b1", primary: "₹ 18,400 billed today" },
                { key: "b2", primary: "3 pending invoices" },
                { key: "b3", primary: "1 refund" },
              ],
            },
          },
        ],
      },
      discover: {
        title: "Discover",
        collapsedByDefault: true,
        items: [
          {
            key: "cme",
            title: "CME event coming up",
            subtitle: "Weekend workshop • Register",
            iconName: "calendar",
            onPress: () => router.push("/vet/settings" as any),
          },
          {
            key: "feature",
            title: "New feature: faster consult notes",
            subtitle: "Try voice dictation in consult",
            iconName: "history",
            onPress: () => router.push("/vet/consult" as any),
          },
        ],
      },
    };
  }, [activeClinic, activeClinicId, clinics, router]);

  return <RoleHomeShell model={model} />;
}
