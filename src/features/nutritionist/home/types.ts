export type NutritionGoalTag =
  | "WEIGHT_LOSS"
  | "WEIGHT_GAIN"
  | "ALLERGY"
  | "PUPPY_GROWTH"
  | "SENIOR_CARE"
  | "DIGESTIVE_SUPPORT"
  | "GENERAL_WELLNESS"
  | string;

export type ClientStatus =
  | "DUE"
  | "OVERDUE"
  | "ON_TRACK"
  | "NEW"
  | string;

export type NutritionClientCard = {
  petId: number;
  petName: string;
  petImageUri?: string | null;

  ownerName: string;

  goalTag: NutritionGoalTag;
  status: ClientStatus;

  latestWeightKg?: number | null;
  lastCheckinAt?: string | null;
};

export type NutritionCheckinPreview = {
  id: number;

  petId: number;
  petName: string;
  ownerName: string;

  submittedAt: string; // ISO

  weightBeforeKg?: number | null;
  weightNowKg?: number | null;
  weightDeltaLabel?: string | null;

  stoolNote?: string | null;
  appetiteNote?: string | null;
  energyNote?: string | null;
};

export type NutritionPlanCategoryStat = {
  key: string;
  label: string;
  count: number;
};

export type NutritionPlanStats = {
  activePlans: number;
  expiringThisWeek: number;
  categories: NutritionPlanCategoryStat[];
};

export type NutritionProgressHighlight = {
  key: string;
  title: string;
  subtitle?: string | null;
};

export type NutritionRecommendedProduct = {
  productId: number;
  title: string;
  subtitle?: string | null;
  imageUri?: string | null;
  reason?: string | null;
};

export type NutritionMessagesSummary = {
  unread: number;
};

export type NutritionBillingSummary = {
  earnedToday: number;
  pendingPayments: number;
};

export type NutritionTodaySummary = {
  checkinsDue: number;
  overdue: number;
  newIntakes: number;
  unreadMessages: number;
  renewalsDue: number;
  scheduledConsults: number;
};

export type NutritionistHomeSummary = {
  clients: NutritionClientCard[];

  today: NutritionTodaySummary;

  checkinPreview: NutritionCheckinPreview[];

  planStats: NutritionPlanStats;

  progressHighlights: NutritionProgressHighlight[];

  recommendedProducts: NutritionRecommendedProduct[];

  messages: NutritionMessagesSummary;

  billing: NutritionBillingSummary;

  discover?: {
    key: string;
    title: string;
    subtitle?: string | null;
  }[];
};