---
name: common-dashboard
description: Build or extend an admin dashboard (sidebar, header, KPI cards, tables, forms, modals, charts, mobile) that matches the approved master Figma dashboard, with per-client branding via theme tokens. Use whenever the user asks for a dashboard, admin panel, back office or a new dashboard screen/module in any project.
---

# common-dashboard

Reuse one approved dashboard design across client projects. **Only branding and business content change; the design system does not.** Do not redesign, restyle or invent patterns.

Master design: Figma file `p40PlJpwzE9AnX71gguRvI`, page node `297:805` (desktop frames 1440, mobile frames 375). Main reference frame: `297:869` (dashboard).

## Where things live

| What | Where |
|---|---|
| Reference docs | `references/` next to this file: `figma-reference.md`, `design-system.md`, `component-rules.md`, `layout-rules.md`, `theme-system.md`, `responsive-rules.md` |
| Reference screenshots | `assets/screenshots/figma/` (design) and `assets/screenshots/implementation/` (what the kit renders) |
| Component library (source of truth) | npm workspace package `@dashboard-kit/ui` in the `dashboard-kit` GitHub repo (versioned with semver tags) |
| Copy-in fallback | `assets/kit/` (`src/` of the package + `styles/`), for projects that cannot install the package |
| Working example | `apps/starter` in the repo: dashboard, orders, add-product, inventory modal, states, 3 themes |

If `references/` is not available (skill installed without its folder), read the same files from the `skill/common-dashboard/` folder of the `dashboard-kit` repo. If neither is reachable, ask the user for the repo location; do not guess specs.

## Workflow (follow in order)

1. **Inspect the project.** Framework (Next.js/Vite/CRA/Remix), TypeScript, styling approach (Tailwind, CSS modules, plain CSS), router, UI/icon libs, existing dashboard components, auth/permissions, API layer. Read `package.json`, the router, an existing page.
2. **Read this skill's references** (at least `design-system.md`, `component-rules.md`, `layout-rules.md`; `theme-system.md` when branding; `responsive-rules.md` for layout work).
3. **Find existing dashboard pieces** in the project. Reuse and wrap them rather than duplicating. Never replace existing dependencies or frameworks without the user's approval.
4. **Ask for missing branding only if needed:** brand name, logo file, primary colour (required). Secondary, accent, fonts and mode are optional and are generated/defaulted (see `theme-system.md`). Ask in one message.
5. **Install the kit.** Preferred: add `@dashboard-kit/ui` (git dependency or workspace) and `import "@dashboard-kit/ui/styles.css"` once. Fallback: copy `assets/kit/` into the project (e.g. `src/dashboard-kit/`) and import its `styles.css`. Keep the kit files unmodified; extend by composition in project code.
6. **Configure the theme** with a `ClientTheme` object and `ThemeProvider`. Load the client's fonts in the project. Check `createTheme(theme).warnings` and report any contrast warnings to the user.
7. **Compose pages** from kit components using the page templates in `layout-rules.md`. Navigation, KPIs, columns, chart data, roles/permissions and API calls are the project's own: pass them as props/config. Keep business logic out of presentation components (fetch in hooks/services, format in `cell` renderers).
8. **Preserve existing behaviour:** keep existing routes, APIs, state and permissions working. Wrap, do not rewrite.
9. **Validate** (checklist below) at 1440, 1024, 820 and 375. Compare screenshots to `assets/screenshots/figma/`.
10. **Report** what was reused, what was created, what is a derived pattern (not in Figma) and any warnings.

## Non-negotiable rules

- Use `--cd-*` CSS variables and kit components. **No** hardcoded hex colours, ad-hoc spacing, radius, font sizes or shadows. If a value is not in `design-system.md`, it does not exist.
- **No client branding inside shared components** (names, logos, colours, copy, currency, routes). Brand comes only from the theme.
- Do not invent new patterns. If the project needs a component that is not in the kit/Figma, compose it from existing tokens and components, label it "derived", and tell the user it may need a Figma design.
- Layout never changes between clients (sidebar 251px, 32/28 padding, 16 gaps, 18px card radius, etc.).
- The master AK57 theme is a fixture. **Never ship AK57 branding** in a client project.
- Extract from Figma instead of assuming. If the user changes the design or asks for a pattern not documented, use the Figma MCP (`get_screenshot`, `get_design_context`, `get_variable_defs` on a frame node). If the Figma MCP is unavailable, ask the user to configure it or send screenshots.
- Do not add new frameworks (Tailwind, UI kits, state libraries) without approval. The kit has zero runtime dependencies besides React.

