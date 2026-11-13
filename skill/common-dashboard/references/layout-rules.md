# Layout rules

## Shell (Figma 297:869, 1440 wide)

```
┌────────────┬──────────────────────────────────────────────┐
│ Sidebar    │ Main  (padding 28 / 32, gap 24)               │
│ 251px, ink │  Header: title + subtitle | search, bell, CTA │
│ sticky     │  KPI row: 4 × StatCard, gap 16 (first = ink)  │
│            │  Row: ChartCard (2fr) | Card list (1fr)       │
│ Settings   │  Table card (full width)                      │
│ Log out    │                                               │
│ Promo card │                                               │
└────────────┴──────────────────────────────────────────────┘
```

- Sidebar is `position: sticky; height: 100vh`, scrolls internally; nav groups at the top, **Settings / Log out and the promo card pinned to the bottom** (spacer between).
- Main column never has its own max-width in the master: it fills 1189px at 1440.
- Cards sit directly on the `#F3F2EE` page background. No shadows.

## Page templates

| Template | Figma | Composition |
|---|---|---|
| Dashboard home | 297:869 | `DashboardHeader` (greeting) → `KpiGrid` → `CardGrid 2-1` (`ChartCard` + progress card) → table card |
| List page | 297:1177 | `DashboardHeader` (+ primary CTA) → `FilterBar` (tabs left, sort/date/export right) → `DashboardCard flush` with `DataTable density="full"` |
| Form page | 297:2402 | `DashboardHeader` + `DashboardBreadcrumb` → `CardGrid main-aside`: left = stacked `DashboardCard`s, right 340px = Publish button + Status + Organisation cards |
| Stats + table | 297:3087 | `KpiGrid` (3) → table card + side card (e.g. "Recent movements") |
| Detail page | 297:1630 | Header with back breadcrumb → main cards + aside summary |
| Auth | 297:807 | 620px brand panel (ink) + form panel |
| Print (invoice, packing slip) | 297:1928 / 297:7037 | A4 at 794px, white, no sidebar |

## Header rules

- Left: title (26/700) over subtitle (14, secondary). Form pages replace the subtitle with a breadcrumb.
- Right: `SearchInput` → bell (`NotificationsMenu`) → primary action (`secondary` button). Pages without a primary action omit it; order is fixed.
- Greeting copy ("Good evening, …") is project data, not part of the component.

## Navigation rules

- Nav items come from a config array (`NavItem[]`): `id`, `label`, `href`, `icon`, `badge`, `permission`, `mobile`, `mobileLabel`.
- Exactly one item has `aria-current="page"`.
- Hide items the user cannot access with `canAccess(permission)`; do not render disabled items.
- Count badges: neutral for informational counts, `danger` for things that need action (low stock).
- Bottom group (Settings, Log out) always last, above the promo card.
- Routing: pass the router's Link as `linkAs` (React Router `Link`, Next.js `Link`). The kit never imports a router.

## Grid

- KPI row: `repeat(4, 1fr)` gap 16. The number of KPIs is a project decision; use `KpiGrid columns={2|3|4}`.
- Chart row: `2fr 1fr`, gap 16.
- Form page: `1fr 340px`, gap 24; inside the left column cards are separated by 24.
- Form fields: two-column `FormGrid` gap 16, long fields span both (`full`).
