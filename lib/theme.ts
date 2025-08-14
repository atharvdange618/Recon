import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const COLORS = {
  // Base
  primary: "#007AFF", // Vibrant blue for primary actions
  secondary: "#ff9f0a", // Warm orange for secondary actions or highlights

  // Grays
  black: "#000000",
  white: "#FFFFFF",
  lightGray: "#F5F5F7",
  lightGray2: "#EAEAEB",
  lightGray3: "#DCDCDD",
  gray: "#8A8A8E",
  gray2: "#6E6E73",
  gray3: "#48484A",
  darkGray: "#2C2C2E",
  darkGray2: "#1C1C1E",

  // Theme-specific
  background: "#121212",
  card: "#222224ff",
  text: "#FFFFFF",
  textSecondary: "#a0a0a0",
  border: "#3a3a3c",

  // Semantic
  success: "#30d158",
  error: "#ff453a",
  warning: "#ff9f0a",
  accent: "#008060",
  secondaryAccent: "#FFD700",
};

export const SIZES = {
  // Global sizes
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,
  padding2: 36,

  // Font sizes
  largeTitle: 50,
  h1: 30,
  h2: 22,
  h3: 20,
  h4: 18,
  body1: 30,
  body2: 20,
  body3: 16,
  body4: 14,
  body5: 12,

  // App dimensions
  width,
  height,
};

export const FONTS = {
  largeTitle: {
    fontFamily: "SpaceMono-Regular",
    fontSize: SIZES.largeTitle,
    lineHeight: 55,
  },
  h1: { fontFamily: "SpaceMono-Regular", fontSize: SIZES.h1, lineHeight: 36 },
  h2: { fontFamily: "SpaceMono-Regular", fontSize: SIZES.h2, lineHeight: 30 },
  h3: { fontFamily: "SpaceMono-Regular", fontSize: SIZES.h3, lineHeight: 22 },
  h4: { fontFamily: "SpaceMono-Regular", fontSize: SIZES.h4, lineHeight: 22 },
  body1: {
    fontFamily: "SpaceMono-Regular",
    fontSize: SIZES.body1,
    lineHeight: 36,
  },
  body2: {
    fontFamily: "SpaceMono-Regular",
    fontSize: SIZES.body2,
    lineHeight: 30,
  },
  body3: {
    fontFamily: "SpaceMono-Regular",
    fontSize: SIZES.body3,
    lineHeight: 22,
  },
  body4: {
    fontFamily: "SpaceMono-Regular",
    fontSize: SIZES.body4,
    lineHeight: 22,
  },
  body5: {
    fontFamily: "SpaceMono-Regular",
    fontSize: SIZES.body5,
    lineHeight: 22,
  },
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;
