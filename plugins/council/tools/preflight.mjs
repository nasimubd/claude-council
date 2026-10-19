#!/usr/bin/env node
/** Shared, deterministic preflight utilities for review workflows. */
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'

export function cacheKey({ repo, head, base, scope = [], toolVersion = '1' }) {
  return crypto.createHash('sha256').update(JSON.stringify({ repo, head, base, scope: [...scope].sort(), toolVersion })).digest('hex')
}
export function riskScore(file) {
  const weights = { security: 10, auth: 10, migration: 9, concurrency: 8, persistence: 8, api: 7, correctness: 6, performance: 5, tests: 3, docs: 1 }
  const tags = (file.tags || []).map((x) => String(x).toLowerCase())
  const score = (Number(file.changedLines) || 0) * 0.02 + Math.min(20, tags.reduce((n, t) => n + (weights[t] || 2), 0)) + (file.testCoverage === false ? 4 : 0)
  return { score: Number(score.toFixed(2)), band: score >= 15 ? 'critical' : score >= 8 ? 'high' : score >= 4 ? 'medium' : 'low' }
}
export async function runCheck({ name, command, cwd, timeoutMs = 120000 }) {
  const started = Date.now()
  if (!name || !Array.isArray(command) || !command.length) return { name: name || 'unnamed', status: 'invalid', durationMs: 0 }
  return await new Promise((resolve) => {
    const child = spawn(command[0], command.slice(1), { cwd, stdio: ['ignore', 'pipe', 'pipe'], shell: false })
    let stdout = '', stderr = ''
    const bounded = (old, chunk) => (old + String(chunk)).slice(-8000)
    const timer = setTimeout(() => { child.kill('SIGTERM'); resolve({ name, command, status: 'timeout', durationMs: Date.now() - started, stdout, stderr }) }, timeoutMs)
    child.stdout.on('data', (x) => { stdout = bounded(stdout, x) })
    child.stderr.on('data', (x) => { stderr = bounded(stderr, x) })
    child.on('error', (e) => { clearTimeout(timer); resolve({ name, command, status: 'unavailable', durationMs: Date.now() - started, stdout, stderr: `${stderr}${e}` }) })
    child.on('close', (code, signal) => { clearTimeout(timer); resolve({ name, command, status: code === 0 ? 'passed' : 'failed', code, signal, durationMs: Date.now() - started, stdout, stderr }) })
  })
}
export function readCache(file) { try { return JSON.parse(fs.readFileSync(file, 'utf8')) } catch { return null } }
export function writeCache(file, value) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n') }
