# Figma master reference

The approved master dashboard. **Source of truth** for every visual decision.

| | |
|---|---|
| File | `AK57 Mens World — Website & Dashboard` |
| URL | https://www.figma.com/design/p40PlJpwzE9AnX71gguRvI/AK57-Mens-World-%E2%80%94-Website---Dashboard?node-id=297-805 |
| File key | `p40PlJpwzE9AnX71gguRvI` |
| Page node | `297:805` (name: "make md") |
| Desktop section | `297:806` "3 · Admin — Desktop" (1440 frames) |
| Mobile section | `297:10141` "4 · Admin — Mobile 375" |

Screenshots of the key frames are in `assets/screenshots/figma/`. Implementation renders to compare against are in `assets/screenshots/implementation/`.

## Re-inspecting Figma

Use the Figma MCP when the user changes the design or asks about a pattern not documented here:

1. `create_session` with the file key, then `get_screenshot` / `get_design_context` on the node below.
2. `get_variable_defs` needs a **frame** node id (not the page node `297:805`).
3. `get_metadata` on the page node returns ~900 KB; save to a file and filter it with `jq`/python instead of reading it.
4. Figma asset URLs may be blocked by the sandbox network policy; use `get_screenshot` with `enableBase64Response: true`.

If the Figma MCP is not available, ask the user to configure it or send exported screenshots. Do not invent specs.

## Frame index (desktop 1440)

| Frame | Node | Used for |
|---|---|---|
| Admin — Login | 297:807 | Auth screen (brand panel 620px + form) |
| **Admin Dashboard** | **297:869** | Master layout: sidebar, header, KPI row, chart + list, table |
| Admin — Orders | 297:1177 | List page: filter bar, grouped data table, row menu |
| Order detail #AK1043 | 297:1630 | Detail page |
| Invoice / Packing slip (A4 print 794) | 297:1928 / 297:7037 | Print layouts |
| Admin — Products | 297:2005 | Product list |
| Add product / Edit product | 297:2402 / 297:2626 | Two-column form page (main + 340px aside) |
| Inventory | 297:3087 | Stat cards + table + "Recent movements" |
| Customers | 297:3450 | List |
| Wholesale enquiries (+ states) | 297:3767, 297:7740, 297:8477, 297:8069, 297:9382 | List + status variants |
| Coupons & offers (+ edit) | 297:4174, 297:9799 | List + form |
| Reports | 297:4481 | Charts and tables |
| Settings | 297:4900 | Forms |
| Delivery / Staff | 297:5165 / 297:5450 | Lists + forms |
| **Restock pop-up** | **297:5611** (modal 297:5976) | Modal pattern |
| Start exchange pop-up | 297:6005 | Modal pattern |
| Invite staff pop-up | 297:6794 | Modal pattern |
| **Notifications panel** | **297:7112** (panel 297:7421) | Popover pattern |
| Low-stock state note | 297:7514 | "below 20 units" rule |
| Variants matrix | 297:7515 | Product variants table |

## Mobile (375)

| Frame | Node |
|---|---|
| **Dashboard** | **297:10142** (header 297:10143, tab bar 297:10251) |
| Orders / Order detail / Enquiries / More / Notifications | 297:10252 / 10387 / 10496 / 10600 / 10695 |

## Figma components (the few that exist)

- `Admin Mobile / Tab bar` (component set `71:543`): "Bottom navigation for the mobile admin. Active tab: yellow pill behind the icon, ink label."
- `Toggle` / `Toggle / On`, `Badge`, `Button / …` and `Status / …` are named frames, **not** published components. Treat names as hints to the pattern.

## What Figma does NOT contain (derived, label as such)

- Tablet frames (768–1279)
- Dark mode
- Loading / skeleton, empty, error and success states for data views
- Drawer (right side panel), toast, alert banners, row action menu contents
- Focus styles, hover states, disabled states

These are derived from the master tokens in `design-system.md` and marked "derived" in `component-rules.md`. If the project needs one of these and the user has a Figma design for it, use theirs.
