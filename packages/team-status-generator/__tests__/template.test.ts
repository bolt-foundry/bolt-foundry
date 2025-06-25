/**
 * Tests for Team Status Generator Template functionality
 */

import { assertEquals, assertExists, assertStringIncludes } from "../deps.ts";
import { StatusTemplate } from "../template.ts";
import type { TeamStatus } from "@bfmono/packages/team-status-analyzer/types.ts";
import type { TeamMemberSummary } from "@bfmono/packages/team-status-analyzer/ai-summarizer.ts";

const mockTeamStatus: TeamStatus = {
  generatedAt: new Date("2025-06-12"),
  periodStart: new Date("2025-06-05"),
  periodEnd: new Date("2025-06-12"),
  totalPRsAnalyzed: 5,
  teamMembers: [{
    username: "testuser",
    displayName: "Test User",
    currentFocus: "Authentication improvements",
    recentWork: [{
      prNumber: 123,
      title: "Add user authentication",
      description: "Implements OAuth2 flow",
      category: "feature",
      impact: "high",
      author: "testuser",
      createdAt: new Date("2025-06-12T10:00:00Z"),
      mergedAt: new Date("2025-06-12T12:00:00Z"),
      nextSteps: [],
      externalRelevance: "Improves user security",
      majorUpdateFlags: [],
      blogWorthiness: null,
    }],
    nextSteps: ["Continue work on PR #123"],
    externalImpact: ["User security improvements"],
    totalPRs: 1,
  }],
  workCategorySummary: {
    feature: 1,
    bugfix: 0,
    refactor: 0,
    documentation: 0,
    infrastructure: 0,
    testing: 0,
    other: 0,
  },
  upcomingPriorities: ["Security improvements"],
  blogWorthyHighlights: ["OAuth2 authentication"],
  majorUpdatesOverview: [],
};

Deno.test("StatusTemplate - generates status document", () => {
  const template = new StatusTemplate();
  const result = template.generateStatusDocument(mockTeamStatus);

  assertExists(result);
  assertEquals(typeof result, "string");

  // Basic functionality test - should return non-empty string
  assertEquals(result.length > 0, true);
});

Deno.test("StatusTemplate - constructor works", () => {
  const template = new StatusTemplate();
  assertEquals(typeof template, "object");
});

Deno.test("StatusTemplate - method exists", () => {
  const template = new StatusTemplate();
  assertEquals(typeof template.generateStatusDocument, "function");
});

Deno.test("StatusTemplate - shows rule-based indicator when no AI summaries", () => {
  const template = new StatusTemplate();
  const result = template.generateStatusDocument(mockTeamStatus);

  assertStringIncludes(
    result,
    "📝 **Rule-based**: Team activity generated using rule-based analysis",
  );
});

Deno.test("StatusTemplate - shows AI indicator when all summaries are AI-generated", () => {
  const template = new StatusTemplate();
  const aiSummaries: Array<TeamMemberSummary> = [{
    username: "testuser",
    displayName: "Test User",
    workSummary: "AI-generated summary",
    blogWorthyContent: [],
    significantContributions: [],
    totalPRs: 1,
    generatedWithAI: true,
  }];

  const result = template.generateStatusDocument(mockTeamStatus, aiSummaries);

  assertStringIncludes(
    result,
    "🤖 **AI Deck**: All summaries generated using AI deck system",
  );
});

Deno.test("StatusTemplate - shows mixed indicator when some summaries are AI-generated", () => {
  const template = new StatusTemplate();
  const aiSummaries: Array<TeamMemberSummary> = [
    {
      username: "testuser1",
      displayName: "Test User 1",
      workSummary: "AI-generated summary",
      blogWorthyContent: [],
      significantContributions: [],
      totalPRs: 1,
      generatedWithAI: true,
    },
    {
      username: "testuser2",
      displayName: "Test User 2",
      workSummary: "Rule-based summary",
      blogWorthyContent: [],
      significantContributions: [],
      totalPRs: 1,
      generatedWithAI: false,
    },
  ];

  const result = template.generateStatusDocument(mockTeamStatus, aiSummaries);

  assertStringIncludes(
    result,
    "🔄 **Mixed Generation**: 1/2 summaries generated using AI deck system",
  );
});
