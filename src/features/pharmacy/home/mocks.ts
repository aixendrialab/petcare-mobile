import type { PharmacyHomeSummary } from "./types";

function isoNowMinus(mins: number) {
  return new Date(Date.now() - mins * 60_000).toISOString();
}

export function mockPharmacyHomeSummary(outletId?: number | null): PharmacyHomeSummary {
  const outlets = [
    {
      id: 501,
      name: "CityCare Pharmacy – Central",
      city: "Hyderabad",
      pendingVerification: 3,
      readyToDispense: 6,
      lowStockCount: 5,
      expiringSoonCount: 2,
    },
    {
      id: 502,
      name: "CityCare Pharmacy – West",
      city: "Hyderabad",
      pendingVerification: 1,
      readyToDispense: 2,
      lowStockCount: 1,
      expiringSoonCount: 0,
    },
  ];

  const activeOutletId = outletId ?? outlets[0].id;

  return {
    outlets,
    activeOutletId,

    kpis: {
      todayRevenue: 12840,
      prescriptionsToday: 18,
      pendingDispense: 6,
    },

    prescriptions: {
      pendingVerification: 3,
      readyToDispense: 6,
      controlledPending: 2,
    },

    inventory: {
      lowStockCount: 5,
      expiringSoonCount: 2,
      lowStockItems: [
        { id: 1, name: "Amoxicillin 250mg", qty: 3, reorderLevel: 10 },
        { id: 2, name: "Carprofen 25mg", qty: 2, reorderLevel: 8 },
        { id: 3, name: "Rabies Vaccine (1 dose)", qty: 1, reorderLevel: 5 },
      ],
      expiringBatches: [
        { id: 11, name: "Amoxicillin 250mg", batchNo: "AMX-2209", daysLeft: 6 },
        { id: 12, name: "Deworming Syrup", batchNo: "DWS-8812", daysLeft: 12 },
      ],
    },

    billing: {
      pendingPayments: 4,
      refundsToday: 1,
    },

    recentPrescriptions: [
      {
        id: 9001,
        petName: "Bella",
        ownerName: "Ram",
        vetName: "Dr. Rao",
        drugLine: "Amoxicillin 250mg • 10 tabs",
        status: "PENDING_VERIFICATION",
        createdAt: isoNowMinus(18),
      },
      {
        id: 9002,
        petName: "Leo",
        ownerName: "Aswin",
        vetName: "Dr. Mehta",
        drugLine: "Carprofen 25mg • 14 tabs",
        status: "READY_TO_DISPENSE",
        createdAt: isoNowMinus(42),
      },
      {
        id: 9003,
        petName: "Milo",
        ownerName: "Azra",
        vetName: "Dr. Singh",
        drugLine: "Deworming Syrup • 1 bottle",
        status: "READY_TO_DISPENSE",
        createdAt: isoNowMinus(64),
      },
    ],

    discover: [
      { key: "reorder", title: "Smart reorder suggestions", subtitle: "Prevent stock-outs this week" },
      { key: "compliance", title: "New compliance workflow tips", subtitle: "Faster controlled-drug approvals" },
      { key: "seasonal", title: "Seasonal demand insight", subtitle: "Tick & flea medicines trending" },
    ],
  };
}