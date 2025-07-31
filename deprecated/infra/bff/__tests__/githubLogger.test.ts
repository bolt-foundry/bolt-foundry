#! /usr/bin/env -S bff test

import { assertEquals } from "@std/assert";
import { annotationLine } from "../githubLogger.ts";

Deno.test("annotationLine escapes newline and percent", () => {
  const line = annotationLine("error", "bad%\nmsg", { file: "a.ts", line: 2 });
  assertEquals(line, "::error file=a.ts,line=2::bad%25%0Amsg");
});
