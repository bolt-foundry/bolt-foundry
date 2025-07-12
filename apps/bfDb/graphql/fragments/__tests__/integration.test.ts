/**
 * Integration tests for the query fragment system
 *
 * These tests verify that the fragment system works correctly with the existing
 * GraphQL builder infrastructure and can be used to create valid specs.
 */

import { assertEquals, assertThrows } from "@std/assert";
import {
  defineQueryFragment,
  mergeQueryFragments,
  simpleFragmentMerge,
} from "../index.ts";
import { QueryFragmentError } from "../types.ts";

// Mock GraphQL object type for testing
class MockBlogPost {
  static name = "BlogPost";
}

class MockUser {
  static name = "User";
}

Deno.test("defineQueryFragment creates valid fragments", () => {
  const fragment = defineQueryFragment((gql) =>
    gql
      .string("testField")
      .boolean("isActive")
      .object("relatedPost", () => MockBlogPost)
  );

  // Verify the fragment structure
  assertEquals(typeof fragment.spec, "object");
  assertEquals(typeof fragment.spec.fields, "object");
  assertEquals(typeof fragment.spec.relations, "object");
  assertEquals(typeof fragment.spec.mutations, "object");

  // Verify fields were created
  assertEquals("testField" in fragment.spec.fields, true);
  assertEquals("isActive" in fragment.spec.fields, true);

  // Verify relations were created
  assertEquals("relatedPost" in fragment.spec.relations, true);
});

Deno.test("defineQueryFragment with options", () => {
  const fragment = defineQueryFragment(
    (gql) => gql.string("name"),
    {
      name: "TestFragment",
      description: "A test fragment",
      dependencies: ["SomeOtherFragment"],
    },
  );

  assertEquals(fragment.name, "TestFragment");
  assertEquals(fragment.description, "A test fragment");
  assertEquals(fragment.dependencies, ["SomeOtherFragment"]);
});

Deno.test("defineQueryFragment validates builder function", () => {
  // Test invalid builder function
  assertThrows(
    () => defineQueryFragment(null as never),
    QueryFragmentError,
    "Builder must be a function",
  );

  // Test builder that doesn't return the builder
  assertThrows(
    () => defineQueryFragment(() => null as never),
    QueryFragmentError,
    "Builder function must return the GqlBuilder instance",
  );

  // Test empty fragment
  assertThrows(
    () => defineQueryFragment((gql) => gql),
    QueryFragmentError,
    "Fragment must define at least one field, relation, mutation, or connection",
  );
});

Deno.test("mergeQueryFragments combines fragments correctly", () => {
  const blogFragment = defineQueryFragment(
    (gql) => gql.object("blogPost", () => MockBlogPost),
    { name: "BlogFragment" },
  );

  const userFragment = defineQueryFragment(
    (gql) => gql.object("currentUser", () => MockUser),
    { name: "UserFragment" },
  );

  const merged = mergeQueryFragments([blogFragment, userFragment]);

  // Verify merge results
  assertEquals(merged.sourceFragments, ["BlogFragment", "UserFragment"]);
  assertEquals("blogPost" in merged.spec.relations, true);
  assertEquals("currentUser" in merged.spec.relations, true);
});

Deno.test("mergeQueryFragments handles conflicts", () => {
  const fragment1 = defineQueryFragment(
    (gql) => gql.string("conflictField"),
    { name: "Fragment1" },
  );

  const fragment2 = defineQueryFragment(
    (gql) => gql.string("conflictField"),
    { name: "Fragment2" },
  );

  // Test error on conflict (default behavior)
  assertThrows(
    () => mergeQueryFragments([fragment1, fragment2]),
    QueryFragmentError,
    'Conflict: field "conflictField" is defined in multiple fragments',
  );

  // Test first-wins strategy
  const firstWins = mergeQueryFragments([fragment1, fragment2], {
    conflictResolution: "first-wins",
  });
  assertEquals(firstWins.warnings?.length, 1);
  assertEquals(firstWins.warnings?.[0]?.includes("was ignored"), true);

  // Test last-wins strategy
  const lastWins = mergeQueryFragments([fragment1, fragment2], {
    conflictResolution: "last-wins",
  });
  assertEquals(lastWins.warnings?.length, 1);
  assertEquals(lastWins.warnings?.[0]?.includes("was overwritten"), true);
});

Deno.test("simpleFragmentMerge convenience function", () => {
  const fragment1 = defineQueryFragment((gql) => gql.string("field1"));
  const fragment2 = defineQueryFragment((gql) => gql.string("field2"));

  const mergedSpec = simpleFragmentMerge([fragment1, fragment2]);

  // Verify it returns just the spec
  assertEquals(typeof mergedSpec, "object");
  assertEquals("field1" in mergedSpec.fields, true);
  assertEquals("field2" in mergedSpec.fields, true);
});

Deno.test("fragment supports all builder methods", () => {
  const fragment = defineQueryFragment((gql) =>
    gql
      .string("stringField")
      .int("intField")
      .boolean("boolField")
      .id("idField")
      .isoDate("dateField")
      .nonNull.string("requiredField")
      .object("objectField", () => MockBlogPost)
      .connection("connectionField", () => MockBlogPost, {
        resolve: () => ({ edges: [], pageInfo: {} }),
      })
      .mutation("testMutation", {
        args: (a) => a.string("input"),
        returns: (r) => r.boolean("success"),
        resolve: () => ({ success: true }),
      })
  );

  const spec = fragment.spec;

  // Verify scalar fields
  assertEquals("stringField" in spec.fields, true);
  assertEquals("intField" in spec.fields, true);
  assertEquals("boolField" in spec.fields, true);
  assertEquals("idField" in spec.fields, true);
  assertEquals("dateField" in spec.fields, true);
  assertEquals("requiredField" in spec.fields, true);

  // Verify object relation
  assertEquals("objectField" in spec.relations, true);

  // Verify connection
  assertEquals(spec.connections && "connectionField" in spec.connections, true);

  // Verify mutation
  assertEquals("testMutation" in spec.mutations, true);
});

Deno.test("fragment dependency validation", () => {
  const baseFragment = defineQueryFragment(
    (gql) => gql.string("baseField"),
    { name: "BaseFragment" },
  );

  const dependentFragment = defineQueryFragment(
    (gql) => gql.string("dependentField"),
    { name: "DependentFragment", dependencies: ["BaseFragment"] },
  );

  // Should succeed with both fragments
  const merged = mergeQueryFragments([baseFragment, dependentFragment], {
    validateDependencies: true,
  });
  assertEquals(merged.sourceFragments.length, 2);

  // Should fail with missing dependency
  assertThrows(
    () =>
      mergeQueryFragments([dependentFragment], { validateDependencies: true }),
    QueryFragmentError,
    'depends on "BaseFragment" which is not present',
  );
});
