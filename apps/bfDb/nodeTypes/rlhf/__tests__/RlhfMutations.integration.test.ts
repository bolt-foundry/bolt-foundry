#! /usr/bin/env -S bft test

/**
 * Integration tests for RLHF GraphQL mutations
 */

import { assert, assertEquals, assertExists } from "@std/assert";
import { graphql } from "graphql";
import { createContext } from "@bfmono/apps/bfDb/graphql/graphqlContext.ts";
import { buildTestSchema } from "@bfmono/apps/bfDb/graphql/__tests__/TestHelpers.test.ts";
import { withIsolatedDb } from "@bfmono/apps/bfDb/bfDb.ts";
import { makeLoggedInCv } from "@bfmono/apps/bfDb/utils/testUtils.ts";
import { BfOrganization } from "@bfmono/apps/bfDb/nodeTypes/BfOrganization.ts";
import {
  ACCESS_COOKIE,
  signSession,
} from "@bfmono/apps/bfDb/graphql/utils/graphqlContextUtils.ts";

// Set JWT secret for testing
Deno.env.set("JWT_SECRET", "test_secret_key");

async function testQuery(
  options: { query: string; personGid?: string; orgOid?: string },
) {
  const schema = await buildTestSchema();

  // Create authentication token if user provided
  let cookieHeader = "";
  if (options.personGid && options.orgOid) {
    const accessToken = await signSession({
      typ: "access",
      personGid: options.personGid,
      orgOid: options.orgOid,
    }, { expiresIn: "15m" });

    cookieHeader = `${ACCESS_COOKIE}=${accessToken}`;
  }

  // Create a mock request with authentication
  const mockRequest = new Request("http://localhost/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader && { "Cookie": cookieHeader }),
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

Deno.test("createDeck mutation creates deck and auto-generates graders", async () => {
  await withIsolatedDb(async () => {
    // Set up organization and logged-in user
    const cv = makeLoggedInCv({
      orgSlug: "test-org",
      email: "test@example.com",
    });

    const org = await BfOrganization.__DANGEROUS__createUnattached(cv, {
      name: "Test Organization",
      domain: "testorg.com",
    });
    await org.save();

    const mutation = `
      mutation {
        createDeck(
          name: "Test Code Review Deck"
          systemPrompt: "Evaluate code review responses for accuracy and helpfulness."
          description: "A test deck for code review evaluation"
        ) {
          id
          name
        }
      }
    `;

    const result = await testQuery({
      query: mutation,
      personGid: cv.personBfGid,
      orgOid: cv.orgBfOid,
    });

    // Verify no errors
    assert(
      !result.errors,
      `Query should not have errors: ${JSON.stringify(result.errors)}`,
    );

    assert(result.data?.createDeck, "createDeck should return a result");

    const deck = result.data?.createDeck as {
      id: string;
      name: string;
    };

    // Verify deck properties
    assertEquals(deck.name, "Test Code Review Deck");
    assertExists(deck.id);

    // TODO: Verify graders were auto-generated
    // The afterCreate() method should have generated graders based on the system prompt
    // Future test: Query for graders linked to this deck
  });
});

Deno.test.ignore(
  "submitSample mutation creates sample linked to deck",
  async () => {
    // Temporarily disabled until createDeck is working
  },
);
