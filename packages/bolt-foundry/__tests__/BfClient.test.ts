#! /usr/bin/env -S bff test

import { assert, assertEquals } from "@std/assert";
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

Deno.test("BfClient.createAssistant - creates assistant specification", () => {
  const client = BfClient.create();

  const assistant = client.createAssistant("test-assistant", (b) => b);

  assertEquals(assistant.name, "test-assistant");
});
