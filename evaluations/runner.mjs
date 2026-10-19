#!/usr/bin/env node
/**
 * Score a council record against evaluation fixtures.
 * Usage: node evaluations/runner.mjs --fixture fixtures/sample.json --record record.json
 * The record may contain findings with id, severity, category, files, confirmed,
 * evidence_class, and tokenCount/wallClockMs metadata.
 */
import fs from 'node:fs'
import path from 'node:path'

function arg(name, fallback = null) {
  const i = process.argv.indexOf(name)
  return i >= 0 ? process.argv[i + 1] : fallback
}
function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8')) }
function fail(message) { console.error(`evaluation error: ${message}`); process.exit(2) }
const fixtureFile = arg('--fixture')
const recordFile = arg('--record')
if (!fixtureFile || !recordFile) fail('use --fixture <file> --record <file>')
const fixture = readJson(fixtureFile)
const record = readJson(recordFile)
if (fixture.schemaVersion !== 1) fail('unsupported fixture schemaVersion')
if (!Array.isArray(fixture.expectedFindings)) fail('expectedFindings must be an array')
if (!Array.isArray(record.findings)) fail('record.findings must be an array')

const expected = new Map(fixture.expectedFindings.map((f) => [f.id, f]))
const actual = new Map(record.findings.filter((f) => f && f.id).map((f) => [f.id, f]))
const truePositives = [...expected.keys()].filter((id) => actual.has(id)).length
const falseNegatives = expected.size - truePositives
const falsePositives = [...actual.keys()].filter((id) => !expected.has(id)).length
const precision = truePositives + falsePositives ? truePositives / (truePositives + falsePositives) : 1
const recall = expected.size ? truePositives / expected.size : 1
const reproduced = record.findings.filter((f) => f.confirmed === true && ['failing-test-repro', 'runtime-trace'].includes(f.evidence_class)).length
const confirmed = record.findings.filter((f) => f.confirmed === true).length
const metrics = {
  fixture: fixture.id,
  expected: expected.size,
  observed: actual.size,
  truePositives,
  falsePositives,
  falseNegatives,
  precision,
  recall,
  f1: precision + recall ? (2 * precision * recall) / (precision + recall) : 0,
  confirmedFindings: confirmed,
  reproducedFindings: reproduced,
  evidenceReproductionRate: confirmed ? reproduced / confirmed : 1,
  tokenCount: Number(record.tokenCount ?? null),
  wallClockMs: Number(record.wallClockMs ?? null)
}
console.log(JSON.stringify(metrics, null, 2))
