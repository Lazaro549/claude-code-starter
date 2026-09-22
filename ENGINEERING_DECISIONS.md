# Engineering Decisions

This record captures decisions that shape the current TaskFlow implementation. It is intentionally small: the project is a learning-oriented local CLI, not a service platform.

## Decision Status

- **Accepted**: the implementation and its tradeoffs are current.
- **Provisional**: suitable for the present scope, but likely to change as requirements grow.

## ADR-001: Use TypeScript with Native ESM

- **Status:** Accepted
- **Date:** 2026-09-21

### Decision: ADR-001

Use strict TypeScript targeting ES2022 with Node.js native ESM. The package declares `"type": "module"`, and internal imports use `.js` specifiers so the compiled output runs directly under Node.js.

### Rationale: ADR-001

The CLI benefits from static types while keeping the runtime dependency surface small. Native ESM matches the current Node.js ecosystem and avoids introducing a bundler for a two-module application.

### Consequences: ADR-001

The project requires Node.js 18 or newer and a build step for distributable JavaScript. Module specifiers must remain compatible with NodeNext resolution.

## ADR-002: Keep the CLI and Task Operations Separate

- **Status:** Accepted
- **Date:** 2026-09-21

### Decision: ADR-002

`src/cli.ts` owns argument parsing, exit codes, and output. `src/tasks.ts` owns the `Task` model, JSON persistence, and CRUD operations.

### Rationale: ADR-002

This boundary keeps user-facing behavior testable without invoking a child process and keeps task operations reusable from tests or another adapter. It also makes the CLI intentionally thin.

### Consequences: ADR-002

Task functions do not print to the console. The current functions operate on an in-memory array and may mutate it; callers must understand that `addTask` and `completeTask` update the supplied collection.

## ADR-003: Persist Tasks as One JSON File

- **Status:** Accepted
- **Date:** 2026-09-21

### Decision: ADR-003

Store all tasks in `tasks.json` at the project root. Reads parse the whole file and writes serialize the whole task array with two-space indentation.

### Rationale: ADR-003

The application is local, single-user, and deliberately minimal. A JSON file is inspectable, has no service to configure, and is sufficient for the current CRUD commands.

### Consequences: ADR-003

Persistence is easy to inspect and back up, but each command pays the cost of reading and, for mutations, rewriting the complete file. Concurrent writers, atomic transactions, schema migrations, and large datasets are outside the current design.

## ADR-004: Generate IDs from the Highest Existing ID

- **Status:** Accepted
- **Date:** 2026-09-21

### Decision: ADR-004

When adding a task, choose one greater than the highest existing numeric ID, starting at 1 for an empty collection.

### Rationale: ADR-004

This keeps IDs readable and prevents reuse after a task is removed from a future version. It requires no separate counter file or database sequence.

### Consequences: ADR-004

ID allocation is a linear scan and assumes the stored IDs are valid positive numbers. The strategy is not safe for concurrent writers; that is acceptable while storage remains a single local JSON file.

## ADR-005: Use Node's Built-In Test Runner

- **Status:** Accepted
- **Date:** 2026-09-21

### Decision: ADR-005

Use `node:test` and `node:assert/strict`, executed through `tsx`, for unit and CLI behavior tests.

### Rationale: ADR-005

The built-in runner avoids adding a test framework to a small project while still supporting focused tests for task operations and injected CLI output.

### Consequences: ADR-005

Tests stay close to the runtime and have few dependencies. More advanced features such as snapshot testing, browser testing, or a large plugin ecosystem would require introducing another tool later.

## Revisit Triggers

Reconsider these decisions when the project needs any of the following:

- Multiple users or concurrent writers
- More than one process updating tasks at once
- Large task collections or frequent bulk operations
- A public API, authentication, or remote synchronization
- Schema evolution that cannot be handled by a simple JSON shape
- Performance requirements that make CLI startup or full-file rewrites material
