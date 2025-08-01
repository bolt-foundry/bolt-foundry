import { assertEquals, assertExists } from "@std/assert";
import { withIsolatedDb } from "@bfmono/apps/bfDb/bfDb.ts";
import { makeLoggedInCv } from "@bfmono/apps/bfDb/utils/testUtils.ts";
import { BfOrganization } from "@bfmono/apps/bfDb/nodeTypes/BfOrganization.ts";
import { handleTelemetryRequest } from "../handlers/telemetry.ts";

// Helper function to setup test data
async function setupTestData() {
  const cv = await makeLoggedInCv();

  // Create the organization that the CurrentViewer references
  // The CurrentViewer's orgBfOid should match this organization's bfGid
  const org = await BfOrganization.__DANGEROUS__createUnattached(cv, {
    name: "Test Organization",
    domain: "test.com",
  }, {
    bfGid: cv.orgBfOid, // Use the same ID that CurrentViewer expects
  });

  return { cv, org };
}

// Mock telemetry data that would come from connectBoltFoundry
const createMockTelemetryData = (overrides = {}) => ({
  duration: 1500,
  provider: "openai",
  request: {
    url: "https://api.openai.com/v1/chat/completions",
    method: "POST",
    headers: {
      "content-type": "application/json",
      "authorization": "Bearer [REDACTED]",
    },
    body: {
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Hello!" },
      ],
    },
  },
  response: {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
    body: {
      id: "chatcmpl-123",
      object: "chat.completion",
      choices: [
        {
          message: {
            role: "assistant",
            content: "Hello! How can I help you today?",
          },
          finish_reason: "stop",
        },
      ],
    },
  },
  // Basic deck metadata for MVP (no hashing)
  bfMetadata: {
    deckId: "customer-service",
    contextVariables: { userId: "user-456", feature: "chat" },
  },
  ...overrides,
});

Deno.test("Telemetry endpoint - successful sample creation", async () => {
  await withIsolatedDb(async () => {
    const { cv } = await setupTestData();

    const mockRequest = new Request("http://localhost:3000/api/telemetry", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-bf-api-key": `bf+${cv.orgBfOid}`,
      },
      body: JSON.stringify(createMockTelemetryData()),
    });

    const response = await handleTelemetryRequest(mockRequest);

    assertEquals(response.status, 200);
    const responseData = await response.json();
    assertEquals(responseData.success, true);
    assertExists(responseData.sampleId);
  });
});

Deno.test("Telemetry endpoint - missing API key", async () => {
  await withIsolatedDb(async () => {
    const mockRequest = new Request("http://localhost:3000/api/telemetry", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(createMockTelemetryData()),
    });

    const response = await handleTelemetryRequest(mockRequest);

    assertEquals(response.status, 401);
    const responseData = await response.json();
    assertEquals(responseData.error, "API key required");
  });
});

Deno.test("Telemetry endpoint - invalid API key", async () => {
  await withIsolatedDb(async () => {
    const mockRequest = new Request("http://localhost:3000/api/telemetry", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-bf-api-key": "invalid-key",
      },
      body: JSON.stringify(createMockTelemetryData()),
    });

    const response = await handleTelemetryRequest(mockRequest);

    assertEquals(response.status, 401);
    const responseData = await response.json();
    assertEquals(responseData.error, "Invalid API key");
  });
});

Deno.test("Telemetry endpoint - creates deck if not exists", async () => {
  await withIsolatedDb(async () => {
    const { cv } = await setupTestData();

    const telemetryData = createMockTelemetryData({
      bfMetadata: {
        deckId: "new-deck",
        contextVariables: { feature: "test" },
      },
    });

    const mockRequest = new Request("http://localhost:3000/api/telemetry", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-bf-api-key": `bf+${cv.orgBfOid}`,
      },
      body: JSON.stringify(telemetryData),
    });

    const response = await handleTelemetryRequest(mockRequest);

    assertEquals(response.status, 200);
    const responseData = await response.json();
    assertEquals(responseData.success, true);
    assertExists(responseData.deckId);
    assertExists(responseData.sampleId);
  });
});

Deno.test("Telemetry endpoint - deduplicates decks by slug", async () => {
  await withIsolatedDb(async () => {
    const { cv } = await setupTestData();

    const telemetryData = createMockTelemetryData({
      bfMetadata: {
        deckId: "customer-service",
        contextVariables: { feature: "chat" },
      },
    });

    const mockRequest = new Request("http://localhost:3000/api/telemetry", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-bf-api-key": `bf+${cv.orgBfOid}`,
      },
      body: JSON.stringify(telemetryData),
    });

    // First request - should create deck
    const response1 = await handleTelemetryRequest(mockRequest);
    assertEquals(response1.status, 200);
    const responseData1 = await response1.json();
    assertEquals(responseData1.success, true);
    const firstDeckId = responseData1.deckId;

    // Second request with same deck name - should reuse existing deck
    const mockRequest2 = new Request("http://localhost:3000/api/telemetry", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-bf-api-key": `bf+${cv.orgBfOid}`,
      },
      body: JSON.stringify(telemetryData),
    });
    const response2 = await handleTelemetryRequest(mockRequest2);
    assertEquals(response2.status, 200);
    const responseData2 = await response2.json();
    assertEquals(responseData2.success, true);
    const secondDeckId = responseData2.deckId;

    // Should be the same deck
    assertEquals(firstDeckId, secondDeckId);
  });
});

Deno.test("Telemetry endpoint - handles missing bfMetadata", async () => {
  await withIsolatedDb(async () => {
    const cv = await makeLoggedInCv();

    const telemetryDataWithoutMetadata = createMockTelemetryData();
    // @ts-expect-error - Deleting optional property
    delete telemetryDataWithoutMetadata.bfMetadata;

    const mockRequest = new Request("http://localhost:3000/api/telemetry", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-bf-api-key": `bf+${cv.orgBfOid}`,
      },
      body: JSON.stringify(telemetryDataWithoutMetadata),
    });

    const response = await handleTelemetryRequest(mockRequest);

    assertEquals(response.status, 200);
    const responseData = await response.json();
    assertEquals(responseData.success, true);
    assertEquals(
      responseData.message,
      "Telemetry processed without deck metadata",
    );
  });
});

Deno.test("Telemetry endpoint - invalid JSON", async () => {
  await withIsolatedDb(async () => {
    const cv = await makeLoggedInCv();

    const mockRequest = new Request("http://localhost:3000/api/telemetry", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-bf-api-key": `bf+${cv.orgBfOid}`,
      },
      body: "invalid json",
    });

    const response = await handleTelemetryRequest(mockRequest);

    assertEquals(response.status, 400);
    const responseData = await response.json();
    assertEquals(responseData.error, "Invalid JSON");
  });
});

Deno.test("Telemetry endpoint - wrong HTTP method", async () => {
  await withIsolatedDb(async () => {
    const cv = await makeLoggedInCv();

    const mockRequest = new Request("http://localhost:3000/api/telemetry", {
      method: "GET",
      headers: {
        "x-bf-api-key": `bf+${cv.orgBfOid}`,
      },
    });

    const response = await handleTelemetryRequest(mockRequest);

    assertEquals(response.status, 405);
    const responseData = await response.json();
    assertEquals(responseData.error, "Method not allowed");
  });
});
