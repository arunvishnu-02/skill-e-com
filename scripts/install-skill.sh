#!/usr/bin/env bash
# Installs the common-dashboard skill globally for Claude Code: ~/.claude/skills/common-dashboard
set -euo pipefail
here="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
dest="${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}/common-dashboard"
node "$here/scripts/sync-skill.mjs"
mkdir -p "$(dirname "$dest")"
rm -rf "$dest"
cp -R "$here/skill/common-dashboard" "$dest"
echo "Installed skill to $dest"
