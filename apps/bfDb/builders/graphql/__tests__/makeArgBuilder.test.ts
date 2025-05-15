#! /usr/bin/env -S bff test
import { assert, assertEquals } from "@std/assert";
import { createArgsBuilder, makeArgBuilder } from "../makeArgBuilder.ts";
import { GraphQLBoolean, GraphQLNonNull, GraphQLString } from "graphql";

/**
 * Tests for the new ArgsBuilder implementation
 */

Deno.test("createArgsBuilder creates a valid ArgsBuilder", () => {
  const builder = createArgsBuilder();

  // Check that the builder has all the expected methods
  assert(
    typeof builder.string === "function",
    "ArgsBuilder should have a string method",
  );
  assert(
    typeof builder.int === "function",
    "ArgsBuilder should have an int method",
  );
  assert(
    typeof builder.float === "function",
    "ArgsBuilder should have a float method",
  );
  assert(
    typeof builder.boolean === "function",
    "ArgsBuilder should have a boolean method",
  );
  assert(
    typeof builder.id === "function",
    "ArgsBuilder should have an id method",
  );
  assert(builder.nonNull, "ArgsBuilder should have a nonNull property");

  // Check that _args exists and is an empty object initially
  assert(builder._args, "ArgsBuilder should have an _args property");
  assertEquals(
    Object.keys(builder._args).length,
    0,
    "Args should be empty initially",
  );
});

Deno.test("ArgsBuilder methods correctly add arguments", () => {
  const builder = createArgsBuilder();

  // Add some arguments
  builder.string("name").int("age").boolean("active");

  // Check that arguments were added correctly
  assertEquals(Object.keys(builder._args).length, 3, "Should have 3 arguments");
  assertEquals(builder._args.name, GraphQLString, "name should be a String");
  assert(builder._args.age, "age should be defined");
  assert(builder._args.active, "active should be defined");
});

Deno.test("ArgsBuilder.nonNull correctly marks arguments as non-nullable", () => {
  const builder = createArgsBuilder();

  // Add non-nullable arguments
  builder.nonNull.string("requiredName");
  builder.string("optionalName");

  // Check that nonNull worked correctly
  assert(
    builder._args.requiredName instanceof GraphQLNonNull,
    "requiredName should be non-null",
  );
  assertEquals(
    builder._args.requiredName.ofType,
    GraphQLString,
    "requiredName should wrap a String",
  );
  assertEquals(
    builder._args.optionalName,
    GraphQLString,
    "optionalName should be a nullable String",
  );
});

Deno.test("makeArgBuilder returns a function that uses ArgsBuilder", () => {
  const argBuilderFn = makeArgBuilder();

  // This is the way it will be used in the GQL builder
  const args = argBuilderFn((a) =>
    a.string("name").nonNull.boolean("required")
  );

  // Check the result
  assertEquals(Object.keys(args).length, 2, "Should have 2 arguments");
  assertEquals(args.name, GraphQLString, "name should be a String");
  assert(
    args.required instanceof GraphQLNonNull,
    "required should be non-null",
  );
  assertEquals(
    args.required.ofType,
    GraphQLBoolean,
    "required should wrap a Boolean",
  );
});

Deno.test("ArgsBuilder works with method chaining", () => {
  const builder = createArgsBuilder();

  // Chain multiple method calls
  const result = builder
    .string("name")
    .nonNull.int("age")
    .boolean("active")
    .nonNull.id("userId");

  // Ensure chaining returns the builder
  assertEquals(result, builder, "Method chaining should return the builder");

  // Check all arguments were added
  assertEquals(Object.keys(builder._args).length, 4, "Should have 4 arguments");
  assert(builder._args.age instanceof GraphQLNonNull, "age should be non-null");
  assert(
    builder._args.userId instanceof GraphQLNonNull,
    "userId should be non-null",
  );
  assertEquals(
    builder._args.name,
    GraphQLString,
    "name should be a nullable String",
  );
  assert(builder._args.active, "active should be defined");
});
