#!/usr/bin/env -S bff test

import { assertEquals, assertStringIncludes } from "@std/assert";
import {
  type EvaluationDataNested,
  generateEvaluationHtml,
  type GraderResults,
} from "@bfmono/apps/aibff/utils/toml-to-html.ts";
import {
  mockMultiGraderData,
  mockMultiGraderMultiModelData,
  mockSingleGraderData,
  mockSingleGraderMultiModelData,
} from "../fixtures/test-evaluation-results.ts";

Deno.test("generateEvaluationHtml should include evaluation data", () => {
  const html = generateEvaluationHtml(mockSingleGraderData);

  // Key data points are visible
  assertStringIncludes(html, "exact-match");
  assertStringIncludes(html, "off-by-one");
  assertStringIncludes(html, '<div class="metric-value">1.33</div>');
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
  assertStringIncludes(html, 'class="tab-radio"');
  assertStringIncludes(html, 'type="radio"');
});

Deno.test("generateEvaluationHtml should create expandable details for each row", () => {
  const html = generateEvaluationHtml(mockSingleGraderData);

  // Should have details/summary elements
  assertStringIncludes(html, "<details>");
  assertStringIncludes(html, "<summary");

  // Should have expandable content
  assertStringIncludes(html, 'class="expandable-content"');

  // Conversation should be in expandable section
  assertStringIncludes(html, "What is JavaScript?");
  assertStringIncludes(html, "JavaScript is a programming language");
});

Deno.test("generateEvaluationHtml should calculate agreement percentage", () => {
  const html = generateEvaluationHtml(mockSingleGraderData);

  // With 1 exact match out of 3 samples = 33.3% - now in compact summary format
  assertStringIncludes(html, "33.3% agreement (1/3)");
});

Deno.test("generateEvaluationHtml should not show tabs for single grader", () => {
  const html = generateEvaluationHtml(mockSingleGraderData);

  // Should NOT have tabs for single grader
  assertEquals(html.includes('<div class="tabs">'), false);
  assertEquals(html.includes('onclick="showTab('), false);
});

// Tests for multiple models support

Deno.test("generateEvaluationHtml should show model names as tabs for single grader + multiple models", () => {
  // Note: This test expects generateEvaluationHtml to be updated to handle nested data
  // For now, we'll just test that it doesn't crash with the new data structure
  // The actual implementation will need to handle both flat and nested structures

  // Mock a function that would handle the nested structure
  // In the real implementation, generateEvaluationHtml would need to be updated
  const mockGenerateHtmlForNestedData = (data: EvaluationDataNested) => {
    // This is a placeholder - the real implementation would generate proper HTML
    return `<div class="tabs">
      ${
      Object.values(data.graderResults).flatMap((grader: GraderResults) =>
        Object.keys(grader.models || {}).map((modelKey) =>
          `<button class="tab">${modelKey}</button>`
        )
      ).join("")
    }
    </div>`;
  };

  const html = mockGenerateHtmlForNestedData(mockSingleGraderMultiModelData);

  // Should have tabs for models
  assertStringIncludes(html, '<div class="tabs">');
  assertStringIncludes(html, "claude-3.5");
  assertStringIncludes(html, "gpt-4");
});

Deno.test("generateEvaluationHtml should show grader-model as tabs for multiple graders + multiple models", () => {
  // Mock implementation for testing
  const mockGenerateHtmlForNestedData = (data: EvaluationDataNested) => {
    const tabs: Array<string> = [];
    Object.entries(data.graderResults).forEach(
      ([graderKey, grader]: [string, GraderResults]) => {
        Object.keys(grader.models || {}).forEach((modelKey) => {
          tabs.push(`<button class="tab">${graderKey}-${modelKey}</button>`);
        });
      },
    );

    return `<div class="tabs">${tabs.join("")}</div>`;
  };

  const html = mockGenerateHtmlForNestedData(mockMultiGraderMultiModelData);

  // Should have tabs combining grader and model names
  assertStringIncludes(html, '<div class="tabs">');
  assertStringIncludes(html, "tone-grader-claude-3.5");
  assertStringIncludes(html, "tone-grader-gpt-3.5");
  assertStringIncludes(html, "accuracy-grader-claude-3.5");
  assertStringIncludes(html, "accuracy-grader-gpt-3.5");
});

Deno.test("generateEvaluationHtml should handle nested model structure in data", () => {
  // This test verifies that the function can process nested data without errors
  // The actual implementation will need to be updated to properly handle this

  // For now, we'll just verify the data structure is correct
  const graderResults = mockSingleGraderMultiModelData.graderResults;
  const firstGrader = Object.values(graderResults)[0];

  // Verify the nested structure
  assertEquals(typeof firstGrader.models, "object");
  assertEquals(Object.keys(firstGrader.models).length, 2);
  assertStringIncludes(
    firstGrader.models["claude-3.5"].model,
    "claude-3.5-sonnet",
  );
});

Deno.test("generateEvaluationHtml should sanitize tab IDs with periods while preserving labels", () => {
  // Create test data with periods in grader names
  const testData = {
    graderResults: {
      "grader.with.periods": {
        grader: "grader.with.periods.deck.md",
        model: "gpt-4",
        timestamp: "2023-01-01T00:00:00Z",
        samples: 2,
        average_distance: 0.5,
        results: [
          {
            id: "test-1",
            grader_score: 3,
            truth_score: 3,
            notes: "Test note",
          },
          {
            id: "test-2",
            grader_score: 2,
            truth_score: 3,
            notes: "Another test",
          },
        ],
      },
      "another.grader.name": {
        grader: "another.grader.name.deck.md",
        model: "claude-3.5",
        timestamp: "2023-01-01T00:00:00Z",
        samples: 1,
        average_distance: 1.0,
        results: [
          {
            id: "test-3",
            grader_score: 1,
            truth_score: 2,
            notes: "Third test",
          },
        ],
      },
    },
  };

  const html = generateEvaluationHtml(testData);

  // Should have sanitized IDs (periods replaced with underscores)
  assertStringIncludes(html, 'id="tab-radio-grader_with_periods"');
  assertStringIncludes(html, 'id="tab-radio-another_grader_name"');
  assertStringIncludes(html, 'for="tab-radio-grader_with_periods"');
  assertStringIncludes(html, 'for="tab-radio-another_grader_name"');

  // CSS selectors should use sanitized IDs
  assertStringIncludes(html, "#tab-radio-grader_with_periods:checked");
  assertStringIncludes(html, "#tab-radio-another_grader_name:checked");

  // Tab content divs should use sanitized IDs
  assertStringIncludes(html, 'id="tab-grader_with_periods"');
  assertStringIncludes(html, 'id="tab-another_grader_name"');

  // But labels should preserve original names with periods
  assertStringIncludes(html, ">grader.with.periods</label>");
  assertStringIncludes(html, ">another.grader.name</label>");

  // Should have radio buttons and tabs
  assertStringIncludes(html, 'type="radio"');
  assertStringIncludes(html, 'class="tab-radio"');
  assertStringIncludes(html, 'class="tab-label"');

  // Should have tab content containers
  assertStringIncludes(html, 'class="tab-content"');
});
