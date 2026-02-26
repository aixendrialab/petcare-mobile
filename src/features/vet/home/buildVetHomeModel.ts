type MinimalRouter = { push: (href: any) => void };

import type {
  IconRegistry,
  RoleHomeModel,
  SecondaryContextItem,
  ActionTileModel,
  AttentionItemModel,
  SectionModel,
  QuickTone,
} from "@/src/components/home";

import type { VetHomeSummary } from "./types";

export type BuildVetHomeModelArgs = {
  summary: VetHomeSummary;
  router: MinimalRouter;
  icons: IconRegistry;
  greeting: string;
  isLoading?: boolean;
};

function toneFromCount(n: number): QuickTone {
  if (n >= 5) return "warning";
  if (n >= 1) return "primary";
  return "neutral";
}

export function buildVetHomeModel(args: BuildVetHomeModelArgs): RoleHomeModel {
  const { summary, router, icons, greeting, isLoading } = args;

  const activeClinic = summary.clinics.find((c) => c.id === summary.activeClinicId);

  const secondaryItems: SecondaryContextItem[] = summary.clinics.map((c) => ({
  key: String(c.id),
  title: c.name,
  subtitle: `${c.city} • ${c.waiting} waiting • ${c.inConsult} consult`,
  onPress: () => {
    router.push({ pathname: "/vet/home", params: { clinicId: String(c.id) } } as any);
  },
}));

  const tiles: ActionTileModel[] = [
    {
      key: "checkin",
      title: "Check-in",
      subtitle: "Front desk",
      tone: "neutral",
      iconName: "upload", // temporary mapping
      onPress: () => router.push("/vet/checkin" as any),
    },
    {
      key: "queue",
      title: "Queue",
      subtitle: "Arrived / waiting",
      tone: toneFromCount(summary.waiting),
      iconName: "history",
      badgeText: summary.waiting ? `${summary.waiting}` : undefined,
      badgeTone: summary.waiting ? toneFromCount(summary.waiting) : undefined,
      onPress: () => router.push("/vet/queue" as any),
    },
    {
      key: "inventory",
      title: "Inventory",
      subtitle: "Stock & PO",
      tone: summary.inventory.lowStockCount ? "warning" : "neutral",
      iconName: "store",
      badgeText: summary.inventory.lowStockCount ? `${summary.inventory.lowStockCount}` : undefined,
      badgeTone: summary.inventory.lowStockCount ? "warning" : undefined,
      onPress: () => router.push("/vet/inventory" as any),
    },
    {
      key: "televisit",
      title: "Televisit",
      subtitle: "Start room",
      tone: "primary",
      iconName: "video",
      onPress: () => router.push("/vet/televisit" as any),
    },
    {
      key: "appointments",
      title: "Appointments",
      subtitle: "Open & booked",
      tone: "primary",
      iconName: "calendar",
      onPress: () => router.push("/vet/schedule" as any),
    },
    {
      key: "labs",
      title: "Labs",
      subtitle: "Orders & results",
      tone: summary.labsPending ? "primary" : "neutral",
      iconName: "prescription", // temporary mapping
      badgeText: summary.labsPending ? `${summary.labsPending}` : undefined,
      badgeTone: summary.labsPending ? "primary" : undefined,
      onPress: () => router.push("/vet/labs" as any),
    },
  ];

  const attentionItems: AttentionItemModel[] = [
    {
      key: "waiting",
      iconName: "history",
      tone: toneFromCount(summary.waiting),
      title: `${summary.waiting} patients waiting`,
      subtitle: "Longest wait • 12m", // later from API
      cta: { text: "Open queue", onPress: () => router.push("/vet/queue" as any) },
    },
    {
      key: "arrived",
      iconName: "stethoscope",
      tone: toneFromCount(summary.arrived),
      title: `${summary.arrived} arrived`,
      subtitle: "2 new since 10:30", // later from API
      cta: { text: "Start", onPress: () => router.push("/vet/consult" as any) },
    },
    {
      key: "labs",
      iconName: "prescription",
      tone: summary.labsPending ? "primary" : "neutral",
      title: `${summary.labsPending} results pending`,
      subtitle: "1 flagged abnormal", // later from API
      cta: { text: "Review", onPress: () => router.push("/vet/labs" as any) },
    },
    {
      key: "lowStock",
      iconName: "store",
      tone: summary.inventory.lowStockCount ? "warning" : "neutral",
      title: `${summary.inventory.lowStockCount} low-stock items`,
      subtitle: summary.inventory.lowItems.join(" • "),
      cta: { text: "View stock", onPress: () => router.push("/vet/inventory" as any) },
    },
  ];

  const sections: SectionModel[] = [
    {
      key: "queuePreview",
      title: "Queue",
      onSeeAll: () => router.push("/vet/queue" as any),
      content: {
        kind: "rows",
        rows: summary.queuePreview.map((q) => ({
          key: `${q.petName}-${q.ownerName}`,
          primary: `${q.petName} • ${q.waitMinutes}m`,
          secondary: `${q.reason} • ${q.ownerName}`,
          onPress: () => router.push("/vet/queue" as any),
        })),
        empty: { text: "No one waiting 🎉" },
      },
    },
    {
      key: "schedule",
      title: "Today’s Schedule",
      onSeeAll: () => router.push("/vet/schedule" as any),
      content: {
        kind: "rows",
        rows: [
          { key: "open", primary: "Open", secondary: String(summary.todaySchedule.open) },
          { key: "completed", primary: "Completed", secondary: String(summary.todaySchedule.completed) },
          { key: "upcoming", primary: "Upcoming", secondary: String(summary.todaySchedule.upcoming) },
        ],
      },
    },
    {
      key: "billing",
      title: "Billing",
      onSeeAll:  () => router.push("/vet/invoices" as any) ,
      content: {
        kind: "rows",
        rows: [
          { key: "billed", primary: "Billed today", secondary: `₹${summary.billing.billedToday}` },
          { key: "pending", primary: "Pending invoices", secondary: String(summary.billing.pendingInvoices) },
          { key: "refunds", primary: "Refunds", secondary: String(summary.billing.refunds) },
        ],
      },
    },
  ];

  const subtitleLine1 = `${activeClinic?.name ?? "Clinic"} • ${activeClinic?.city ?? ""}`.trim();
  const subtitleLine2 = `Today: ${summary.todaySchedule.open} appts • ${summary.waiting} waiting • ₹${summary.billing.billedToday.toLocaleString()} billed`;

  return {
    role: "VET",
    icons,

    header: {
      greeting,
      subtitle: subtitleLine1,
      roleBadge: { label: "Vet" },
      summary: {
        isLoading: !!isLoading,
        tone: attentionItems.length ? "primary" : "neutral",
        text: subtitleLine2,
      },
    },

    secondaryContext: {
      title: "Clinics",
      items: secondaryItems,
      showStatus: true,
    },

    attention: {
      title: "Now",
      items: attentionItems,
      maxVisible: 4,
      empty: { text: "All caught up 🎉" },
    },

    actions: {
      title: "What would you like to do?",
      tiles,
      grid: { tilesPerRow: 3, maxVisible: 6 },
      seeAll: { label: "See all", onPress: () => router.push("/vet/actions" as any) },
    },

    sections: { items: sections },

    discover: {
      title: "Discover",
      items: [
        {
          key: "cme",
          title: "CME event coming up",
          subtitle: "Earn credits & learn",
          iconName: "calendar",
          tone: "primary",
          onPress: () => router.push("/vet/discover" as any),
        },
        {
          key: "feature",
          title: "New: faster consult notes",
          subtitle: "Try the updated workflow",
          iconName: "stethoscope",
          tone: "success",
          onPress: () => router.push("/vet/discover" as any),
        },
      ],
    },
  };
}