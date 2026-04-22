export type PharmacyOutlet = {
  id: number;
  name: string;
  city: string;

  pendingVerification: number;
  readyToDispense: number;

  lowStockCount: number;
  expiringSoonCount: number;
};

export type RxStatus =
  | "PENDING_VERIFICATION"
  | "READY_TO_DISPENSE"
  | "DISPENSED"
  | "REJECTED"
  | string;

export type PharmacyRxPreview = {
  id: number;

  petName: string;
  ownerName: string;
  vetName?: string | null;

  drugLine: string; // "Amoxicillin 250mg • 10 tabs"
  status: RxStatus;

  createdAt: string; // ISO
};

export type ExpiringBatchPreview = {
  id: number;
  name: string;
  batchNo: string;
  daysLeft: number;
};

export type LowStockItemPreview = {
  id: number;
  name: string;
  qty: number;
  reorderLevel?: number | null;
};

export type PharmacyHomeSummary = {
  outlets: PharmacyOutlet[];
  activeOutletId: number | null;

  kpis: {
    todayRevenue: number;
    prescriptionsToday: number;
    pendingDispense: number;
  };

  prescriptions: {
    pendingVerification: number;
    readyToDispense: number;
    controlledPending: number;
  };

  inventory: {
    lowStockCount: number;
    expiringSoonCount: number;

    lowStockItems: LowStockItemPreview[];
    expiringBatches: ExpiringBatchPreview[];
  };

  billing: {
    pendingPayments: number;
    refundsToday: number;
  };

  recentPrescriptions: PharmacyRxPreview[];

  discover?: { key: string; title: string; subtitle?: string | null }[];
};