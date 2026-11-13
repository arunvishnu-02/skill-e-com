# Component rules

Every component is in `@dashboard-kit/ui` (or `assets/kit/` for the copy-in fallback). Figma node ids are the visual source of truth. "Derived" = not in Figma, built from master tokens.

## Rules that apply to every component

1. Style only with `--cd-*` variables. No hex, no px values that are not in `design-system.md`.
2. No client names, logos, copy, currencies, routes or API calls inside shared components. Data and labels come in as props.
3. Business logic (fetching, formatting money/dates, permissions) lives in the project's own code and is passed in (`columns[].cell`, `canAccess`, `linkAs`).
4. Every interactive element is keyboard reachable with a visible focus ring; icon-only buttons need `label`.
5. Do not change a component's look to suit a client. If a client needs a different look, that is a design change, ask the user.

## Catalogue

| Component | Figma | Notes |
|---|---|---|
| `DashboardLayout` | 297:869 | Shell: sidebar + `<main>` (32/28 padding, 24 gap). Slots `mobileHeader`, `mobileTabBar`. |
| `DashboardSidebar` | 297:870 | 251px ink. Props: `brand`, `items: NavItem[]`, `bottomItems`, `activeId`, `footer`, `linkAs`, `canAccess`. Active item = primary fill, bold. Count badge: neutral `#2A2A2A` or `danger`. |
| `SidebarPromo` | 297:956 | "Store is live" card: `#1B1B1B`, 14px radius, brand CTA. Optional. |
| `DashboardHeader` | 297:962 | Title 26/700 + subtitle 14; `actions` right; `breadcrumb` for form pages; `hideOnMobile` on home. |
| `DashboardBreadcrumb` | 297:2496 | `Products / New product`, 13px secondary. |
| `SearchInput` | 297:967 | 280×44, 10px radius, border `#E7E5DF`. |
| `NotificationsMenu` + `NotificationsPanel` | 297:7421 | Bell opens a 420px popover (14px radius, popover shadow). Tabs (pill), grouped list, unread rows tinted `#F3F1EC` with red dot, footer links. |
| `DashboardCard` | 297:1024 | 18px radius, 1px border, 24 padding. `title`, `subtitle`, `actions`, `flush`. |
| `StatCard` | 297:982 / 297:992 | `featured` = ink card with primary-colour value (first KPI only). Anton 38 value. `delta` pill (up/down/neutral) + `note`. |
| `KpiGrid` | 297:981 | 4 columns desktop, 2 tablet/mobile. |
| `CardGrid` | 297:1023 | `2-1` (chart + list) or `main-aside` (form page, 340px aside). |
| `ChartCard` | 297:1024 | Card + `loading` / `error` / `empty` handling. |
| `BarChart` | 297:1037 | 36px bars, 5px top radius, last/active bar = accent with ink border + tooltip (297:1066). |
| `ProgressList` | 297:1069 | 8px track; first row highlighted in primary. |
| `Tabs` | 297:1290, 297:1030, 297:7428 | `boxed` (status tabs with counts), `segmented` (7D/30D/90D), `pill` (notifications). Arrow-key navigation. |
| `FilterBar` | 297:1289 | Tabs left, actions right (sort, date range, export). |
| `DataTable` | 297:1339 / 297:1102 | `density="compact"` (dashboard card) or `"full"` (list page: 64px rows, grouped months). Props: `columns`, `rows`, `rowKey`, `groupBy`, `highlightRow`, `onRowClick`, `loading`, `error`, `empty`, `mobileCard`, `footer`. |
| `RowMenu` | derived | `⋯` button + menu (`role="menu"`, Esc/outside click closes). |
| `StatusBadge` | 297:1384 | Pill, 12/700. Tones: success, warning, danger, info, neutral, brand, ink. Map your statuses to tones in project code. |
| `FormField`, `TextInput`, `TextArea`, `Select` | 297:2589 | Label 13/600, input 46px, 10px radius, border `#E4E1D8`, focus = ink border. |
| `FormGrid` | 297:2510 | 2 columns, collapses to 1 on mobile. |
| `ChoiceGroup` | 297:2510 | Segmented radio ("Single product / Product with variants"). |
| `Toggle` | 297:2574 | 40×24 switch; on = ink track + primary knob. `role="switch"`. |
| `Chip` | 297:5991 | 999px pill, `#D9D6CF` border. |
| Upload area (`.cd-upload`) | 297:2510 | Dashed, 150px min height. |
| `Modal` | 297:5976 | 420px, 16px radius, 24 padding, Anton title, close icon, actions row of equal buttons (46px). Focus trap, Esc, restores focus. Bottom sheet on mobile (derived). |
| `Drawer` | derived | Right panel 420px; same focus handling. |
| `MobileHeader` | 297:10143 | Ink header: brand + bell with count; greeting below. |
| `MobileTabBar` | 297:10251 | 5 tabs, 72px, active = primary pill behind icon, label bold ink. |
| `EmptyState` | derived | Icon in subtle circle, title 16/700, text 13 secondary, optional actions. Tones: default, error, success. |
| `LoadingSkeleton` / `Skeleton` | derived | Shimmer using `--cd-subtle` → `--cd-border-card`; variants `stat`, `table`, `chart`, `card`. |
| `Alert` | derived | success / warning / danger / info on the `-bg` colours. |
| `ToastRegion` | derived | Ink toast with primary icon, bottom-right (above tab bar on mobile). |

## Buttons (297:976, 297:6001, 297:6003)

| Variant | Look | Use |
|---|---|---|
| `secondary` | Ink fill, white text | Header CTA ("Add product"), "Publish product" |
| `primary` | Brand fill, ink text | Modal confirm, "View store" |
| `outline` | White, `#E4E1D8` border | Sort, date range, Cancel, Preview |
| `ghost` | Text only, secondary | "Export" |
| `danger` | White, danger border | Destructive confirm (derived) |

Height 44 (`lg` 46, `sm` 32), radius 10, label 14/700.

## State patterns (derived, consistent across components)

- **Loading:** `LoadingSkeleton` in place of the content, `role="status"`, `aria-busy`.
- **Empty:** `EmptyState` with one clear next action.
- **Error:** `EmptyState tone="error"` + retry. Field errors use `FormField error` (red text, `aria-invalid`).
- **Success:** `ToastRegion` or `Alert tone="success"`.
- **Low stock:** "below 20 units" (Figma note 297:7514) uses the warning badge; 0 = danger "Out".

## Adding a component that is not in Figma

Only when the project truly needs it. Compose from existing components and tokens, document it in the project, and tell the user it is a derived pattern and may need a Figma design.
