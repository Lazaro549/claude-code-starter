---
name: review
description: Reviews the uncommitted diff against this repo's CLAUDE.md conventions before you commit. Use when the user asks to review changes, check the diff, or wants a pre-commit sanity check.
allowed-tools: Bash(git diff *), Bash(git status *), Bash(git log *), Bash(git describe *), Bash(git remote *), Bash(npm test), Bash(npm run lint)
---

## Uncommitted changes

!`git diff HEAD`

## Working tree status

!`git status --short`

## Your task

Review the diff above against this repo's conventions from CLAUDE.md:

- `src/tasks.ts` stays free of `console.log` — all printing belongs in `src/cli.ts`.
- Every exported function added or changed in `src/tasks.ts` has a matching test in `src/tasks.test.ts`.
- Code is 2-space indented, uses semicolons, and double quotes — run `npm run lint` to verify this instead of eyeballing it.
- `certificate/` is never touched.

If the diff above is empty — for example when this skill runs in CI against a freshly checked-out PR branch, where there's nothing "uncommitted" — find the repo's default branch (`git remote show origin` or fall back to `main`) and diff the current branch against it instead: `git diff <default-branch>...HEAD`. If that's unavailable too (a shallow clone with no base branch present), review `src/*.ts` directly against the conventions above.

Run `npm test` and report whether it passes.

Organize findings into three groups:

- **Blocking** — violates a CLAUDE.md convention or breaks a test
- **Worth fixing** — a real issue that isn't blocking
- **Nit** — optional polish

Be specific: name the file and, where it helps, the line, and suggest the fix rather than just naming the problem. If there's nothing to flag, say so plainly instead of inventing nitpicks.
