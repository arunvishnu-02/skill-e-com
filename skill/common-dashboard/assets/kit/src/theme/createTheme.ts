import {
  adjustLightness,
  contrastRatio,
  ensureContrast,
  ensureReadableBackground,
  hexToHsl,
  hslToHex,
  luminance,
  mix,
  readableOn,
  withAlpha,
} from "./color";
import { figmaRawValues, figmaVariables, typography } from "./tokens";

/**
 * Client theme input. Only these values may differ between client projects.
 * Everything else (layout, spacing, radius, type scale, neutrals, status colours)
 * comes from the master Figma design and is fixed.
 */
export interface ClientTheme {
  brandName: string;
  /** URL or import of the logo (square-ish mark, shown at 40×46 in the sidebar). */
  logo?: string;
  /**
   * Brand highlight. In the master design this is the yellow (#F5EF0F): active nav item,
   * confirm buttons, active tab counts, featured KPI value, mobile tab pill.
   */
  primary: string;
  /**
   * Brand ink. In the master design this is #0E0E0E: sidebar, featured KPI card,
   * header CTA, chart bars, active filter tab, tooltips. Should be dark.
   * Defaults to a near-black tinted with the primary hue.
   */
  secondary?: string;
  /** Data highlight (current-period bar). Master: #F5C518. Defaults to a deeper primary. */
  accent?: string;
  /** Body / UI font family name. Master: Inter. */
  fontFamily?: string;
  /** Display font for KPI numbers, logo and modal titles. Master: Anton. */
  displayFontFamily?: string;
  mode?: "light" | "dark";
  /** Escape hatch for exact values (e.g. to reproduce a Figma-specified shade). Keys without "--cd-". */
  overrides?: Partial<Record<ThemeVar, string>>;
}

export type ThemeVar =
  | "primary" | "primary-hover" | "primary-active" | "primary-border" | "primary-soft" | "on-primary" | "primary-text"
  | "secondary" | "secondary-hover" | "secondary-raised" | "secondary-raised-2" | "secondary-divider"
  | "on-secondary" | "on-secondary-subtle" | "on-secondary-muted"
  | "accent" | "accent-border" | "on-accent"
  | "kpi-featured-value" | "kpi-featured-label" | "delta-up-on-dark"
  | "bg" | "surface" | "subtle" | "border" | "border-card" | "border-strong"
  | "text" | "text-strong" | "text-secondary" | "text-placeholder"
  | "row-highlight" | "thumb" | "overlay" | "unread-bg"
  | "chart-bar" | "chart-highlight" | "chart-track"
  | "on-danger" | "success" | "success-bg" | "warning" | "warning-bg" | "danger" | "danger-bg" | "info" | "info-bg"
  | "focus-ring"
  | "font-sans" | "font-display";

export interface ResolvedTheme {
  brandName: string;
  logo?: string;
  mode: "light" | "dark";
  /** CSS custom properties, keys include the "--cd-" prefix. */
  vars: Record<`--cd-${ThemeVar}`, string>;
  /** Accessibility notes produced while generating the palette. */
  warnings: string[];
}

const DARK = figmaVariables["brand-ink"];
const WHITE = "#FFFFFF";

function hover(hex: string): string {
  return luminance(hex) > 0.35 ? adjustLightness(hex, -6) : adjustLightness(hex, 8);
}
function active(hex: string): string {
  return luminance(hex) > 0.35 ? adjustLightness(hex, -12) : adjustLightness(hex, 14);
}

/** Near-black tinted with the primary hue (keeps the master's dark sidebar). */
export function deriveSecondary(primary: string): string {
  const { h, s } = hexToHsl(primary);
  return hslToHex({ h, s: Math.min(s, 30), l: 6 });
}

/** Deeper/warmer variant of primary used for the highlighted data point. */
export function deriveAccent(primary: string): string {
  const { h, s, l } = hexToHsl(primary);
  return hslToHex({ h: (h + 352) % 360, s: Math.min(100, s + 2), l: Math.max(30, l - 3) });
}

