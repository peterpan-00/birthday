export const memoryTheme = {
  // Cinematic Memory Garden Palette
  primaryBackground: "#19141B",
  secondaryBackground: "#271E29",
  surfaceSoft: "#382A3B",

  warmCream: "#F5E9DE",
  textSecondary: "#D4C3B7",

  blush: "#D99CA5",
  peach: "#E5B1A3",
  champagne: "#D9BF8A",
  cocoa: "#72564D",
  sage: "#89967C",
  dustyTeal: "#6D9E99",

  // Legacy aliases
  midnight: "#19141B",
  deepPlum: "#271E29",
  warmPlum: "#382A3B",
  softCream: "#FAF2EB",
  lavender: "#C4B0C7",
  dustyLavender: "#D4C3B7",
} as const;

export type MemoryTheme = typeof memoryTheme;

