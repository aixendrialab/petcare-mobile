// src/components/home/utils/derive.ts
import type { RoleKind, QuickTone } from "../types";
import { toneColors } from "../theme";

export function roleLabel(role: RoleKind) {
  switch (role) {
    case "PARENT":
      return "Parent";
    case "VET":
      return "Vet";
    case "VENDOR":
      return "Vendor";
    case "NUTRITIONIST":
      return "Nutritionist";
    default:
      return "";
  }
}

export function toneToColors(tone?: QuickTone) {
  return toneColors(tone);
}
