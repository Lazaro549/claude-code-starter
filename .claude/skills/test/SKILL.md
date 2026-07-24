---
name: test
description: Runs the test suite and fixes any failures itself. Use when the user asks to run the tests, fix failing tests, or make the suite pass.
allowed-tools: Bash(npm test), Bash(npm run build)
---

Run `npm test`.

If every test passes, report that and stop — there's nothing else to do.

If any test fails:

1. Read the failing test and the code it exercises.
2. Decide whether the test or the implementation is wrong, using CLAUDE.md's conventions as the tiebreaker — for example, `src/tasks.ts` must stay free of `console.log`, and printing belongs in `src/cli.ts`.
3. Fix the code (not the test, unless the test itself is the one that's incorrect).
4. Re-run `npm test` to confirm the fix. Repeat until the suite passes, or until you're confident a remaining failure needs human input — don't loop forever on the same failure.

Never edit anything under `certificate/`. When you're done, give a short summary of what was broken and what you changed.
