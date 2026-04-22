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
  WalkerHomeSummary,
  WalkerClientPet,
  WalkSessionPreview,
} from "./types";

function moneyINR(n: number) {
  try {
    return `₹${Number(n).toLocaleString()}`;
  } catch {
    return `₹${n}`;
  }
}

function petStatusToContextStatus(
  status: WalkerClientPet["status"]
): "ok" | "dueSoon" {
  switch (status) {
    case "NOW":
    case "SETUP":
    case "UPCOMING":
      return "dueSoon";
    default:
      return "ok";
  }
}

function countTone(n: number, warnAt = 2): QuickTone {
  if (n >= warnAt) return "warning";
  if (n > 0) return "primary";
  return "neutral";
}

function sessionPrimary(s: WalkSessionPreview) {
  return `${s.petName} • ${s.timeLabel}`;
}

function sessionSecondary(s: WalkSessionPreview) {
  return `${s.ownerName}${s.addressLine ? ` • ${s.addressLine}` : ""}`;
}

export type BuildWalkerHomeModelArgs = {
  summary: WalkerHomeSummary;
  router: MinimalRouter;
  icons: IconRegistry;
  greeting: string;
  isLoading?: boolean;
};

export function buildWalkerHomeModel(
  args: BuildWalkerHomeModelArgs
): RoleHomeModel {
  const { summary, router, icons, greeting, isLoading } = args;

  const secondaryItems: SecondaryContextItem[] = summary.assignedPets.map(
    (p: WalkerClientPet) => ({
      key: String(p.petId),
      title: `${p.petName} • ${p.ownerName}`,
      subtitle: p.timeLabel,
      imageUri: p.imageUri ?? null,
      status: petStatusToContextStatus(p.status),
      onPress: () =>
        router.push({
          pathname: "/walker/pets/[petId]",
          params: { petId: String(p.petId) },
        } as any),
    })
  );

  const attentionItems: AttentionItemModel[] = [
    {
      key: "startingSoon",
      iconName: "calendar",
      tone: countTone(summary.attention.startingSoon, 1),
      title: `${summary.attention.startingSoon} walk starting soon`,
      subtitle: "Open your next session",
      cta: {
        text: "Open",
        onPress: () => router.push("/walker/today" as any),
      },
    },
    {
      key: "inProgress",
      iconName: "truck",
      tone: summary.attention.inProgress ? "primary" : "neutral",
      title: `${summary.attention.inProgress} in progress`,
      subtitle: "Resume or complete active walk",
      cta: {
        text: "Resume",
        onPress: () => router.push("/walker/today" as any),
      },
    },
    {
      key: "pendingProof",
      iconName: "upload",
      tone: countTone(summary.attention.pendingProof, 1),
      title: `${summary.attention.pendingProof} missing proof/update`,
      subtitle: "Photo or potty note pending",
      cta: {
        text: "Complete",
        onPress: () => router.push("/walker/updates" as any),
      },
    },
    {
      key: "changedBookings",
      iconName: "history",
      tone: summary.attention.changedBookings ? "warning" : "neutral",
      title: `${summary.attention.changedBookings} changed booking`,
      subtitle: "Timing or session changed",
      cta: {
        text: "Review",
        onPress: () => router.push("/walker/requests" as any),
      },
    },
    {
      key: "setup",
      iconName: "stethoscope",
      tone: summary.attention.pendingSetup ? "warning" : "neutral",
      title: `${summary.attention.pendingSetup} pending setup`,
      subtitle: "Accepted but not ready to start",
      cta: {
        text: "Setup",
        onPress: () => router.push("/walker/plans" as any),
      },
    },
  ];

  const tiles: ActionTileModel[] = [
    {
      key: "today",
      title: "Today’s Walks",
      subtitle: "Upcoming & active",
      tone: "primary",
      iconName: "calendar",
      badgeText: summary.todayStats.upcoming
        ? `${summary.todayStats.upcoming}`
        : undefined,
      badgeTone: summary.todayStats.upcoming ? "primary" : undefined,
      onPress: () => router.push("/walker/today" as any),
    },
    {
      key: "start",
      title: "Start Walk",
      subtitle: "Open next session",
      tone: "success",
      iconName: "truck",
      onPress: () => router.push("/walker/today" as any),
    },
    {
      key: "updates",
      title: "Updates",
      subtitle: "Photo & notes",
      tone: summary.attention.pendingProof ? "warning" : "neutral",
      iconName: "upload",
      badgeText: summary.attention.pendingProof
        ? `${summary.attention.pendingProof}`
        : undefined,
      badgeTone: summary.attention.pendingProof ? "warning" : undefined,
      onPress: () => router.push("/walker/updates" as any),
    },
    {
      key: "messages",
      title: "Messages",
      subtitle: "Parent chat",
      tone: summary.attention.unreadMessages ? "primary" : "neutral",
      iconName: "history",
      badgeText: summary.attention.unreadMessages
        ? `${summary.attention.unreadMessages}`
        : undefined,
      onPress: () => router.push("/walker/messages" as any),
    },
    {
      key: "schedule",
      title: "Schedule",
      subtitle: "Plans & timings",
      tone: "neutral",
      iconName: "calendar",
      onPress: () => router.push("/walker/schedule" as any),
    },
    {
      key: "earnings",
      title: "Earnings",
      subtitle: "Income & payout",
      tone: "primary",
      iconName: "prescription",
      onPress: () => router.push("/walker/earnings" as any),
    },
    {
      key: "requests",
      title: "Requests",
      subtitle: "New & pending",
      tone: summary.requests.pending ? "primary" : "neutral",
      iconName: "stethoscope",
      badgeText: summary.requests.pending
        ? `${summary.requests.pending}`
        : undefined,
      onPress: () => router.push("/walker/requests" as any),
    },
    {
      key: "history",
      title: "History",
      subtitle: "Completed walks",
      tone: "neutral",
      iconName: "history",
      onPress: () => router.push("/walker/history" as any),
    },
    {
      key: "profile",
      title: "Profile",
      subtitle: "Availability",
      tone: "neutral",
      iconName: "upload",
      onPress: () => router.push("/walker/profile" as any),
    },
  ];

  const sections: SectionModel[] = [];

  sections.push({
    key: "nextWalk",
    title: "Next Walk",
    onSeeAll: () => router.push("/walker/today" as any),
    content: {
      kind: "rows",
      rows: summary.nextSession
        ? [
            {
              key: String(summary.nextSession.id),
              primary: `${summary.nextSession.petName} • ${summary.nextSession.timeLabel}`,
              secondary: `${summary.nextSession.ownerName}${summary.nextSession.addressLine ? ` • ${summary.nextSession.addressLine}` : ""}`,
              tertiary: `${summary.nextSession.durationMin} min`,
              onPress: () =>
                router.push({
                  pathname: "/walker/sessions/[id]",
                  params: { id: String(summary.nextSession!.id) },
                } as any),
            },
          ]
        : [],
      empty: { text: "No upcoming walk right now." },
    },
  });

  sections.push({
    key: "todaySnapshot",
    title: "Today’s Walks",
    onSeeAll: () => router.push("/walker/today" as any),
    content: {
      kind: "rows",
      rows: [
        {
          key: "upcoming",
          primary: "Upcoming",
          secondary: String(summary.todayStats.upcoming),
        },
        {
          key: "inProgress",
          primary: "In progress",
          secondary: String(summary.todayStats.inProgress),
        },
        {
          key: "completed",
          primary: "Completed",
          secondary: String(summary.todayStats.completed),
        },
        {
          key: "cancelled",
          primary: "Cancelled",
          secondary: String(summary.todayStats.cancelled),
        },
      ],
    },
  });

  sections.push({
    key: "pendingUpdates",
    title: "Pending Updates",
    onSeeAll: () => router.push("/walker/updates" as any),
    content: {
      kind: "rows",
      rows: summary.sessions.pendingUpdates.slice(0, 3).map((s) => ({
        key: String(s.id),
        primary: sessionPrimary(s),
        secondary: `${s.petName}${s.proofPending ? " • Photo pending" : ""}${s.notesPending ? " • Notes pending" : ""}`,
        tertiary: s.ownerName,
        onPress: () =>
          router.push({
            pathname: "/walker/sessions/[id]",
            params: { id: String(s.id) },
          } as any),
      })),
      empty: { text: "All walk updates completed ✅" },
    },
  });

  sections.push({
    key: "recentCompleted",
    title: "Recent Completed Walks",
    onSeeAll: () => router.push("/walker/history" as any),
    content: {
      kind: "rows",
      rows: summary.sessions.recentCompleted.slice(0, 3).map((s) => ({
        key: String(s.id),
        primary: sessionPrimary(s),
        secondary: sessionSecondary(s),
        tertiary: `${s.durationMin} min`,
        onPress: () =>
          router.push({
            pathname: "/walker/sessions/[id]",
            params: { id: String(s.id) },
          } as any),
      })),
      empty: { text: "No completed walks yet." },
    },
  });

  sections.push({
    key: "earnings",
    title: "Earnings Snapshot",
    onSeeAll: () => router.push("/walker/earnings" as any),
    content: {
      kind: "rows",
      rows: [
        {
          key: "todayEarned",
          primary: "Today earned",
          secondary: moneyINR(summary.earnings.today),
        },
        {
          key: "weekEarned",
          primary: "This week",
          secondary: moneyINR(summary.earnings.week),
        },
        {
          key: "pendingPayout",
          primary: "Pending payout",
          secondary: moneyINR(summary.earnings.pendingPayout),
        },
      ],
    },
  });

  const summaryText = `Today: ${summary.todayStats.upcoming} upcoming • ${summary.todayStats.inProgress} in progress • ${moneyINR(summary.earnings.today)} earned`;

  return {
    role: "WALKER",
    icons,
    header: {
      greeting,
      subtitle: `Dog Walker • ${summary.sessions.today.length} walk(s) today`,
      roleBadge: { label: "Walker" },
      summary: {
        isLoading: !!isLoading,
        tone: summary.attention.pendingProof || summary.attention.pendingSetup
          ? "warning"
          : "primary",
        text: summaryText,
      },
    },
    secondaryContext: {
      title: "Today’s Pets",
      items: secondaryItems,
      onAdd: {
        label: "Requests",
        onPress: () => router.push("/walker/requests" as any),
      },
      showStatus: true,
    },
    attention: {
      title: "Now",
      items: attentionItems,
      maxVisible: 5,
      empty: { text: "All set for the day 🎉" },
    },
    actions: {
      title: "What would you like to do?",
      tiles,
      grid: { tilesPerRow: 3, maxVisible: 9 },
      seeAll: {
        label: "See all",
        onPress: () => router.push("/walker/actions" as any),
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
        onPress: () => router.push("/walker/discover" as any),
      })),
    },
  };
}