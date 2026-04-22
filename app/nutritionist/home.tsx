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
  BowlOutlineIcon,
  StethoscopeIcon,
} from "@/src/components/quickActions/QuickActionIcons";

import type { IconName, IconRegistry } from "@/src/components/home";
import { RoleHomeShell } from "@/src/components/home";
import { Screen } from "@/src/ui";

import { useNutritionistHomeModel } from "@/src/features/nutritionist/home/useNutritionistHomeModel";

/**
 * Nutritionist icon registry
 * Reuses current shared icon set until we add dedicated icons
 * for plans, progress, clients, messages, renewals, etc.
 */
const ICONS: IconRegistry = {
  stethoscope: <StethoscopeIcon />, // intake / consult / care
  syringe: <HistoryIcon />, // unused for now
  calendar: <CalendarIcon />, // check-ins / renewals
  history: <HistoryIcon />, // progress / logs
  video: <VideoIcon />, // consults / calls
  upload: <UploadIcon />, // intake / upload
  store: <StoreIcon />, // product recommendations
  cart: <CartOutlineIcon />, // product list / suggested items
  truck: <TruckOutlineIcon />, // optional ordering / fulfillment
  pills: <PillsOutlineIcon />, // supplements
  bowl: <BowlOutlineIcon />, // nutrition / food plans
  prescription: <PrescriptionIcon />, // plans / guidance
} satisfies Record<IconName, React.ReactElement>;

export default function NutritionistHome() {
  const { model } = useNutritionistHomeModel(ICONS);

  if (!model) {
    return (
      <Screen title="Loading...">
        <></>
      </Screen>
    );
  }

  return <RoleHomeShell model={model} />;
}