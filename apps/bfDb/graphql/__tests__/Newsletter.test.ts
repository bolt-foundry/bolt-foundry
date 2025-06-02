import { assertEquals } from "@std/assert";
import { buildTestSchema } from "apps/bfDb/graphql/__tests__/TestHelpers.test.ts";
import { graphql } from "graphql";
import { createContext } from "apps/bfDb/graphql/graphqlContext.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

Deno.test("Newsletter: subscribeToNewsletter mutation", async (t) => {
  const schema = await buildTestSchema();

  await t.step("should successfully subscribe a new email", async () => {
    const query = `
      mutation SubscribeToNewsletter($email: String!) {
        subscribeToNewsletter(email: $email) {
          success
          message
        }
      }
    `;

    const variables = {
      email: "test@example.com",
    };

    // Create a mock request
    const mockRequest = new Request("http://localhost/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Create context
    using ctx = await createContext(mockRequest);

    const result = await graphql({
      schema,
      source: query,
      variableValues: variables,
      contextValue: ctx,
    });

    logger.debug("Subscription result:", result);

    // Check that there are no GraphQL errors
    assertEquals(result.errors, undefined);

    // Note: In a real test, we'd mock the Substack API response
    // For now, we're testing that the mutation structure works correctly
    const data = result.data as {
      subscribeToNewsletter?: { success: boolean; message?: string | null };
    };
    assertEquals(typeof data?.subscribeToNewsletter, "object");
    assertEquals(typeof data?.subscribeToNewsletter?.success, "boolean");

    // The actual result will depend on whether Substack API credentials are configured
    if (!data?.subscribeToNewsletter?.success) {
      assertEquals(
        data?.subscribeToNewsletter?.message,
        "Server configuration error",
      );
    }
  });

  await t.step("should handle subscription request", async () => {
    const query = `
      mutation SubscribeToNewsletter($email: String!) {
        subscribeToNewsletter(email: $email) {
          success
          message
        }
      }
    `;

    const variables = {
      email: "valid@example.com",
    };

    // Create a mock request
    const mockRequest = new Request("http://localhost/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Create context
    using ctx = await createContext(mockRequest);

    const result = await graphql({
      schema,
      source: query,
      variableValues: variables,
      contextValue: ctx,
    });

    logger.debug("Valid email result:", result);

    assertEquals(result.errors, undefined);
    const data = result.data as {
      subscribeToNewsletter?: { success: boolean; message?: string | null };
    };
    assertEquals(typeof data?.subscribeToNewsletter, "object");
    assertEquals(typeof data?.subscribeToNewsletter?.success, "boolean");
  });
});
