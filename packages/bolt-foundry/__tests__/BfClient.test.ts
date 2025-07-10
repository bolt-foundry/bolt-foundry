#! /usr/bin/env -S bff test

import { assert } from "@std/assert";
import { BfClient } from "../BfClient.ts";

Deno.test("BfClient.create - creates client instance", () => {
  const client = BfClient.create();
  assert(client instanceof BfClient);
  assert(typeof client.fetch === "function");
});

Deno.test("BfClient.create - accepts config options", () => {
  const client = BfClient.create({
    apiKey: "test-key",
    collectorEndpoint: "https://test.endpoint",
  });
  assert(client instanceof BfClient);
});

Deno.test("BfClient.fetch - returns wrapped fetch function", () => {
  const client = BfClient.create();
  const wrappedFetch = client.fetch;
  assert(typeof wrappedFetch === "function");
});
