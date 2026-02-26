import React from "react";

import {
  StethoscopeIcon,
  CalendarIcon,
  HistoryIcon,
  VideoIcon,
  StoreIcon,
  PrescriptionIcon,
  UploadIcon,
} from "@/src/components/quickActions/QuickActionIcons";

import type { IconName, IconRegistry } from "@/src/components/home";
import { RoleHomeShell } from "@/src/components/home";
import { Screen } from "@/src/ui";

import { useVetHomeModel } from "@/src/features/vet/home/useVetHomeModel";

/**
 * Vet icons: we reuse existing icons for now.
 * Later we can add dedicated Vet icons (checkin/queue/labs/inventory/billing).
 */
const ICONS: IconRegistry = {
  stethoscope: <StethoscopeIcon />,     // Consult
  calendar: <CalendarIcon />,           // Schedule / Appointments
  history: <HistoryIcon />,             // Queue
  video: <VideoIcon />,                 // Televisit
  store: <StoreIcon />,                 // Inventory
  prescription: <PrescriptionIcon />,   // Labs / Rx
  upload: <UploadIcon />,               // Check-in (temporary)
} as any;

export default function VetHome() {
  const { model } = useVetHomeModel(ICONS);

  if (!model) {
    return (
      <Screen title="Loading...">
        <></>
      </Screen>
    );
  }

  return <RoleHomeShell model={model} />;
}