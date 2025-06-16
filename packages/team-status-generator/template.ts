/**
 * Team Status Template Generator
 * Creates formatted markdown documents from team status data
 */

import type {
  MajorUpdateFlag,
  TeamMemberActivity,
  TeamStatus,
  WorkCategory,
} from "packages/team-status-analyzer/types.ts";
import type { TeamMemberSummary } from "packages/team-status-analyzer/ai-summarizer.ts";

export class StatusTemplate {
  /**
   * Generate complete team status markdown document
   */
  generateStatusDocument(
    status: TeamStatus,
    aiSummaries?: Array<TeamMemberSummary>,
  ): string {
    const sections = [
      this.generateHeader(status),
      this.generateSummary(status),
      this.generateCustomerImpact(status, aiSummaries),
      aiSummaries
        ? this.generateAITeamActivity(aiSummaries)
        : this.generateTeamActivity(status.teamMembers),
      this.generateWorkCategorySummary(status.workCategorySummary),
      status.majorUpdatesOverview.length > 0
        ? this.generateMajorUpdatesSection(status.majorUpdatesOverview)
        : null,
      status.blogWorthyHighlights.length > 0
        ? this.generateBlogWorthySection(status.blogWorthyHighlights)
        : null,
      this.generateUpcomingPriorities(status.upcomingPriorities),
    ].filter((section) => section !== null);

    return sections.join("\n\n");
  }

  /**
   * Generate document header
   */
  private generateHeader(status: TeamStatus): string {
    const period = this.formatDateRange(status.periodStart, status.periodEnd);
    return [
      "# Team Status Report",
      `**Generated**: ${this.formatDateTime(status.generatedAt)}`,
      `**Period**: ${period}`,
      `**Total PRs Analyzed**: ${status.totalPRsAnalyzed}`,
    ].join("\n");
  }

  /**
   * Generate summary section
   */
  private generateSummary(status: TeamStatus): string {
    const activeMemberCount =
      status.teamMembers.filter((m) => m.totalPRs > 0).length;
    const totalPRs = status.totalPRsAnalyzed;
    const avgPRsPerMember = activeMemberCount > 0
      ? Math.round(totalPRs / activeMemberCount)
      : 0;

    return [
      "## Team Activity Summary",
      `- **Active team members**: ${activeMemberCount}`,
      `- **Average PRs per member**: ${avgPRsPerMember}`,
      `- **Period duration**: ${
        this.calculatePeriodDays(status.periodStart, status.periodEnd)
      } days`,
    ].join("\n");
  }

  /**
   * Generate AI-driven team activity sections
   */
  private generateAITeamActivity(
    aiSummaries: Array<TeamMemberSummary>,
  ): string {
    if (aiSummaries.length === 0) {
      return "## Team Activity\n\nNo team activity found in this period.";
    }

    const sections = ["## Team Activity"];

    for (const summary of aiSummaries) {
      sections.push(this.generateAIMemberSection(summary));
    }

    return sections.join("\n\n");
  }

  /**
   * Generate team member activity sections (legacy)
   */
  private generateTeamActivity(teamMembers: Array<TeamMemberActivity>): string {
    if (teamMembers.length === 0) {
      return "## Team Activity\n\nNo team activity found in this period.";
    }

    const sections = ["## Team Activity"];

    for (const member of teamMembers) {
      sections.push(this.generateMemberSection(member));
    }

    return sections.join("\n\n");
  }

