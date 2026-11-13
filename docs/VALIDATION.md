# Testing and validation checklist

Automated (run from repo root; the starter must be built and served on :4173 for the browser scripts):

| Check | Command | Result at hand-off |
|---|---|---|
| Typecheck | `npm run typecheck` | pass |
| Theme + contrast tests | `npm test` | 23 / 23 pass (9 primaries × light/dark, WCAG 4.5:1 for text on primary, secondary, accent, surface, danger, success) |
| Build | `npm run build` | pass |
| Screenshots, no horizontal scroll | `node scripts/shoot.mjs` | 1440, 820, 375: no h-scroll, no console errors |
| axe WCAG 2.1 AA (serious/critical) | `node scripts/a11y.mjs` | 0 violations: 3 themes × (dashboard, orders, products, states @1440; dashboard @375) |

Set `PLAYWRIGHT_PATH=$(npm root -g)/playwright` if Playwright is installed globally.

Manual per project (see also SKILL.md):
- [ ] Each page vs Figma frame (side by side, listed differences justified)
- [ ] Same sidebar/header on every page; one active nav item
- [ ] Cards/tables use kit components only
- [ ] No hex colours outside theme config; no client name/logo in shared code
- [ ] 1440 / 1024 / 820 / 375 responsive pass
- [ ] Keyboard pass: tabs (arrows), row menu (Esc), modal (focus trap, Esc, focus restore), notifications
- [ ] Loading, empty, error, success states present
- [ ] Existing routes, APIs, permissions, tests unchanged and passing

## Known differences from Figma (honest list)
- Logo is the client's; the demo uses a placeholder square.
- Restock modal quantity input is a plain input; Figma shows a bold 16px value with a "pcs" suffix and 1.5px ink border (use `.cd-input-group` + `.cd-input-group__affix` classes; not yet a React component).
- Fonts are not bundled (Inter / Anton must be loaded by the project).
- Tablet, dark mode, drawer, toast, empty/error/loading, row menu, hover/focus/disabled are derived (not in Figma).
- Comparison was visual (side-by-side screenshots), not automated pixel diff.
