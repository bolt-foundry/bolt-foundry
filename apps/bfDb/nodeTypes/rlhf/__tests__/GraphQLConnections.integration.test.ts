#! /usr/bin/env -S bff test
/**
 * GraphQL Connections Integration – Tests for RLHF GraphQL connection resolvers
 *
 * Tests the complete integration of scratch GraphQL connections with RLHF entities,
 * including both successful queries and error handling for pagination attempts.
 */

import { assertEquals, assertThrows } from "@std/assert";
import { withIsolatedDb } from "@bfmono/apps/bfDb/bfDb.ts";
import { makeLoggedInCv } from "@bfmono/apps/bfDb/utils/testUtils.ts";
import { BfErrorNotImplemented } from "@bfmono/lib/BfError.ts";
import { BfOrganization } from "@bfmono/apps/bfDb/nodeTypes/BfOrganization.ts";
import { BfDeck } from "@bfmono/apps/bfDb/nodeTypes/rlhf/BfDeck.ts";
import { BfSample } from "@bfmono/apps/bfDb/nodeTypes/rlhf/BfSample.ts";
import { BfGrader } from "@bfmono/apps/bfDb/nodeTypes/rlhf/BfGrader.ts";
import { BfGraderResult } from "@bfmono/apps/bfDb/nodeTypes/rlhf/BfGraderResult.ts";
import type { ConnectionArguments } from "graphql-relay";

Deno.test("GraphQL Connection Integration - BfDeck.samples connection without pagination", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv({
      orgSlug: "test-org",
      email: "test@example.com",
    });

    // Create test data
    const org = await BfOrganization.__DANGEROUS__createUnattached(cv, {
      name: "Test Organization",
      domain: "testorg.com",
    });

    const deck = await org.createTargetNode(BfDeck, {
      name: "Integration Test Deck",
      systemPrompt: "Test GraphQL connections",
      description: "Deck for testing connection resolvers",
    });

    const sample1 = await deck.createTargetNode(BfSample, {
      completionData: {
        id: "sample-1",
        model: "gpt-4",
        usage: { prompt_tokens: 100, completion_tokens: 50, total_tokens: 150 },
        choices: [{
          index: 0,
          message: { role: "assistant", content: "Sample response 1" },
          finish_reason: "stop",
        }],
      },
      collectionMethod: "manual",
    });

    const sample2 = await deck.createTargetNode(BfSample, {
      completionData: {
        id: "sample-2",
        model: "gpt-4",
        usage: { prompt_tokens: 120, completion_tokens: 60, total_tokens: 180 },
        choices: [{
          index: 0,
          message: { role: "assistant", content: "Sample response 2" },
          finish_reason: "stop",
        }],
      },
      collectionMethod: "api",
    });

    // Simulate GraphQL connection resolver call using proper traversal methods
    const samples = await deck.queryTargetInstances(BfSample);
    const connectionArgs: ConnectionArguments = {}; // No pagination
    const connection = BfSample.connection(samples, connectionArgs);

    // Verify connection structure
    assertEquals(connection.edges.length, 2);
    assertEquals(connection.pageInfo.hasNextPage, false);
    assertEquals(connection.pageInfo.hasPreviousPage, false);
    assertEquals(connection.pageInfo.startCursor, null);
    assertEquals(connection.pageInfo.endCursor, null);

    // Verify edge data
    const edgeNodes = connection.edges.map((edge) => edge.node);
    const nodeIds = edgeNodes.map((node) => node.id);
    assertEquals(nodeIds.includes(sample1.id), true);
    assertEquals(nodeIds.includes(sample2.id), true);
  });
});

