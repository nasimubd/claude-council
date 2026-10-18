# AI contribution guide

This repository contains an installable multi-agent code-review plugin. Preserve the review contract: review and goal-audit report findings without editing tracked files; debug edits only with explicit `--fix`; evidence must be execution-backed and taint-checked.

Read the nearest `AGENTS.md` and `CLAUDE.md` before changing a folder. Keep documentation, manifests, schemas, and workflow behavior synchronized. Run syntax/metadata checks after changes. Do not commit scratch output under `tmp/`.

## Folder map

- `.claude-plugin/`, `.codex-plugin/`: marketplace and plugin manifests.
- `plugins/council/`: plugin package and maintainer rules.
- `plugins/council/skills/`: user-invoked workflow skills.
- `plugins/council/references/`: prose schemas, evidence, lenses, and reports.
