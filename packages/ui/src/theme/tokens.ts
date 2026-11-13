/**
 * Master design tokens extracted from the Figma master dashboard
 * (file p40PlJpwzE9AnX71gguRvI, page 297:805, "Admin Dashboard — Desktop 1440" 297:869).
 *
 * LAYOUT, SPACING, RADIUS, TYPE SCALE and NEUTRALS are part of the master design and are
 * NOT client-configurable. Only brand colours, fonts, logo and name change per client.
 */

/** Figma variables (light mode) — values exactly as defined in the file. */
export const figmaVariables = {
  "brand-ink": "#0E0E0E",
  "brand-yellow": "#F5EF0F",
  "bg-surface": "#FFFFFF",
  "bg-subtle": "#F3F2EE",
  "border-default": "#E4E1D8",
  "text-secondary": "#6B6B6B",
  "text-strong": "#3A3A3A",
  "text-placeholder": "#6E6A60",
  "text-on-dark-muted": "#9A9A9A",
  "status-success": "#177A45",
  "status-success-bg": "#DDF3E7",
  "status-warning": "#8A5E00",
  "status-warning-bg": "#FBF0D5",
  "status-offer": "#B8340D",
  "status-offer-bg": "#FBE3DC",
  "status-info": "#2860C0",
} as const;

/** Raw (un-tokenised) values that recur in the Figma frames. */
export const figmaRawValues = {
  cardBorder: "#E7E5DF", // dashboard cards (orders/forms use border-default #E4E1D8)
  sidebarRaised: "#1B1B1B", // "Store is live" card, mobile bell button
  sidebarBadge: "#2A2A2A", // neutral nav count badge
  sidebarText: "#D6D6D6", // inactive nav label
  kpiLabelOnDark: "#BDBDBD",
  deltaOnDark: "#7CE3A8",
  chartHighlight: "#F5C518", // current-period bar + count on dark tab
  rowHighlight: "#FFFDE6", // highlighted / new table row
  thumbPlaceholder: "#E8E4DA",
  chipBorder: "#D9D6CF",
  notificationUnreadBg: "#F3F1EC",
} as const;

export const typography = {
  fontSans: `"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`,
  fontDisplay: `"Anton", "Impact", "Arial Narrow", sans-serif`,
  /** Figma text styles. lineHeight 100% = "normal" in Figma export. */
  styles: {
    "display/kpi": { font: "display", size: 38, weight: 400 }, // KPI value
    "display/m": { font: "display", size: 22, weight: 400 }, // modal title, logo (Display/S)
    "heading/page": { font: "sans", size: 26, weight: 700 },
    "heading/page-mobile": { font: "sans", size: 24, weight: 700 },
    "heading/card": { font: "sans", size: 17, weight: 700 },
    "heading/panel": { font: "sans", size: 16, weight: 700 },
    "label/l": { font: "sans", size: 14, weight: 700 },
    "label/m": { font: "sans", size: 13, weight: 600 },
    "label/s": { font: "sans", size: 12, weight: 700 },
    "body/m": { font: "sans", size: 14, weight: 400 },
    "body/s": { font: "sans", size: 13, weight: 400 },
    caption: { font: "sans", size: 12, weight: 400 },
    overline: { font: "sans", size: 12, weight: 700, letterSpacing: "0.08em", uppercase: true },
    "overline/s": { font: "sans", size: 11, weight: 600, letterSpacing: "0.08em", uppercase: true },
  },
} as const;

export const radius = {
  xs: 4, // progress track
  sm: 6, // segmented inner, thumbs, chart bar tops (5)
  md: 8, // segmented outer, small buttons, table head
  lg: 10, // buttons, inputs, nav items, icon buttons
  xl: 12, // filter tab group
  "2xl": 14, // popover / notifications panel, sidebar promo card
  modal: 16,
  card: 18,
  pill: 999,
} as const;

export const spacing = {
  pageX: 32,
  pageY: 28,
  sectionGap: 24,
  gridGap: 16,
  cardPad: 24,
  kpiPad: 22,
  sidebarWidth: 251,
  sidebarPadX: 20,
  sidebarPadY: 24,
  navItemPadX: 12,
  navItemPadY: 11,
  navGap: 6,
  controlHeight: 44,
  inputHeight: 46,
  mobilePadX: 16,
  mobileTabBarHeight: 72,
} as const;

export const elevation = {
  none: "none", // cards are flat with 1px border
  popover: "0 12px 32px rgba(0, 0, 0, 0.14)",
  modal: "0 24px 64px rgba(0, 0, 0, 0.24)", // derived (not in Figma)
} as const;

export const iconSizes = { xs: 12, sm: 14, md: 16, lg: 18, xl: 20 } as const;

export const breakpoints = {
  mobile: 0, // Figma: 375 frames
  tablet: 768, // derived — no tablet frame in Figma
  desktop: 1280, // Figma: 1440 frames, sidebar full from here
  wide: 1440,
} as const;
