import { masterTheme, type ClientTheme } from "@dashboard-kit/ui";

/** Reproduces the Figma master exactly (AK57). */
export const ak57: ClientTheme = { ...masterTheme };

/** Only a primary colour supplied — everything else is generated. */
export const oceanClinic: ClientTheme = {
  brandName: "Ocean Clinic",
  primary: "#0EA5E9",
  fontFamily: "Inter",
};

/** Full custom brand, dark mode. */
export const verdeFoods: ClientTheme = {
  brandName: "Verde Foods",
  primary: "#22C55E",
  secondary: "#0B1F14",
  accent: "#F59E0B",
  fontFamily: "Inter",
  mode: "dark",
};

export const themes = { ak57, oceanClinic, verdeFoods };
export type ThemeKey = keyof typeof themes;