## Design system in one screen

Colours (CSS var → master value): `--cd-secondary` ink `#0E0E0E` (sidebar, featured KPI, CTA, bars) · `--cd-primary` highlight `#F5EF0F` (active nav, confirm, tab counts) · `--cd-bg` `#F3F2EE` · `--cd-surface` `#FFFFFF` · `--cd-border` `#E4E1D8` · `--cd-text-secondary` `#6B6B6B` · success `#177A45` · warning `#8A5E00` · danger `#B8340D` · info `#2860C0`.
Type: Inter UI; Anton for KPI numbers (38), logo and modal titles (22); page title 26/700, card title 17/700, labels 14/700 and 13/600, body 14/13, captions 12, overline 12/700 uppercase +8%.
Shape: cards 18, modal 16, popover 14, buttons/inputs 10, pills 999. Cards are flat with a 1px border; shadow only on popover/modal.
Spacing: page 32×28, section gap 24, card gap 16, card padding 24, controls 44, inputs 46.
Responsive: ≥1280 full sidebar · 768–1279 icon rail (derived) · <768 mobile header + bottom tab bar (Figma 375).

## Minimal usage

```tsx
import "@dashboard-kit/ui/styles.css";
import { ThemeProvider, DashboardLayout, DashboardSidebar, DashboardHeader, KpiGrid, StatCard } from "@dashboard-kit/ui";

<ThemeProvider theme={clientTheme}>
  <DashboardLayout sidebar={<DashboardSidebar brand={{ name: clientTheme.brandName, logo: clientTheme.logo }} items={nav} activeId="dashboard" linkAs={RouterLink} />}>
    <DashboardHeader title="Overview" actions={<Button variant="secondary">New</Button>} />
    <KpiGrid>
      <StatCard featured label="Revenue" value={fmt(total)} delta={{ value: "+12%" }} note="vs last week" />
    </KpiGrid>
  </DashboardLayout>
</ThemeProvider>
```

## Validation checklist

- [ ] **Fidelity:** each page screenshot matches the corresponding Figma frame (layout, spacing, type, radius, colours). Differences are listed and justified.
- [ ] **Shell consistency:** same sidebar and header structure on every page; one `aria-current="page"` item.
- [ ] **Cards/tables:** all use `DashboardCard`/`StatCard`/`DataTable`; no one-off card or table CSS.
- [ ] **Theme tokens:** no hex colours in project/dashboard CSS (`grep -rEn "#[0-9a-fA-F]{3,8}\b"` over dashboard files returns nothing outside theme config); switching `ClientTheme` changes colours only, not layout.
- [ ] **No client branding in shared code:** no client name/logo/colour in kit files or in components reused across clients.
- [ ] **Responsive:** 1440, 1024, 820, 375: no horizontal page scroll, sidebar → rail → tab bar, tables have `mobileCard` or scroll.
- [ ] **Accessibility:** run axe (WCAG 2.1 AA) on key pages in light and dark; keyboard-only pass (tabs, menu, modal focus trap, Esc); icon buttons labelled; text contrast ≥ 4.5:1 (theme `warnings` empty).
- [ ] **States:** loading, empty, error and success handled with `LoadingSkeleton`, `EmptyState`, `Alert`/toast.
- [ ] **No regressions:** existing routes, API calls, permissions and tests still pass; build and typecheck are green.

## Tooling in the repo (use when available)

`npm run build`, `npm test` (theme + contrast tests), `scripts/shoot.mjs` (Playwright screenshots + horizontal-scroll check), `scripts/a11y.mjs` (axe across themes/pages), `scripts/sync-skill.mjs` (refresh `assets/kit` from the package).

## Updating the master design

When the Figma master changes: re-inspect with the Figma MCP, update `references/`, update `tokens.ts`/`tokens.css`/`components.css` in the kit, bump the package version, re-run tests/screenshots, refresh `assets/kit`. Client projects upgrade by bumping the version.
