import type { WalkerHomeSummary } from "./types";

function isoFromNow(minutes: number) {
  return new Date(Date.now() + minutes * 60_000).toISOString();
}

function isoAgo(minutes: number) {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

export function mockWalkerHomeSummary(): WalkerHomeSummary {
  return {
    assignedPets: [
      {
        petId: 101,
        petName: "Bella",
        ownerName: "Ram",
        imageUri: null,
        timeLabel: "6:30 PM",
        status: "UPCOMING",
      },
      {
        petId: 102,
        petName: "Leo",
        ownerName: "Priya",
        imageUri: null,
        timeLabel: "Now",
        status: "NOW",
      },
      {
        petId: 103,
        petName: "Milo",
        ownerName: "Aswin",
        imageUri: null,
        timeLabel: "Setup pending",
        status: "SETUP",
      },
      {
        petId: 104,
        petName: "Coco",
        ownerName: "Sana",
        imageUri: null,
        timeLabel: "4:00 PM",
        status: "DONE",
      },
    ],

    nextSession: {
      id: 9001,
      planId: 7001,
      petId: 101,
      petName: "Bella",
      ownerName: "Ram",
      scheduledStart: isoFromNow(20),
      scheduledEnd: isoFromNow(65),
      timeLabel: "Starts in 20 min",
      addressLine: "Madhapur, Hyderabad",
      durationMin: 45,
      status: "SCHEDULED",
      proofPending: false,
      notesPending: false,
    },

    todayStats: {
      upcoming: 2,
      inProgress: 1,
      completed: 2,
      cancelled: 1,
    },

    attention: {
      startingSoon: 1,
      inProgress: 1,
      pendingProof: 2,
      unreadMessages: 3,
      changedBookings: 1,
      pendingSetup: 1,
    },

    requests: {
      pending: 2,
      acceptedAwaitingSetup: 1,
    },

    plans: {
      active: 6,
      pendingSetup: 1,
      readyToStart: 2,
    },

    sessions: {
      today: [
        {
          id: 9001,
          planId: 7001,
          petId: 101,
          petName: "Bella",
          ownerName: "Ram",
          scheduledStart: isoFromNow(20),
          scheduledEnd: isoFromNow(65),
          timeLabel: "6:30 PM",
          addressLine: "Madhapur, Hyderabad",
          durationMin: 45,
          status: "SCHEDULED",
        },
        {
          id: 9002,
          planId: 7002,
          petId: 102,
          petName: "Leo",
          ownerName: "Priya",
          scheduledStart: isoAgo(15),
          scheduledEnd: isoFromNow(15),
          timeLabel: "In progress",
          addressLine: "Kondapur, Hyderabad",
          durationMin: 30,
          status: "STARTED",
        },
        {
          id: 9003,
          planId: 7003,
          petId: 103,
          petName: "Milo",
          ownerName: "Aswin",
          scheduledStart: isoFromNow(120),
          scheduledEnd: isoFromNow(165),
          timeLabel: "8:00 PM",
          addressLine: "Gachibowli, Hyderabad",
          durationMin: 45,
          status: "SCHEDULED",
        },
      ],

      pendingUpdates: [
        {
          id: 9004,
          planId: 7004,
          petId: 104,
          petName: "Coco",
          ownerName: "Sana",
          scheduledStart: isoAgo(180),
          scheduledEnd: isoAgo(135),
          timeLabel: "4:00 PM",
          addressLine: "Hitech City, Hyderabad",
          durationMin: 45,
          status: "COMPLETED",
          proofPending: true,
          notesPending: true,
        },
        {
          id: 9005,
          planId: 7005,
          petId: 105,
          petName: "Rocky",
          ownerName: "Nina",
          scheduledStart: isoAgo(300),
          scheduledEnd: isoAgo(255),
          timeLabel: "2:00 PM",
          addressLine: "Kukatpally, Hyderabad",
          durationMin: 45,
          status: "COMPLETED",
          proofPending: true,
          notesPending: false,
        },
      ],

      recentCompleted: [
        {
          id: 9006,
          planId: 7006,
          petId: 106,
          petName: "Buddy",
          ownerName: "Arjun",
          scheduledStart: isoAgo(420),
          scheduledEnd: isoAgo(375),
          timeLabel: "12:00 PM",
          addressLine: "Jubilee Hills, Hyderabad",
          durationMin: 45,
          status: "COMPLETED",
        },
        {
          id: 9007,
          planId: 7007,
          petId: 107,
          petName: "Simba",
          ownerName: "Kiran",
          scheduledStart: isoAgo(540),
          scheduledEnd: isoAgo(495),
          timeLabel: "10:00 AM",
          addressLine: "Banjara Hills, Hyderabad",
          durationMin: 45,
          status: "COMPLETED",
        },
      ],
    },

    earnings: {
      today: 1200,
      week: 6400,
      pendingPayout: 1800,
    },

    discover: [
      {
        key: "tips",
        title: "Tip: finish proof right after each walk",
        subtitle: "Helps avoid missing updates later",
      },
      {
        key: "safety",
        title: "Safety checklist reminder",
        subtitle: "Leash, hydration, and route awareness",
      },
    ],
  };
}