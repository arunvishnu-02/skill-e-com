# dashboard-kit

Reusable admin-dashboard design system built from the master Figma dashboard, plus the `common-dashboard` Claude Code skill that controls how it is applied.

```
packages/ui        @dashboard-kit/ui: React + TS components, theme engine, CSS (source of truth, semver)
apps/starter       Vite demo: dashboard, orders, add product, inventory modal, states, 3 client themes
skill/common-dashboard   The Claude Code skill (SKILL.md, references/, assets/, examples/)
scripts            build-css, shoot (screenshots), a11y (axe), sync-skill, install-skill.sh
docs               USAGE.md, VALIDATION.md
```

## Quick start

```bash
npm install
npm run build        # library + starter
npm test             # theme + contrast tests
npm run dev          # starter at http://localhost:5173 (theme switcher top right)
```

## Install the skill globally

```bash
bash scripts/install-skill.sh      # -> ~/.claude/skills/common-dashboard
```

Then in any project: "Build the admin dashboard for <client>" and Claude follows the skill. See `docs/USAGE.md`.

## Versioning

`@dashboard-kit/ui` follows semver. Tag releases `ui-vX.Y.Z`. Client projects pin a tag:

```json
"@dashboard-kit/ui": "github:<owner>/dashboard-kit#ui-v0.1.0"
```

A git dependency needs a built `dist/`. Either publish to a registry (npm/GitHub Packages) or use the copy-in fallback (`skill/common-dashboard/assets/kit`, refreshed with `npm run sync-skill`).
