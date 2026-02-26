import React from "react";
import { Alert, View } from "react-native";

import {
  RoleHomeShell,
  type RoleHomeModel,
  type IconRegistry,
} from "@/src/components/home";

import {
  StethoscopeIcon,
  SyringeIcon,
  CalendarIcon,
  HistoryIcon,
  VideoIcon,
  UploadIcon,
  StoreIcon,
  CartOutlineIcon,
  TruckOutlineIcon,
  PillsOutlineIcon,
  BowlOutlineIcon,
  PrescriptionIcon,
} from "@/src/components/quickActions/QuickActionIcons";

function toast(msg: string) {
  // Works on mobile + web.
  try {
    Alert.alert(msg);
  } catch {
    // eslint-disable-next-line no-console
    console.log(msg);
  }
}

function buildIcons(): IconRegistry {
  const color = "#0F172A";
  const size = 18;
  return {
    stethoscope: <StethoscopeIcon size={size} color={color} />,
    syringe: <SyringeIcon size={size} color={color} />,
    calendar: <CalendarIcon size={size} color={color} />,
    history: <HistoryIcon size={size} color={color} />,
    video: <VideoIcon size={size} color={color} />,
    upload: <UploadIcon size={size} color={color} />,
    store: <StoreIcon size={size} color={color} />,
    cart: <CartOutlineIcon size={size} color={color} />,
    truck: <TruckOutlineIcon size={size} color={color} />,
    pills: <PillsOutlineIcon size={size} color={color} />,
    bowl: <BowlOutlineIcon size={size} color={color} />,
    prescription: (
      <View style={{ color }}>
        <PrescriptionIcon />
      </View>
    ),
  };
}

