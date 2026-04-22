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
  PillsOutlineIcon,
  SyringeIcon,
} from "@/src/components/quickActions/QuickActionIcons";

import type { IconName, IconRegistry } from "@/src/components/home";
import { RoleHomeShell } from "@/src/components/home";
import { Screen } from "@/src/ui";

import { usePharmacyHomeModel } from "@/src/features/pharmacy/home/usePharmacyHomeModel";

/**
 * Pharmacist icon registry
 * NOTE: reusing existing icons until we add dedicated pharmacy icons (expiry, controlled, billing, analytics, etc.)
 */
const ICONS: IconRegistry = {
  stethoscope: <HistoryIcon />, // unused
  syringe: <SyringeIcon />, // controlled / vaccines-style
  calendar: <CalendarIcon />, // expiry / schedule
  history: <HistoryIcon />, // activity
  video: <VideoIcon />, // unused
  upload: <UploadIcon />, // rx upload / misc
  store: <StoreIcon />, // catalog / outlet
  cart: <CartOutlineIcon />, // inventory
  truck: <TruckOutlineIcon />, // orders/dispatch
  pills: <PillsOutlineIcon />, // dispense
  bowl: <HistoryIcon />, // unused
  prescription: <PrescriptionIcon />, // prescriptions
} satisfies Record<IconName, React.ReactElement>;

export default function PharmacistHome() {
  const { model } = usePharmacyHomeModel(ICONS);

  if (!model) {
    return (
      <Screen title="Loading...">
        <></>
      </Screen>
    );
  }

  return <RoleHomeShell model={model} />;
}