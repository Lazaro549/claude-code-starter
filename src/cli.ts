#!/usr/bin/env node

import {
  addTask,
  completeTask,
  listTasks,
  loadTasks,
  saveTasks,
  type Task,
} from "./tasks.js";

export interface CliOptions {
  tasks?: Task[];
  stdout?: (message: string) => void;
  stderr?: (message: string) => void;
  persist?: boolean;
}

export function runCli(argv: string[], options: CliOptions = {}): number {
  const [command, ...rest] = argv;

  const stdout = options.stdout ?? console.log;
  const stderr = options.stderr ?? console.error;
  const tasks = options.tasks ?? loadTasks();
  const persist = options.persist ?? options.tasks === undefined;

  const printTask = (task: Task): void => {
    stdout(`${task.done ? "[x]" : "[ ]"} #${task.id}  ${task.title}\n`);
  };

  switch (command) {
    case "add": {
      const title = rest.join(" ").trim();

      if (!title) {
        stderr('Usage: taskflow add "task title"\n');
        return 1;
      }

      const task = addTask(title, tasks);

      if (persist) {
        saveTasks(tasks);
      }

      stdout("Added:\n");
      printTask(task);
      return 0;
    }

    case "done": {
      const rawId = rest[0];
      const id = Number(rawId);

      if (!rawId || !Number.isInteger(id) || id <= 0) {
        stderr(`Invalid task id: ${rawId ?? ""}\n`);
        return 1;
      }

      const task = completeTask(id, tasks);

      if (!task) {
        stderr(`No task with id ${rawId}\n`);
        return 1;
      }

      if (persist) {
        saveTasks(tasks);
      }

      stdout("Completed:\n");
      printTask(task);
      return 0;
    }

    case "list":
    case undefined: {
      const openOnly = rest.includes("--open");
      const doneOnly = rest.includes("--done");

      const filtered = listTasks(tasks, {
        openOnly,
        doneOnly,
      });

      if (filtered.length === 0) {
        stdout('No tasks yet. Try: taskflow add "write the README"\n');
      } else {
        filtered.forEach(printTask);
      }

      return 0;
    }

    default:
      stderr(`Unknown command: ${command}\n`);
      stderr("Usage: taskflow <add|done|list> [args]\n");
      return 1;
  }
}

function main(): void {
  const exitCode = runCli(process.argv.slice(2));

  if (exitCode !== 0) {
    process.exitCode = exitCode;
  }
}

main();