export default function ParentHomeShellDemo() {
  const icons = React.useMemo(() => buildIcons(), []);

  const model: RoleHomeModel = {
    role: "PARENT",
    icons,
    header: {
      greeting: "Hello, Ram 👋",
      subtitle: "+91 98765 43210",
      roleBadge: { label: "Parent" },
      summary: {
        text: "1 vaccine due • 1 refill pending • Order arriving tomorrow",
        tone: "primary",
      },
      actions: {
        showBell: true,
        onPressBell: () => toast("Notifications"),
        showProfile: true,
        onPressProfile: () => toast("Profile"),
      },
    },
    secondaryContext: {
      title: "Your Pets",
      showStatus: true,
      items: [
        {
          key: "max",
          title: "Max",
          subtitle: "Golden Retriever",
          imageUri: "https://loremflickr.com/300/300/dog?lock=101",
          status: "ok",
          badges: [{ text: "All good", tone: "success" }],
          onPress: () => toast("Max"),
        },
        {
          key: "luna",
          title: "Luna",
          subtitle: "Siamese",
          imageUri: "https://loremflickr.com/300/300/cat?lock=102",
          status: "dueSoon",
          badges: [{ text: "1 due", tone: "warning" }],
          onPress: () => toast("Luna"),
        },
        {
          key: "rocky",
          title: "Rocky",
          subtitle: "Beagle",
          imageUri: "https://loremflickr.com/300/300/beagle?lock=103",
          status: "ok",
          badges: [{ text: "Rx", tone: "primary" }],
          onPress: () => toast("Rocky"),
        },
        {
          key: "bella",
          title: "Bella",
          subtitle: "—",
          imageUri: "https://loremflickr.com/300/300/puppy?lock=104",
          status: "overdue",
          badges: [{ text: "Overdue", tone: "warning" }],
          onPress: () => toast("Bella"),
        },
      ],
      onAdd: {
        label: "Add Pet",
        onPress: () => toast("Add pet"),
      },
    },
    actions: {
      title: "What would you like to do?",
      grid: { tilesPerRow: 3, maxVisible: 9 },
      seeAll: { onPress: () => toast("See all actions") },
      tiles: [
        { key: "book", title: "Book a Vet", iconName: "stethoscope", tone: "primary", onPress: () => toast("Book Vet") },
        { key: "vacc", title: "Vaccinations", iconName: "syringe", tone: "warning", badgeText: "1 due", badgeTone: "warning", onPress: () => toast("Vaccines") },
        { key: "rx", title: "Prescriptions", iconName: "prescription", tone: "success", onPress: () => toast("Prescriptions") },
        { key: "appt", title: "Appointments", iconName: "calendar", tone: "primary", onPress: () => toast("Appointments") },
        { key: "visits", title: "Recent Visits", iconName: "history", tone: "neutral", onPress: () => toast("Recent visits") },
        { key: "upload", title: "Upload Report", iconName: "upload", tone: "neutral", onPress: () => toast("Upload") },
        { key: "shop", title: "Shop", iconName: "store", tone: "primary", onPress: () => toast("Shop") },
        { key: "cart", title: "Cart", iconName: "cart", tone: "neutral", badgeText: "3 items", onPress: () => toast("Cart") },
        { key: "orders", title: "Orders", iconName: "truck", tone: "neutral", badgeText: "2", onPress: () => toast("Orders") },
      ],
    },
    attention: {
      title: "ATTENTION",
      maxVisible: 3,
      empty: { text: "All caught up 🎉" },
      items: [
        {
          key: "a1",
          iconName: "syringe",
          title: "Bella: Rabies vaccine due in 3 days",
          subtitle: "Schedule now",
          cta: { text: "Schedule", onPress: () => toast("Schedule rabies") },
        },
        {
          key: "a2",
          iconName: "pills",
          title: "Rocky: Refill meds in 2 days",
          subtitle: "Prednisone",
          cta: { text: "Refill", onPress: () => toast("Refill") },
        },
        {
          key: "a3",
          iconName: "truck",
          title: "Order #123: arriving tomorrow",
          subtitle: "Track delivery",
          cta: { text: "Track", onPress: () => toast("Track") },
        },
      ],
    },
    sections: {
      items: [
        {
          key: "next_appt",
          title: "Next Appointment",
          accent: { iconName: "calendar", tone: "primary" },
          onSeeAll: () => toast("See all appointments"),
          content: {
            kind: "rows",
            rows: [
              {
                key: "r1",
                primary: "Max with Dr. Smith",
                secondary: "VetCare Clinic",
                tertiary: "Tomorrow, 10:00 AM",
                leftIconName: "stethoscope",
                onPress: () => toast("Appointment details"),
              },
            ],
          },
        },
        {
          key: "recent_visit",
          title: "Recent Visit",
          accent: { iconName: "history", tone: "neutral" },
          onSeeAll: () => toast("See all visits"),
          content: {
            kind: "rows",
            rows: [
              {
                key: "rv1",
                primary: "Paws & Claws Clinic",
                secondary: "Luna — Dr. Adams",
                tertiary: "Routine checkup",
                leftIconName: "history",
                onPress: () => toast("Visit details"),
              },
            ],
          },
        },
        {
          key: "vacc_due",
          title: "Vaccines Due",
          accent: { iconName: "syringe", tone: "warning" },
          onSeeAll: () => toast("See all vaccines"),
          content: {
            kind: "rows",
            rows: [
              {
                key: "vd1",
                primary: "Bella: Rabies Vaccine",
                secondary: "Due • May 5, 2026",
                leftIconName: "syringe",
                onPress: () => toast("Vaccine details"),
              },
            ],
          },
        },
        {
          key: "rx_active",
          title: "Prescriptions",
          accent: { iconName: "prescription", tone: "success" },
          onSeeAll: () => toast("See all prescriptions"),
          content: {
            kind: "rows",
            rows: [
              {
                key: "rx1",
                primary: "Prednisone",
                secondary: "Active",
                leftIconName: "pills",
                onPress: () => toast("Rx details"),
              },
            ],
          },
        },
        {
          key: "recent_orders",
          title: "Recent Orders",
          accent: { iconName: "truck", tone: "primary" },
          onSeeAll: () => toast("See all orders"),
          content: {
            kind: "rows",
            rows: [
              {
                key: "o1",
                primary: "Order #56789",
                secondary: "Shipped",
                leftIconName: "truck",
                onPress: () => toast("Order details"),
              },
            ],
          },
        },
      ],
    },
    discover: {
      title: "DISCOVER",
      collapsedByDefault: true,
      items: [
        {
          key: "d1",
          title: "Rewards & Achievements",
          subtitle: "Earn points by completing care actions",
          iconName: "bowl",
          tone: "success",
          onPress: () => toast("Rewards"),
        },
        {
          key: "d2",
          title: "Events near you",
          subtitle: "Workshops & adoption drives",
          iconName: "calendar",
          tone: "primary",
          onPress: () => toast("Events"),
        },
      ],
    },
  };

  return <RoleHomeShell model={model} />;
}
