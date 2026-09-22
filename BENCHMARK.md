# TaskFlow Benchmark

## Purpose

This document defines a small, repeatable performance baseline for TaskFlow. It is intended to catch accidental regressions in the CLI and persistence path, not to present a production capacity claim.

The current application is a local command-line tool backed by one JSON file. Its useful performance questions are therefore startup cost, JSON read/write cost, and the effect of task count on listing and completion.

## Environment

Record the following with every benchmark run:

- Operating system and version
- CPU and available memory
- Node.js version (`node --version`)
- npm version (`npm --version`)
- Git revision (`git rev-parse --short HEAD`)
- Task count and approximate `tasks.json` size

Do not compare results from different environments as if they were equivalent.

## Baseline Scenarios

| Scenario        | Command shape                         | What it measures                             |
| --------------- | ------------------------------------- | -------------------------------------------- |
| Empty list      | `npm run dev -- list`                 | Process startup and empty-file handling      |
| Add and persist | `npm run dev -- add "benchmark task"` | Startup, JSON load, append, and JSON write   |
| List all        | `npm run dev -- list`                 | Startup, JSON parse, and output of all tasks |
| List open       | `npm run dev -- list --open`          | Parse, filter, and output of open tasks      |
| Complete        | `npm run dev -- done <id>`            | Parse, lookup, mutation, and JSON write      |

The command examples use the default `tasks.json`. Run them against a disposable copy or restore the file between scenarios so one measurement does not change the next one.

## Repeatable Procedure

1. Install dependencies with `npm ci` when a lockfile is available, otherwise use `npm install`.
2. Build the project with `npm run build`.
3. Run the automated checks: `npm test` and `npm run lint`.
4. Prepare a known fixture with 0, 100, 1,000, and 10,000 tasks. Keep titles and completion ratios consistent between runs.
5. Warm up each scenario with 5 executions.
6. Measure at least 30 executions per scenario using a monotonic timer. Record median, p95, and standard deviation in milliseconds.
7. Capture stdout separately when measuring command latency. Terminal rendering can dominate the result for large lists.
8. Repeat the run three times and retain the median of the three medians.

On Windows PowerShell, a simple timing loop is:

```powershell
1..30 | ForEach-Object {
  $elapsed = Measure-Command { npm run dev -- list *> $null }
  $elapsed.TotalMilliseconds
}
```

This is a convenient smoke measurement, not a substitute for a dedicated benchmark harness. `Measure-Command` includes process startup and npm/tsx overhead, which is part of the user-visible CLI experience.

## Results Table

Fill this table from a controlled run rather than copying values between machines.

| Scenario        | Task count | Median (ms) | p95 (ms) | Notes |
| --------------- | ---------: | ----------: | -------: | ----- |
| Empty list      |          0 |     pending |  pending |       |
| Add and persist |        100 |     pending |  pending |       |
| List all        |      1,000 |     pending |  pending |       |
| List open       |      1,000 |     pending |  pending |       |
| Complete        |      1,000 |     pending |  pending |       |

## Expected Scaling

- `loadTasks` and `saveTasks` are linear in the serialized task data size, because the complete JSON document is read and written.
- `listTasks` is linear in the number of tasks inspected.
- `completeTask` is linear in the number of tasks in the worst case because it uses a sequential search.
- Every CLI invocation starts a new Node.js process, so fixed startup and TypeScript runner overhead can be larger than the task operation for small files.

## Regression Signals

Investigate a change when any of the following occurs against the same environment and fixture:

- Median latency increases by more than 20% for two consecutive runs.
- p95 latency increases by more than 30%.
- Memory usage grows with repeated invocations rather than task count.
- Output or persisted data changes unexpectedly.

Correctness checks take precedence over speed. A faster benchmark that loses tasks or writes invalid JSON is a regression.

## Limitations

This benchmark does not measure concurrent writers, network storage, multi-user access, or database-scale workloads. The JSON file is intentionally simple and is not a substitute for a database when those requirements appear.
