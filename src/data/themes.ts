import { Theme } from '@/types/types';

export const themes: Record<string, Theme> = {
  "Netflix": {
    name: "Netflix",
    primary: "#E50914",
    secondary: "#141414",
    accent: "#F5F5F1",
    background: "#000000",
    foreground: "#FFFFFF",
    muted: "#333333",
    mutedForeground: "#999999",
    border: "#333333",
    card: "#1A1A1A",
    cardForeground: "#FFFFFF"
  },
  "Spotify": {
    name: "Spotify",
    primary: "#1DB954",
    secondary: "#191414",
    accent: "#B3B3B3",
    background: "#121212",
    foreground: "#FFFFFF",
    muted: "#282828",
    mutedForeground: "#B3B3B3",
    border: "#282828",
    card: "#181818",
    cardForeground: "#FFFFFF"
  },
  "Polar Mint": {
    name: "Polar Mint",
    primary: "#00D9A5",
    secondary: "#0A1628",
    accent: "#38BDF8",
    background: "#0F172A",
    foreground: "#F8FAFC",
    muted: "#1E293B",
    mutedForeground: "#94A3B8",
    border: "#1E293B",
    card: "#1E293B",
    cardForeground: "#F8FAFC"
  },
  "Amazon": {
    name: "Amazon",
    primary: "#FF9900",
    secondary: "#232F3E",
    accent: "#37475A",
    background: "#FFFFFF",
    foreground: "#0F1111",
    muted: "#F7F8F8",
    mutedForeground: "#565959",
    border: "#DDD",
    card: "#FFFFFF",
    cardForeground: "#0F1111"
  },
  "Shopify": {
    name: "Shopify",
    primary: "#96BF48",
    secondary: "#5C6AC4",
    accent: "#006FBB",
    background: "#F6F6F7",
    foreground: "#212B36",
    muted: "#EBEEF1",
    mutedForeground: "#637381",
    border: "#DFE3E8",
    card: "#FFFFFF",
    cardForeground: "#212B36"
  },
  "Sunset Glow": {
    name: "Sunset Glow",
    primary: "#FF6B6B",
    secondary: "#4ECDC4",
    accent: "#FFE66D",
    background: "#1A1A2E",
    foreground: "#EAEAEA",
    muted: "#16213E",
    mutedForeground: "#8892B0",
    border: "#0F3460",
    card: "#16213E",
    cardForeground: "#EAEAEA"
  },
  "Midnight Blue": {
    name: "Midnight Blue",
    primary: "#6366F1",
    secondary: "#8B5CF6",
    accent: "#EC4899",
    background: "#0F0F23",
    foreground: "#E2E8F0",
    muted: "#1E1E3F",
    mutedForeground: "#94A3B8",
    border: "#2D2D5A",
    card: "#1A1A3E",
    cardForeground: "#E2E8F0"
  },
  "Cyber Punk": {
    name: "Cyber Punk",
    primary: "#00FFFF",
    secondary: "#FF00FF",
    accent: "#FFFF00",
    background: "#0D0D0D",
    foreground: "#FFFFFF",
    muted: "#1A1A1A",
    mutedForeground: "#888888",
    border: "#333333",
    card: "#1A1A1A",
    cardForeground: "#FFFFFF"
  },
  "Ocean Breeze": {
    name: "Ocean Breeze",
    primary: "#0EA5E9",
    secondary: "#14B8A6",
    accent: "#F97316",
    background: "#F0F9FF",
    foreground: "#0C4A6E",
    muted: "#E0F2FE",
    mutedForeground: "#64748B",
    border: "#BAE6FD",
    card: "#FFFFFF",
    cardForeground: "#0C4A6E"
  },
  "Forest Night": {
    name: "Forest Night",
    primary: "#22C55E",
    secondary: "#10B981",
    accent: "#84CC16",
    background: "#0A0F0D",
    foreground: "#ECFDF5",
    muted: "#14281D",
    mutedForeground: "#86EFAC",
    border: "#1E3A2F",
    card: "#14281D",
    cardForeground: "#ECFDF5"
  }
};

export const themeList = Object.keys(themes);

export function getThemeCSSVariables(themeName: string): string {
  const theme = themes[themeName];
  if (!theme) return '';
  
  return `
    --primary: ${theme.primary};
    --secondary: ${theme.secondary};
    --accent: ${theme.accent};
    --background: ${theme.background};
    --foreground: ${theme.foreground};
    --muted: ${theme.muted};
    --muted-foreground: ${theme.mutedForeground};
    --border: ${theme.border};
    --card: ${theme.card};
    --card-foreground: ${theme.cardForeground};
  `;
}
