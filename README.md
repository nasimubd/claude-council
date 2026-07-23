# Council

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Claude Code plugin](https://img.shields.io/badge/Claude%20Code-plugin-8A63D2)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

**Multi-agent, execution-gated code review for [Claude Code](https://code.claude.com).**

A "council" of Claude agents reviews your code from diverse lenses, cross-examines each other's findings **blind and anonymized**, and — the decisive upgrade over other multi-agent reviewers — **proves every finding by execution before anyone acts on it.** It is surface-first: the council reports and stops; you direct which findings to fix.

In the lineage of [Karpathy's llm-council](https://github.com/karpathy/llm-council) (parallel first opinions → anonymized peer review → chairman synthesis), rebuilt for code with an evidence tribunal on top.

```
goal → invariants → finder lenses → blind cross-exam → evidence tribunal → chairman (main session) → operator
       hard/soft     loop-until-dry   refute-first       CONFIRMED only          surface-first report:    directs
                                      quorum kill        if proven by execution   plain + technical + ctx  the fixes
```

## Install

```
/plugin marketplace add nasimubd/claude-council
/plugin install council@council
```

Then invoke any of the three skills explicitly (they are `disable-model-invocation: true` — a deliberately expensive gate you opt into):

## Skills

| Command | What it does |
|---|---|
| `/council:review <goal> [--base ref] [--scope paths] [--fleet small\|standard\|large]` | Final review gate: diverse finder lenses → blind cross-examination → evidence tribunal → **surface-first report** with a plain-English + technical fix per finding. The council never edits code; you direct which findings to fix. |
| `/council:debug <symptom> [--repro cmd] [--test-cmd cmd] [--fix]` | Hypothesis-elimination debugging: falsifiable hypotheses, discriminating experiments, root cause by elimination. Proposes the fix; `--fix` applies it and an independent verifier re-checks repro + suite. |
| `/council:goal-audit <goal> [--depth deep]` | Letter + spirit spec decomposition, per-invariant conformance audit, nuance surfacing — report-only. |

## What makes it different

- **Blind cross-examination** — findings are anonymized and order-shuffled before skeptics see them; a kill requires a majority spanning both PROSECUTE and DEFEND framings (order/anchor-bias controls from the LLM-judge literature).
- **Evidence tribunal** — a finding is **CONFIRMED** only when a prover reproduces it (failing test or runtime trace) in your repo, under a taint guard that forbids touching tracked files. Everything unproven is reported as **PLAUSIBLE** and never fixed without your direction. LLM critics over-report; execution is the one precision filter that doesn't share their blind spots.
- **Surface-first, human in charge** — the review council reports and stops. Every finding arrives with a plain-English explanation, a plain-English + technical fix, and the operator context you need to decide. There is no autonomous fix loop — a loop's stop signal inherits every flaw of its own repro artifacts.
- **Negative knowledge kept** — refuted findings ship in the report with their refutations; eliminated debug hypotheses ship in an elimination table.

## Cost expectations

| Fleet | Trigger (auto) | Typical subagent calls |
|---|---|---|
| small | <200 changed lines | ~10 |
| standard | <1500 | ~25 |
| large | ≥1500 (or `--fleet large`) | 45+ |

This is a deliberate brute-force gate — use the built-in `code-review` skill for quick passes.

## Under the hood

Council runs on Claude Code's **Workflow** orchestration tool: each skill drives a deterministic `*.workflow.mjs` script that fans out subagents, gates on execution evidence, and returns a council record the main session synthesizes as chairman. If the Workflow tool is unavailable, each skill falls back to a reduced manual Task fan-out — no installation required.

- **User docs:** [`plugins/council/README.md`](./plugins/council/README.md)
- **Maintainer SSoT + invariants:** [`plugins/council/CLAUDE.md`](./plugins/council/CLAUDE.md)
- **Research provenance** (every mechanism → paper/source): [`plugins/council/references/sota-provenance.md`](./plugins/council/references/sota-provenance.md)

## License

[MIT](./LICENSE) © 2026 MD NASIM
