#!/usr/bin/env node
import crypto from 'node:crypto'
import fs from 'node:fs'
import { execFileSync } from 'node:child_process'

const repo = process.argv[2] || process.cwd()
const run = (args) => { try { return execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8', maxBuffer: 2e6 }).trim() } catch { return '' } }
const base = process.env.COUNCIL_BASE || 'HEAD^'
const diff = run(['diff', '--numstat', `${base}...HEAD`])
const files = diff.split('\n').filter(Boolean).map((line) => { const [add, del, ...rest] = line.split('\t'); const file = rest.join('\t'); const changedLines = Number(add) + Number(del); const tags = []; if (/auth|permission|token|crypto|secret/i.test(file)) tags.push('security'); if (/migration|schema|database|sql/i.test(file)) tags.push('migration'); if (/api|route|controller|public/i.test(file)) tags.push('api'); if (/test|spec/i.test(file)) tags.push('tests'); if (/\.md$|README/i.test(file)) tags.push('docs'); return { file, added: Number(add), deleted: Number(del), changedLines, tags } })
const totalLines = files.reduce((n, f) => n + f.changedLines, 0)
const payload = { schemaVersion: 1, base, head: run(['rev-parse', 'HEAD']), changedLines: totalLines, files, cacheKey: crypto.createHash('sha256').update(JSON.stringify({ base, files })).digest('hex') }
fs.writeFileSync(1, JSON.stringify(payload, null, 2) + '\n')
