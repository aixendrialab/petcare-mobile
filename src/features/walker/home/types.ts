export type WalkRequestStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "COUNTERED"
  | "CANCELLED";

export type WalkPlanStatus =
  | "PENDING_SETUP"
  | "READY_TO_START"
  | "ACTIVE"
  | "PAUSED"
  | "COMPLETED"
  | "CANCELLED";

export type WalkSessionStatus =
  | "SCHEDULED"
  | "STARTED"
  | "COMPLETED"
  | "CANCELLED"
  | "MISSED";

export type WalkServiceType = "ONE_TIME" | "RECURRING";

export type WalkerClientPet = {
  petId: number;
  petName: string;
  ownerName: string;
  imageUri?: string | null;

  timeLabel: string;
  status: "UPCOMING" | "NOW" | "DONE" | "SETUP";
};

export type WalkRequestPreview = {
  id: number;
  petId: number;
  petName: string;
  ownerName: string;

  requestType: WalkServiceType;
  preferredTime: string;
  durationMin: number;

  status: WalkRequestStatus;
};

export type WalkPlanPreview = {
  id: number;
  petId: number;
  petName: string;
  ownerName: string;

  status: WalkPlanStatus;

  preferredTime: string;
  durationMin: number;

  recurrenceLabel?: string | null;
};

export type WalkSessionPreview = {
  id: number;
  planId: number;
  petId: number;

  petName: string;
  ownerName: string;

  scheduledStart: string;
  scheduledEnd: string;
  timeLabel: string;

  addressLine?: string | null;
  durationMin: number;

  status: WalkSessionStatus;

  proofPending?: boolean;
  notesPending?: boolean;
};

export type WalkerEarningsSummary = {
  today: number;
  week: number;
  pendingPayout: number;
};

export type WalkerTodayStats = {
  upcoming: number;
  inProgress: number;
  completed: number;
  cancelled: number;
};

export type WalkerAttentionSummary = {
  startingSoon: number;
  inProgress: number;
  pendingProof: number;
  unreadMessages: number;
  changedBookings: number;
  pendingSetup: number;
};

export type WalkerHomeSummary = {
  assignedPets: WalkerClientPet[];

  nextSession: WalkSessionPreview | null;

  todayStats: WalkerTodayStats;

  attention: WalkerAttentionSummary;

  requests: {
    pending: number;
    acceptedAwaitingSetup: number;
  };

  plans: {
    active: number;
    pendingSetup: number;
    readyToStart: number;
  };

  sessions: {
    today: WalkSessionPreview[];
    pendingUpdates: WalkSessionPreview[];
    recentCompleted: WalkSessionPreview[];
  };

  earnings: WalkerEarningsSummary;

  discover?: {
    key: string;
    title: string;
    subtitle?: string | null;
  }[];
};