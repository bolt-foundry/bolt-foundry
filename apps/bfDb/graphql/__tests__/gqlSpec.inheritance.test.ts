/**
 * Tests for GraphQL spec inheritance
 *
 * This test demonstrates the current bug where child classes don't inherit
 * parent gqlSpec fields automatically, and verifies the fix works correctly.
 */

import { assert } from "@std/assert";
import { GraphQLObjectBase } from "../GraphQLObjectBase.ts";

// Create test classes to demonstrate the inheritance chain
class ParentNode extends GraphQLObjectBase {
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .nonNull.id("id")
      .string("parentField")
  );
}

class ChildNode extends ParentNode {
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .string("childField")
  );
}

class GrandChildNode extends ChildNode {
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .string("grandChildField")
  );
}

Deno.test("GraphQL spec inheritance - parent fields should be inherited", () => {
  // Parent should have its own fields
  const parentSpec = ParentNode.gqlSpec;
  assert(parentSpec.fields.id, "Parent should have id field");
  assert(parentSpec.fields.parentField, "Parent should have parentField");

  // Child should inherit parent fields AND have its own
  const childSpec = ChildNode.gqlSpec;
  assert(childSpec.fields.id, "Child should inherit id field from parent");
  assert(
    childSpec.fields.parentField,
    "Child should inherit parentField from parent",
  );
  assert(childSpec.fields.childField, "Child should have its own childField");

  // Grandchild should inherit from entire chain
  const grandChildSpec = GrandChildNode.gqlSpec;
  assert(
    grandChildSpec.fields.id,
    "GrandChild should inherit id field from ancestor",
  );
  assert(
    grandChildSpec.fields.parentField,
    "GrandChild should inherit parentField from ancestor",
  );
  assert(
    grandChildSpec.fields.childField,
    "GrandChild should inherit childField from parent",
  );
  assert(
    grandChildSpec.fields.grandChildField,
    "GrandChild should have its own grandChildField",
  );
});

Deno.test("GraphQL spec inheritance - child fields can override parent fields", () => {
  class OverrideParent extends GraphQLObjectBase {
    static override gqlSpec = this.defineGqlNode((gql) =>
      gql
        .nonNull.id("id")
        .string("overrideField")
    );
  }

  class OverrideChild extends OverrideParent {
    static override gqlSpec = this.defineGqlNode((gql) =>
      gql
        .nonNull.string("overrideField") // Override parent's optional field to be required
    );
  }

  const childSpec = OverrideChild.gqlSpec;

  // Child should inherit id field
  assert(childSpec.fields.id, "Child should inherit id field from parent");

  // Child should override parent's field
  assert(childSpec.fields.overrideField, "Child should have overrideField");

  // Note: We're not testing the specific field properties here since that would require
  // complex type assertions. The main point is that inheritance and override should work.
});

Deno.test("GraphQL spec inheritance - mutations should be inherited", () => {
  class MutationParent extends GraphQLObjectBase {
    static override gqlSpec = this.defineGqlNode((gql) =>
      gql
        .nonNull.id("id")
        .mutation("parentMutation", {
          args: (a) => a.string("arg1"),
          returns: "String",
          // @ts-expect-error - simplified resolver for test
          resolve: () => "parent result",
        })
    );
  }

  class MutationChild extends MutationParent {
    static override gqlSpec = this.defineGqlNode((gql) =>
      gql
        .string("childField")
        .mutation("childMutation", {
          args: (a) => a.string("arg2"),
          returns: "String",
          // @ts-expect-error - simplified resolver for test
          resolve: () => "child result",
        })
    );
  }

  const childSpec = MutationChild.gqlSpec;

  // Child should inherit parent mutations
  assert(
    childSpec.mutations.parentMutation,
    "Child should inherit parentMutation",
  );
  assert(
    childSpec.mutations.childMutation,
    "Child should have its own childMutation",
  );

  // Child should also inherit parent fields
  assert(childSpec.fields.id, "Child should inherit id field from parent");
  assert(childSpec.fields.childField, "Child should have its own childField");
});

Deno.test("GraphQL spec inheritance - relations should be inherited", () => {
  class RelationParent extends GraphQLObjectBase {
    static override gqlSpec = this.defineGqlNode((gql) =>
      gql
        .nonNull.id("id")
        .object("parentRelation", () => RelationParent)
    );
  }

  class RelationChild extends RelationParent {
    static override gqlSpec = this.defineGqlNode((gql) =>
      gql
        .string("childField")
        .object("childRelation", () => RelationChild)
    );
  }

  const childSpec = RelationChild.gqlSpec;

  // Child should inherit parent relations
  assert(
    childSpec.relations.parentRelation,
    "Child should inherit parentRelation",
  );
  assert(
    childSpec.relations.childRelation,
    "Child should have its own childRelation",
  );

  // Child should also inherit parent fields
  assert(childSpec.fields.id, "Child should inherit id field from parent");
  assert(childSpec.fields.childField, "Child should have its own childField");
});

Deno.test("GraphQL spec inheritance - BfDeck should inherit id field from BfNode", async () => {
  // Import the actual classes to test real-world scenario
  const { BfDeck } = await import("@bfmono/apps/bfDb/nodeTypes/rlhf/BfDeck.ts");

  const deckSpec = BfDeck.gqlSpec;

  // This is currently failing but should pass after the fix
  assert(
    deckSpec.fields.id,
    "BfDeck should inherit id field from BfNode via inheritance chain",
  );
  assert(deckSpec.fields.name, "BfDeck should have its own name field");
  assert(
    deckSpec.fields.systemPrompt,
    "BfDeck should have its own systemPrompt field",
  );
});

Deno.test("GraphQL spec inheritance - BfSample should inherit id field from BfNode", async () => {
  // Import the actual classes to test real-world scenario
  const { BfSample } = await import(
    "@bfmono/apps/bfDb/nodeTypes/rlhf/BfSample.ts"
  );

  const sampleSpec = BfSample.gqlSpec;

  // This is currently failing but should pass after the fix
  assert(
    sampleSpec.fields.id,
    "BfSample should inherit id field from BfNode via inheritance chain",
  );
  assert(
    sampleSpec.fields.completionData,
    "BfSample should have its own completionData field",
  );
  assert(
    sampleSpec.fields.collectionMethod,
    "BfSample should have its own collectionMethod field",
  );
});
