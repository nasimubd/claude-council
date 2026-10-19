# Council evaluation harness

Phase 1 defines the repeatable quality and cost measurement surface for council reviews. Fixtures and runners will be added incrementally; generated results belong under `evaluations/results/` and should not be committed unless they are baseline artifacts.

## Metrics

The runner reports true/false positives and negatives, precision, recall, F1, confirmed findings, evidence reproduction rate, token count, and wall-clock time. A fixture is a small review case with expected findings; a record is the normalized council output for that case. Keep fixtures versioned and keep generated result files out of commits unless they are intentionally approved baselines.

Run the deterministic sample:

```sh
node evaluations/runner.mjs \
  --fixture evaluations/fixtures/sample.json \
  --record evaluations/fixtures/sample-record.json
```

The sample is plumbing validation, not a quality claim. Real baselines should include historical PRs and seeded defects, with expected findings independently reviewed.
