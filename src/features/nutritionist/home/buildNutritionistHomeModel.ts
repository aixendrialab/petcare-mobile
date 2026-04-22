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
  NutritionistHomeSummary,
  NutritionClientCard,
  NutritionGoalTag,
  ClientStatus,
} from "./types";

function moneyINR(n: number) {
  try {
    return `₹${Number(n).toLocaleString()}`;
  } catch {
    return `₹${n}`;
  }
}

function goalLabel(goal: NutritionGoalTag): string {
  switch (goal) {
    case "WEIGHT_LOSS":
      return "Weight loss";
    case "WEIGHT_GAIN":
      return "Weight gain";
    case "ALLERGY":
      return "Allergy";
    case "PUPPY_GROWTH":
      return "Puppy growth";
    case "SENIOR_CARE":
      return "Senior care";
    case "DIGESTIVE_SUPPORT":
      return "Digestive support";
    case "GENERAL_WELLNESS":
      return "General wellness";
    default:
      return String(goal);
  }
}

function statusToTone(status: ClientStatus): QuickTone {
  switch (status) {
    case "OVERDUE":
      return "warning";
    case "DUE":
      return "primary";
    case "NEW":
      return "success";
    default:
      return "neutral";
  }
}

function clientStatusLabel(status: ClientStatus): string {
  switch (status) {
    case "DUE":
      return "Check-in due";
    case "OVERDUE":
      return "Overdue";
    case "ON_TRACK":
      return "On track";
    case "NEW":
      return "New intake";
    default:
      return String(status);
  }
}

export type BuildNutritionistHomeModelArgs = {
  summary: NutritionistHomeSummary;
  router: MinimalRouter;
  icons: IconRegistry;
  greeting: string;
  isLoading?: boolean;
};

