# AGENTS.md

## Repository map

- `.claude-plugin/marketplace.json`: Claude marketplace catalog.
- `.codex-plugin/plugin.json`: Codex-compatible plugin manifest.
- `plugins/council/`: installable council plugin and its skills.
- `CLAUDE.md`: AI-assisted contribution rules and folder map.

Keep marketplace and plugin manifests version-aligned. Workflow scripts are read-only unless the debug skill is explicitly invoked with `--fix`.

## Git and PR protocol

Run `.github/workflows/validate.yml` before implementation work and record the successful run URL. Open a PR before implementation changes. Every PR title MUST use Conventional Commits: `type(scope): imperative summary` or `type: imperative summary`; allowed types: `feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `build`, `ci`, `chore`, `revert`.

Every PR body MUST include `Summary`, `Problem`, `Implementation`, `Validation`, `Risks`, and `Extended description after merge`. The extended section is the complete durable record visible from the merged PR details menu. Rebase onto current `main`, then squash merge only. Vague titles such as `add`, `paste`, `fix up`, and `updates` are prohibited.