function fontStack(name: string | undefined, fallback: string): string {
  if (!name) return fallback;
  const quoted = /[\s,]/.test(name) && !name.includes('"') ? `"${name}"` : name;
  return `${quoted}, ${fallback}`;
}

const lightNeutrals = {
  bg: figmaVariables["bg-subtle"],
  surface: figmaVariables["bg-surface"],
  subtle: figmaVariables["bg-subtle"],
  border: figmaVariables["border-default"],
  "border-card": figmaRawValues.cardBorder,
  "border-strong": figmaRawValues.chipBorder,
  text: DARK,
  "text-strong": figmaVariables["text-strong"],
  "text-secondary": figmaVariables["text-secondary"],
  "text-placeholder": figmaVariables["text-placeholder"],
  thumb: figmaRawValues.thumbPlaceholder,
  overlay: "rgba(14, 14, 14, 0.4)",
  "unread-bg": figmaRawValues.notificationUnreadBg,
  "chart-track": figmaVariables["bg-subtle"],
};

/** Derived dark mode (no dark frames exist in Figma). Same warm neutral family, inverted. */
const darkNeutrals = {
  bg: "#111110",
  surface: "#1A1A19",
  subtle: "#242422",
  border: "#2F2E2B",
  "border-card": "#2F2E2B",
  "border-strong": "#45433E",
  text: "#F3F2EE",
  "text-strong": "#DAD8D2",
  "text-secondary": "#A3A29D",
  "text-placeholder": "#8F8D86",
  thumb: "#33322E",
  overlay: "rgba(0, 0, 0, 0.6)",
  "unread-bg": "#22211F",
  "chart-track": "#242422",
};

const lightStatus = {
  success: figmaVariables["status-success"],
  "success-bg": figmaVariables["status-success-bg"],
  warning: figmaVariables["status-warning"],
  "warning-bg": figmaVariables["status-warning-bg"],
  danger: figmaVariables["status-offer"],
  "danger-bg": figmaVariables["status-offer-bg"],
  info: figmaVariables["status-info"],
  "info-bg": mix(figmaVariables["status-info"], WHITE, 0.12),
};

const darkStatus = {
  success: "#6FD69C",
  "success-bg": withAlpha("#177A45", 0.28),
  warning: "#F0C25A",
  "warning-bg": withAlpha("#8A5E00", 0.32),
  danger: "#FF8A66",
  "danger-bg": withAlpha("#B8340D", 0.3),
  info: "#8DB3F5",
  "info-bg": withAlpha("#2860C0", 0.3),
};

