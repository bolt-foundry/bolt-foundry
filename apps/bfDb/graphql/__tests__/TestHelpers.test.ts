#! /usr/bin/env -S bff test

/**
 * Test helpers that avoid lint issues
 */

import { makeSchema } from "nexus";
import { loadGqlTypes } from "../loadGqlTypes.ts";
import { graphql } from "graphql";
import { createContext } from "../graphqlContext.ts";

export async function buildTestSchema() {
  return makeSchema({ types: await loadGqlTypes() });
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
      [key: string]: { [key: string]: string | boolean | null } | {
        name?: string;
        fields?: Array<
          {
            name: string;
            type: { kind: string; name?: string; ofType?: { name: string } };
          }
        >;
      };
    };
    errors?: unknown;
  };
}
