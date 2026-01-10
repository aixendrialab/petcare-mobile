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

export type QuickIconName =
  | "stethoscope"
  | "syringe"
  | "calendar"
  | "history"
  | "video"
  | "upload"
  | "store"
  | "cart"
  | "truck"
  | "pills"
  | "bowl"
  | "prescription";

export const QUICK_ACTION_ICONS: Record<QuickIconName, React.ReactElement> = {
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
};
