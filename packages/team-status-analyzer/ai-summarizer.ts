/**
 * AI Summarizer
 * Uses the team summary analysis deck to generate human-readable work summaries
 */

import { getLogger } from "packages/logger/logger.ts";
import { parseMarkdownToDeck } from "packages/bolt-foundry/builders/markdown/markdownToDeck.ts";
import type { DeckBuilder } from "packages/bolt-foundry/builders/builders.ts";
import type { CompanyContext, WorkItem } from "./types.ts";

const logger = getLogger(import.meta);

export interface TeamMemberSummary {
  username: string;
  displayName?: string;
  workSummary: string;
  blogWorthyContent: Array<string>;
  significantContributions: Array<string>;
  totalPRs: number;
}

export class AISummarizer {
  private deck: DeckBuilder | null = null;

  /**
   * Initialize by loading and parsing the team summary analysis deck
   */
  async initialize(): Promise<void> {
    try {
      const deckPath =
        "/home/runner/workspace/decks/team-summary-analysis.deck.md";
      const deckContent = await Deno.readTextFile(deckPath);
      const { deck } = await parseMarkdownToDeck(deckContent);
      this.deck = deck;
      logger.debug("Successfully loaded team summary analysis deck");
    } catch (error) {
      logger.warn("Could not load team summary deck:", error);
      this.deck = null;
    }
  }

  /**
   * Generate AI-powered summary using the deck system
   */
  async generateAIPoweredSummary(
    username: string,
    displayName: string | undefined,
    workItems: Array<WorkItem>,
    companyContext: CompanyContext,
  ): Promise<TeamMemberSummary> {
    if (!this.deck || workItems.length === 0) {
      return this.generateMemberSummary(
        username,
        displayName,
        workItems,
        companyContext,
      );
    }

    try {
      // Prepare work context for the deck
      const workContext = this.prepareWorkContext(
        workItems,
        displayName || username,
        companyContext,
      );

      // Render the deck with work context
      const rendered = this.deck.render({
        model: "gpt-4o-mini", // Fast model for summarization
        context: workContext,
      });

      // Since we don't have LLM execution here, fallback to rule-based for now
      // TODO: Integrate with Bolt Foundry's LLM execution system
      logger.debug(
        "Deck rendered successfully, falling back to rule-based generation",
      );
      return this.generateMemberSummary(
        username,
        displayName,
        workItems,
        companyContext,
      );
    } catch (error) {
      logger.warn(
        "Failed to use deck for AI summary, falling back to rule-based:",
        error,
      );
      return this.generateMemberSummary(
        username,
        displayName,
        workItems,
        companyContext,
      );
    }
  }

  /**
   * Generate a human summary for a team member's work (rule-based fallback)
   */
  generateMemberSummary(
    username: string,
    displayName: string | undefined,
    workItems: Array<WorkItem>,
    companyContext: CompanyContext,
  ): TeamMemberSummary {
    if (workItems.length === 0) {
      return {
        username,
        displayName,
        workSummary: `${displayName || username} had no recent activity.`,
        blogWorthyContent: [],
        significantContributions: [],
        totalPRs: 0,
      };
    }

    const workSummary = this.generateWorkSummary(
      workItems,
      displayName || username,
      companyContext,
    );
    const blogWorthyContent = this.identifyBlogWorthyContent(
      workItems,
      companyContext,
    );
    const significantContributions = this.identifySignificantContributions(
      workItems,
    );

    return {
      username,
      displayName,
      workSummary,
      blogWorthyContent,
      significantContributions,
      totalPRs: workItems.length,
    };
  }

  /**
   * Generate a narrative work summary following deck guidelines
   */
  private generateWorkSummary(
    workItems: Array<WorkItem>,
    name: string,
    companyContext: CompanyContext,
  ): string {
    // Find the main theme/project
    const mainTheme = this.identifyMainTheme(workItems);

    // Find the most significant contribution
    const significantWork = this.findMostSignificantWork(workItems);

    // Check for company connection
    const companyConnection = this.findCompanyConnection(
      workItems,
      companyContext,
    );

    // Generate summary following the deck format: "[Name] worked on [project/area]. They [implemented/fixed/improved] [specific thing] which [company connection if clear]."
    let summary = `${name} worked on ${mainTheme}. `;

    if (significantWork) {
      const action = this.determineAction(significantWork);
      summary += `They ${action} ${significantWork.title.toLowerCase()}`;

      if (companyConnection) {
        summary += ` which ${companyConnection}`;
      }
      summary += ".";
    }

    // Add context about additional work if relevant
    const additionalContext = this.generateAdditionalContext(
      workItems,
      significantWork,
    );
    if (additionalContext) {
      summary += ` ${additionalContext}`;
    }

    return summary;
  }

