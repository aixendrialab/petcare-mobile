// src/components/home/theme.ts
// Small, dependency-free design tokens for the Home Shell.

export type Tone = "neutral" | "primary" | "success" | "warning";

export const HomeTheme = {
  pageBg: "#F6F7FB",
  cardBg: "#FFFFFF",
  text: "#0F172A",
  textMuted: "#64748B",
  border: "#E5E7EB",
  shadow: "rgba(15, 23, 42, 0.08)",
  divider: "#EEF2F7",

  radius: {
    card: 16,
    pill: 999,
    avatar: 999,
    tile: 18,
  },

  spacing: {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 18,
    xl: 24,
  },

  tones: {
    neutral: { bg: "#EEF2FF", fg: "#1E293B", border: "#E2E8F0" },
    primary: { bg: "#E0F2FE", fg: "#0B3B5B", border: "#BAE6FD" },
    success: { bg: "#DCFCE7", fg: "#14532D", border: "#BBF7D0" },
    warning: { bg: "#FEF3C7", fg: "#7C2D12", border: "#FDE68A" },
  } as const,
} as const;

export function toneColors(tone?: Tone) {
  const t = tone ?? "neutral";
  return HomeTheme.tones[t];
}