  /**
   * Generate individual team member section
   */
  private generateMemberSection(member: TeamMemberActivity): string {
    const lines = [
      `### ${member.displayName || member.username}`,
      `**Current Focus**: ${member.currentFocus}`,
      `**PRs This Period**: ${member.totalPRs}`,
    ];

    // Recent contributions
    if (member.recentWork.length > 0) {
      lines.push("**Recent Contributions**:");
      for (const work of member.recentWork.slice(0, 5)) { // Top 5 most recent
        const status = work.mergedAt ? "✅" : "🔄";
        const impact = this.getImpactEmoji(work.impact);
        lines.push(`- ${status} ${impact} #${work.prNumber}: ${work.title}`);
        if (work.description && work.description !== work.title) {
          lines.push(`  *${work.description}*`);
        }
      }
    }

    // Next steps
    if (member.nextSteps.length > 0) {
      lines.push("**Next Steps**:");
      for (const step of member.nextSteps) {
        lines.push(`- ${step}`);
      }
    }

    // Major updates and external impact
    const majorUpdates = member.recentWork.filter((work) =>
      work.majorUpdateFlags.length > 0
    );
    const blogWorthy = member.recentWork.filter((work) =>
      work.blogWorthiness?.isNovel
    );

    if (majorUpdates.length > 0) {
      lines.push("**Major Updates (Team Awareness)**:");
      for (const work of majorUpdates.slice(0, 3)) {
        const flags = work.majorUpdateFlags.map((f) =>
          this.getMajorUpdateEmoji(f)
        ).join(" ");
        lines.push(`- ${flags} #${work.prNumber}: ${work.title}`);
        if (work.majorUpdateFlags.length > 0) {
          lines.push(`  *Flags: ${work.majorUpdateFlags.join(", ")}*`);
        }
      }
    }

    if (blogWorthy.length > 0) {
      lines.push("**Blog-Worthy Content**:");
      for (const work of blogWorthy.slice(0, 2)) {
        const contentType = work.blogWorthiness?.suggestedContentType ||
          "article";
        lines.push(`- 📝 #${work.prNumber}: ${work.title}`);
        lines.push(`  *${work.blogWorthiness?.noveltyReason}*`);
        lines.push(`  *Suggested: ${contentType}*`);
      }
    }

    // Legacy external impact (keep for compatibility)
    if (member.externalImpact.length > 0) {
      lines.push("**Other External Impact**:");
      for (const impact of member.externalImpact) {
        lines.push(`- ${impact}`);
      }
    }

    return lines.join("\n");
  }

