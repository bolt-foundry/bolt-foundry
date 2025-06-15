/**
 * Team Status Analyzer
 * Main module exports for analyzing GitHub PRs and generating team status data
 */

export { GitHubClient } from "./github-client.ts";
export { PRParser } from "./pr-parser.ts";
export { DocumentIngester } from "./document-ingester.ts";
export { AISummarizer } from "./ai-summarizer.ts";
export {
  createDefaultTimestampTracker,
  FileTimestampTracker,
} from "./timestamp-tracker.ts";
export type * from "./types.ts";
export type { TeamMemberSummary } from "./ai-summarizer.ts";

import { GitHubClient } from "./github-client.ts";
import { PRParser } from "./pr-parser.ts";
import { DocumentIngester } from "./document-ingester.ts";
import { AISummarizer } from "./ai-summarizer.ts";
import { createDefaultTimestampTracker } from "./timestamp-tracker.ts";
import type {
  AnalyzerConfig,
  CompanyContext,
  TeamMemberActivity,
  TeamStatus,
  WorkCategory,
  WorkItem,
} from "./types.ts";
import type { TeamMemberSummary } from "./ai-summarizer.ts";

/**
 * Main analyzer class that orchestrates PR fetching and analysis
 */
export class TeamStatusAnalyzer {
  private githubClient: GitHubClient;
  private prParser: PRParser;
  private documentIngester: DocumentIngester;
  private aiSummarizer: AISummarizer;
  private timestampTracker = createDefaultTimestampTracker();

  constructor(private config: AnalyzerConfig) {
    this.githubClient = new GitHubClient(
      config.repositoryOwner,
      config.repositoryName,
    );
    this.prParser = new PRParser();
    this.documentIngester = new DocumentIngester();
    this.aiSummarizer = new AISummarizer();

    // Apply custom configurations
    if (config.workCategoryKeywords) {
      this.prParser.updateCategoryKeywords(config.workCategoryKeywords);
    }
    if (config.externalImpactKeywords) {
      this.prParser.updateExternalImpactKeywords(config.externalImpactKeywords);
    }
    if (config.majorUpdateKeywords) {
      this.prParser.updateMajorUpdateKeywords(config.majorUpdateKeywords);
    }
  }

  /**
   * Initialize the analyzer
   */
  async initialize(): Promise<void> {
    await this.githubClient.initialize();
    await this.aiSummarizer.initialize();
  }

  /**
   * Analyze team status since last check
   */
  async analyzeTeamStatus(options?: { dryRun?: boolean }): Promise<
    { teamStatus: TeamStatus; aiSummaries: Array<TeamMemberSummary> }
  > {
    const now = new Date();

    let since: Date;
    if (options?.dryRun) {
      // For dry runs, always analyze the last week regardless of timestamp
      since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Last 7 days
    } else {
      // For normal runs, use timestamp tracker
      const lastCheck = await this.timestampTracker.getLastCheck();
      since = lastCheck || new Date(Date.now() - 14 * 24 * 60 * 60 * 1000); // Default 2 weeks
    }

    // Ingest company context from documents
    const companyContext = await this.documentIngester.ingestCompanyContext();

    // Fetch PRs since last check
    const prs = await this.githubClient.fetchPRs({
      since,
      state: "all",
    });

    // Parse PRs into work items with company context
    const workItems: Array<WorkItem> = [];
    for (const pr of prs) {
      try {
        // Optionally fetch comments for richer analysis
        const comments = await this.githubClient.fetchPRComments(pr.number);
        const workItem = this.prParser.parseWorkItem(
          pr,
          comments,
          companyContext,
        );
        workItems.push(workItem);
      } catch (_error) {
        // Failed to parse PR, skipping (error already handled)
        continue;
      }
    }

    // Group work by team member and generate AI summaries
    const teamMembers = this.groupWorkByTeamMember(workItems);
    const aiSummaries = await this.generateAISummaries(
      workItems,
      companyContext,
    );

    // Generate enhanced analysis
    const workCategorySummary = this.generateCategorySummary(workItems);
    const upcomingPriorities = this.extractUpcomingPriorities(teamMembers);
    const blogWorthyHighlights = this.extractBlogWorthyHighlights(aiSummaries);
    const majorUpdatesOverview = this.generateMajorUpdatesOverview(workItems);

    // Update last check timestamp only if not a dry run
    if (!options?.dryRun) {
      await this.timestampTracker.setLastCheck(now);
    }

    const teamStatus: TeamStatus = {
      generatedAt: now,
      periodStart: since,
      periodEnd: now,
      totalPRsAnalyzed: prs.length,
      teamMembers,
      workCategorySummary,
      upcomingPriorities,
      blogWorthyHighlights,
      majorUpdatesOverview,
    };

    return { teamStatus, aiSummaries };
  }

  /**
   * Group work items by team member
   */
  private groupWorkByTeamMember(
    workItems: Array<WorkItem>,
  ): Array<TeamMemberActivity> {
    const memberMap = new Map<string, Array<WorkItem>>();

    // Group work items by author
    for (const item of workItems) {
      const existing = memberMap.get(item.author) || [];
      existing.push(item);
      memberMap.set(item.author, existing);
    }

    // Convert to team member activities
    const teamMembers: Array<TeamMemberActivity> = [];
    for (const [username, items] of memberMap.entries()) {
      const displayName = this.config.teamMembers[username] || username;
      const currentFocus = this.determineFocus(items);
      const nextSteps = this.aggregateNextSteps(items);
      const externalImpact = this.extractExternalImpact(items);

      teamMembers.push({
        username,
        displayName,
        currentFocus,
        recentWork: items.sort((a, b) =>
          b.createdAt.getTime() - a.createdAt.getTime()
        ),
        nextSteps,
        externalImpact,
        totalPRs: items.length,
      });
    }

    return teamMembers.sort((a, b) => b.totalPRs - a.totalPRs);
  }

