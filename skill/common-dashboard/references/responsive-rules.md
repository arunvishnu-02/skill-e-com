# Responsive rules

| Range | Source | Behaviour |
|---|---|---|
| **≥ 1280** desktop | Figma 1440 frames | Full 251px sidebar, 4-col KPI row, `2fr 1fr` chart row, `1fr 340px` form page |
| **1024–1279** | derived | Sidebar collapses to a 76px icon rail (labels hidden, badges become corner dots; `sidebarExpanded` keeps it full). KPI row 2 columns. Form aside narrows to 300px |
| **768–1023** | derived | As above; chart row and form page stack to one column; page padding 24 |
| **< 768** mobile | Figma 375 frames | Sidebar hidden. `MobileHeader` (ink, brand + bell + greeting) and fixed `MobileTabBar` (72px, 4 key items + More). Page padding 16, gaps 16/10, card padding 16, KPI value 28px, cards 14px radius. KPI row 2 columns with plain-text deltas (no pill, no icon) |

## Mobile specifics (Figma 297:10142)

- Home hides the page header (`DashboardHeader hideOnMobile`) because `MobileHeader` already shows the greeting. Other pages keep their title and the search/actions wrap to full width.
- Tab bar items come from `NavItem.mobile` (max 4) + a "More" button that should open a `Drawer` with the remaining nav. Use `mobileLabel` for short names ("Home", "Enquiries").
- Tables: pass `mobileCard` to `DataTable` to show each row as a list item (title + meta left, amount/status right). Without it the table scrolls horizontally.
- Modals become bottom sheets (full width, 16px top radius, safe-area padding). Toasts sit above the tab bar.
- Filter bars stack; tab groups scroll horizontally.
- Touch targets ≥ 44px (buttons, icon buttons and tab items are).

## Rules

- Mobile-first CSS is not used; breakpoints are `max-width` overrides in `components.css`. Add overrides there, not per-project.
- Never hide business-critical data on mobile; restructure it (cards) instead.
- Do not add a new breakpoint without asking.
- Test at **1440, 1024, 820, 375** and check there is no horizontal page scroll (`scripts/shoot.mjs` reports `hScroll`).
- Respect `prefers-reduced-motion` (transitions off) and `env(safe-area-inset-bottom)` on the tab bar.
