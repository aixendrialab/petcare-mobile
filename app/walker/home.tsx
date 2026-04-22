import React from "react";

import {
  CalendarIcon,
  HistoryIcon,
  UploadIcon,
  VideoIcon,
  PrescriptionIcon,
  TruckOutlineIcon,
  StethoscopeIcon,
} from "@/src/components/quickActions/QuickActionIcons";

import type { IconName, IconRegistry } from "@/src/components/home";
import { RoleHomeShell } from "@/src/components/home";
import { Screen } from "@/src/ui";

import { useWalkerHomeModel } from "@/src/features/walker/home/useWalkerHomeModel";

/**
 * Walker icons
 * Reusing existing shared icons until dedicated walker icons are added.
 */
const ICONS: IconRegistry = {
  stethoscope: <StethoscopeIcon />, // requests / setup / care
  syringe: <HistoryIcon />,
  calendar: <CalendarIcon />, // schedule
  history: <HistoryIcon />, // activity / history / messages
  video: <VideoIcon />, // optional call
  upload: <UploadIcon />, // proof upload / updates
  store: <HistoryIcon />,
  cart: <HistoryIcon />,
  truck: <TruckOutlineIcon />, // route / movement / trips
  pills: <HistoryIcon />,
  bowl: <HistoryIcon />,
  prescription: <PrescriptionIcon />, // plans / sessions / summaries
} satisfies Record<IconName, React.ReactElement>;

export default function WalkerHome() {
  const { model } = useWalkerHomeModel(ICONS);

  if (!model) {
    return (
      <Screen title="Loading...">
        <></>
      </Screen>
    );
  }

  return <RoleHomeShell model={model} />;
}