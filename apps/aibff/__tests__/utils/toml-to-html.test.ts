#!/usr/bin/env -S bff test

import { assertStringIncludes, assertEquals } from "@std/assert";
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
  assertStringIncludes(html, "Average Distance:</strong> 1.33");
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
  
  // Should have tabs for multiple graders
  assertStringIncludes(html, '<div class="tabs">');
  assertStringIncludes(html, 'onclick="showTab(');
});

Deno.test("generateEvaluationHtml should create expandable details for each row", () => {
  const html = generateEvaluationHtml(mockSingleGraderData);
  
  // Should have details/summary elements
  assertStringIncludes(html, "<details>");
  assertStringIncludes(html, "<summary");
  assertStringIncludes(html, "Click to expand");
  
  // Should have expandable content
  assertStringIncludes(html, '<div class="expandable-content">');
  
  // Conversation should be in expandable section
  assertStringIncludes(html, "What is JavaScript?");
  assertStringIncludes(html, "JavaScript is a programming language");
});

Deno.test("generateEvaluationHtml should calculate agreement percentage", () => {
  const html = generateEvaluationHtml(mockSingleGraderData);
  
  // With 1 exact match out of 3 samples = 33.3%
  assertStringIncludes(html, "Agreement:</strong> 33.3%");
  assertStringIncludes(html, "(1/3)");
});

Deno.test("generateEvaluationHtml should not show tabs for single grader", () => {
  const html = generateEvaluationHtml(mockSingleGraderData);
  
  // Should NOT have tabs for single grader
  assertEquals(html.includes('<div class="tabs">'), false);
  assertEquals(html.includes('onclick="showTab('), false);
});
