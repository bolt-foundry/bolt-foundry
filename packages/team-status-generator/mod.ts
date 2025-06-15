/**
 * Team Status Generator
 * Main module for generating formatted team status documents
 */

export { StatusTemplate } from "./template.ts";
export { DocumentArchiver } from "./archiver.ts";

import { getLogger } from "packages/logger/logger.ts";
import { StatusTemplate } from "./template.ts";
import { DocumentArchiver } from "./archiver.ts";
import type { TeamStatus } from "packages/team-status-analyzer/types.ts";
import type { TeamMemberSummary } from "packages/team-status-analyzer/ai-summarizer.ts";

const logger = getLogger(import.meta);

/**
 * Main generator class that creates and manages team status documents
 */
export class TeamStatusGenerator {
  private template = new StatusTemplate();
  private archiver = new DocumentArchiver();

  constructor(private outputDir?: string) {
    if (outputDir) {
      this.archiver = new DocumentArchiver(outputDir);
    }
  }

  /**
   * Generate and save team status document
   */
  async generateAndSave(
    status: TeamStatus,
    aiSummaries?: Array<TeamMemberSummary>,
  ): Promise<{
    content: string;
    saved: boolean;
    backupCreated: boolean;
  }> {
    // Generate markdown content
    const content = this.template.generateStatusDocument(status, aiSummaries);

    try {
      // Save document and create backup
      await this.archiver.saveTeamStatus(content, status);

      // Also export as JSON for external processing
      await this.archiver.exportStatusAsJSON(status);

      return {
        content,
        saved: true,
        backupCreated: true,
      };
    } catch (error) {
      logger.error("Failed to save team status document:", error);
      return {
        content,
        saved: false,
        backupCreated: false,
      };
    }
  }

  /**
   * Generate status document without saving
   */
  generateDocument(
    status: TeamStatus,
    aiSummaries?: Array<TeamMemberSummary>,
  ): string {
    return this.template.generateStatusDocument(status, aiSummaries);
  }

  /**
   * Get the current team status document
   */
  getCurrentDocument(): Promise<string | null> {
    return this.archiver.getCurrentStatus();
  }

  /**
   * List all available archived status documents
   */
  listArchivedDocuments(): Promise<Array<string>> {
    return this.archiver.listArchivedStatuses();
  }

  /**
   * Get an archived status document by date
   */
  getArchivedDocument(date: string): Promise<string | null> {
    return this.archiver.getArchivedStatus(date);
  }

  /**
   * Compare current document with the most recent backup
   */
  compareWithPrevious(): Promise<{
    current: string | null;
    previous: string | null;
    hasChanges: boolean;
  }> {
    return this.archiver.compareWithPrevious();
  }

  /**
   * Get archive statistics
   */
  getArchiveStatistics() {
    return this.archiver.getArchiveStatistics();
  }

  /**
   * Generate a summary report for recent activity
   */
  generateSummaryReport(status: TeamStatus): string {
    const activeMemberCount =
      status.teamMembers.filter((m) => m.totalPRs > 0).length;
    const topCategories = Object.entries(status.workCategorySummary)
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    const lines = [
      `# Team Status Summary - ${status.generatedAt.toDateString()}`,
      "",
      `## Key Metrics`,
      `- **Active team members**: ${activeMemberCount}`,
      `- **Total PRs**: ${status.totalPRsAnalyzed}`,
      `- **Period**: ${
        Math.ceil(
          (status.periodEnd.getTime() - status.periodStart.getTime()) /
            (1000 * 60 * 60 * 24),
        )
      } days`,
      "",
      `## Top Work Categories`,
    ];

    for (const [category, count] of topCategories) {
      lines.push(`- **${category}**: ${count} PRs`);
    }

    if (status.upcomingPriorities.length > 0) {
      lines.push("", "## Shared Priorities");
      for (const priority of status.upcomingPriorities.slice(0, 3)) {
        lines.push(`- ${priority}`);
      }
    }

    return lines.join("\n");
  }

  /**
   * Generate team member spotlight (most active member)
   */
  generateTeamSpotlight(status: TeamStatus): string | null {
    const mostActive = status.teamMembers
      .filter((m) => m.totalPRs > 0)
      .sort((a, b) => b.totalPRs - a.totalPRs)[0];

    if (!mostActive) return null;

    const lines = [
      `## Team Spotlight: ${mostActive.displayName || mostActive.username}`,
      "",
      `**Focus Area**: ${mostActive.currentFocus}`,
      `**Contributions This Period**: ${mostActive.totalPRs} PRs`,
      "",
      "**Recent Highlights**:",
    ];

    for (const work of mostActive.recentWork.slice(0, 3)) {
      const status = work.mergedAt ? "Merged" : "In Progress";
      lines.push(`- **${status}**: ${work.title}`);
    }

    if (mostActive.externalImpact.length > 0) {
      lines.push("", "**External Impact**:");
      for (const impact of mostActive.externalImpact.slice(0, 2)) {
        lines.push(`- ${impact}`);
      }
    }

    return lines.join("\n");
  }
}
