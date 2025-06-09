#! /usr/bin/env -S bff test

/**
 * Test helpers that avoid lint issues
 */

import { makeSchema } from "nexus";
import { graphql } from "graphql";
import { createContext } from "../graphqlContext.ts";
import { getSchemaOptions } from "../schemaConfig.ts";

export async function buildTestSchema() {
  const schemaOptions = await getSchemaOptions();
  return makeSchema(schemaOptions);
}

export async function testQuery(options: { query: string }) {
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
  }) as {
    data: {
      [key: string]: unknown;
    };
    errors?: unknown;
  };
}
