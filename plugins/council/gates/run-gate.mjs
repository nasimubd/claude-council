#!/usr/bin/env node
import { spawn } from 'node:child_process'
const checks = JSON.parse(process.env.COUNCIL_CHECKS || '[]')
const timeoutMs = Number(process.env.COUNCIL_CHECK_TIMEOUT_MS || 120000)
const results = []
for (const check of checks) {
  const started = Date.now()
  if (!check.name || !check.command) { results.push({name: check.name ?? 'unnamed', status: 'invalid', durationMs: 0}); continue }
  const [cmd, ...args] = check.command
  const result = await new Promise((resolve) => {
    const child = spawn(cmd, args, {stdio: ['ignore', 'pipe', 'pipe'], shell: false})
    let stdout = '', stderr = ''
    const timer = setTimeout(() => { child.kill('SIGTERM'); resolve({status: 'timeout', stdout, stderr}) }, timeoutMs)
    child.stdout.on('data', (x) => { stdout += x; if (stdout.length > 8000) stdout = stdout.slice(-8000) })
    child.stderr.on('data', (x) => { stderr += x; if (stderr.length > 8000) stderr = stderr.slice(-8000) })
    child.on('error', (error) => { clearTimeout(timer); resolve({status: 'unavailable', stdout, stderr: String(error)}) })
    child.on('close', (code, signal) => { clearTimeout(timer); resolve({status: code === 0 ? 'passed' : 'failed', code, signal, stdout, stderr}) })
  })
  results.push({name: check.name, command: check.command, durationMs: Date.now() - started, ...result})
}
console.log(JSON.stringify({schemaVersion: 1, generatedAt: new Date().toISOString(), results}, null, 2))
process.exitCode = results.some((x) => ['failed', 'timeout'].includes(x.status)) ? 1 : 0
