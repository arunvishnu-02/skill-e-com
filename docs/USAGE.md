# Using common-dashboard in a new client project

## One-time
1. `bash scripts/install-skill.sh` (installs to `~/.claude/skills/common-dashboard`), or save the skill from the card Claude gave you.
2. Make sure the Figma MCP is connected if you want Claude to re-inspect the design (optional; the references already contain the extracted specs).

## Per project
1. Open the client project in Claude Code.
2. Say what you need, e.g.:
   > Build the admin dashboard for **Acme Clinic**. Primary colour `#0EA5E9`, logo at `public/logo.svg`. Modules: Appointments, Patients, Billing. KPIs: appointments today, revenue, no-shows, new patients.
3. Claude will: inspect the stack, read the skill, reuse existing components, install `@dashboard-kit/ui` (or copy `assets/kit`), configure the theme, build pages from the kit, keep your APIs/auth intact, then validate against the checklist and Figma screenshots.
4. Provide only: brand name, logo, primary colour (required); secondary/accent/fonts/mode (optional).

## What is customised per client
Nav items, KPIs, tables/columns, charts, forms, roles/permissions, API calls: all passed as props/config. Never the look.

## Changing the master design
Update Figma, then ask Claude: "Update common-dashboard from Figma node 297:869". It re-inspects, updates references + tokens + CSS, bumps the version and re-runs validation.

## Upgrading a client
Bump the `@dashboard-kit/ui` version tag (or re-copy `assets/kit`), run the project's build/tests, review screenshots.