Deno.test("GraphQL Connection Integration - BfDeck.samples connection with pagination should fail", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv({
      orgSlug: "test-org",
      email: "test@example.com",
    });

    // Create test data
    const org = await BfOrganization.__DANGEROUS__createUnattached(cv, {
      name: "Test Organization",
      domain: "testorg.com",
    });

    const deck = await org.createTargetNode(BfDeck, {
      name: "Pagination Test Deck",
      systemPrompt: "Test pagination errors",
      description: "Deck for testing pagination error handling",
    });

    await deck.createTargetNode(BfSample, {
      completionData: {
        id: "sample-1",
        model: "gpt-4",
        usage: { prompt_tokens: 100, completion_tokens: 50, total_tokens: 150 },
        choices: [{
          index: 0,
          message: { role: "assistant", content: "Sample response" },
          finish_reason: "stop",
        }],
      },
      collectionMethod: "manual",
    });

    // Simulate GraphQL connection resolver call with pagination using traversal methods
    const samples = await deck.queryTargetInstances(BfSample);
    const connectionArgs: ConnectionArguments = { first: 10 }; // Pagination requested

    // Should throw BfErrorNotImplemented
    assertThrows(
      () => BfSample.connection(samples, connectionArgs),
      BfErrorNotImplemented,
      "Cursor-based pagination requires node traversal methods",
    );
  });
});

Deno.test("GraphQL Connection Integration - BfSample.results connection without pagination", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv({
      orgSlug: "test-org",
      email: "test@example.com",
    });

    // Create full RLHF hierarchy
    const org = await BfOrganization.__DANGEROUS__createUnattached(cv, {
      name: "Test Organization",
      domain: "testorg.com",
    });

    const deck = await org.createTargetNode(BfDeck, {
      name: "Results Test Deck",
      systemPrompt: "Test result connections",
      description: "Deck for testing result connection resolvers",
    });

    // Create sample and graders for test setup
    const sample = await deck.createTargetNode(BfSample, {
      completionData: {
        id: "sample-1",
        model: "gpt-4",
        usage: { prompt_tokens: 150, completion_tokens: 75, total_tokens: 225 },
        choices: [{
          index: 0,
          message: { role: "assistant", content: "Sample for results testing" },
          finish_reason: "stop",
        }],
      },
      collectionMethod: "api",
    });

    const grader1 = await deck.createTargetNode(BfGrader, {
      graderText: "Quality assessment grader",
    });

    const grader2 = await deck.createTargetNode(BfGrader, {
      graderText: "Clarity assessment grader",
    });

    // Create grader results connected to the sample
    const result1 = await sample.createTargetNode(BfGraderResult, {
      score: 2,
      explanation: "Good quality analysis",
      reasoningProcess: "Analyzed structure and content",
      bfGrader: grader1.metadata.bfGid,
      bfSample: sample.metadata.bfGid,
    });

    const result2 = await sample.createTargetNode(BfGraderResult, {
      score: 1,
      explanation: "Moderate clarity",
      reasoningProcess: "Evaluated communication effectiveness",
      bfGrader: grader2.metadata.bfGid,
      bfSample: sample.metadata.bfGid,
    });

    // Simulate GraphQL connection resolver call using traversal methods
    const results = await sample.queryTargetInstances(BfGraderResult);
    const connectionArgs: ConnectionArguments = {}; // No pagination
    const connection = BfGraderResult.connection(results, connectionArgs);

    // Verify connection structure
    assertEquals(connection.edges.length, 2);
    assertEquals(connection.pageInfo.hasNextPage, false);
    assertEquals(connection.pageInfo.hasPreviousPage, false);

    // Verify edge data contains actual result instances
    const edgeNodes = connection.edges.map((edge) => edge.node);
    const resultIds = edgeNodes.map((node) => node.id);
    assertEquals(resultIds.includes(result1.id), true);
    assertEquals(resultIds.includes(result2.id), true);

    // Verify properties are preserved
    const result1Found = edgeNodes.find((node) => node.id === result1.id);
    const result2Found = edgeNodes.find((node) => node.id === result2.id);
    assertEquals(result1Found?.props.score, 2);
    assertEquals(result2Found?.props.score, 1);
  });
});

