---
name: typecheck
description: Run TypeScript type checking on the project without emitting files
disable-model-invocation: true
allowed-tools: Bash(bun run typecheck)
---

Run TypeScript type checking with `bun run typecheck` (tsc --noEmit).

Report any type errors found and suggest fixes. Do not auto-fix unless the user asks.