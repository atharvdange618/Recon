import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

// 60-30-10 Color Rule Implementation
// 60% Neutral: True black for a high-contrast, focused experience.
// 30% Secondary: Dark, sophisticated grays for surfaces like cards and inputs.
// 10% Accent: A vibrant, modern blue for interactive elements and branding.

export const COLORS = {
  // 10% ACCENT COLORS
  primary: "#0A84FF", // A slightly more vibrant, modern blue.
  accent: "#FF9F0A", // A warm, energetic orange for secondary highlights.

  // 30% SECONDARY COLORS (Surfaces)
  card: "#1C1C1E", // A subtle, dark gray for card backgrounds.
  input: "#2C2C2E", // A slightly lighter gray for input fields.

  // 60% NEUTRAL COLORS (Backgrounds)
  background: "#000000", // A true black for a high-contrast, focused experience.

  // TYPOGRAPHY
  text: "#FFFFFF",
  textSecondary: "#8E8E93", // A muted gray for less important text.

  // SEMANTIC COLORS (Slightly desaturated for better harmony)
  success: "#32D74B", // A vibrant, yet balanced green.
  error: "#FF453A", // A clear, but not overly harsh red.
  warning: "#FFD60A", // A noticeable, but not jarring yellow/orange.

  // BORDERS & DIVIDERS
  border: "#38383A",

  // MISC
  black: "#000000",
  white: "#FFFFFF",
};

// 8pt Grid System Implementation
export const SIZES = {
  // Core Spacing Unit
  base: 8,

  // Spacing Scale (Multiples of 8)
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,

  // Font Sizes (Aligned with a harmonious type scale)
  h1: 32,
  h2: 24,
  h3: 20,
  h4: 16,
  body: 14,
  caption: 12,

  // Radii
  radius: 8,
  radius_lg: 16,

  // App dimensions
  width,
  height,
};

// Typography System
export const FONTS = {
  h1: { fontFamily: "SpaceMono-Regular", fontSize: SIZES.h1, lineHeight: 40 },
  h2: { fontFamily: "SpaceMono-Regular", fontSize: SIZES.h2, lineHeight: 32 },
  h3: { fontFamily: "SpaceMono-Regular", fontSize: SIZES.h3, lineHeight: 24 },
  h4: { fontFamily: "SpaceMono-Regular", fontSize: SIZES.h4, lineHeight: 24 },

  body: { fontFamily: "sans-serif", fontSize: SIZES.body, lineHeight: 20 },
  caption: {
    fontFamily: "sans-serif",
    fontSize: SIZES.caption,
    lineHeight: 16,
  },
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;