  /**
   * Identify the main theme or project from work items
   */
  private identifyMainTheme(workItems: Array<WorkItem>): string {
    // Look for common keywords in titles
    const titleWords = workItems.flatMap((item) =>
      item.title.toLowerCase().split(/\s+/).filter((word) => word.length > 3)
    );

    const wordCounts = new Map<string, number>();
    titleWords.forEach((word) => {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    });

    // Find most common meaningful words
    const commonThemes = Array.from(wordCounts.entries())
      .filter(([word, count]) => count > 1 && !this.isStopWord(word))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([word, _]) => word);

    if (commonThemes.length > 0) {
      // Try to make it more readable
      const theme = commonThemes[0];
      if (theme.includes("test")) return "testing and quality assurance";
      if (theme.includes("doc")) return "documentation";
      if (theme.includes("api")) return "API development";
      if (theme.includes("ui") || theme.includes("interface")) {
        return "user interface";
      }
      if (theme.includes("auth")) return "authentication";
      if (theme.includes("deploy") || theme.includes("ci")) {
        return "infrastructure and deployment";
      }
      return `${theme}-related work`;
    }

    // Fallback based on categories
    const categories = workItems.map((item) => item.category);
    const mostCommonCategory = this.getMostCommon(categories);

    switch (mostCommonCategory) {
      case "feature":
        return "new feature development";
      case "bugfix":
        return "bug fixes and maintenance";
      case "refactor":
        return "code refactoring and improvements";
      case "documentation":
        return "documentation";
      case "infrastructure":
        return "infrastructure and tooling";
      case "testing":
        return "testing and quality assurance";
      default:
        return "various development tasks";
    }
  }

  /**
   * Find the most significant piece of work
   */
  private findMostSignificantWork(workItems: Array<WorkItem>): WorkItem | null {
    // Prioritize by impact level and major update flags
    const scored = workItems.map((item) => {
      let score = 0;

      // Impact level scoring
      if (item.impact === "high") score += 10;
      else if (item.impact === "medium") score += 5;
      else score += 1;

      // Major update flags add significance
      score += item.majorUpdateFlags.length * 3;

      // Blog worthiness adds significance
      if (item.blogWorthiness?.isNovel) score += 8;

      // Merged PRs are more significant than open ones
      if (item.mergedAt) score += 2;

      return { item, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.length > 0 ? scored[0].item : null;
  }

  /**
   * Find connection to company goals
   */
  private findCompanyConnection(
    workItems: Array<WorkItem>,
    companyContext: CompanyContext,
  ): string | null {
    // Look for connections in the most significant work
    const significantWork = this.findMostSignificantWork(workItems);
    if (!significantWork) return null;

    const text = `${significantWork.title} ${significantWork.description}`
      .toLowerCase();

    // Check against core capabilities
    for (const capability of companyContext.coreCapabilities) {
      if (text.includes(capability.toLowerCase())) {
        if (capability.includes("reliability")) {
          return "improves system reliability";
        }
        if (
          capability.includes("evaluation") || capability.includes("testing")
        ) return "supports evaluation and testing capabilities";
        if (capability.includes("automation")) {
          return "advances automation capabilities";
        }
        if (capability.includes("analysis")) {
          return "enhances analysis capabilities";
        }
        return `supports ${capability}`;
      }
    }

    // Check against major update flags for user impact
    if (significantWork.majorUpdateFlags.includes("user-experience")) {
      return "improves user experience";
    }
    if (significantWork.majorUpdateFlags.includes("performance")) {
      return "makes the system faster";
    }
    if (significantWork.majorUpdateFlags.includes("security")) {
      return "strengthens security";
    }
    if (significantWork.majorUpdateFlags.includes("infrastructure")) {
      return "improves team efficiency";
    }

    return null;
  }

  /**
   * Determine the right action verb for the work
   */
  private determineAction(workItem: WorkItem): string {
    const title = workItem.title.toLowerCase();

    if (
      title.includes("add") || title.includes("create") ||
      title.includes("implement")
    ) return "built";
    if (title.includes("fix") || title.includes("resolve")) return "fixed";
    if (
      title.includes("improve") || title.includes("optimize") ||
      title.includes("enhance")
    ) return "improved";
    if (title.includes("update") || title.includes("upgrade")) return "updated";
    if (title.includes("refactor") || title.includes("restructure")) {
      return "refactored";
    }
    if (title.includes("remove") || title.includes("delete")) return "removed";

    // Default based on category
    switch (workItem.category) {
      case "feature":
        return "implemented";
      case "bugfix":
        return "fixed";
      case "refactor":
        return "improved";
      default:
        return "worked on";
    }
  }

  /**
   * Generate additional context if there's more to mention
   */
  private generateAdditionalContext(
    workItems: Array<WorkItem>,
    significantWork: WorkItem | null,
  ): string | null {
    if (workItems.length <= 1) return null;

    const otherWork = workItems.filter((item) => item !== significantWork);
    if (otherWork.length === 0) return null;

    // Count meaningful additional work
    const additionalFixes =
      otherWork.filter((item) => item.category === "bugfix").length;
    const additionalFeatures =
      otherWork.filter((item) => item.category === "feature").length;
    const additionalDocs =
      otherWork.filter((item) => item.category === "documentation").length;

    const contexts: Array<string> = [];

    if (additionalFixes > 0) {
      contexts.push(
        `${additionalFixes} bug fix${additionalFixes > 1 ? "es" : ""}`,
      );
    }
    if (additionalFeatures > 0) {
      contexts.push(
        `${additionalFeatures} other feature${
          additionalFeatures > 1 ? "s" : ""
        }`,
      );
    }
    if (additionalDocs > 0) {
      contexts.push("documentation updates");
    }

    if (contexts.length === 0) return null;
    if (contexts.length === 1) return `They also worked on ${contexts[0]}.`;
    if (contexts.length === 2) {
      return `They also worked on ${contexts[0]} and ${contexts[1]}.`;
    }
    return `They also worked on ${contexts.slice(0, -1).join(", ")}, and ${
      contexts[contexts.length - 1]
    }.`;
  }

  /**
   * Identify blog-worthy content
   */
  private identifyBlogWorthyContent(
    workItems: Array<WorkItem>,
    _companyContext: CompanyContext,
  ): Array<string> {
    return workItems
      .filter((item) => item.blogWorthiness?.isNovel)
      .map((item) => {
        const contentType = item.blogWorthiness?.suggestedContentType ||
          "article";
        const reason = item.blogWorthiness?.noveltyReason || "novel approach";

        // Clean up the reason to be more concise like the AI-driven example
        let cleanReason = reason;
        if (reason.includes("Aligns with company differentiator:")) {
          // Extract just the key concept instead of the full differentiator text
          cleanReason = "Innovative approach to core capability";
        } else if (reason.includes("Uses novelty indicator:")) {
          const indicator = reason.split('"')[1] || "optimize";
          cleanReason = `Uses novelty indicator: "${indicator}"`;
        }

        return `#${item.prNumber}: ${item.title} (${contentType} - ${cleanReason})`;
      })
      .slice(0, 3); // Top 3 blog-worthy items
  }

  /**
   * Identify significant contributions beyond blog content
   */
  private identifySignificantContributions(
    workItems: Array<WorkItem>,
  ): Array<string> {
    return workItems
      .filter((item) => {
        // High impact or multiple major update flags
        return item.impact === "high" || item.majorUpdateFlags.length >= 2;
      })
      .map((item) => {
        const flags = item.majorUpdateFlags.length > 0
          ? ` (${item.majorUpdateFlags.join(", ")})`
          : "";
        return `#${item.prNumber}: ${item.title}${flags}`;
      })
      .slice(0, 3); // Top 3 significant contributions
  }

  /**
   * Get most common item in array
   */
  private getMostCommon<T>(items: Array<T>): T | null {
    if (items.length === 0) return null;

    const counts = new Map<T, number>();
    items.forEach((item) => {
      counts.set(item, (counts.get(item) || 0) + 1);
    });

    let maxCount = 0;
    let mostCommon: T | null = null;

    for (const [item, count] of counts.entries()) {
      if (count > maxCount) {
        maxCount = count;
        mostCommon = item;
      }
    }

    return mostCommon;
  }

  /**
   * Check if word should be ignored in theme detection
   */
  private isStopWord(word: string): boolean {
    const stopWords = [
      "the",
      "and",
      "for",
      "with",
      "from",
      "that",
      "this",
      "will",
      "have",
      "been",
      "when",
      "where",
      "what",
      "how",
      "why",
      "they",
      "them",
      "their",
    ];
    return stopWords.includes(word);
  }

  /**
   * Prepare work context for the deck system
   */
  private prepareWorkContext(
    workItems: Array<WorkItem>,
    memberName: string,
    companyContext: CompanyContext,
  ): Record<string, unknown> {
    // Extract key information from work items
    const prTitles = workItems.map((item) => item.title);
    const mainTheme = this.identifyMainTheme(workItems);
    const significantWork = this.findMostSignificantWork(workItems);
    const companyConnection = this.findCompanyConnection(
      workItems,
      companyContext,
    );

    return {
      memberName,
      totalPRs: workItems.length,
      prTitles: prTitles.slice(0, 10), // Limit to top 10 for context
      mainTheme,
      significantWorkTitle: significantWork?.title || "",
      significantWorkDescription: significantWork?.description || "",
      companyConnection: companyConnection || "",
      workCategories: this.categorizeWork(workItems),
      companyGoals: companyContext.differentiators.slice(0, 3), // Top 3 company differentiators
    };
  }

  /**
   * Categorize work items by type
   */
  private categorizeWork(workItems: Array<WorkItem>): Record<string, number> {
    const categories: Record<string, number> = {};
    workItems.forEach((item) => {
      categories[item.category] = (categories[item.category] || 0) + 1;
    });
    return categories;
  }
}
