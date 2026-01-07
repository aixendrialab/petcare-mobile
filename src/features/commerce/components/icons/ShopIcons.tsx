import React from "react";
import Svg, { Path } from "react-native-svg";

const STROKE = "rgba(255,255,255,0.92)";

/** ===== Category Icons (B4) ===== */

export function PillsIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M8.5 20.5 3.5 15.5a4.2 4.2 0 0 1 0-6l2-2a4.2 4.2 0 0 1 6 0l5 5"
        fill="none"
        stroke={STROKE}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14.5 3.5 20.5 9.5a4.2 4.2 0 0 1 0 6l-2 2a4.2 4.2 0 0 1-6 0l-1.5-1.5"
        fill="none"
        stroke={STROKE}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7.5 10.5l6 6"
        fill="none"
        stroke={STROKE}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function BowlIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M5 12c0 4 3 7 7 7s7-3 7-7H5z"
        fill="none"
        stroke={STROKE}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path
        d="M7 12V9.5A2.5 2.5 0 0 1 9.5 7h5A2.5 2.5 0 0 1 17 9.5V12"
        fill="none"
        stroke={STROKE}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CollarIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M6.5 9.5a5.5 5.5 0 0 1 11 0v3a5.5 5.5 0 0 1-11 0v-3z"
        fill="none"
        stroke={STROKE}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path
        d="M12 14.2v3.3"
        fill="none"
        stroke={STROKE}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Path
        d="M10.7 17.8h2.6"
        fill="none"
        stroke={STROKE}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function HomeIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M4 11.5 12 5l8 6.5V20a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 20v-8.5z"
        fill="none"
        stroke={STROKE}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path
        d="M10 21v-6h4v6"
        fill="none"
        stroke={STROKE}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function PlanIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M7 3.8h10A2.2 2.2 0 0 1 19.2 6v14A2.2 2.2 0 0 1 17 22.2H7A2.2 2.2 0 0 1 4.8 20V6A2.2 2.2 0 0 1 7 3.8z"
        fill="none"
        stroke={STROKE}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path
        d="M8 8h8M8 12h8M8 16h5"
        fill="none"
        stroke={STROKE}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function HeartIcon({
  size = 18,
  filled = false,
}: {
  size?: number;
  filled?: boolean;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 21s-7.2-4.6-9.7-9C.7 8.7 2.2 5.8 5 4.7c1.8-.7 3.8-.2 5 1.1 1.2-1.3 3.2-1.8 5-1.1 2.8 1.1 4.3 4 2.7 7.3C19.2 16.4 12 21 12 21z"
        fill={filled ? "rgba(255,255,255,0.92)" : "none"}
        stroke="rgba(255,255,255,0.92)"
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function TruckIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M3 6h12v10H3V6zm12 4h3l3 3v3h-6v-6zm-9 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm12 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"
        fill="none"
        stroke="rgba(255,255,255,0.92)"
        strokeWidth={1.8}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function PinIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 22s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12z"
        fill="none"
        stroke="rgba(255,255,255,0.92)"
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path
        d="M12 11.2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
        fill="none"
        stroke="rgba(255,255,255,0.92)"
        strokeWidth={1.8}
      />
    </Svg>
  );
}

export function CartIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M3 4h2l2.5 11h9.5l2-7H7"
        fill="none"
        stroke="rgba(255,255,255,0.92)"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm8 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"
        fill="none"
        stroke="rgba(255,255,255,0.92)"
        strokeWidth={1.8}
      />
    </Svg>
  );
}
