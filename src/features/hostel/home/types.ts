export type FacilityStatus = "ACTIVE" | "PAUSED" | string;

export type HostelFacilityCard = {
  id: number;
  name: string;
  city: string;

  petsInStay: number;
  occupancyPct: number;
  arrivalsToday: number;
  status: FacilityStatus;
};

export type BoardingArrivalPreview = {
  bookingId: number;
  petId: number;

  petName: string;
  ownerName: string;

  timeLabel: string;
};

export type BoardingDeparturePreview = {
  bookingId: number;
  petId: number;

  petName: string;
  ownerName: string;

  timeLabel: string;
};

export type CareTaskSummary = {
  pendingTasks: number;
  specialCarePets: number;

  feedingDue: number;
  medsDue: number;
  walksDue: number;
  groomingDue: number;
};

export type BoardingRevenueSummary = {
  today: number;
  pendingPayments: number;
};

export type BoardingTodaySummary = {
  arrivals: number;
  departures: number;
  occupancyPct: number;
  unreadMessages: number;
};

export type CurrentStayPreview = {
  stayId: number;
  petId: number;

  petName: string;
  ownerName: string;

  roomLabel?: string | null;
  specialCare?: boolean;
};

export type HostelHomeSummary = {
  facilities: HostelFacilityCard[];
  activeFacilityId: number | null;

  today: BoardingTodaySummary;

  care: CareTaskSummary;

  arrivalsPreview: BoardingArrivalPreview[];
  departuresPreview: BoardingDeparturePreview[];

  currentStaysPreview: CurrentStayPreview[];

  revenue: BoardingRevenueSummary;

  discover?: {
    key: string;
    title: string;
    subtitle?: string | null;
  }[];
};