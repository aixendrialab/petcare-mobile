export type ClinicSummary = {
  id: number;
  name: string;
  city: string;
  waiting: number;
  inConsult: number;
  upcoming: number;
};

export type QueuePreviewItem = {
  petName: string;
  ownerName: string;
  reason: string;
  waitMinutes: number;
};

export type BillingSnapshot = {
  billedToday: number;
  pendingInvoices: number;
  refunds: number;
};

export type InventoryAlert = {
  lowStockCount: number;
  lowItems: string[];
};

export type VetHomeSummary = {
  activeClinicId: number;
  clinics: ClinicSummary[];

  waiting: number;
  arrived: number;
  labsPending: number;

  queuePreview: QueuePreviewItem[];

  todaySchedule: {
    open: number;
    completed: number;
    upcoming: number;
  };

  billing: BillingSnapshot;
  inventory: InventoryAlert;
};