  /**
   * Determine primary focus area for a team member
   */
  private determineFocus(items: Array<WorkItem>): string {
    if (items.length === 0) return "No recent activity";

    // Count categories
    const categoryCount = new Map<WorkCategory, number>();
    for (const item of items) {
      categoryCount.set(
        item.category,
        (categoryCount.get(item.category) || 0) + 1,
      );
    }

    // Find most common category
    let maxCount = 0;
    let primaryCategory: WorkCategory = "other";
    for (const [category, count] of categoryCount.entries()) {
      if (count > maxCount) {
        maxCount = count;
        primaryCategory = category;
      }
    }

    // Generate focus description
    const categoryLabels: Record<WorkCategory, string> = {
      feature: "Feature development",
      bugfix: "Bug fixes and maintenance",
      refactor: "Code refactoring and optimization",
      documentation: "Documentation and guides",
      infrastructure: "Infrastructure and tooling",
      testing: "Testing and quality assurance",
      other: "General development",
    };

    return categoryLabels[primaryCategory];
  }

  /**
   * Aggregate next steps from work items
   */
  private aggregateNextSteps(items: Array<WorkItem>): Array<string> {
    const allSteps = items.flatMap((item) => item.nextSteps);
    return [...new Set(allSteps)].slice(0, 5); // Top 5 unique steps
  }

  /**
   * Extract external impact items
   */
  private extractExternalImpact(items: Array<WorkItem>): Array<string> {
    return items
      .filter((item) => item.externalRelevance)
      .map((item) => `${item.title}: ${item.externalRelevance}`)
      .slice(0, 3); // Top 3 items
  }

  /**
   * Generate work category summary
   */
  private generateCategorySummary(
    workItems: Array<WorkItem>,
  ): Record<WorkCategory, number> {
    const summary: Record<WorkCategory, number> = {
      feature: 0,
      bugfix: 0,
      refactor: 0,
      documentation: 0,
      infrastructure: 0,
      testing: 0,
      other: 0,
    };

    for (const item of workItems) {
      summary[item.category]++;
    }

    return summary;
  }

  /**
   * Extract upcoming priorities from team next steps
   */
  private extractUpcomingPriorities(
    teamMembers: Array<TeamMemberActivity>,
  ): Array<string> {
    const allSteps = teamMembers.flatMap((member) => member.nextSteps);
    const stepCounts = new Map<string, number>();

    for (const step of allSteps) {
      stepCounts.set(step, (stepCounts.get(step) || 0) + 1);
    }

    // Return steps mentioned by multiple people (likely important)
    return Array.from(stepCounts.entries())
      .filter(([_, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .map(([step, _]) => step)
      .slice(0, 5);
  }

  /**
   * Generate AI summaries for all team members
   */
  private async generateAISummaries(
    workItems: Array<WorkItem>,
    companyContext: CompanyContext,
  ): Promise<Array<TeamMemberSummary>> {
    // Group work items by author
    const memberWork = new Map<string, Array<WorkItem>>();
    for (const item of workItems) {
      const existing = memberWork.get(item.author) || [];
      existing.push(item);
      memberWork.set(item.author, existing);
    }

    // Generate AI summaries for each team member
    const summaries: Array<TeamMemberSummary> = [];
    for (const [username, items] of memberWork.entries()) {
      const displayName = this.config.teamMembers[username] || username;

      // Try AI-powered summary first, fallback to rule-based
      const summary = await this.aiSummarizer.generateAIPoweredSummary(
        username,
        displayName,
        items,
        companyContext,
      );
      summaries.push(summary);
    }

    return summaries.sort((a, b) => b.totalPRs - a.totalPRs);
  }

  /**
   * Extract blog-worthy highlights from AI summaries
   */
  private extractBlogWorthyHighlights(
    aiSummaries: Array<TeamMemberSummary>,
  ): Array<string> {
    const highlights: Array<string> = [];

    for (const summary of aiSummaries) {
      highlights.push(...summary.blogWorthyContent);
    }

    return highlights.slice(0, 5); // Top 5 blog-worthy items
  }

  /**
   * Generate major updates overview
   */
  private generateMajorUpdatesOverview(
    workItems: Array<WorkItem>,
  ): Array<string> {
    const flagCounts = new Map<string, number>();

    for (const item of workItems) {
      for (const flag of item.majorUpdateFlags) {
        flagCounts.set(flag, (flagCounts.get(flag) || 0) + 1);
      }
    }

    return Array.from(flagCounts.entries())
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([flag, count]) =>
        `${this.formatMajorUpdateFlag(flag)}: ${count} PR${
          count > 1 ? "s" : ""
        }`
      )
      .slice(0, 8); // Top 8 categories
  }

  /**
   * Format major update flag for display
   */
  private formatMajorUpdateFlag(flag: string): string {
    const flagMap: Record<string, string> = {
      "core-functionality": "🏗️ Core Functionality",
      "breaking-change": "💥 Breaking Changes",
      "performance": "⚡ Performance",
      "security": "🔒 Security",
      "user-experience": "🎨 User Experience",
      "infrastructure": "🏭 Infrastructure",
      "integration": "🔗 Integration",
      "api-change": "🔄 API Changes",
    };
    return flagMap[flag] || `📋 ${flag}`;
  }

  /**
   * Test the analyzer configuration
   */
  async testConfiguration(): Promise<boolean> {
    try {
      await this.initialize();
      return await this.githubClient.testConnection();
    } catch (_error) {
      // Configuration test failed (error logged elsewhere)
      return false;
    }
  }
}
