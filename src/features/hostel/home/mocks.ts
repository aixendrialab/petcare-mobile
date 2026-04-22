import type { HostelHomeSummary } from "./types";

export function mockHostelHomeSummary(facilityId?: number | null): HostelHomeSummary {
  const facilities = [
    {
      id: 801,
      name: "Happy Paws Boarding",
      city: "Vizag",
      petsInStay: 18,
      occupancyPct: 82,
      arrivalsToday: 3,
      status: "ACTIVE",
    },
    {
      id: 802,
      name: "Happy Paws East",
      city: "Vizag",
      petsInStay: 11,
      occupancyPct: 64,
      arrivalsToday: 1,
      status: "ACTIVE",
    },
  ];

  const activeFacilityId = facilityId ?? facilities[0].id;

  return {
    facilities,
    activeFacilityId,

    today: {
      arrivals: 3,
      departures: 2,
      occupancyPct: 82,
      unreadMessages: 4,
    },

    care: {
      pendingTasks: 7,
      specialCarePets: 2,
      feedingDue: 3,
      medsDue: 2,
      walksDue: 1,
      groomingDue: 1,
    },

    arrivalsPreview: [
      {
        bookingId: 5001,
        petId: 101,
        petName: "Bella",
        ownerName: "Ram",
        timeLabel: "2:00 PM",
      },
      {
        bookingId: 5002,
        petId: 102,
        petName: "Leo",
        ownerName: "Priya",
        timeLabel: "5:00 PM",
      },
      {
        bookingId: 5003,
        petId: 103,
        petName: "Milo",
        ownerName: "Aswin",
        timeLabel: "7:00 PM",
      },
    ],

    departuresPreview: [
      {
        bookingId: 6001,
        petId: 201,
        petName: "Coco",
        ownerName: "Sana",
        timeLabel: "11:00 AM",
      },
      {
        bookingId: 6002,
        petId: 202,
        petName: "Rocky",
        ownerName: "Nina",
        timeLabel: "6:00 PM",
      },
    ],

    currentStaysPreview: [
      {
        stayId: 7001,
        petId: 301,
        petName: "Buddy",
        ownerName: "Arjun",
        roomLabel: "Kennel A-3",
        specialCare: false,
      },
      {
        stayId: 7002,
        petId: 302,
        petName: "Simba",
        ownerName: "Kiran",
        roomLabel: "Kennel B-1",
        specialCare: true,
      },
      {
        stayId: 7003,
        petId: 303,
        petName: "Luna",
        ownerName: "Farah",
        roomLabel: "Suite S-2",
        specialCare: false,
      },
    ],

    revenue: {
      today: 15400,
      pendingPayments: 3,
    },

    discover: [
      {
        key: "care-template",
        title: "New care checklist template",
        subtitle: "Standardize feeding, meds, and walk logs",
      },
      {
        key: "peak",
        title: "Weekend peak occupancy insight",
        subtitle: "Plan rooms and staff allocation better",
      },
    ],
  };
}