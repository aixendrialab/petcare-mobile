type MinimalRouter = {
  push: (href: any) => void;
};

import type {
  IconRegistry,
  RoleHomeModel,
  SecondaryContextItem,
  ActionTileModel,
  AttentionItemModel,
  SectionModel,
  QuickTone,
} from "@/src/components/home";

import type { User } from "@/src/auth";

import type { ParentPet } from "@/src/features/parent/pets/types";
import type { VaccineDueItem } from "@/src/features/vaccines/types";
import type { ParentRecentConsult, ParentUpcomingAppointment, Rx } from "@/src/features/parent/types";
import type { OrderListItem } from "@/src/features/commerce/types";

function toneFromVaccineStatus(v: VaccineDueItem): QuickTone {
  // Simple heuristic: DUE is warning, otherwise neutral
  return v.status === "DUE" ? "warning" : "neutral";
}

function toneFromOrderStatus(status: string): QuickTone {
  const s = (status || "").toUpperCase();
  if (s === "DELIVERED") return "success";
  if (s === "CANCELLED") return "neutral";
  if (s === "DISPATCHED" || s === "PACKED" || s === "CONFIRMED") return "primary";
  return "neutral";
}

function safeDateLabel(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

export type BuildParentHomeModelArgs = {
  user: User | null;
  router: MinimalRouter;

  icons: IconRegistry;

  pets: ParentPet[];
  nextAppt: ParentUpcomingAppointment | null;
  recentConsults: ParentRecentConsult[];
  vaccinesDue: VaccineDueItem[];
  prescriptions: Rx[];
  orders: OrderListItem[];

  isLoading?: boolean;
};

export function buildParentHomeModel(args: BuildParentHomeModelArgs): RoleHomeModel {
  const {
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
  } = args;

  const displayName = user?.name?.trim() || "there";

  const secondaryItems: SecondaryContextItem[] = pets.map((p) => ({
    key: String(p.id ?? p.name),
    title: p.name,
    subtitle: p.breed ?? "—",
    imageUri: p.picture_uri ?? null,
    status: p.vaccine_status === "due" ? "dueSoon" : "ok",
    onPress: () =>
      router.push({
        pathname: "/parent/pets/[petId]",
        params: { petId: String(p.id) },
      } as any),
  }));

  const tiles: ActionTileModel[] = [
    {
      key: "book",
      title: "Book a Vet",
      subtitle: "In-clinic or video",
      tone: "primary",
      iconName: "stethoscope",
      onPress: () => router.push("/parent/book" as any),
    },
    {
      key: "vacc",
      title: "Vaccinations",
      subtitle: "Schedule & history",
      tone: "warning",
      iconName: "syringe",
      badgeText: vaccinesDue.length ? `${vaccinesDue.length} due` : undefined,
      badgeTone: vaccinesDue.length ? "warning" : undefined,
      onPress: () => router.push("/parent/vaccines" as any),
    },
    {
      key: "rx",
      title: "Prescriptions",
      subtitle: "Medicines & dosage",
      tone: "warning",
      iconName: "prescription",
      badgeText: prescriptions.length ? `${prescriptions.length}` : undefined,
      badgeTone: prescriptions.length ? "warning" : undefined,
      onPress: () => router.push("/parent/prescriptions" as any),
    },
    {
      key: "appts",
      title: "Appointments",
      subtitle: "Upcoming & past",
      tone: "primary",
      iconName: "calendar",
      onPress: () => router.push("/parent/appointments" as any),
    },
    {
      key: "visits",
      title: "Recent Visits",
      subtitle: "Past consultations",
      tone: "neutral",
      iconName: "history",
      onPress: () => router.push("/parent/visits" as any),
    },
    {
      key: "tele",
      title: "Televisit",
      subtitle: "Start a consult",
      tone: "primary",
      iconName: "video",
      onPress: () => router.push("/parent/televisit" as any),
    },
    {
      key: "upload",
      title: "Upload Report",
      subtitle: "PDF / Images",
      tone: "neutral",
      iconName: "upload",
      onPress: () => router.push("/parent/reports" as any),
    },
    {
      key: "shop",
      title: "Shop",
      subtitle: "Food • Accessories",
      tone: "success",
      iconName: "store",
      onPress: () => router.push("/parent/shop" as any),
    },
    {
      key: "cart",
      title: "Cart",
      subtitle: "Review items",
      tone: "neutral",
      iconName: "cart",
      onPress: () => router.push("/parent/cart" as any),
    },
    {
      key: "orders",
      title: "Orders",
      subtitle: "Track deliveries",
      tone: "neutral",
      iconName: "truck",
      badgeText: orders.length ? `${orders.length}` : undefined,
      onPress: () => router.push("/parent/orders" as any),
    },
    {
      key: "refill",
      title: "Refill Meds",
      subtitle: "Browse medicines",
      tone: "warning",
      iconName: "pills",
      onPress: () => router.push({ pathname: "/parent/shop/list", params: { category: "MEDICINE" } } as any),
    },
    {
      key: "food",
      title: "Order Food",
      subtitle: "Nutrition & diet",
      tone: "success",
      iconName: "bowl",
      onPress: () => router.push({ pathname: "/parent/shop/list", params: { category: "FOOD" } } as any),
    },
  ];

  const attentionItems: AttentionItemModel[] = [];

  vaccinesDue.slice(0, 2).forEach((v) => {
    attentionItems.push({
      key: `vacc-${v.plan_item_id}`,
      iconName: "syringe",
      tone: toneFromVaccineStatus(v),
      title: `${v.pet_name}: ${v.vaccine_name}`,
      subtitle: `${v.status === "DUE" ? "Due" : "Upcoming"} • ${v.due_on}`,
      cta: {
        label: "Schedule",
        onPress: () => router.push("/parent/vaccines" as any),
      },
    });
  });

  prescriptions
    .filter((r) => r.status === "ACTIVE")
    .slice(0, 1)
    .forEach((r) => {
      attentionItems.push({
        key: `rx-${r.id}`,
        iconName: "prescription",
        tone: "warning",
        title: `${r.pet_name}: ${r.drug}`,
        subtitle: r.dose ? `${r.dose}${r.frequency ? ` • ${r.frequency}` : ""}` : "Active prescription",
        cta: {
          label: "View",
          onPress: () => router.push("/parent/prescriptions" as any),
        },
      });
    });

  orders
    .filter((o) => !["DELIVERED", "CANCELLED"].includes(String(o.status).toUpperCase()))
    .slice(0, 1)
    .forEach((o) => {
      attentionItems.push({
        key: `ord-${o.id}`,
        iconName: "truck",
        tone: toneFromOrderStatus(o.status),
        title: `Order #${o.id}: ${o.status}`,
        subtitle: o.store_name ? o.store_name : undefined,
        cta: {
          label: "Track",
          onPress: () => router.push("/parent/orders" as any),
        },
      });
    });

  const sections: SectionModel[] = [];

  // Next appointment
  sections.push({
    key: "nextAppt",
    title: "Next Appointment",
    seeAll: { onPress: () => router.push("/parent/appointments" as any) },
    content: {
      kind: "rows",
      rows: !nextAppt
        ? []
        : [
            {
              key: String(nextAppt.id),
              primary: `${nextAppt.pet_name} with ${nextAppt.vet_name}`,
              secondary: `${nextAppt.location_name ?? ""}`.trim() || undefined,
              tertiary: safeDateLabel(nextAppt.start_ts),
              onPress: () => router.push(`/parent/appointment/${nextAppt.id}` as any),
            },
          ],
      empty: { text: "No upcoming appointments" },
    },
  });

  // Recent consult
  const rv = recentConsults[0];
  sections.push({
    key: "recentVisit",
    title: "Recent Visit",
    seeAll: { onPress: () => router.push("/parent/consult" as any) },
    content: {
      kind: "rows",
      rows: !rv
        ? []
        : [
            {
              key: String(rv.consult_id),
              primary: `${rv.pet_name} – ${rv.vet_name ?? ""}`.trim(),
              secondary: rv.diagnosis || "Consult completed",
              tertiary: safeDateLabel(rv.date),
              onPress: () =>
                router.push({ pathname: "/parent/consult/[consultId]", params: { consultId: String(rv.consult_id) } } as any),
            },
          ],
      empty: { text: "No recent consultations." },
    },
  });

  // Vaccines due
  sections.push({
    key: "vaccinesDue",
    title: "Vaccines Due",
    seeAll: { onPress: () => router.push("/parent/vaccines" as any) },
    content: {
      kind: "rows",
      rows: vaccinesDue.slice(0, 3).map((v) => ({
        key: String(v.plan_item_id),
        primary: `${v.pet_name}: ${v.vaccine_name}`,
        secondary: `${v.status === "DUE" ? "Due" : "Upcoming"} • ${v.due_on}`,
        onPress: () => router.push("/parent/vaccines" as any),
      })),
      empty: { text: "All caught up. We’ll remind you when due." },
    },
  });

  // Prescriptions
  sections.push({
    key: "prescriptions",
    title: "Prescriptions",
    seeAll: { onPress: () => router.push("/parent/prescriptions" as any) },
    content: {
      kind: "rows",
      rows: prescriptions.slice(0, 3).map((r) => ({
        key: String(r.id),
        primary: r.drug,
        secondary: r.status,
        onPress: () => router.push("/parent/prescriptions" as any),
      })),
      empty: { text: "No prescriptions yet." },
    },
  });

  // Orders
  sections.push({
    key: "orders",
    title: "Recent Orders",
    seeAll: { onPress: () => router.push("/parent/orders" as any) },
    content: {
      kind: "rows",
      rows: orders.slice(0, 3).map((o) => ({
        key: String(o.id),
        primary: `Order #${o.id}`,
        secondary: o.status,
        onPress: () => router.push("/parent/orders" as any),
      })),
      empty: {
        text: "Your cart is empty. Browse products →",
        actionLabel: "Open cart",
        onAction: () => router.push("/parent/cart" as any),
      },
    },
  });

  const summaryParts: string[] = [];

if (vaccinesDue.length) {
  summaryParts.push(`${vaccinesDue.length} vaccine(s) due`);
}

if (orders.length) {
  summaryParts.push(`${orders.length} order(s)`);
}

const subtitle =
  summaryParts.length > 0
    ? summaryParts.join(" • ")
    : "Quick overview";

  return {
    role: "PARENT",
    icons,
    header: {
      greeting: `Hello, ${displayName} 👋`,
      subtitle: user?.phone,
      roleBadge: { label: "Parent" },
      summary: {
        isLoading: !!isLoading,
        tone: attentionItems.length ? "primary" : "neutral",
        text: subtitle,
      },
    },
    secondaryContext: {
      title: "Your Pets",
      items: secondaryItems,
      onAdd: { label: "Add Pet", onPress: () => router.push("/parent/pets/add" as any) },
      showStatus: true,
    },
    actions: {
      title: "What would you like to do?",
      tiles,
      grid: { tilesPerRow: 3, maxVisible: 9 },
      seeAll: {
        label: "See all",
        onPress: () => router.push("/parent/actions" as any),
      },
    },
    attention: {
      title: "Attention",
      items: attentionItems,
      maxVisible: 5,
      empty: { text: "All caught up 🎉" },
    },
    sections: {
      items: sections,
    },
    discover: {
      title: "Discover",
      items: [
        {
          key: "rewards",
          title: "Rewards & Achievements",
          subtitle: "Earn points by completing care actions",
          iconName: "history",
          tone: "success",
          onPress: () => router.push("/parent/rewards" as any),
        },
        {
          key: "events",
          title: "Events Near You",
          subtitle: "Find pet events in your city",
          iconName: "calendar",
          tone: "primary",
          onPress: () => router.push("/parent/events" as any),
        },
      ],
    },
  };
}
