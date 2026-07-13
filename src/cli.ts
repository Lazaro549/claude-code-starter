#!/usr/bin/env node
import {
  addTask,
  completeTask,
  listTasks,
  loadTasks,
  saveTasks,
  type Task,
} from "./tasks.js";

function printTask(task: Task): void {
  console.log(`${task.done ? "[x]" : "[ ]"} #${task.id}  ${task.title}`);
}

function main(argv: string[]): void {
  const [command, ...rest] = argv;
  const tasks = loadTasks();

  switch (command) {
    case "add": {
      const title = rest.join(" ").trim();
      if (!title) {
        console.error('Usage: taskflow add "task title"');
        process.exitCode = 1;
        return;
      }
      const task = addTask(title, tasks);
      saveTasks(tasks);
      console.log("Added:");
      printTask(task);
      break;
    }

    case "done": {
      const id = Number(rest[0]);
      const task = completeTask(id, tasks);
      if (!task) {
        console.error(`No task with id ${rest[0]}`);
        process.exitCode = 1;
        return;
      }
      saveTasks(tasks);
      console.log("Completed:");
      printTask(task);
      break;
    }

    case "list":
    case undefined: {
      const openOnly = rest.includes("--open");
      const doneOnly = rest.includes("--done");
      const filtered = listTasks(tasks, { openOnly, doneOnly });
      if (filtered.length === 0) {
        console.log('No tasks yet. Try: taskflow add "write the README"');
      } else {
        filtered.forEach(printTask);
      }
      break;
    }

    default: {
      console.error(`Unknown command: ${command}`);
      console.error("Usage: taskflow <add|done|list> [args]");
      process.exitCode = 1;
    }
  }
}

main(process.argv.slice(2));
