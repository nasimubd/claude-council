# AI contribution guide

This repository contains an installable multi-agent code-review plugin. Preserve the review contract: review and goal-audit report findings without editing tracked files; debug edits only with explicit `--fix`; evidence must be execution-backed and taint-checked.

Read the nearest `AGENTS.md` and `CLAUDE.md` before changing a folder. Keep documentation, manifests, schemas, and workflow behavior synchronized. Run syntax/metadata checks after changes. Do not commit scratch output under `tmp/`.

## Folder map

- `.claude-plugin/`, `.codex-plugin/`: marketplace and plugin manifests.
- `plugins/council/`: plugin package and maintainer rules.
- `plugins/council/skills/`: user-invoked workflow skills.
- `plugins/council/references/`: prose schemas, evidence, lenses, and reports.

## Git and PR protocol

Run `.github/workflows/validate.yml` before implementation and record its URL. Open the PR before implementation changes. Use a specific Conventional Commit title with an allowed type: `feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `build`, `ci`, `chore`, or `revert`. Every PR body must contain Summary, Problem, Implementation, Validation, Risks, and Extended description after merge. Rebase onto current `main`, then squash merge only; never use merge commits or rebase-only merges.
