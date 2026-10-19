#!/usr/bin/env node
const input = JSON.parse(await new Promise((resolve,reject)=>{let s='';process.stdin.on('data',x=>s+=x);process.stdin.on('end',()=>resolve(s));process.stdin.on('error',reject)}))
const weights={security:10,auth:10,migration:9,concurrency:8,persistence:8,api:7,correctness:6,performance:5,tests:3,docs:1}
const rows=(input.files||[]).map(f=>{const tags=(f.tags||[]).map(x=>String(x).toLowerCase());const score=(f.changedLines||0)*0.02+Math.min(20,tags.reduce((n,t)=>n+(weights[t]||2),0))+(f.testCoverage===false?4:0);return {...f,riskScore:Number(score.toFixed(2)),riskBand:score>=15?'critical':score>=8?'high':score>=4?'medium':'low'}}).sort((a,b)=>b.riskScore-a.riskScore)
console.log(JSON.stringify({schemaVersion:1,files:rows},null,2))
