import assert from "node:assert/strict";
import { test } from "node:test";
import { runCli } from "./cli.js";
import type { Task } from "./tasks.js";

function createTasks(): Task[] {
  return [];
}

test("add creates a task and prints its id", () => {
  const tasks = createTasks();
  const output: string[] = [];

  const code = runCli(["add", "write tests"], {
    tasks,
    stdout: (message) => output.push(message),
    stderr: () => {},
  });

  assert.equal(code, 0);
  assert.equal(tasks.length, 1);
  assert.equal(tasks[0].title, "write tests");
  assert.match(output.join(""), /1/);
});

test("add preserves multi-word task titles", () => {
  const tasks = createTasks();

  const code = runCli(["add", "write", "better", "tests"], {
    tasks,
    stdout: () => {},
    stderr: () => {},
  });

  assert.equal(code, 0);
  assert.equal(tasks[0].title, "write better tests");
});

test("list prints all tasks", () => {
  const tasks: Task[] = [
    {
      id: 1,
      title: "first",
      done: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: "second",
      done: true,
      createdAt: new Date().toISOString(),
    },
  ];

  const output: string[] = [];

  const code = runCli(["list"], {
    tasks,
    stdout: (message) => output.push(message),
    stderr: () => {},
  });

  assert.equal(code, 0);
  assert.match(output.join(""), /first/);
  assert.match(output.join(""), /second/);
});

test("list --open prints only open tasks", () => {
  const tasks: Task[] = [
    {
      id: 1,
      title: "open task",
      done: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: "done task",
      done: true,
      createdAt: new Date().toISOString(),
    },
  ];

  const output: string[] = [];

  const code = runCli(["list", "--open"], {
    tasks,
    stdout: (message) => output.push(message),
    stderr: () => {},
  });

  const text = output.join("");

  assert.equal(code, 0);
  assert.match(text, /open task/);
  assert.doesNotMatch(text, /done task/);
});

test("list --done prints only completed tasks", () => {
  const tasks: Task[] = [
    {
      id: 1,
      title: "open task",
      done: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: "done task",
      done: true,
      createdAt: new Date().toISOString(),
    },
  ];

  const output: string[] = [];

  const code = runCli(["list", "--done"], {
    tasks,
    stdout: (message) => output.push(message),
    stderr: () => {},
  });

  const text = output.join("");

  assert.equal(code, 0);
  assert.match(text, /done task/);
  assert.doesNotMatch(text, /open task/);
});

test("done marks an existing task as completed", () => {
  const tasks: Task[] = [
    {
      id: 1,
      title: "finish me",
      done: false,
      createdAt: new Date().toISOString(),
    },
  ];

  const output: string[] = [];

  const code = runCli(["done", "1"], {
    tasks,
    stdout: (message) => output.push(message),
    stderr: () => {},
  });

  assert.equal(code, 0);
  assert.equal(tasks[0].done, true);
  assert.match(output.join(""), /1/);
});

test("done returns an error for an unknown task", () => {
  const errors: string[] = [];

  const code = runCli(["done", "99"], {
    tasks: createTasks(),
    stdout: () => {},
    stderr: (message) => errors.push(message),
  });

  assert.equal(code, 1);
  assert.match(errors.join(""), /99/);
});

test("done rejects an invalid id", () => {
  const errors: string[] = [];

  const code = runCli(["done", "abc"], {
    tasks: createTasks(),
    stdout: () => {},
    stderr: (message) => errors.push(message),
  });

  assert.equal(code, 1);
  assert.match(errors.join(""), /invalid/i);
});

test("add requires a title", () => {
  const errors: string[] = [];

  const code = runCli(["add"], {
    tasks: createTasks(),
    stdout: () => {},
    stderr: (message) => errors.push(message),
  });

  assert.equal(code, 1);
  assert.match(errors.join(""), /title/i);
});

test("unknown commands return an error", () => {
  const errors: string[] = [];

  const code = runCli(["unknown"], {
    tasks: createTasks(),
    stdout: () => {},
    stderr: (message) => errors.push(message),
  });

  assert.equal(code, 1);
  assert.match(errors.join(""), /unknown|usage/i);
});
