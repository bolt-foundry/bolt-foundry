#!/usr/bin/env -S bff test

import { assertStringIncludes } from "@std/assert";
import { generateEvaluationHtml } from "../../utils/toml-to-html.ts";
import {
  mockMultiGraderData,
  mockSingleGraderData,
} from "../fixtures/test-evaluation-results.ts";

Deno.test("generateEvaluationHtml should include evaluation data", () => {
  const html = generateEvaluationHtml(mockSingleGraderData);

  // Key data points are visible
  assertStringIncludes(html, "exact-match");
  assertStringIncludes(html, "off-by-one");
  assertStringIncludes(html, "Average Distance: 1.33");
});

Deno.test("generateEvaluationHtml should color-code rows by distance", () => {
  const html = generateEvaluationHtml(mockSingleGraderData);

  // Should have color styling
  assertStringIncludes(html, "background-color");
});

Deno.test("generateEvaluationHtml should embed JSON data", () => {
  const html = generateEvaluationHtml(mockSingleGraderData);

  // JSON should be embedded
  assertStringIncludes(html, '<script type="application/json"');
  assertStringIncludes(html, JSON.stringify(mockSingleGraderData));
});

Deno.test("generateEvaluationHtml should handle multiple graders", () => {
  const html = generateEvaluationHtml(mockMultiGraderData);

  // Should have both graders
  assertStringIncludes(html, "grader-a");
  assertStringIncludes(html, "grader-b");
});
