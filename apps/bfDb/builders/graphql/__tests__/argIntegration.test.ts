#! /usr/bin/env -S bff test
import { assert, assertEquals } from "@std/assert";
import { makeGqlSpec } from "../makeGqlSpec.ts";
import { GraphQLNonNull, GraphQLString } from "graphql";
import type { ArgMap } from "../makeArgBuilder.ts";
import type { ReturnSpec } from "../makeReturnsBuilder.ts";

/**
 * Test the integration of the new ArgBuilder with the GqlBuilder
 */

Deno.test("GqlBuilder integrates with ArgBuilder for field arguments", () => {
  // Create a GraphQL spec using the builder with arguments
  const spec = makeGqlSpec((gql) =>
    gql.string("searchField", {
      args: (a) => a.string("query").nonNull.boolean("exactMatch"),
    })
  );

  // Define a type for the field spec
  type FieldSpec = {
    type: string;
    nonNull?: boolean;
    args: ArgMap;
    resolve?: (...args: Array<unknown>) => unknown;
  };

  // Verify the spec contains the arguments
  const fieldSpec = spec.fields.searchField as FieldSpec;
  assert(fieldSpec, "searchField should exist in the spec");

  // Check that the args were added correctly
  assert(fieldSpec.args, "searchField should have args");
  assertEquals(
    Object.keys(fieldSpec.args).length,
    2,
    "Should have 2 arguments",
  );
  assertEquals(fieldSpec.args.query, GraphQLString, "query should be a String");
  assert(
    fieldSpec.args.exactMatch instanceof GraphQLNonNull,
    "exactMatch should be non-null",
  );
});

Deno.test("GqlBuilder integrates with ArgBuilder for mutation arguments", () => {
  // Create a GraphQL spec with a mutation that has arguments
  const spec = makeGqlSpec((gql) =>
    gql.mutation("createItem", {
      args: (a) => a.string("name").nonNull.int("quantity"),
      returns: "CreateItemResult",
    })
  );

  // Define a type for the mutation spec
  type MutationSpec = {
    returnsType?: string;
    returnsSpec?: ReturnSpec;
    args: ArgMap;
    resolve?: (...args: Array<unknown>) => unknown;
  };

  // Verify the mutation exists with the correct arguments
  const mutationSpec = spec.mutations.createItem as MutationSpec;
  assert(mutationSpec, "createItem mutation should exist in the spec");

  // Check mutation arguments
  assert(mutationSpec.args, "mutation should have args");
  assertEquals(
    Object.keys(mutationSpec.args).length,
    2,
    "Should have 2 arguments",
  );
  assertEquals(
    mutationSpec.args.name,
    GraphQLString,
    "name should be a String",
  );
  assert(mutationSpec.args.quantity, "quantity should exist");

  // Check the return type
  assertEquals(
    mutationSpec.returnsType,
    "CreateItemResult",
    "Should have the correct return type",
  );
});
