# AGENTS.md

Council is a report-first, evidence-gated plugin. Read `CLAUDE.md` for maintainer invariants. Keep `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json` aligned with the root marketplace entry. Any schema change must update both workflow constants and `references/schemas.md`.

Before changing the plugin, run and record the successful validation workflow. Open the PR before implementation. Use only a specific Conventional Commit title (`feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `build`, `ci`, `chore`, `revert`) and an imperative summary. PR bodies require Summary, Problem, Implementation, Validation, Risks, and Extended description after merge. Rebase onto current `main` and squash merge only.
