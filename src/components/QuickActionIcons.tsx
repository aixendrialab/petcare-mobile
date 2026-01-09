import React from "react";
import Svg, { Path } from "react-native-svg";

type IconProps = { size?: number; color?: string };

const strokeCommon = (color: string) => ({
  fill: "none" as const,
  stroke: color,
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export function StethoscopeIcon({ size = 18, color = "#111" }: IconProps) {
  const s = strokeCommon(color);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M6 3v6a6 6 0 0 0 12 0V3" {...s} />
      <Path d="M8 3v4M16 3v4" {...s} />
      <Path d="M18 11a3 3 0 1 0 3 3" {...s} />
      <Path d="M12 15v2a4 4 0 0 0 4 4h2" {...s} />
    </Svg>
  );
}

export function SyringeIcon({ size = 18, color = "#111" }: IconProps) {
  const s = strokeCommon(color);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M14 4l6 6" {...s} />
      <Path d="M8.5 9.5l6 6" {...s} />
      <Path d="M6 12l6 6" {...s} />
      <Path d="M16 6l-9 9a3 3 0 0 0 0 4l.5.5a3 3 0 0 0 4 0l9-9" {...s} />
      <Path d="M5 19l-1 1" {...s} />
      <Path d="M13 7l4 4" {...s} />
    </Svg>
  );
}

export function CalendarIcon({ size = 18, color = "#111" }: IconProps) {
  const s = strokeCommon(color);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M7 4v3M17 4v3" {...s} />
      <Path d="M4.5 8h15" {...s} />
      <Path d="M6.5 5.5h11A2 2 0 0 1 19.5 7.5v12A2 2 0 0 1 17.5 21.5h-11A2 2 0 0 1 4.5 19.5v-12A2 2 0 0 1 6.5 5.5z" {...s} />
      <Path d="M8 12h3M13 12h3M8 16h3" {...s} />
    </Svg>
  );
}

export function HistoryIcon({ size = 18, color = "#111" }: IconProps) {
  const s = strokeCommon(color);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M4 12a8 8 0 1 0 2.3-5.7" {...s} />
      <Path d="M4 4v4h4" {...s} />
      <Path d="M12 7v5l3 2" {...s} />
    </Svg>
  );
}

export function VideoIcon({ size = 18, color = "#111" }: IconProps) {
  const s = strokeCommon(color);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M4.5 7.5h10A2 2 0 0 1 16.5 9.5v5A2 2 0 0 1 14.5 16.5h-10A2 2 0 0 1 2.5 14.5v-5A2 2 0 0 1 4.5 7.5z" {...s} />
      <Path d="M16.5 10l5-2.5v9L16.5 14" {...s} />
    </Svg>
  );
}

export function UploadIcon({ size = 18, color = "#111" }: IconProps) {
  const s = strokeCommon(color);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 3v10" {...s} />
      <Path d="M8 7l4-4 4 4" {...s} />
      <Path d="M4 14v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" {...s} />
    </Svg>
  );
}

export function StoreIcon({ size = 18, color = "#111" }: IconProps) {
  const s = strokeCommon(color);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M4 7h16l-1.5-3h-13L4 7z" {...s} />
      <Path d="M5 7v13h14V7" {...s} />
      <Path d="M9 20v-6h6v6" {...s} />
      <Path d="M7 10h2M15 10h2" {...s} />
    </Svg>
  );
}

export function CartOutlineIcon({ size = 18, color = "#111" }: IconProps) {
  const s = strokeCommon(color);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M3 4h2l2.5 11h9.5l2-7H7" {...s} />
      <Path d="M9 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm8 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" {...s} />
    </Svg>
  );
}

export function TruckOutlineIcon({ size = 18, color = "#111" }: IconProps) {
  const s = strokeCommon(color);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M3 6h12v10H3V6z" {...s} />
      <Path d="M15 10h3l3 3v3h-6v-6z" {...s} />
      <Path d="M6 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm12 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" {...s} />
    </Svg>
  );
}

export function PillsOutlineIcon({ size = 18, color = "#111" }: IconProps) {
  const s = strokeCommon(color);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M8.5 20.5 3.5 15.5a4.2 4.2 0 0 1 0-6l2-2a4.2 4.2 0 0 1 6 0l5 5" {...s} />
      <Path d="M14.5 3.5 20.5 9.5a4.2 4.2 0 0 1 0 6l-2 2a4.2 4.2 0 0 1-6 0l-1.5-1.5" {...s} />
      <Path d="M7.5 10.5l6 6" {...s} />
    </Svg>
  );
}

export function BowlOutlineIcon({ size = 18, color = "#111" }: IconProps) {
  const s = strokeCommon(color);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M5 12c0 4 3 7 7 7s7-3 7-7H5z" {...s} />
      <Path d="M7 12V9.5A2.5 2.5 0 0 1 9.5 7h5A2.5 2.5 0 0 1 17 9.5V12" {...s} />
    </Svg>
  );
}
