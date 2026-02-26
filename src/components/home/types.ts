// src/components/home/types.ts
import type React from "react";

/** ---------- Core enums / shared primitives ---------- */

export type RoleKind = "PARENT" | "VET" | "VENDOR" | "NUTRITIONIST";
export type QuickTone = "neutral" | "primary" | "success" | "warning";

export type IconName =
  | "stethoscope"
  | "syringe"
  | "calendar"
  | "history"
  | "video"
  | "upload"
  | "store"
  | "cart"
  | "truck"
  | "pills"
  | "bowl"
  | "prescription";

/** Icon registry is injected so the shell stays generic */
export type IconRegistry = Record<IconName, React.ReactElement>;

/** Common tiny badge/chip type */
export type ChipModel = {
  text: string;
  tone?: QuickTone;
};

/** Common "see all" action */
export type SeeAllModel = {
  label?: string; // default: "See all"
  onPress: () => void;
};

/** ---------- Top-level model fed into RoleHomeShell ---------- */

export type RoleHomeModel = {
  role: RoleKind;
  header: HeaderModel;
  secondaryContext: SecondaryContextModel;
  actions: ActionsModel;
  attention: AttentionModel;
  sections: StateSectionsModel;
  discover?: DiscoverModel;
  icons: IconRegistry;
};

/** ---------- Header (Primary context: WHO) ---------- */

export type HeaderModel = {
  greeting: string; // "Hello, Ram 👋"
  subtitle?: string; // phone/email/store id etc.

  /** If not provided, shell can derive label from role */
  roleBadge?: {
    label: string; // "Parent" / "Vendor" / "Vet"
  };

  /** One-line state summary */
  summary?: {
    text: string; // "1 vaccine due • 1 delivery arriving • next appt in 2 days"
    tone?: QuickTone;
    isLoading?: boolean;
  };

  /** Right-side actions in header (optional, future) */
  actions?: {
    showBell?: boolean;
    onPressBell?: () => void;

    showProfile?: boolean;
    onPressProfile?: () => void;
  };
};

/** ---------- Secondary context strip (Pets, Stores, Locations etc) ---------- */

export type ContextStatus = "ok" | "dueSoon" | "overdue";

export type SecondaryContextModel = {
  title: string; // "Your Pets" / "Your Stores"
  items: SecondaryContextItem[];

  onAdd?: {
    label: string; // "Add Pet"
    onPress: () => void;
  };

  /**
   * When true, the shell renders status dots/chips (default true).
   * When false, it renders only avatar + title/subtitle.
   */
  showStatus?: boolean;
};

export type SecondaryContextItem = {
  key: string;
  title: string; // "Bella"
  subtitle?: string; // "Golden Retriever" / "Vizag Store"
  imageUri?: string | null;

  /** Quick status indicator (NOT a switcher/tab) */
  status?: ContextStatus;

  /** Optional small chips under name, e.g. "1 due" "Rx" */
  badges?: ChipModel[];

  onPress: () => void; // open pet/store profile
};

/** ---------- Primary actions (Tiles) ---------- */

export type ActionCategoryKey = "care" | "appointments" | "commerce" | "engagement";

export type ActionCategory = {
  key: ActionCategoryKey;
  label: string; // "Care"
  iconName?: IconName;
};

export type ActionsModel = {
  title: string; // "What would you like to do?"
  tiles: ActionTileModel[];

  grid: {
    tilesPerRow: number; // 3 or 4
    maxVisible?: number; // e.g. 8 (if more, show seeAll)
  };

  seeAll?: SeeAllModel;

  /**
   * Optional: category pills/tabs shown under the actions header
   * Use if you want grouping/navigation; keep disabled by default.
   */
  categories?: {
    enabled: boolean;
    items: ActionCategory[];

    /** Only if you want interactive filtering */
    selectedKey?: ActionCategoryKey;
    onSelect?: (key: ActionCategoryKey) => void;
  };
};

export type ActionScope = "ALL" | "CARE";

/**
 * Tile model supports “smart tiles” via badgeText/badgeTone.
 * scope="CARE" lets you show pet-context hinting only for care actions.
 */
export type ActionTileModel = {
  key: string;

  title: string; // "Vaccines"
  subtitle?: string; // "Schedule & history"

  iconName: IconName;
  tone?: QuickTone;

  /** Smart badge (computed from state): "1 due", "2 in transit", "3 items" */
  badgeText?: string;
  badgeTone?: QuickTone;

  /** Optional: category association if categories enabled */
  categoryKey?: ActionCategoryKey;

  /** Your preference: pet context only for CARE actions */
  scope?: ActionScope;

  onPress: () => void;
};

/** ---------- Tier 1: Attention panel (Urgent / Next-best-actions) ---------- */

export type AttentionModel = {
  title: string; // "Attention"
  items: AttentionItemModel[];

  maxVisible?: number; // e.g. 5

  empty?: {
    text: string; // "All caught up 🎉"
  };
};

export type AttentionItemModel = {
  key: string;

  iconName: IconName;
  tone?: QuickTone;

  /** Main copy */
  title: string; // "Bella: Rabies vaccine due in 3 days"
  subtitle?: string; // "Due on Jan 18"

  /** Optional pill like "Bella" or "Order #123" */
  scopeLabel?: string;

  /** Click entire row (optional) */
  onPress?: () => void;

  /** Primary CTA button on right */
  cta?: {
    text: string; // "Schedule" / "Refill" / "Track"
    onPress: () => void;
  };
};

/** ---------- Tier 2: State sections (cards) ---------- */

export type StateSectionsModel = {
  items: SectionModel[];
};

export type SectionAccent = {
  iconName: IconName;
  tone?: QuickTone;
  label?: string; // "Upcoming", "Delivery", "Medicines"
};

export type EmptyModel = {
  text: string;
  action?: {
    label?: string; // default: "Tap to continue"
    onPress: () => void;
  };
};

export type SectionRowModel = {
  key: string;
  primary: string;
  secondary?: string;
  tertiary?: string;

  leftIconName?: IconName;
  onPress?: () => void;
};

export type SectionContent =
  | {
      kind: "rows";
      rows: SectionRowModel[];
      empty?: EmptyModel;
    }
  | {
      kind: "custom";
      render: () => React.ReactNode;
    };

export type SectionModel = {
  key: string;
  title: string;

  accent?: SectionAccent;
  onSeeAll?: () => void;

  /**
   * Prefer "rows" to keep sections consistent & shell-friendly.
   * Use "custom" only when needed (e.g. your Next Appointment Card).
   */
  content: SectionContent;
};

/** ---------- Optional: Discover / Engagement ---------- */

export type DiscoverModel = {
  title: string; // "Discover"
  collapsedByDefault?: boolean;
  items: DiscoverItemModel[];
};

export type DiscoverItemModel = {
  key: string;
  title: string; // "Rewards & Achievements"
  subtitle?: string;
  iconName: IconName;
  tone?: QuickTone;
  onPress: () => void;
};
