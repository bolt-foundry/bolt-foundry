/**
 * Integration test for the actual fragment system implementation
 */

import { assertEquals, assertExists } from "@std/assert";
import { defineQueryFragment } from "./defineQueryFragment.ts";
import { blogQueries } from "../queries/blogQueries.ts";
import { documentQueries } from "../queries/documentQueries.ts";

Deno.test("Fragment system integration", () => {
  // Test that our actual fragments exist and have the right structure
  assertExists(blogQueries);
  assertExists(blogQueries.spec);
  assertExists(documentQueries);
  assertExists(documentQueries.spec);

  // Test passed
});

Deno.test("defineQueryFragment function exists", () => {
  assertEquals(typeof defineQueryFragment, "function");
  // Test passed
});

Deno.test("blogQueries fragment structure", () => {
  // Test that blogQueries has the expected structure
  assertExists(blogQueries.spec.fields);
  assertExists(blogQueries.spec.relations);
  assertExists(blogQueries.spec.connections);

  // Test passed
});

Deno.test("documentQueries fragment structure", () => {
  // Test that documentQueries has the expected structure
  assertExists(documentQueries.spec.fields);
  assertExists(documentQueries.spec.relations);

  // Test passed
});
