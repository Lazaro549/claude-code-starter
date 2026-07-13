import assert from "node:assert/strict";
import { test } from "node:test";
import { addTask, completeTask, listTasks, type Task } from "./tasks.js";

test("addTask assigns incrementing ids starting from 1", () => {
  const tasks: Task[] = [];
  const first = addTask("first", tasks);
  const second = addTask("second", tasks);

  assert.equal(first.id, 1);
  assert.equal(second.id, 2);
  assert.equal(tasks.length, 2);
});

test("addTask continues from the highest existing id", () => {
  const tasks: Task[] = [
    {
      id: 5,
      title: "existing",
      done: false,
      createdAt: new Date().toISOString(),
    },
  ];
  const task = addTask("new", tasks);

  assert.equal(task.id, 6);
});

test("completeTask marks a matching task done and returns it", () => {
  const tasks: Task[] = [
    { id: 1, title: "a", done: false, createdAt: new Date().toISOString() },
  ];
  const task = completeTask(1, tasks);

  assert.equal(task?.done, true);
  assert.equal(tasks[0].done, true);
});

test("completeTask returns undefined for an unknown id", () => {
  const tasks: Task[] = [];
  const task = completeTask(99, tasks);

  assert.equal(task, undefined);
});

test("listTasks filters by openOnly and doneOnly", () => {
  const tasks: Task[] = [
    { id: 1, title: "a", done: true, createdAt: new Date().toISOString() },
    { id: 2, title: "b", done: false, createdAt: new Date().toISOString() },
  ];

  assert.equal(listTasks(tasks, { doneOnly: true }).length, 1);
  assert.equal(listTasks(tasks, { openOnly: true }).length, 1);
  assert.equal(listTasks(tasks).length, 2);
});
