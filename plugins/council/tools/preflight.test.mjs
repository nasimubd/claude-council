import assert from 'node:assert/strict'
import { cacheKey, riskScore, runCheck } from './preflight.mjs'
assert.equal(cacheKey({ repo: 'r', head: 'h', base: 'b' }).length, 64)
assert.deepEqual(riskScore({ changedLines: 20, tags: ['auth', 'security'], testCoverage: false }), { score: 24.4, band: 'critical' })
assert.equal((await runCheck({ name: 'ok', command: ['node', '--version'], cwd: process.cwd() })).status, 'passed')
assert.equal((await runCheck({ name: 'bad', command: ['node', '-e', 'process.exit(1)'], cwd: process.cwd() })).status, 'failed')
console.log('preflight tests passed')
