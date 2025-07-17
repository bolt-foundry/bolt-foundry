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
          slug: "test-org_test-code-review-deck"
        ) {
          id
          name
          slug
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
      slug: string;
    };

    // Verify deck properties
    assertEquals(deck.name, "Test Code Review Deck");
    assertEquals(deck.slug, "test-org_test-code-review-deck");
    assertExists(deck.id);

    // TODO: Verify graders were auto-generated
    // The afterCreate() method should have generated graders based on the system prompt
    // Future test: Query for graders linked to this deck
  });
});

Deno.test("submitSample mutation creates sample linked to deck", async () => {
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

    // First create a deck
    const createDeckMutation = `
      mutation {
        createDeck(
          name: "Test Sample Deck"
          systemPrompt: "Evaluate responses for quality."
          description: "A test deck for sample submission"
          slug: "test-org_test-sample-deck"
        ) {
          id
          name
          slug
        }
      }
    `;

    const deckResult = await testQuery({
      query: createDeckMutation,
      personGid: cv.personBfGid,
      orgOid: cv.orgBfOid,
    });

    assert(
      !deckResult.errors,
      `Deck creation should not have errors: ${
        JSON.stringify(deckResult.errors)
      }`,
    );
    const deck = deckResult.data?.createDeck as {
      id: string;
      name: string;
      slug: string;
    };

    // Now submit a sample to the deck
    const submitSampleMutation = `
      mutation {
        submitSample(
          deckId: "${deck.id}"
          completionData: "{\\"id\\": \\"test-123\\", \\"object\\": \\"chat.completion\\", \\"created\\": 1234567890, \\"model\\": \\"gpt-4\\", \\"choices\\": [{\\"index\\": 0, \\"message\\": {\\"role\\": \\"assistant\\", \\"content\\": \\"Hello world!\\"}, \\"finish_reason\\": \\"stop\\"}], \\"messages\\": [{\\"role\\": \\"user\\", \\"content\\": \\"Say hello\\"}]}"
          collectionMethod: "manual"
        ) {
          id
          collectionMethod
        }
      }
    `;

    const sampleResult = await testQuery({
      query: submitSampleMutation,
      personGid: cv.personBfGid,
      orgOid: cv.orgBfOid,
    });

    // Verify no errors
    assert(
      !sampleResult.errors,
      `Sample submission should not have errors: ${
        JSON.stringify(sampleResult.errors)
      }`,
    );
    assert(
      sampleResult.data?.submitSample,
      "submitSample should return a result",
    );

    const sample = sampleResult.data?.submitSample as {
      id: string;
      collectionMethod: string;
    };

    // Verify sample properties
    assertEquals(sample.collectionMethod, "manual");
    assertExists(sample.id);
  });
});
