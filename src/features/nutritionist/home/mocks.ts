import type { NutritionistHomeSummary } from "./types";

function isoNowMinusHours(hours: number) {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

export function mockNutritionistHomeSummary(): NutritionistHomeSummary {
  return {
    clients: [
      {
        petId: 101,
        petName: "Bella",
        petImageUri: null,
        ownerName: "Ram",
        goalTag: "WEIGHT_LOSS",
        status: "DUE",
        latestWeightKg: 17.6,
        lastCheckinAt: isoNowMinusHours(48),
      },
      {
        petId: 102,
        petName: "Leo",
        petImageUri: null,
        ownerName: "Priya",
        goalTag: "ALLERGY",
        status: "ON_TRACK",
        latestWeightKg: 11.2,
        lastCheckinAt: isoNowMinusHours(24),
      },
      {
        petId: 103,
        petName: "Milo",
        petImageUri: null,
        ownerName: "Aswin",
        goalTag: "PUPPY_GROWTH",
        status: "OVERDUE",
        latestWeightKg: 6.8,
        lastCheckinAt: isoNowMinusHours(96),
      },
      {
        petId: 104,
        petName: "Coco",
        petImageUri: null,
        ownerName: "Sana",
        goalTag: "DIGESTIVE_SUPPORT",
        status: "NEW",
        latestWeightKg: null,
        lastCheckinAt: null,
      },
    ],

    today: {
      checkinsDue: 3,
      overdue: 1,
      newIntakes: 2,
      unreadMessages: 4,
      renewalsDue: 2,
      scheduledConsults: 1,
    },

    checkinPreview: [
      {
        id: 5001,
        petId: 101,
        petName: "Bella",
        ownerName: "Ram",
        submittedAt: isoNowMinusHours(3),
        weightBeforeKg: 18.2,
        weightNowKg: 17.6,
        weightDeltaLabel: "-0.6 kg",
        stoolNote: "Normal",
        appetiteNote: "Stable",
        energyNote: "Improved",
      },
      {
        id: 5002,
        petId: 102,
        petName: "Leo",
        ownerName: "Priya",
        submittedAt: isoNowMinusHours(5),
        weightBeforeKg: 11.2,
        weightNowKg: 11.1,
        weightDeltaLabel: "-0.1 kg",
        stoolNote: "Normal",
        appetiteNote: "Good",
        energyNote: "High",
      },
      {
        id: 5003,
        petId: 103,
        petName: "Milo",
        ownerName: "Aswin",
        submittedAt: isoNowMinusHours(28),
        weightBeforeKg: 6.4,
        weightNowKg: 6.8,
        weightDeltaLabel: "+0.4 kg",
        stoolNote: "Soft",
        appetiteNote: "Increased",
        energyNote: "Playful",
      },
    ],

    planStats: {
      activePlans: 9,
      expiringThisWeek: 2,
      categories: [
        { key: "weight_loss", label: "Weight loss", count: 4 },
        { key: "allergy", label: "Allergy", count: 2 },
        { key: "puppy_growth", label: "Puppy growth", count: 2 },
        { key: "digestive", label: "Digestive support", count: 1 },
      ],
    },

    progressHighlights: [
      {
        key: "bella",
        title: "Bella: −0.6 kg in 2 weeks",
        subtitle: "Weight-loss plan is on track",
      },
      {
        key: "leo",
        title: "Leo: skin flare reduced",
        subtitle: "Allergy plan showing improvement",
      },
      {
        key: "milo",
        title: "Milo: healthy gain +0.4 kg",
        subtitle: "Puppy growth progressing well",
      },
    ],

    recommendedProducts: [
      {
        productId: 9001,
        title: "Hypoallergenic Dry Food",
        subtitle: "2kg pack",
        imageUri: null,
        reason: "Suitable for allergy management",
      },
      {
        productId: 9002,
        title: "Weight Management Kibble",
        subtitle: "3kg pack",
        imageUri: null,
        reason: "Recommended for calorie control",
      },
      {
        productId: 9003,
        title: "Digestive Support Probiotic",
        subtitle: "30 sachets",
        imageUri: null,
        reason: "Supports gut balance",
      },
    ],

    messages: {
      unread: 4,
    },

    billing: {
      earnedToday: 4200,
      pendingPayments: 2,
    },

    discover: [
      {
        key: "template",
        title: "New template: Weight loss starter plan",
        subtitle: "Use it for first-time obesity consults",
      },
      {
        key: "summer",
        title: "Seasonal advice: Summer hydration",
        subtitle: "Share tips with active clients",
      },
      {
        key: "allergy",
        title: "Top questions: Food allergy elimination diets",
        subtitle: "Quick client education resource",
      },
    ],
  };
}