Deno.test("GraphQL Connection Integration - BfSample.results connection with pagination should fail", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv({
      orgSlug: "test-org",
      email: "test@example.com",
    });

    // Create minimal test data
    const org = await BfOrganization.__DANGEROUS__createUnattached(cv, {
      name: "Test Organization",
      domain: "testorg.com",
    });

    const deck = await org.createTargetNode(BfDeck, {
      name: "Pagination Error Test Deck",
      systemPrompt: "Test pagination errors in results",
      description: "Testing pagination error handling",
    });

    // Create sample for test setup
    const sample = await deck.createTargetNode(BfSample, {
      completionData: {
        id: "sample-1",
        model: "gpt-4",
        usage: { prompt_tokens: 100, completion_tokens: 50, total_tokens: 150 },
        choices: [{
          index: 0,
          message: { role: "assistant", content: "Sample response" },
          finish_reason: "stop",
        }],
      },
      collectionMethod: "manual",
    });

    // Simulate GraphQL connection resolver call with pagination
    // Query for grader results (empty in this test since no results were created)
    const results = await sample.queryTargetInstances(BfGraderResult);
    const connectionArgs: ConnectionArguments = {
      last: 5,
      before: "cursor123",
    }; // Pagination requested

    // Should throw BfErrorNotImplemented
    assertThrows(
      () => BfGraderResult.connection(results, connectionArgs),
      BfErrorNotImplemented,
      "Use static queries without pagination args for now",
    );
  });
});

Deno.test("GraphQL Connection Integration - empty connections should work correctly", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv({
      orgSlug: "test-org",
      email: "test@example.com",
    });

    // Create deck with no samples
    const org = await BfOrganization.__DANGEROUS__createUnattached(cv, {
      name: "Test Organization",
      domain: "testorg.com",
    });

    const deck = await org.createTargetNode(BfDeck, {
      name: "Empty Deck",
      systemPrompt: "Empty deck for testing",
      description: "This deck has no samples",
    });

    // Simulate GraphQL connection resolver call for empty data using traversal methods
    const samples = await deck.queryTargetInstances(BfSample);
    const connectionArgs: ConnectionArguments = {};
    const connection = BfSample.connection(samples, connectionArgs);

    // Verify empty connection structure
    assertEquals(connection.edges.length, 0);
    assertEquals(connection.pageInfo.hasNextPage, false);
    assertEquals(connection.pageInfo.hasPreviousPage, false);
    assertEquals(connection.pageInfo.startCursor, null);
    assertEquals(connection.pageInfo.endCursor, null);
  });
});

Deno.test("GraphQL Connection Integration - connection preserves node properties and metadata", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv({
      orgSlug: "test-org",
      email: "test@example.com",
    });

    // Create test data
    const org = await BfOrganization.__DANGEROUS__createUnattached(cv, {
      name: "Property Test Organization",
      domain: "proptest.com",
    });

    const deck = await org.createTargetNode(BfDeck, {
      name: "Property Preservation Deck",
      systemPrompt: "Testing property preservation",
      description: "Verify all properties are maintained",
    });

    const sample = await deck.createTargetNode(BfSample, {
      completionData: {
        id: "prop-sample",
        model: "gpt-4-turbo",
        usage: {
          prompt_tokens: 200,
          completion_tokens: 100,
          total_tokens: 300,
        },
        choices: [{
          index: 0,
          message: {
            role: "assistant",
            content: "Complex response with detailed analysis and reasoning",
          },
          finish_reason: "stop",
        }],
      },
      collectionMethod: "automated",
    });

    // Query and create connection using traversal methods
    const samples = await deck.queryTargetInstances(BfSample);
    const connection = BfSample.connection(samples, {});

    // Verify node properties are preserved in connection
    assertEquals(connection.edges.length, 1);
    const edgeNode = connection.edges[0].node;

    // Check all properties are preserved
    assertEquals(edgeNode.id, sample.id);
    assertEquals(edgeNode.props.collectionMethod, "automated");
    const completionData = edgeNode.props.completionData as {
      model: string;
      usage: { total_tokens: number };
      choices: Array<{ message: { content: string } }>;
    };
    assertEquals(completionData.model, "gpt-4-turbo");
    assertEquals(completionData.usage.total_tokens, 300);
    assertEquals(
      completionData.choices[0].message.content,
      "Complex response with detailed analysis and reasoning",
    );

    // Check metadata is preserved
    assertEquals(edgeNode.metadata.bfOid, cv.orgBfOid);
    assertEquals(edgeNode.metadata.className, "BfSample");
  });
});
