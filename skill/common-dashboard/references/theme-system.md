# Theme system

Per-client branding changes **only colour, fonts, logo and name**. Layout, spacing, radius, type scale, neutrals and status colours are fixed by the master.

## Input

```ts
import { ThemeProvider, type ClientTheme } from "@dashboard-kit/ui";
import "@dashboard-kit/ui/styles.css";

const clientTheme: ClientTheme = {
  brandName: "Client Name",
  logo: "/logo.svg",
  primary: "#2563EB",      // required. The highlight (master: yellow #F5EF0F)
  secondary: "#0B1220",    // optional. The ink (master: #0E0E0E). Should be dark
  accent: "#0EA5E9",       // optional. Current-period chart bar (master: #F5C518)
  fontFamily: "Inter",     // optional. UI font
  displayFontFamily: "Anton", // optional. KPI numbers, logo name, modal titles
  mode: "light",           // "light" | "dark"
};

<ThemeProvider theme={clientTheme}> … </ThemeProvider>
```

`ThemeProvider` calls `createTheme()` and writes the result as `--cd-*` CSS variables on a wrapper element. Several themes can coexist on a page. Outside React use `applyTheme(createTheme(t))` or `themeToCss(createTheme(t))`.

## What the client colours drive

| Client input | Where it appears |
|---|---|
| `primary` | Active nav item, confirm/“View store” buttons, count pill on active tab, featured KPI value, top progress bar, mobile tab pill, toggle knob (on), focus ring |
| `secondary` | Sidebar, featured KPI card, header CTA, chart bars, active tab, tooltips, mobile header |
| `accent` | The highlighted (current) chart bar |

## Only a primary colour?

`createTheme` generates the rest:

- `secondary` → near-black tinted with the primary hue (L 6%, S ≤ 30%)
- `accent` → a slightly deeper primary, nudged until text on it reaches 4.5:1
- `primary-hover` / `-active` / `-border` / `-soft` → lightness steps
- `on-primary`, `on-secondary`, `on-accent`, `on-danger` → ink or white, whichever has more contrast
- `primary-text` → primary darkened until it reaches 4.5:1 on the surface (for text/links in brand colour)
- `focus-ring` → primary adjusted to ≥ 3:1 on the surface

Client-supplied colours are **never altered**; if they fail contrast the theme returns `warnings[]` (read `useDashboardTheme().warnings` or `createTheme(t).warnings`) and you must tell the user.

## Variables (`--cd-*`)

Brand: `primary`, `primary-hover`, `primary-active`, `primary-border`, `primary-soft`, `on-primary`, `primary-text`, `secondary`, `secondary-hover`, `secondary-raised`, `secondary-raised-2`, `secondary-divider`, `on-secondary`, `on-secondary-subtle`, `on-secondary-muted`, `accent`, `accent-border`, `on-accent`, `kpi-featured-value`, `kpi-featured-label`, `delta-up-on-dark`.
Neutrals: `bg`, `surface`, `subtle`, `border`, `border-card`, `border-strong`, `text`, `text-strong`, `text-secondary`, `text-placeholder`, `row-highlight`, `thumb`, `overlay`, `unread-bg`, `chart-bar`, `chart-highlight`, `chart-track`.
Status: `success`, `success-bg`, `warning`, `warning-bg`, `danger`, `danger-bg`, `on-danger`, `info`, `info-bg`, `focus-ring`.
Fonts: `font-sans`, `font-display`.

Fixed tokens (`--cd-radius-*`, `--cd-page-x`, `--cd-sidebar-w`, `--cd-fs-*` …) are in `tokens.css` and are not theme inputs.

## Dark mode

Not in Figma. Derived: warm near-black neutrals (`#111110` page, `#1A1A19` surface), status colours lightened to keep ≥ 4.5:1, chart bars use the light text colour. Layout is identical. Set `mode: "dark"`.

## Fonts

The kit sets `font-family` from the theme but does not load fonts. Add the client's fonts in the project (e.g. Google Fonts `<link>`, `@font-face`, or `next/font`). Master: Inter 400–700 and Anton 400.

## Master theme

`masterTheme` reproduces the Figma design exactly (AK57). It is only a test fixture and an example; **never ship `AK57` branding in a client project**.

## Example themes

`examples/` in the skill and `apps/starter/src/themes/index.ts` contain three: `ak57` (master), `oceanClinic` (primary only), `verdeFoods` (full custom, dark).

## Rules

- Never hardcode a client colour in a component or stylesheet; add it to the theme.
- Never edit `tokens.css` fixed values per client.
- Check `warnings` and run the contrast tests (`npm test -w @dashboard-kit/ui`) when a client supplies colours.