export function createTheme(input: ClientTheme): ResolvedTheme {
  const warnings: string[] = [];
  const mode = input.mode ?? "light";
  const primary = input.primary.toUpperCase();
  const secondary = (input.secondary ?? deriveSecondary(primary)).toUpperCase();
  const accent = (input.accent ?? ensureReadableBackground(deriveAccent(primary))).toUpperCase();
  const n = mode === "dark" ? darkNeutrals : lightNeutrals;
  const st = mode === "dark" ? darkStatus : lightStatus;

  if (luminance(secondary) > 0.2) {
    warnings.push(
      `secondary ${secondary} is light. The master design uses a dark ink for the sidebar and featured KPI; consider a darker secondary.`,
    );
  }

  const onPrimary = readableOn(primary, DARK, WHITE);
  if (contrastRatio(primary, onPrimary) < 4.5) {
    warnings.push(`Text on primary only reaches ${contrastRatio(primary, onPrimary).toFixed(2)}:1 (< 4.5).`);
  }
  const onSecondary = readableOn(secondary, DARK, WHITE);
  const secondaryIsDark = onSecondary === WHITE;
  const onAccent = readableOn(accent, DARK, WHITE);
  if (contrastRatio(accent, onAccent) < 4.5) {
    warnings.push(`Text on accent only reaches ${contrastRatio(accent, onAccent).toFixed(2)}:1 (< 4.5).`);
  }

  // Featured KPI shows the primary colour on the secondary background (yellow on ink).
  const kpiValue =
    contrastRatio(primary, secondary) >= 3 ? primary : onSecondary;
  if (kpiValue !== primary) {
    warnings.push(`primary on secondary is below 3:1, featured KPI value falls back to ${kpiValue}.`);
  }

  // Bars: ink on light surfaces. In dark mode use the light text colour so bars stay visible.
  const chartBar = mode === "dark" ? (secondaryIsDark ? n.text : secondary) : secondary;
  const highlightVsBar = contrastRatio(accent, chartBar);
  if (highlightVsBar < 1.5) {
    warnings.push(`accent and chart bars are hard to tell apart (${highlightVsBar.toFixed(2)}:1).`);
  }

  const vars: Record<ThemeVar, string> = {
    primary,
    "primary-hover": hover(primary),
    "primary-active": active(primary),
    "primary-border": adjustLightness(primary, -11),
    "primary-soft": mode === "dark" ? withAlpha(primary, 0.16) : mix(primary, WHITE, 0.14),
    "on-primary": onPrimary,
    "primary-text": ensureContrast(primary, n.surface, 4.5),

    secondary: mode === "dark" && secondaryIsDark ? "#0A0A0A" : secondary,
    "secondary-hover": hover(secondary),
    "secondary-raised": secondaryIsDark ? mix(WHITE, secondary, 0.07) : adjustLightness(secondary, -6),
    "secondary-raised-2": secondaryIsDark ? mix(WHITE, secondary, 0.13) : adjustLightness(secondary, -12),
    "secondary-divider": secondaryIsDark ? "rgba(255, 255, 255, 0.14)" : "rgba(14, 14, 14, 0.14)",
    "on-secondary": onSecondary,
    "on-secondary-subtle": secondaryIsDark ? figmaRawValues.sidebarText : figmaVariables["text-strong"],
    "on-secondary-muted": secondaryIsDark ? figmaVariables["text-on-dark-muted"] : figmaVariables["text-secondary"],

    accent,
    "accent-border": mode === "dark" ? accent : DARK,
    "on-accent": onAccent,

    "kpi-featured-value": kpiValue,
    "kpi-featured-label": secondaryIsDark ? figmaRawValues.kpiLabelOnDark : figmaVariables["text-secondary"],
    "delta-up-on-dark": figmaRawValues.deltaOnDark,

    ...n,
    "row-highlight": mode === "dark" ? withAlpha(primary, 0.08) : mix(primary, WHITE, 0.1),
    "chart-bar": chartBar,
    "chart-highlight": accent,

    ...st,
    "on-danger": readableOn(st.danger, DARK, WHITE),
    "focus-ring": ensureContrast(primary, n.surface, 3),

    "font-sans": fontStack(input.fontFamily, typography.fontSans),
    "font-display": fontStack(input.displayFontFamily, typography.fontDisplay),
  };

  Object.assign(vars, input.overrides ?? {});

  const prefixed = Object.fromEntries(
    Object.entries(vars).map(([k, v]) => [`--cd-${k}`, v]),
  ) as ResolvedTheme["vars"];

  return { brandName: input.brandName, logo: input.logo, mode, vars: prefixed, warnings };
}

/** Serialise a theme to a CSS rule, e.g. for SSR or non-React hosts. */
export function themeToCss(theme: ResolvedTheme, selector = ":root"): string {
  const body = Object.entries(theme.vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n");
  return `${selector} {\n${body}\n  color-scheme: ${theme.mode};\n}`;
}

/** Apply a theme to an element's inline style (defaults to <html>). */
export function applyTheme(theme: ResolvedTheme, el?: HTMLElement): void {
  const target = el ?? document.documentElement;
  for (const [k, v] of Object.entries(theme.vars)) target.style.setProperty(k, v);
  target.dataset.cdMode = theme.mode;
}

/** The master theme, reproducing the Figma reference exactly. */
export const masterTheme: ClientTheme = {
  brandName: "AK57",
  primary: "#F5EF0F",
  secondary: "#0E0E0E",
  accent: "#F5C518",
  fontFamily: "Inter",
  displayFontFamily: "Anton",
  mode: "light",
  overrides: { "primary-border": "#C9C300", "row-highlight": figmaRawValues.rowHighlight },
};
