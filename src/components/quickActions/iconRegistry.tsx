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
} from "@/src/components/QuickActionIcons";

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
  | "bowl";

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
};
