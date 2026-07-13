# TaskFlow

A minimal task-tracker CLI. This repo exists as much for the `.claude/` setup
around it as for the CLI itself — it's the companion project for Anthropic
Academy's "Claude Code in Action" course.

## Commands

- `npm run dev -- <args>` — run the CLI directly with tsx, no build step
- `npm run build` — compile to `dist/`
- `npm test` — run the unit tests (Node's built-in test runner via tsx)
- `npm run lint` — check formatting with Prettier

## Architecture

- `src/tasks.ts` — pure functions for task CRUD (add/complete/list). No
  console output, no side effects beyond `loadTasks`/`saveTasks`.
- `src/cli.ts` — thin argv parser that calls into `tasks.ts` and handles
  all printing.
- Tasks persist to `tasks.json` at the project root (gitignored).

## Conventions

- Keep `tasks.ts` free of `console.log` — all output belongs in `cli.ts`.
- Every exported function in `src/tasks.ts` needs a matching test in
  `src/tasks.test.ts`.
- 2-space indentation, semicolons on, double quotes — enforced by
  `npm run lint`.
- Run `npm test` before committing.

## Do not touch

- `certificate/` — the course completion certificate, not project output.
  A `PreToolUse` hook also blocks edits here (see `.claude/settings.json`).

## Claude Code setup in this repo

- `.claude/skills/` — `/review`, `/test`, `/changelog`
- `.claude/agents/` — `code-reviewer`, `test-writer`
- `.claude/settings.json` + `.claude/hooks/` — auto-formats edited files,
  protects `certificate/`
- `.github/workflows/` — `@claude` mentions plus an automated `/review` on
  every PR

See the README for how each of these works and why.