  /**
   * Generate work category summary
   */
  private generateWorkCategorySummary(
    summary: Record<WorkCategory, number>,
  ): string {
    const lines = ["## Work Categories This Period"];

    const categoryLabels: Record<WorkCategory, string> = {
      feature: "Features",
      bugfix: "Bug Fixes",
      refactor: "Refactoring",
      documentation: "Documentation",
      infrastructure: "Infrastructure",
      testing: "Testing",
      other: "Other",
    };

    const sortedCategories = Object.entries(summary)
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1]);

    if (sortedCategories.length === 0) {
      lines.push("No categorized work found in this period.");
    } else {
      for (const [category, count] of sortedCategories) {
        const label = categoryLabels[category as WorkCategory];
        const emoji = this.getCategoryEmoji(category as WorkCategory);
        lines.push(`- ${emoji} **${label}**: ${count} PRs`);
      }
    }

    return lines.join("\n");
  }

  /**
   * Generate AI member section
   */
  private generateAIMemberSection(summary: TeamMemberSummary): string {
    const lines = [
      `### ${summary.displayName || summary.username}`,
      `**Summary**: ${summary.workSummary}`,
    ];

    if (summary.significantContributions.length > 0) {
      lines.push("**Significant Contributions**:");
      for (const contribution of summary.significantContributions) {
        lines.push(`- ${contribution}`);
      }
    }

    if (summary.blogWorthyContent.length > 0) {
      lines.push("**Blog-Worthy Content**:");
      for (const content of summary.blogWorthyContent) {
        lines.push(`- 📝 ${content}`);
      }
    }

    return lines.join("\n");
  }

  /**
   * Generate major updates section
   */
  private generateMajorUpdatesSection(majorUpdates: Array<string>): string {
    const lines = ["## Major Updates This Period"];

    for (const update of majorUpdates) {
      lines.push(`- ${update}`);
    }

    return lines.join("\n");
  }

  /**
   * Generate blog-worthy section
   */
  private generateBlogWorthySection(blogWorthy: Array<string>): string {
    const lines = ["## Blog-Worthy Highlights"];

    for (const highlight of blogWorthy) {
      lines.push(`- ${highlight}`);
    }

    return lines.join("\n");
  }

  /**
   * Generate upcoming priorities section
   */
  private generateUpcomingPriorities(priorities: Array<string>): string {
    const lines = ["## Upcoming Priorities"];

    if (priorities.length === 0) {
      lines.push("No shared priorities identified from recent work.");
    } else {
      lines.push("*Based on next steps mentioned by multiple team members:*");
      for (const priority of priorities) {
        lines.push(`- ${priority}`);
      }
    }

    return lines.join("\n");
  }

  /**
   * Generate customer impact section with sales talking points
   */
  private generateCustomerImpact(
    status: TeamStatus,
    aiSummaries?: Array<TeamMemberSummary>,
  ): string {
    const lines = ["## Customer Impact & Sales Talking Points"];

    // Extract customer-facing improvements
    const customerFeatures = this.extractCustomerFeatures(status, aiSummaries);
    const performanceImprovements = this.extractPerformanceImprovements(status);
    const reliabilityEnhancements = this.extractReliabilityEnhancements(status);

    if (
      customerFeatures.length === 0 && performanceImprovements.length === 0 &&
      reliabilityEnhancements.length === 0
    ) {
      lines.push("*No significant customer-facing changes this period.*");
      return lines.join("\n");
    }

    if (customerFeatures.length > 0) {
      lines.push("### 🚀 New Capabilities");
      lines.push("*What customers can now do that they couldn't before:*");
      for (const feature of customerFeatures) {
        lines.push(`- ${feature}`);
      }
      lines.push("");
    }

    if (performanceImprovements.length > 0) {
      lines.push("### ⚡ Performance & Efficiency");
      lines.push("*How the platform got faster and more reliable:*");
      for (const improvement of performanceImprovements) {
        lines.push(`- ${improvement}`);
      }
      lines.push("");
    }

    if (reliabilityEnhancements.length > 0) {
      lines.push("### 🛡️ Reliability & Quality");
      lines.push("*Reduced friction and improved user experience:*");
      for (const enhancement of reliabilityEnhancements) {
        lines.push(`- ${enhancement}`);
      }
      lines.push("");
    }

    // Add sales conversation starters
    lines.push("### 💬 Sales Conversation Starters");
    lines.push("*Use these talking points in customer conversations:*");

    const talkingPoints = this.generateSalesTalkingPoints(
      status,
      customerFeatures,
      performanceImprovements,
      reliabilityEnhancements,
    );
    for (const point of talkingPoints) {
      lines.push(`- ${point}`);
    }

    return lines.join("\n");
  }

  /**
   * Extract customer-facing features from team activity
   */
  private extractCustomerFeatures(
    status: TeamStatus,
    aiSummaries?: Array<TeamMemberSummary>,
  ): Array<string> {
    const features: Array<string> = [];

    // Look for user-facing features in team member work
    for (const member of status.teamMembers) {
      for (const work of member.recentWork) {
        if (this.isCustomerFacingFeature(work)) {
          features.push(`${work.title} - ${this.getCustomerBenefit(work)}`);
        }
      }
    }

    // Also check AI summaries for significant contributions
    if (aiSummaries) {
      for (const summary of aiSummaries) {
        for (const contribution of summary.significantContributions) {
          if (this.isCustomerFacingContribution(contribution)) {
            const benefit = this.extractCustomerBenefitFromContribution(
              contribution,
            );
            if (benefit) {
              features.push(benefit);
            }
          }
        }
      }
    }

    return features.slice(0, 5); // Top 5 customer features
  }

  /**
   * Extract performance improvements
   */
  private extractPerformanceImprovements(status: TeamStatus): Array<string> {
    const improvements: Array<string> = [];

    for (const member of status.teamMembers) {
      for (const work of member.recentWork) {
        if (work.majorUpdateFlags.includes("performance")) {
          improvements.push(`${work.title} - Improved system performance`);
        }
        if (
          work.title.toLowerCase().includes("optimize") ||
          work.title.toLowerCase().includes("cache")
        ) {
          improvements.push(`${work.title} - Enhanced response times`);
        }
        if (
          work.title.toLowerCase().includes("ci/cd") ||
          work.title.toLowerCase().includes("deploy")
        ) {
          improvements.push(`${work.title} - Faster deployment and updates`);
        }
      }
    }

    return improvements.slice(0, 3); // Top 3 performance improvements
  }

  /**
   * Extract reliability enhancements
   */
  private extractReliabilityEnhancements(status: TeamStatus): Array<string> {
    const enhancements: Array<string> = [];

    for (const member of status.teamMembers) {
      for (const work of member.recentWork) {
        if (work.category === "bugfix" && work.impact === "high") {
          enhancements.push(`Fixed: ${work.title} - Improved system stability`);
        }
        if (work.majorUpdateFlags.includes("security")) {
          enhancements.push(
            `${work.title} - Enhanced security and data protection`,
          );
        }
        if (
          work.title.toLowerCase().includes("test") &&
          work.majorUpdateFlags.includes("core-functionality")
        ) {
          enhancements.push(`${work.title} - Improved quality assurance`);
        }
        if (
          work.title.toLowerCase().includes("error") ||
          work.title.toLowerCase().includes("handling")
        ) {
          enhancements.push(`${work.title} - Better error recovery`);
        }
      }
    }

    return enhancements.slice(0, 4); // Top 4 reliability enhancements
  }

  /**
   * Generate sales talking points based on recent work
   */
  private generateSalesTalkingPoints(
    status: TeamStatus,
    customerFeatures: Array<string>,
    performanceImprovements: Array<string>,
    reliabilityEnhancements: Array<string>,
  ): Array<string> {
    const points: Array<string> = [];

    // Feature-based talking points
    if (customerFeatures.length > 0) {
      points.push(
        `"We've just shipped ${customerFeatures.length} new capabilities that help customers ${
          this.getCommonCustomerBenefit(customerFeatures)
        }"`,
      );
    }

    // Performance talking points
    if (performanceImprovements.length > 0) {
      points.push(
        `"Our latest performance improvements mean faster processing and more responsive user experience"`,
      );
    }

    // Reliability talking points
    if (reliabilityEnhancements.length > 0) {
      points.push(
        `"We've strengthened platform reliability with ${reliabilityEnhancements.length} key stability improvements"`,
      );
    }

    // Innovation talking points based on blog-worthy content
    if (status.blogWorthyHighlights.length > 0) {
      points.push(
        `"Our engineering team is pioneering innovative approaches - we have ${status.blogWorthyHighlights.length} breakthrough developments worth sharing"`,
      );
    }

    // Team momentum talking points
    const totalFeatures = status.workCategorySummary.feature || 0;
    if (totalFeatures > 10) {
      points.push(
        `"Our development velocity is strong - ${totalFeatures} feature improvements delivered this period shows our commitment to continuous innovation"`,
      );
    }

    return points.slice(0, 4); // Keep it concise
  }

  /**
   * Check if work item is customer-facing using Bolt Foundry library impact criteria
   */
  private isCustomerFacingFeature(work: any): boolean {
    const title = work.title.toLowerCase();
    const description = (work.description || "").toLowerCase();
    const text = `${title} ${description}`;

    // High-impact customer changes (from deck card)
    const highImpactKeywords = [
      "api",
      "breaking",
      "deprecated",
      "format",
      "schema",
      "config",
      "dependency",
      "version",
      "migrate",
      "update",
      "endpoint",
      "method",
      "signature",
    ];

    // Customer-facing keywords
    const customerKeywords = [
      "ui",
      "interface",
      "user",
      "dashboard",
      "form",
      "page",
      "navigation",
      "export",
      "import",
      "visualization",
      "subscription",
      "auth",
      "login",
      "signup",
      "docs",
      "documentation",
      "library",
      "sdk",
      "package",
    ];

    // Check for breaking changes or deprecations
    if (
      work.majorUpdateFlags.includes("breaking-change") ||
      text.includes("deprecat") || text.includes("breaking") ||
      text.includes("migrate") || text.includes("version")
    ) {
      return true;
    }

    // Check for API changes
    if (
      work.majorUpdateFlags.includes("api-change") ||
      highImpactKeywords.some((keyword) => text.includes(keyword))
    ) {
      return true;
    }

    // Check for user-experience improvements
    if (
      work.majorUpdateFlags.includes("user-experience") ||
      customerKeywords.some((keyword) => text.includes(keyword))
    ) {
      return true;
    }

    // New features are generally customer-facing
    return work.category === "feature";
  }

  /**
   * Get customer benefit from work item using Bolt Foundry impact assessment
   */
  private getCustomerBenefit(work: any): string {
    const title = work.title.toLowerCase();
    const description = (work.description || "").toLowerCase();
    const text = `${title} ${description}`;

    // Critical impact - requires immediate customer action
    if (
      work.majorUpdateFlags.includes("breaking-change") ||
      text.includes("breaking")
    ) {
      return "⚠️ Breaking change - migration required";
    }
    if (text.includes("deprecat")) {
      return "⚠️ Deprecation notice - plan migration";
    }

    // High impact - new capabilities or significant improvements
    if (work.majorUpdateFlags.includes("api-change") || title.includes("api")) {
      return "New API capabilities for enhanced integration";
    }
    if (title.includes("format") || title.includes("schema")) {
      return "Improved data formats and structures";
    }
    if (work.majorUpdateFlags.includes("performance")) {
      return "Faster processing and better performance";
    }

    // Medium impact - experience improvements
    if (title.includes("dashboard") || title.includes("ui")) {
      return "Better user interface";
    }
    if (title.includes("docs") || title.includes("documentation")) {
      return "Clearer guidance and examples";
    }
    if (title.includes("auth") || title.includes("login")) {
      return "Streamlined authentication";
    }
    if (title.includes("export") || title.includes("visualization")) {
      return "Better data insights";
    }
    if (title.includes("config") || title.includes("setup")) {
      return "Simplified configuration";
    }
    if (title.includes("test") || title.includes("eval")) {
      return "Enhanced testing and evaluation tools";
    }

    // Default for other features
    if (work.category === "feature") return "New platform capabilities";
    if (work.category === "bugfix") return "Improved stability and reliability";

    return "Enhanced platform capabilities";
  }

  /**
   * Check if contribution is customer-facing
   */
  private isCustomerFacingContribution(contribution: string): boolean {
    const text = contribution.toLowerCase();
    return text.includes("user-experience") ||
      text.includes("integration") ||
      text.includes("api") ||
      text.includes("ui") ||
      text.includes("interface");
  }

  /**
   * Extract customer benefit from contribution text
   */
  private extractCustomerBenefitFromContribution(
    contribution: string,
  ): string | null {
    // Extract the title part before the parentheses
    const match = contribution.match(/^([^(]+)/);
    if (match) {
      const title = match[1].trim();
      if (this.isCustomerFacingContribution(contribution)) {
        return `${title} - Enhanced user experience`;
      }
    }
    return null;
  }

  /**
   * Get common customer benefit theme
   */
  private getCommonCustomerBenefit(customerFeatures: Array<string>): string {
    const benefits = customerFeatures.join(" ").toLowerCase();

    if (benefits.includes("interface") || benefits.includes("dashboard")) {
      return "work more efficiently";
    }
    if (benefits.includes("integration") || benefits.includes("api")) {
      return "connect their systems seamlessly";
    }
    if (benefits.includes("docs") || benefits.includes("documentation")) {
      return "get started faster";
    }

    return "accomplish their goals more effectively";
  }

  /**
   * Format date and time for display
   */
  private formatDateTime(date: Date): string {
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  }

  /**
   * Format date range for display
   */
  private formatDateRange(start: Date, end: Date): string {
    const startStr = start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const endStr = end.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return `${startStr} to ${endStr}`;
  }

  /**
   * Calculate period duration in days
   */
  private calculatePeriodDays(start: Date, end: Date): number {
    const diffMs = end.getTime() - start.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }

  /**
   * Get emoji for work impact level
   */
  private getImpactEmoji(impact: string): string {
    switch (impact) {
      case "high":
        return "🔥";
      case "medium":
        return "⭐";
      case "low":
        return "💡";
      default:
        return "📝";
    }
  }

  /**
   * Get emoji for work category
   */
  private getCategoryEmoji(category: WorkCategory): string {
    switch (category) {
      case "feature":
        return "🚀";
      case "bugfix":
        return "🐛";
      case "refactor":
        return "🔧";
      case "documentation":
        return "📝";
      case "infrastructure":
        return "⚙️";
      case "testing":
        return "🧪";
      case "other":
        return "📦";
      default:
        return "📋";
    }
  }

  /**
   * Get emoji for major update flags
   */
  private getMajorUpdateEmoji(flag: MajorUpdateFlag): string {
    switch (flag) {
      case "core-functionality":
        return "🏗️";
      case "breaking-change":
        return "💥";
      case "performance":
        return "⚡";
      case "security":
        return "🔒";
      case "user-experience":
        return "🎨";
      case "infrastructure":
        return "🏭";
      case "integration":
        return "🔗";
      case "api-change":
        return "🔄";
      default:
        return "📋";
    }
  }
}
