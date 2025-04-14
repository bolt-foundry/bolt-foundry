#! /usr/bin/env -S bff test

import { assertSpyCalls, stub } from "@std/testing/mock";
import { calculateLlmCost, trackLlmEvent } from "../llm-event-tracker.ts";
import { assertEquals } from "@std/assert/equals";
import { assert } from "@std/assert";
import type { PostHog } from "posthog-node";

Deno.test("calculateLlmCost - should calculate correct cost for gpt-4o", () => {
  const inputTokens = 1000;
  const outputTokens = 500;
  const cost = calculateLlmCost("gpt-4o", inputTokens, outputTokens);

  // 1000 input tokens at $0.0025 per 1000 tokens = $0.0025
  // 500 output tokens at $0.010 per 1000 tokens = $0.005
  // Total expected: $0.0075
  assertEquals(cost, 0.0075);
});

Deno.test("calculateLlmCost - should calculate correct cost for gpt-3.5-turbo", () => {
  const inputTokens = 2000;
  const outputTokens = 1000;
  const cost = calculateLlmCost("gpt-3.5-turbo", inputTokens, outputTokens);

  // 2000 input tokens at $0.0010 per 1000 tokens = $0.002
  // 1000 output tokens at $0.0020 per 1000 tokens = $0.002
  // Total expected: $0.004
  assertEquals(cost, 0.004);
});

Deno.test("calculateLlmCost - should use default pricing for unknown models", () => {
  const inputTokens = 1000;
  const outputTokens = 500;
  const cost = calculateLlmCost("unknown-model", inputTokens, outputTokens);

  // Should default to gpt-3.5-turbo pricing
  // 1000 input tokens at $0.0010 per 1000 tokens = $0.001
  // 500 output tokens at $0.0020 per 1000 tokens = $0.001
  // Total expected: $0.002
  assertEquals(cost, 0.002);
});

Deno.test("trackLlmEvent - should skip tracking if no client and no API key", async () => {
  const req = new Request("https://api.openai.com/v1/chat/completions");
  const res = new Response(
    '{"id":"123","usage":{"prompt_tokens":10,"completion_tokens":20}}',
  );
  const startTime = Date.now();

  // Create a console logger spy
  const warnSpy = stub(console, "warn");

  await trackLlmEvent(req, res, startTime);

  // Verify warning was logged
  assertSpyCalls(warnSpy, 1);
  assert(warnSpy.calls[0].args[0].includes("Api client not available"));

  warnSpy.restore();
});

Deno.test("trackLlmEvent - should track events when client is provided", async () => {
  const req = new Request("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "user", content: "Hello" }],
      temperature: 0.7,
    }),
  });

  const res = new Response(JSON.stringify({
    id: "response-id",
    usage: {
      prompt_tokens: 10,
      completion_tokens: 20,
    },
    choices: [
      { message: { role: "assistant", content: "Hi there!" } },
    ],
  }));

  const startTime = Date.now() - 500; // 500ms ago

  // Create a mock PostHog client
  const mockPosthog = {
    capture: (_payload: {
      event: string;
      distinctId: string;
      properties: Record<string, unknown>;
    }) => Promise.resolve(),
  };

  // Stub the capture method
  const captureStub = stub(mockPosthog, "capture");

  // Create debug logger spy
  const debugSpy = stub(console, "debug");

  await trackLlmEvent(req, res, startTime, mockPosthog as unknown as PostHog);

  // Verify PostHog capture was called
  assertSpyCalls(captureStub, 1);

  // Verify the properties sent to PostHog
  const captureCall = captureStub.calls[0];

  // Define the expected payload type for PostHog capture calls
  interface CaptureCallPayload {
    event: string;
    distinctId: string;
    properties: Record<string, unknown>;
  }

  const capturePayload = captureCall.args[0] as CaptureCallPayload;
  assertEquals(capturePayload.event, "$ai_generation");
  assertEquals(capturePayload.distinctId, "bolt-foundry");

  const props = capturePayload.properties;
  assertEquals(props["$ai_provider"], "openai");
  assertEquals(props["$ai_model"], "gpt-4o");
  assertEquals(props["$ai_base_url"], "https://api.openai.com/v1");
  assert(typeof props["$ai_latency"] === "number");
  assertEquals(props["$ai_http_status"], 200);
  assertEquals(props["$ai_is_error"], false);
  assertEquals(props["$ai_input_tokens"], 10);
  assertEquals(props["$ai_output_tokens"], 20);
  assertEquals(props["$ai_total_tokens"], 30);

  // Check that debug info was logged
  assertSpyCalls(debugSpy, 1);

  debugSpy.restore();
});
