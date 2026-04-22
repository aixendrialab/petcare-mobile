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

import type {
  HostelHomeSummary,
  HostelFacilityCard,
} from "./types";

function moneyINR(n: number) {
  try {
    return `₹${Number(n).toLocaleString()}`;
  } catch {
    return `₹${n}`;
  }
}

function toneFromCount(n: number, warnAt = 3): QuickTone {
  if (n >= warnAt) return "warning";
  if (n > 0) return "primary";
  return "neutral";
}

export type BuildHostelHomeModelArgs = {
  summary: HostelHomeSummary;
  router: MinimalRouter;
  icons: IconRegistry;
  greeting: string;
  isLoading?: boolean;
};

export function buildHostelHomeModel(
  args: BuildHostelHomeModelArgs
): RoleHomeModel {
  const { summary, router, icons, greeting, isLoading } = args;

  const activeFacility =
    summary.facilities.find((f) => f.id === summary.activeFacilityId) ?? null;

  const secondaryItems: SecondaryContextItem[] = summary.facilities.map(
    (f: HostelFacilityCard) => ({
      key: String(f.id),
      title: f.name,
      subtitle: `${f.city} • ${f.petsInStay} in stay • ${f.occupancyPct}% occupied`,
      onPress: () =>
        router.push({
          pathname: "/hostel/home",
          params: { facilityId: String(f.id) },
        } as any),
    })
  );

  const attentionItems: AttentionItemModel[] = [
    {
      key: "arrivals",
      iconName: "calendar",
      tone: toneFromCount(summary.today.arrivals, 2),
      title: `${summary.today.arrivals} arrival(s) today`,
      subtitle: "Prepare check-ins",
      cta: {
        text: "Prepare",
        onPress: () => router.push("/hostel/arrivals" as any),
      },
    },
    {
      key: "departures",
      iconName: "truck",
      tone: toneFromCount(summary.today.departures, 2),
      title: `${summary.today.departures} departure(s) today`,
      subtitle: "Prepare check-outs",
      cta: {
        text: "Process",
        onPress: () => router.push("/hostel/departures" as any),
      },
    },
    {
      key: "careTasks",
      iconName: "bowl",
      tone: toneFromCount(summary.care.pendingTasks, 4),
      title: `${summary.care.pendingTasks} care task(s) pending`,
      subtitle: `${summary.care.feedingDue} feeding • ${summary.care.medsDue} meds • ${summary.care.walksDue} walk`,
      cta: {
        text: "Open tasks",
        onPress: () => router.push("/hostel/tasks" as any),
      },
    },
    {
      key: "specialCare",
      iconName: "pills",
      tone: summary.care.specialCarePets ? "warning" : "neutral",
      title: `${summary.care.specialCarePets} special-care pet(s)`,
      subtitle: "Needs closer monitoring",
      cta: {
        text: "Review",
        onPress: () => router.push("/hostel/stays" as any),
      },
    },
    {
      key: "messages",
      iconName: "history",
      tone: summary.today.unreadMessages ? "primary" : "neutral",
      title: `${summary.today.unreadMessages} unread message(s)`,
      subtitle: "Parents waiting for update",
      cta: {
        text: "Reply",
        onPress: () => router.push("/hostel/messages" as any),
      },
    },
  ];

  const tiles: ActionTileModel[] = [
    {
      key: "bookings",
      title: "Bookings",
      subtitle: "Upcoming stays",
      tone: "primary",
      iconName: "calendar",
      badgeText: summary.today.arrivals ? `${summary.today.arrivals}` : undefined,
      onPress: () => router.push("/hostel/bookings" as any),
    },
    {
      key: "currentStays",
      title: "Current Stays",
      subtitle: "In-facility pets",
      tone: "primary",
      iconName: "history",
      badgeText: activeFacility?.petsInStay ? `${activeFacility.petsInStay}` : undefined,
      onPress: () => router.push("/hostel/stays" as any),
    },
    {
      key: "careTasks",
      title: "Care Tasks",
      subtitle: "Feeding & meds",
      tone: summary.care.pendingTasks ? "warning" : "neutral",
      iconName: "bowl",
      badgeText: summary.care.pendingTasks ? `${summary.care.pendingTasks}` : undefined,
      badgeTone: summary.care.pendingTasks ? "warning" : undefined,
      onPress: () => router.push("/hostel/tasks" as any),
    },
    {
      key: "checkin",
      title: "Check-in",
      subtitle: "Arrival process",
      tone: "success",
      iconName: "upload",
      onPress: () => router.push("/hostel/arrivals" as any),
    },
    {
      key: "checkout",
      title: "Check-out",
      subtitle: "Departure process",
      tone: "neutral",
      iconName: "truck",
      onPress: () => router.push("/hostel/departures" as any),
    },
    {
      key: "rooms",
      title: "Rooms",
      subtitle: "Kennels & suites",
      tone: "neutral",
      iconName: "store",
      onPress: () => router.push("/hostel/rooms" as any),
    },
    {
      key: "messages",
      title: "Messages",
      subtitle: "Parent chat",
      tone: summary.today.unreadMessages ? "primary" : "neutral",
      iconName: "history",
      badgeText: summary.today.unreadMessages
        ? `${summary.today.unreadMessages}`
        : undefined,
      onPress: () => router.push("/hostel/messages" as any),
    },
    {
      key: "billing",
      title: "Billing",
      subtitle: "Payments",
      tone: "primary",
      iconName: "prescription",
      badgeText: summary.revenue.pendingPayments
        ? `${summary.revenue.pendingPayments}`
        : undefined,
      onPress: () => router.push("/hostel/billing" as any),
    },
    {
      key: "availability",
      title: "Availability",
      subtitle: "Capacity & slots",
      tone: "neutral",
      iconName: "calendar",
      onPress: () => router.push("/hostel/availability" as any),
    },
  ];

  const sections: SectionModel[] = [
    {
      key: "arrivalsToday",
      title: "Arrivals Today",
      onSeeAll: () => router.push("/hostel/arrivals" as any),
      content: {
        kind: "rows",
        rows: summary.arrivalsPreview.slice(0, 3).map((a) => ({
          key: String(a.bookingId),
          primary: `${a.petName} • ${a.timeLabel}`,
          secondary: a.ownerName,
          onPress: () =>
            router.push({
              pathname: "/hostel/bookings/[id]",
              params: { id: String(a.bookingId) },
            } as any),
        })),
        empty: { text: "No arrivals today." },
      },
    },
    {
      key: "inStaySnapshot",
      title: "In Stay Snapshot",
      onSeeAll:() => router.push("/hostel/stays" as any),
      content: {
        kind: "rows",
        rows: [
          {
            key: "occupied",
            primary: "Pets in stay",
            secondary: String(activeFacility?.petsInStay ?? 0),
          },
          {
            key: "occupancy",
            primary: "Occupancy",
            secondary: `${summary.today.occupancyPct}%`,
          },
          {
            key: "special",
            primary: "Special care",
            secondary: String(summary.care.specialCarePets),
          },
        ],
      },
    },
    {
      key: "departuresToday",
      title: "Departures Today",
      onSeeAll:() => router.push("/hostel/departures" as any),
      content: {
        kind: "rows",
        rows: summary.departuresPreview.slice(0, 3).map((d) => ({
          key: String(d.bookingId),
          primary: `${d.petName} • ${d.timeLabel}`,
          secondary: d.ownerName,
          onPress: () =>
            router.push({
              pathname: "/hostel/bookings/[id]",
              params: { id: String(d.bookingId) },
            } as any),
        })),
        empty: { text: "No departures today." },
      },
    },
    {
      key: "careBreakdown",
      title: "Care Tasks",
      onSeeAll: () => router.push("/hostel/tasks" as any),
      content: {
        kind: "rows",
        rows: [
          {
            key: "feeding",
            primary: "Feeding due",
            secondary: String(summary.care.feedingDue),
          },
          {
            key: "meds",
            primary: "Medication due",
            secondary: String(summary.care.medsDue),
          },
          {
            key: "walks",
            primary: "Walks due",
            secondary: String(summary.care.walksDue),
          },
          {
            key: "grooming",
            primary: "Grooming due",
            secondary: String(summary.care.groomingDue),
          },
        ],
      },
    },
    {
      key: "revenueSnapshot",
      title: "Revenue Snapshot",
      onSeeAll: () => router.push("/hostel/billing" as any),
      content: {
        kind: "rows",
        rows: [
          {
            key: "todayRevenue",
            primary: "Today revenue",
            secondary: moneyINR(summary.revenue.today),
          },
          {
            key: "pendingPayments",
            primary: "Pending payments",
            secondary: String(summary.revenue.pendingPayments),
          },
        ],
      },
    },
  ];

  const headerSubtitle = `${activeFacility?.name ?? "Boarding"}${
    activeFacility?.city ? ` • ${activeFacility.city}` : ""
  }`;

  const summaryText = `Today: ${summary.today.arrivals} arrival(s) • ${summary.today.departures} departure(s) • ${summary.today.occupancyPct}% occupancy`;

  return {
    role: "HOSTEL",
    icons,
    header: {
      greeting,
      subtitle: headerSubtitle,
      roleBadge: { label: "Boarding" },
      summary: {
        isLoading: !!isLoading,
        tone: summary.care.pendingTasks || summary.care.specialCarePets ? "warning" : "primary",
        text: summaryText,
      },
    },
    secondaryContext: {
      title: "Your Facilities",
      items: secondaryItems,
      onAdd: {
        label: "Add Facility",
        onPress: () => router.push("/hostel/onboarding" as any),
      },
      showStatus: false,
    },
    attention: {
      title: "Now",
      items: attentionItems,
      maxVisible: 5,
      empty: { text: "Operations look good ✅" },
    },
    actions: {
      title: "What would you like to do?",
      tiles,
      grid: { tilesPerRow: 3, maxVisible: 9 },
      seeAll: {
        label: "See all",
        onPress: () => router.push("/hostel/actions" as any),
      },
    },
    sections: {
      items: sections,
    },
    discover: {
      title: "Discover",
      items: (summary.discover ?? []).map((d) => ({
        key: d.key,
        title: d.title,
        subtitle: d.subtitle ?? undefined,
        iconName: "history",
        tone: "neutral",
        onPress: () => router.push("/hostel/discover" as any),
      })),
    },
  };
}