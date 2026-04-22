// app/vendor/home_demo.tsx
import React from "react";

import { RoleHomeShell } from "@/src/components/home";
import type { IconName, IconRegistry } from "@/src/components/home";

import {
  StoreIcon,
  CartOutlineIcon,
  TruckOutlineIcon,
  HistoryIcon,
  UploadIcon,
  CalendarIcon,
  VideoIcon,
  SyringeIcon,
  StethoscopeIcon,
  PillsOutlineIcon,
  BowlOutlineIcon,
  PrescriptionIcon,
} from "@/src/components/quickActions/QuickActionIcons";

import { Screen } from "@/src/ui";
import { useVendorHomeModel } from "@/src/features/vendor/home/useVendorHomeModel";

const ICONS: IconRegistry = {
  store: <StoreIcon />,
  cart: <CartOutlineIcon />,
  truck: <TruckOutlineIcon />,
  history: <HistoryIcon />,
  upload: <UploadIcon />,
  calendar: <CalendarIcon />,
  video: <VideoIcon />,
  syringe: <SyringeIcon />,
  stethoscope: <StethoscopeIcon />,
  pills: <PillsOutlineIcon />,
  bowl: <BowlOutlineIcon />,
  prescription: <PrescriptionIcon />,
} satisfies Record<IconName, React.ReactElement>;

export default function VendorHomeDemo() {
  const { model } = useVendorHomeModel(ICONS);

  if (!model) return <Screen title="Loading…">
    <div></div>
    </Screen>;

  return <RoleHomeShell model={model} />;
}
