#! /usr/bin/env -S bft test

import { assertEquals, assertExists } from "@std/assert";
import { type TaskDefinition, taskMap } from "../bft.ts";

Deno.test("bft: help task should exist", () => {
  const helpTask = taskMap.get("help");
  assertExists(helpTask, "Help task was not registered");
});

Deno.test("bft: manually adding task to taskMap", () => {
  const testTask: TaskDefinition = {
    description: "A test task",
    fn: (_args: Array<string>) => 0,
  };
  taskMap.set("testTask", testTask);
  const got = taskMap.get("testTask");
  assertExists(got);
  assertEquals(got?.description, "A test task");
});

Deno.test("bft: task execution returns exit code", () => {
  const expectedCode = 42;
  const testTask: TaskDefinition = {
    description: "Test exit code",
    fn: (_args: Array<string>) => expectedCode,
  };
  taskMap.set("exitTest", testTask);

  const task = taskMap.get("exitTest");
  assertExists(task);
  const result = task.fn([]);
  assertEquals(result, expectedCode);
});
