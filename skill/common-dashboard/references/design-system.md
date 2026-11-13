# Design system (extracted from Figma 297:869 and sibling frames)

All values below were read from Figma variables and design context. They are encoded in `@dashboard-kit/ui` (`src/theme/tokens.ts`, `src/styles/tokens.css`). **Use the CSS variables, never the raw values.**

## Colour

Figma variables (light mode):

| Figma variable | Value | CSS var | Role |
|---|---|---|---|
| `brand-ink` | `#0E0E0E` | `--cd-secondary` | Sidebar, featured KPI card, header CTA, chart bars, active tab, tooltip, body text |
| `brand-yellow` | `#F5EF0F` | `--cd-primary` | Active nav item, confirm button, tab counts, featured KPI value, mobile tab pill, top progress bar |
| `bg-subtle` | `#F3F2EE` | `--cd-bg`, `--cd-subtle` | Page background, table head, segmented control, progress track |
| `bg-surface` | `#FFFFFF` | `--cd-surface` | Cards, inputs, modal, popover |
| `border-default` | `#E4E1D8` | `--cd-border` | Inputs, tables on list pages, popover, dividers |
| `text-secondary` | `#6B6B6B` | `--cd-text-secondary` | Labels, captions, table headers |
| `text-strong` | `#3A3A3A` | `--cd-text-strong` | Group header text |
| `text-placeholder` | `#6E6A60` | `--cd-text-placeholder` | Placeholders, notification body text |
| `text-on-dark-muted` | `#9A9A9A` | `--cd-on-secondary-muted` | Muted text on the dark sidebar/KPI |
| `status-success` / `-bg` | `#177A45` / `#DDF3E7` | `--cd-success` / `-bg` | Delivered, up deltas, "new stock" |
| `status-warning` / `-bg` | `#8A5E00` / `#FBF0D5` | `--cd-warning` / `-bg` | Processing, low-stock |
| `status-offer` / `-bg` | `#B8340D` / `#FBE3DC` | `--cd-danger` / `-bg` | Cancelled, out of stock, error, unread dot, danger badges |
| `status-info` | `#2860C0` | `--cd-info` | Shipped, enquiry icon |

Raw (un-tokenised) values that recur in frames (also encoded as tokens): card border `#E7E5DF`, sidebar raised surface `#1B1B1B`, neutral nav badge `#2A2A2A`, inactive nav text `#D6D6D6`, KPI label on dark `#BDBDBD`, delta on dark `#7CE3A8`, chart highlight bar `#F5C518`, highlighted row `#FFFDE6`, thumbnail placeholder `#E8E4DA`, chip border `#D9D6CF`, unread notification background `#F3F1EC`.

**Brand-neutral naming:** in code the brand pair is `primary` (the yellow) and `secondary` (the ink). Clients change those two plus `accent` (the chart highlight). Neutrals and status colours are fixed.

## Typography

Fonts: **Inter** (UI) and **Anton** (display: KPI numbers, logo wordmark, modal titles). Line-height is the font's normal (`line-height: normal`), not a fixed ratio.

| Style | Font | Size / weight | Used for |
|---|---|---|---|
| Display / KPI | Anton | 38 / 400 | KPI values |
| Display / S | Anton | 22 / 400 | Logo name, modal title |
| Page title | Inter | 26 / 700 (mobile 24) | Header title |
| Card title | Inter | 17 / 700 | Card headings |
| Panel title | Inter | 16 / 700 | Notifications, drawer |
| Label / L | Inter | 14 / 700 | Buttons, nav active, names |
| Body / M | Inter | 14 / 400 | Subtitles, inputs |
| Label / M | Inter | 13 / 600 | KPI labels, field labels, chips |
| Body / S | Inter | 13 / 400 | Table cells, secondary text |
| Label / S | Inter | 12 / 700 | Badges, deltas, segmented |
| Caption | Inter | 12 / 400 | Meta text |
| Overline | Inter | 12 / 700, +8% tracking, uppercase | Table headers, section labels |
| Overline / S | Inter | 11 / 600, +8% tracking, uppercase | Notification groups |

## Radius

`4` progress track · `6` segmented inner, thumbs · `8` segmented outer, table head, tooltips · `10` buttons, inputs, nav items, icon buttons · `12` filter tab group · `14` popover, sidebar promo card (mobile cards) · `16` modal · `18` cards and KPI cards · `999` pills and badges. Chart bar tops: `5`.

## Spacing and sizes

- Page padding **32 × 28** (mobile 16). Section gap **24**. Card grid gap **16**. Card padding **24** (KPI **22**).
- Sidebar **251** wide, padding 24 × 20, nav item padding 11 × 12, gap between nav items 6, icon 18.
- Control height **44** (buttons, search, icon buttons). Input height **46**. Modal buttons 46.
- Table: head padding 10 × 12 (compact) / 12 × 20 (list pages); rows 13–14 vertical padding; list-page row height 64.
- Mobile tab bar **72** high.

## Elevation

Cards are flat (1px border, no shadow). Shadows exist only on the popover (`0 12px 32px rgba(0,0,0,.14)`, from Figma) and the modal (`0 24px 64px rgba(0,0,0,.24)`, derived). Overlay is ink at 40%.

## Icons

Line icons, 2px stroke, round caps, `currentColor`. Sizes: **18** nav and icon buttons, **16** inside buttons/search, **14** small actions, **12** inside delta pills, **20** mobile tab bar and modal close. The library ships a small internal set; client projects may pass their own icons as `ReactNode`.

## Motion (derived)

`160ms cubic-bezier(.2,0,0,1)` on colour/background/border; disabled under `prefers-reduced-motion`.
