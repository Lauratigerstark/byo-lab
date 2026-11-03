import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'
import { DESIGN_FILES } from './verdict.mjs'

const CHANGED = /^\+- \d{4}-\d{2}-\d{2} changed `\w+`: .+ Why: .+$/m
const TOSSED = /^\+- \d{4}-\d{2}-\d{2} tossed `/m

const git = (...args) => execFileSync('git', args, { cwd: resolve(import.meta.dirname, '..'), encoding: 'utf8' })

const design = git('diff', '--cached', '--name-only')
  .split('\n')
  .filter((file) => file in DESIGN_FILES)

if (design.length) {
  const added = git('diff', '--cached', '--', 'LEDGER.md')
  // A toss writes its own reason to TASTE.md and its own ledger line.
  const logged = CHANGED.test(added) || (design.every((file) => file === 'TASTE.md') && TOSSED.test(added))
  if (!logged) {
    console.error(`Design files changed with no ledger line: ${design.join(', ')}\n`)
    console.error('Say what changed and why, then stage it:\n')
    console.error(`  pnpm lab log ${DESIGN_FILES[design[0]]} --what "..." --reason "..."`)
    console.error('  git add LEDGER.md\n')
    console.error('To skip it once: git commit --no-verify')
    process.exit(1)
  }
}
