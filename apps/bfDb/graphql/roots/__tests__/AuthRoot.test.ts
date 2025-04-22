#! /usr/bin/env -S bff test

import { withIsolatedDb } from "apps/bfDb/bfDb.ts";
import { graphQLHandler } from "apps/bfDb/graphql/graphqlServer.ts";
import { assertEquals, assertExists } from "@std/assert";
import { BfCurrentViewer } from "apps/bfDb/classes/BfCurrentViewer.ts";
import { BfOrganization } from "apps/bfDb/models/BfOrganization.ts";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */
function makeGraphQLRequest(body: unknown): Request {
  return new Request("http://localhost/graphql", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

function mutationBody(token: string) {
  return {
    query: `mutation LoginWithGoogle($token: String!) {
      loginWithGoogle(token: $token) {
        success
        errors
        viewer {
          __typename
        }
      }
    }`,
    variables: { token },
  };
}

/* -------------------------------------------------------------------------- */
/* Red tests                                                                   */
/* -------------------------------------------------------------------------- */

Deno.test(
  "loginWithGoogle › first‑time login succeeds and returns LoggedIn viewer",
  async () => {
    await withIsolatedDb(async () => {
      const response = await graphQLHandler(
        makeGraphQLRequest(mutationBody("VALID_WORKSPACE_TOKEN")),
      );
      const json = await response.json();
      const payload = json.data?.loginWithGoogle;
      assertExists(payload);
      assertEquals(payload.success, true);
      assertEquals(payload.viewer.__typename, "BfCurrentViewerLoggedIn");
    });
  },
);

Deno.test(
  "loginWithGoogle › first‑time login creates a new Organization",
  async () => {
    await withIsolatedDb(async () => {
      const cv = BfCurrentViewer
        .__DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
          import.meta,
          "test",
          "test",
        );

      const before = await BfOrganization.query(cv, {});

      await graphQLHandler(
        makeGraphQLRequest(mutationBody("VALID_WORKSPACE_TOKEN")),
      );

      const after = await BfOrganization.query(cv, {});
      assertEquals(after.length, before.length + 1);
    });
  },
);

Deno.test(
  "loginWithGoogle › blocks gmail.com domains",
  async () => {
    await withIsolatedDb(async () => {
      const response = await graphQLHandler(
        makeGraphQLRequest(mutationBody("GMAIL_TOKEN")),
      );
      const json = await response.json();
      const payload = json.data?.loginWithGoogle;
      assertExists(payload);
      assertEquals(payload.success, false);
      // Expect at least one error describing the rejection
      assertEquals((payload.errors ?? []).length > 0, true);
    });
  },
);
