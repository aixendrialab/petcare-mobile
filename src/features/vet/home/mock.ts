import { VetHomeSummary } from "./types";

export const MOCK_VET_HOME_SUMMARY: VetHomeSummary = {
  activeClinicId: 1,
  clinics: [
    { id: 1, name: "Paws & Claws Clinic", city: "Gurgaon", waiting: 3, inConsult: 2, upcoming: 6 },
    { id: 2, name: "Happy Tails Clinic", city: "Delhi", waiting: 2, inConsult: 1, upcoming: 5 },
    { id: 3, name: "Pet Zone Care", city: "Noida", waiting: 5, inConsult: 1, upcoming: 8 },
  ],

  waiting: 3,
  arrived: 4,
  labsPending: 3,

  queuePreview: [
    { petName: "Bella", ownerName: "Ram", reason: "Vaccination", waitMinutes: 12 },
    { petName: "Rocky", ownerName: "Priya", reason: "Skin issue", waitMinutes: 8 },
  ],

  todaySchedule: {
    open: 18,
    completed: 8,
    upcoming: 6,
  },

  billing: {
    billedToday: 18400,
    pendingInvoices: 3,
    refunds: 1,
  },

  inventory: {
    lowStockCount: 2,
    lowItems: ["Amoxicillin", "Rabies vaccine"],
  },
};