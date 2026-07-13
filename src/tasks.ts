import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export interface Task {
  id: number;
  title: string;
  done: boolean;
  createdAt: string;
}

const DEFAULT_DB_PATH = fileURLToPath(
  new URL("../tasks.json", import.meta.url),
);

export function loadTasks(path: string = DEFAULT_DB_PATH): Task[] {
  if (!existsSync(path)) return [];
  const raw = readFileSync(path, "utf-8").trim();
  return raw ? (JSON.parse(raw) as Task[]) : [];
}

export function saveTasks(tasks: Task[], path: string = DEFAULT_DB_PATH): void {
  writeFileSync(path, JSON.stringify(tasks, null, 2) + "\n");
}

export function addTask(title: string, tasks: Task[]): Task {
  const nextId = tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
  const task: Task = {
    id: nextId,
    title,
    done: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  return task;
}

export function completeTask(id: number, tasks: Task[]): Task | undefined {
  const task = tasks.find((t) => t.id === id);
  if (task) task.done = true;
  return task;
}

export interface ListOptions {
  doneOnly?: boolean;
  openOnly?: boolean;
}

export function listTasks(tasks: Task[], options: ListOptions = {}): Task[] {
  if (options.doneOnly) return tasks.filter((t) => t.done);
  if (options.openOnly) return tasks.filter((t) => !t.done);
  return tasks;
}
