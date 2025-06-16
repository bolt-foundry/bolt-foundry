#! /usr/bin/env -S bff test

/**
 * Test for the Waitlist type and mutations in graphqlServer
 */

import { assert, assertEquals } from "@std/assert";
import { printSchema } from "graphql";
import { graphql } from "graphql";
import { createContext } from "../graphqlContext.ts";
import { buildTestSchema } from "./TestHelpers.test.ts";

async function testQuery(options: { query: string }) {
  const schema = await buildTestSchema();
  // Create a mock request
  const mockRequest = new Request("http://localhost/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Create context with real BfDb setup
  using ctx = await createContext(mockRequest);

  return await graphql({
    schema,
    source: options.query,
    contextValue: ctx,
  });
}

Deno.test("Waitlist type is included in schema", async () => {
  const schema = await buildTestSchema();
  const sdl = printSchema(schema);

  // Verify Waitlist type is present
  assert(
    sdl.includes("type Waitlist {"),
    "Schema is missing Waitlist type",
  );

  // Verify Waitlist has an id field
  assert(
    sdl.includes("id: ID"),
    "Waitlist is missing id field",
  );
});

Deno.test("joinWaitlist mutation is available with returns builder", async () => {
  const schema = await buildTestSchema();
  const sdl = printSchema(schema);

  // Verify mutation exists
  assert(
    sdl.includes("joinWaitlist("),
    "Schema is missing joinWaitlist mutation",
  );

  // Verify mutation arguments
  assert(
    sdl.includes("email: String!") &&
      sdl.includes("name: String!") &&
      sdl.includes("company: String"),
    "joinWaitlist mutation is missing required arguments",
  );

  // Verify payload type is generated
  assert(
    sdl.includes("type JoinWaitlistPayload {"),
    "Schema is missing JoinWaitlistPayload type",
  );

  // Verify payload fields
  assert(
    sdl.includes("success: Boolean!") &&
      sdl.includes("message: String"),
    "JoinWaitlistPayload is missing expected fields",
  );
});

Deno.test.ignore(
  "joinWaitlist mutation executes with returns builder",
  async () => {
    const query = `
    mutation {
      joinWaitlist(
        email: "test@example.com"
        name: "Test User"
        company: "Test Company"
      ) {
        success
        message
      }
    }
  `;

    const result = await testQuery({ query });

    // Check for errors silently

    assert(!result.errors, "Query should not have errors");
    assert(result.data?.joinWaitlist, "JoinWaitlist should return a result");

    const joinWaitlistResult = result.data?.joinWaitlist as {
      success: boolean;
      message: string | null;
    };

    assert(
      typeof joinWaitlistResult.success === "boolean",
      "success should be a boolean",
    );
    assert(
      joinWaitlistResult.message === null ||
        typeof joinWaitlistResult.message === "string",
      "message should be a string or null",
    );
  },
);

Deno.test("JoinWaitlistPayload type is properly generated", async () => {
  const introspectionQuery = `
    {
      __type(name: "JoinWaitlistPayload") {
        name
        fields {
          name
          type {
            name
            kind
            ofType {
              name
              kind
            }
          }
        }
      }
    }
  `;

  const result = await testQuery({ query: introspectionQuery });

  assert(
    result.data?.__type,
    "JoinWaitlistPayload type should exist in the schema",
  );

  const typeData = result.data?.__type as {
    name?: string;
    fields?: Array<
      {
        name: string;
        type: { kind: string; name?: string; ofType?: { name: string } };
      }
    >;
  };

  assertEquals(
    typeData?.name,
    "JoinWaitlistPayload",
    "Type name should be JoinWaitlistPayload",
  );

  // Verify fields
  const fields = typeData?.fields || [];
  const successField = fields.find((f) => f.name === "success");
  const messageField = fields.find((f) => f.name === "message");

  assert(successField, "JoinWaitlistPayload should have success field");
  assert(messageField, "JoinWaitlistPayload should have message field");

  // Verify success is non-null Boolean
  assertEquals(successField.type.kind, "NON_NULL");
  assertEquals(successField.type.ofType?.name, "Boolean");

  // Verify message is nullable String
  assertEquals(messageField.type.name, "String");
});
