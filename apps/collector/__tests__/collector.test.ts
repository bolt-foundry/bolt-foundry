#!/usr/bin/env -S bff test

import { assertEquals, assertExists } from "@std/assert";
import { handleCollectorRequest } from "../collector.ts";

/**
 * Integration tests for the collector service
 *
 * Tests verify that the collector correctly processes incoming data
 * and returns expected responses for various scenarios.
 */
Deno.test("Collector should handle JSON data collection request", async () => {
  // Create a mock request with JSON data
  const jsonData = {
    model: "gpt-4",
    messages: [{ role: "user", content: "Hello world" }],
    temperature: 0.7,
  };

  const mockRequest = new Request("http://localhost:8001/", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(jsonData),
  });

  // Execute - Process the request
  const response = await handleCollectorRequest(mockRequest);

  // Verify - Check the response
  assertEquals(response.status, 200, "Expected status code 200");

  const responseData = await response.json();
  assertEquals(responseData.success, true, "Expected success to be true");
});

Deno.test("Collector should handle text data collection request", async () => {
  // Create a mock request with text data
  const textData = "Sample text data for collection";

  const mockRequest = new Request("http://localhost:8001/", {
    method: "POST",
    headers: {
      "content-type": "text/plain",
    },
    body: textData,
  });

  // Execute
  const response = await handleCollectorRequest(mockRequest);

  // Verify
  assertEquals(response.status, 200, "Expected status code 200 for text data");

  const responseData = await response.json();
  assertEquals(
    responseData.success,
    true,
    "Expected success to be true for text data",
  );
});

Deno.test("Collector should return 404 for non-existent routes", async () => {
  // Create a mock request to a non-existent route
  const mockRequest = new Request("http://localhost:8001/not-found", {
    method: "GET",
  });

  // Execute
  const response = await handleCollectorRequest(mockRequest);

  // Verify
  assertEquals(
    response.status,
    404,
    "Expected status code 404 for non-existent route",
  );
});
