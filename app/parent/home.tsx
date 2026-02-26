// app/parent/home.tsx
import React from "react";

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

import type { IconName, IconRegistry } from "@/src/components/home";
import { RoleHomeShell } from "@/src/components/home";

import { useParentHomeModel } from "@/src/features/parent/home/useParentHomeModel";

/** Parent-specific icon registry */
const ICONS: IconRegistry = {
  stethoscope: <StethoscopeIcon />,
  syringe: <SyringeIcon />,
  calendar: <CalendarIcon />,
  history: <HistoryIcon />,
  video: <VideoIcon />,
  upload: <UploadIcon />,
  store: <StoreIcon />,
  cart: <CartOutlineIcon />,
  truck: <TruckOutlineIcon />,
  pills: <PillsOutlineIcon />,
  bowl: <BowlOutlineIcon />,
  prescription: <PrescriptionIcon />,
} satisfies Record<IconName, React.ReactElement>;

export default function ParentHome() {
  const { model } = useParentHomeModel(ICONS);
  return <RoleHomeShell model={model} />;
}