export function buildNutritionistHomeModel(
  args: BuildNutritionistHomeModelArgs
): RoleHomeModel {
  const { summary, router, icons, greeting, isLoading } = args;

  const secondaryItems: SecondaryContextItem[] = summary.clients.map(
    (c: NutritionClientCard) => ({
      key: String(c.petId),
      title: `${c.petName} • ${c.ownerName}`,
      subtitle: `${goalLabel(c.goalTag)} • ${clientStatusLabel(c.status)}`,
      imageUri: c.petImageUri ?? null,
      status:
        c.status === "OVERDUE"
          ? "dueSoon"
          : c.status === "DUE"
          ? "dueSoon"
          : "ok",
      onPress: () =>
        router.push({
          pathname: "/nutritionist/clients/[petId]",
          params: { petId: String(c.petId) },
        } as any),
    })
  );

  const attentionItems: AttentionItemModel[] = [
    {
      key: "checkinsDue",
      iconName: "calendar",
      tone: summary.today.checkinsDue ? "primary" : "neutral",
      title: `${summary.today.checkinsDue} check-ins due`,
      subtitle: summary.clients
        .filter((c) => c.status === "DUE")
        .slice(0, 3)
        .map((c) => c.petName)
        .join(" • ") || "Review due clients",
      cta: {
        text: "Review",
        onPress: () => router.push("/nutritionist/checkins" as any),
      },
    },
    {
      key: "overdue",
      iconName: "history",
      tone: summary.today.overdue ? "warning" : "neutral",
      title: `${summary.today.overdue} overdue follow-up`,
      subtitle: summary.today.overdue
        ? "Owner update pending"
        : "All follow-ups are on track",
      cta: {
        text: "Nudge",
        onPress: () => router.push("/nutritionist/followups" as any),
      },
    },
    {
      key: "newIntakes",
      iconName: "stethoscope",
      tone: summary.today.newIntakes ? "success" : "neutral",
      title: `${summary.today.newIntakes} new intakes`,
      subtitle: "Start a new nutrition plan",
      cta: {
        text: "Start",
        onPress: () => router.push("/nutritionist/intake" as any),
      },
    },
    {
      key: "messages",
      iconName: "history",
      tone: summary.today.unreadMessages ? "primary" : "neutral",
      title: `${summary.today.unreadMessages} unread messages`,
      subtitle: "Parents waiting for guidance",
      cta: {
        text: "Reply",
        onPress: () => router.push("/nutritionist/messages" as any),
      },
    },
    {
      key: "renewals",
      iconName: "calendar",
      tone: summary.today.renewalsDue ? "warning" : "neutral",
      title: `${summary.today.renewalsDue} plans expiring`,
      subtitle: "Renew this week",
      cta: {
        text: "Renew",
        onPress: () => router.push("/nutritionist/plans" as any),
      },
    },
  ];

  const tiles: ActionTileModel[] = [
    {
      key: "clients",
      title: "Clients",
      subtitle: "Pets & owners",
      tone: "primary",
      iconName: "history",
      onPress: () => router.push("/nutritionist/clients" as any),
    },
    {
      key: "plans",
      title: "Plans",
      subtitle: "Active & draft",
      tone: "primary",
      iconName: "prescription",
      badgeText: summary.planStats.activePlans
        ? `${summary.planStats.activePlans}`
        : undefined,
      onPress: () => router.push("/nutritionist/plans" as any),
    },
    {
      key: "createPlan",
      title: "Create Plan",
      subtitle: "New recommendation",
      tone: "success",
      iconName: "bowl",
      onPress: () => router.push("/nutritionist/plans/create" as any),
    },
    {
      key: "checkins",
      title: "Check-ins",
      subtitle: "Due & submitted",
      tone: summary.today.checkinsDue ? "primary" : "neutral",
      iconName: "calendar",
      badgeText: summary.today.checkinsDue
        ? `${summary.today.checkinsDue}`
        : undefined,
      onPress: () => router.push("/nutritionist/checkins" as any),
    },
    {
      key: "messages",
      title: "Messages",
      subtitle: "Client chat",
      tone: summary.today.unreadMessages ? "primary" : "neutral",
      iconName: "history",
      badgeText: summary.today.unreadMessages
        ? `${summary.today.unreadMessages}`
        : undefined,
      onPress: () => router.push("/nutritionist/messages" as any),
    },
    {
      key: "progress",
      title: "Progress",
      subtitle: "Outcomes & trends",
      tone: "neutral",
      iconName: "history",
      onPress: () => router.push("/nutritionist/progress" as any),
    },
    {
      key: "products",
      title: "Products",
      subtitle: "Food & supplements",
      tone: "success",
      iconName: "store",
      onPress: () => router.push("/nutritionist/products" as any),
    },
    {
      key: "billing",
      title: "Billing",
      subtitle: "Payments",
      tone: "primary",
      iconName: "truck",
      badgeText: summary.billing.pendingPayments
        ? `${summary.billing.pendingPayments}`
        : undefined,
      onPress: () => router.push("/nutritionist/billing" as any),
    },
    {
      key: "resources",
      title: "Resources",
      subtitle: "Templates & guides",
      tone: "neutral",
      iconName: "upload",
      onPress: () => router.push("/nutritionist/resources" as any),
    },
  ];

  const sections: SectionModel[] = [
    {
      key: "checkinsToReview",
      title: "Check-ins to Review",
      onSeeAll:  () => router.push("/nutritionist/checkins" as any),
      content: {
        kind: "rows",
        rows: summary.checkinPreview.slice(0, 3).map((c) => ({
          key: String(c.id),
          primary: `${c.petName} • ${c.weightDeltaLabel ?? "Update submitted"}`,
          secondary: `${c.stoolNote ?? "No stool note"} • ${
            c.energyNote ?? "No energy note"
          }`,
          tertiary: c.ownerName,
          onPress: () =>
            router.push({
              pathname: "/nutritionist/checkins/[id]",
              params: { id: String(c.id) },
            } as any),
        })),
        empty: { text: "No new check-ins yet." },
      },
    },
    {
      key: "activePlansSnapshot",
      title: "Active Plans Snapshot",
      onSeeAll: () => router.push("/nutritionist/plans" as any),
      content: {
        kind: "rows",
        rows: summary.planStats.categories.map((cat) => ({
          key: cat.key,
          primary: cat.label,
          secondary: `${cat.count} pet(s)`,
          onPress: () => router.push("/nutritionist/plans" as any),
        })),
        empty: { text: "No active plans yet." },
      },
    },
    {
      key: "progressHighlights",
      title: "Progress Highlights",
      onSeeAll:  () => router.push("/nutritionist/progress" as any),
      content: {
        kind: "rows",
        rows: summary.progressHighlights.slice(0, 3).map((p) => ({
          key: p.key,
          primary: p.title,
          secondary: p.subtitle ?? undefined,
          onPress: () => router.push("/nutritionist/progress" as any),
        })),
        empty: { text: "No highlights yet." },
      },
    },
    {
      key: "recommendedProducts",
      title: "Recommended Products",
      onSeeAll:  () => router.push("/nutritionist/products" as any),
      content: {
        kind: "rows",
        rows: summary.recommendedProducts.slice(0, 3).map((p) => ({
          key: String(p.productId),
          primary: p.title,
          secondary: p.reason ?? p.subtitle ?? undefined,
          onPress: () => router.push("/nutritionist/products" as any),
        })),
        empty: { text: "No product recommendations yet." },
      },
    },
  ];

  const summaryText = `Today: ${summary.today.checkinsDue} follow-up(s) • ${summary.today.newIntakes} new intake(s) • ${moneyINR(summary.billing.earnedToday)} earned`;

  return {
    role: "NUTRITIONIST",
    icons,
    header: {
      greeting,
      subtitle: `${summary.planStats.activePlans} active plan(s) • ${summary.today.checkinsDue} check-in(s) due`,
      roleBadge: { label: "Nutritionist" },
      summary: {
        isLoading: !!isLoading,
        tone: summary.today.overdue ? "warning" : "primary",
        text: summaryText,
      },
    },
    secondaryContext: {
      title: "My Clients",
      items: secondaryItems,
      onAdd: {
        label: "New Intake",
        onPress: () => router.push("/nutritionist/intake" as any),
      },
      showStatus: true,
    },
    attention: {
      title: "Today",
      items: attentionItems,
      maxVisible: 5,
      empty: { text: "All caught up 🎉" },
    },
    actions: {
      title: "What would you like to do?",
      tiles,
      grid: { tilesPerRow: 3, maxVisible: 9 },
      seeAll: {
        label: "See all",
        onPress: () => router.push("/nutritionist/actions" as any),
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
        tone: "success",
        onPress: () => router.push("/nutritionist/discover" as any),
      })),
    },
  };
}