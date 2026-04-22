import React from "react";

import {
  StoreIcon,
  CartOutlineIcon,
  TruckOutlineIcon,
  HistoryIcon,
  CalendarIcon,
  UploadIcon,
  VideoIcon,
  PrescriptionIcon,
  BowlOutlineIcon,
  PillsOutlineIcon,
} from "@/src/components/quickActions/QuickActionIcons";

import type { IconName, IconRegistry } from "@/src/components/home";
import { RoleHomeShell } from "@/src/components/home";
import { Screen } from "@/src/ui";

import { useHostelHomeModel } from "@/src/features/hostel/home/useHostelHomeModel";

/**
 * Hostel / Boarding icon registry
 * Reusing shared icons for now until dedicated icons are added.
 */
const ICONS: IconRegistry = {
  stethoscope: <HistoryIcon />,
  syringe: <HistoryIcon />,
  calendar: <CalendarIcon />, // bookings / arrivals / departures
  history: <HistoryIcon />, // stays / activity / logs
  video: <VideoIcon />,
  upload: <UploadIcon />, // check-in / care logs
  store: <StoreIcon />, // facility / rooms
  cart: <CartOutlineIcon />, // tasks / inventory-ish
  truck: <TruckOutlineIcon />, // arrivals / departures / transport
  pills: <PillsOutlineIcon />, // meds
  bowl: <BowlOutlineIcon />, // feeding
  prescription: <PrescriptionIcon />, // billing / notes / plans
} satisfies Record<IconName, React.ReactElement>;

export default function HostelHome() {
  const { model } = useHostelHomeModel(ICONS);

  if (!model) {
    return (
      <Screen title="Loading...">
        <></>
      </Screen>
    );
  }

  return <RoleHomeShell model={model} />;
}