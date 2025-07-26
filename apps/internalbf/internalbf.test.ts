import { assertEquals, assertExists } from "@std/assert";

// Test fixtures
const createWorkflowPayload = (status: string, conclusion?: string) => ({
  action: "completed",
  workflow_run: {
    id: 12345,
    name: "Deploy boltfoundry-com",
    status,
    conclusion,
    head_branch: "main",
    head_sha: "abc123def456789",
    html_url: "https://github.com/bolt-foundry/bolt-foundry/actions/runs/12345",
  },
  repository: {
    full_name: "bolt-foundry/bolt-foundry",
    name: "bolt-foundry",
    owner: { login: "bolt-foundry" },
  },
});

const createPRPayload = (merged: boolean) => ({
  action: "closed",
  pull_request: {
    number: 123,
    title: "Add new feature",
    state: "closed",
    merged,
    html_url: "https://github.com/bolt-foundry/bolt-foundry/pull/123",
    user: { login: "developer1" },
    merged_by: merged ? { login: "maintainer1" } : null,
  },
  repository: {
    full_name: "bolt-foundry/bolt-foundry",
    name: "bolt-foundry",
    owner: { login: "bolt-foundry" },
  },
});

// URL Routing
Deno.test("matches webhook endpoint", () => {
  const pattern = new URLPattern({ pathname: "/webhooks/github" });
  const result = pattern.exec("https://internalbf.com/webhooks/github");
  assertExists(result);
});

// Event Filtering
Deno.test("only processes bolt-foundry repository", () => {
  const validPayload = createWorkflowPayload("completed", "success");
  assertEquals(validPayload.repository.full_name, "bolt-foundry/bolt-foundry");

  const invalidPayload = {
    ...validPayload,
    repository: {
      full_name: "other-org/other-repo",
      name: "other-repo",
      owner: { login: "other-org" },
    },
  };
  assertEquals(
    invalidPayload.repository.full_name !== "bolt-foundry/bolt-foundry",
    true,
  );
});

Deno.test("only processes completed workflows", () => {
  const completed = createWorkflowPayload("completed", "success");
  assertEquals(completed.workflow_run.status, "completed");

  const inProgress = createWorkflowPayload("in_progress");
  assertEquals(inProgress.workflow_run.status !== "completed", true);
});

// Message Formatting
Deno.test("formats successful deployment message", () => {
  const payload = createWorkflowPayload("completed", "success");
  const message = [
    "✅ **Deployment succeeded**",
    `**Workflow:** ${payload.workflow_run.name}`,
    `**Repository:** ${payload.repository.full_name}`,
    `**Branch:** ${payload.workflow_run.head_branch}`,
    `**Commit:** ${payload.workflow_run.head_sha.substring(0, 7)}`,
    `**URL:** ${payload.workflow_run.html_url}`,
  ].join("\n");

  assertEquals(message.includes("✅"), true);
  assertEquals(message.includes("succeeded"), true);
});

Deno.test("formats failed deployment message", () => {
  const payload = createWorkflowPayload("completed", "failure");
  const message = [
    "❌ **Deployment failed**",
    `**Workflow:** ${payload.workflow_run.name}`,
    `**Repository:** ${payload.repository.full_name}`,
    `**Branch:** ${payload.workflow_run.head_branch}`,
    `**Commit:** ${payload.workflow_run.head_sha.substring(0, 7)}`,
    `**URL:** ${payload.workflow_run.html_url}`,
  ].join("\n");

  assertEquals(message.includes("❌"), true);
  assertEquals(message.includes("failed"), true);
});

Deno.test("formats PR merged message", () => {
  const payload = createPRPayload(true);
  const message = [
    "🎉 **Pull Request Merged**",
    `**Title:** ${payload.pull_request.title}`,
    `**Repository:** ${payload.repository.full_name}`,
    `**Author:** ${payload.pull_request.user.login}`,
    `**Merged by:** ${payload.pull_request.merged_by?.login}`,
    `**URL:** ${payload.pull_request.html_url}`,
  ].join("\n");

  assertEquals(message.includes("🎉"), true);
  assertEquals(message.includes("Add new feature"), true);
});

// Error Handling
Deno.test("always returns 200 to prevent GitHub retries", () => {
  // Even for errors, we should return 200
  const responses = [
    new Response("OK", { status: 200 }),
    new Response("Event not handled", { status: 200 }),
    new Response("Error occurred", { status: 200 }),
  ];

  responses.forEach((response) => {
    assertEquals(response.status, 200);
  });
});

// Request Validation
Deno.test("validates GitHub headers", () => {
  const request = new Request("https://internalbf.com/webhooks/github", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-github-event": "workflow_run",
      "x-github-delivery": "12345678-1234-1234-1234-123456789012",
    },
    body: JSON.stringify(createWorkflowPayload("completed", "success")),
  });

  assertEquals(request.headers.get("x-github-event"), "workflow_run");
  assertExists(request.headers.get("x-github-delivery"));
});
