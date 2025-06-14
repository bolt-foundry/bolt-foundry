/**
 * PR Parser
 * Extracts meaningful information from GitHub PRs for team status analysis
 */

import type {
  BlogWorthiness,
  CompanyContext,
  GitHubComment,
  GitHubPR,
  ImpactLevel,
  MajorUpdateFlag,
  WorkCategory,
  WorkItem,
} from "./types.ts";

export class PRParser {
  private workCategoryKeywords: Record<WorkCategory, Array<string>> = {
    feature: ["add", "implement", "create", "new", "feature", "support"],
    bugfix: ["fix", "bug", "issue", "resolve", "patch", "repair"],
    refactor: [
      "refactor",
      "clean",
      "simplify",
      "optimize",
      "restructure",
      "improve",
    ],
    documentation: [
      "doc",
      "readme",
      "comment",
      "guide",
      "explain",
      "documentation",
    ],
    infrastructure: [
      "build",
      "ci",
      "deploy",
      "config",
      "setup",
      "infra",
      "devops",
    ],
    testing: ["test", "spec", "e2e", "unit", "integration", "coverage"],
    other: [],
  };

  private externalImpactKeywords = [
    "user",
    "customer",
    "client",
    "public",
    "api",
    "interface",
    "ui",
    "ux",
    "performance",
    "security",
    "breaking",
    "migration",
    "release",
    "launch",
    "marketing",
    "sales",
    "demo",
    "showcase",
    "feature",
    "product",
  ];

  private majorUpdateKeywords: Record<MajorUpdateFlag, Array<string>> = {
    "core-functionality": [
      "core",
      "main",
      "primary",
      "central",
      "fundamental",
      "key",
      "essential",
      "critical",
      "important",
      "major",
      "significant",
      "substantial",
    ],
    "breaking-change": [
      "breaking",
      "break",
      "incompatible",
      "migration",
      "deprecated",
      "remove",
      "refactor",
      "restructure",
      "rewrite",
      "rework",
      "overhaul",
    ],
    "performance": [
      "performance",
      "speed",
      "fast",
      "slow",
      "optimize",
      "optimization",
      "efficient",
      "memory",
      "cpu",
      "latency",
      "throughput",
      "benchmark",
    ],
    "security": [
      "security",
      "secure",
      "vulnerability",
      "exploit",
      "auth",
      "authentication",
      "authorization",
      "permission",
      "access",
      "token",
      "encryption",
      "ssl",
      "tls",
    ],
    "user-experience": [
      "user",
      "ui",
      "ux",
      "interface",
      "experience",
      "usability",
      "design",
      "frontend",
      "client",
      "dashboard",
      "form",
      "button",
      "layout",
      "responsive",
    ],
    "infrastructure": [
      "infrastructure",
      "deploy",
      "deployment",
      "ci",
      "cd",
      "docker",
      "kubernetes",
      "server",
      "database",
      "redis",
      "postgres",
      "monitoring",
      "logging",
      "metrics",
    ],
    "integration": [
      "integration",
      "integrate",
      "api",
      "webhook",
      "external",
      "third-party",
      "service",
      "dependency",
      "library",
      "package",
      "import",
      "connect",
    ],
    "api-change": [
      "api",
      "endpoint",
      "route",
      "graphql",
      "rest",
      "response",
      "request",
      "schema",
      "interface",
      "contract",
      "specification",
      "openapi",
    ],
  };

  /**
   * Parse a GitHub PR into a WorkItem
   */
  parseWorkItem(
    pr: GitHubPR,
    comments?: Array<GitHubComment>,
    companyContext?: CompanyContext,
  ): WorkItem {
    const title = pr.title;
    const description = this.extractDescription(pr.body || "");
    const category = this.categorizeWork(title, description);
    const impact = this.assessImpact(pr, title, description);
    const nextSteps = this.extractNextSteps(pr.body || "", comments);
    const externalRelevance = this.assessExternalRelevance(title, description);
    const majorUpdateFlags = this.detectMajorUpdates(title, description, pr);
    const blogWorthiness = companyContext
      ? this.assessBlogWorthiness(
        title,
        description,
        companyContext,
        majorUpdateFlags,
      )
      : null;

    return {
      prNumber: pr.number,
      title,
      description,
      category,
      impact,
      author: pr.user.login,
      createdAt: new Date(pr.created_at),
      mergedAt: pr.merged_at ? new Date(pr.merged_at) : null,
      nextSteps,
      externalRelevance,
      majorUpdateFlags,
      blogWorthiness,
    };
  }

  /**
   * Extract clean description from PR body
   */
  private extractDescription(body: string): string {
    if (!body) return "";

    // Remove common PR template sections and markdown
    const cleanBody = body
      .split("\n")
      .filter((line) => {
        const lower = line.toLowerCase().trim();
        return !lower.startsWith("##") &&
          !lower.startsWith("###") &&
          !lower.includes("checklist") &&
          !lower.includes("test plan") &&
          !lower.includes("related") &&
          !lower.startsWith("- [");
      })
      .join(" ")
      .replace(/\*\*/g, "") // Remove bold markdown
      .replace(/\*/g, "") // Remove italic markdown
      .replace(/`/g, "") // Remove code markdown
      .trim();

    // Take first meaningful sentence or paragraph
    const sentences = cleanBody.split(/[.!?]+/);
    return sentences[0]?.trim() || "";
  }

  /**
   * Categorize work based on title and description
   */
  private categorizeWork(title: string, description: string): WorkCategory {
    const text = `${title} ${description}`.toLowerCase();

    for (
      const [category, keywords] of Object.entries(this.workCategoryKeywords)
    ) {
      if (category === "other") continue;

      if (keywords.some((keyword) => text.includes(keyword))) {
        return category as WorkCategory;
      }
    }

    return "other";
  }

  /**
   * Assess impact level of the work
   */
  private assessImpact(
    pr: GitHubPR,
    title: string,
    description: string,
  ): ImpactLevel {
    const text = `${title} ${description}`.toLowerCase();
    const labels = pr.labels.map((l) => l.name.toLowerCase());

    // High impact indicators
    const highImpactKeywords = [
      "breaking",
      "major",
      "critical",
      "security",
      "performance",
      "migration",
      "release",
      "launch",
      "api",
      "public",
    ];

    if (
      highImpactKeywords.some((keyword) => text.includes(keyword)) ||
      labels.some((label) => ["critical", "major", "breaking"].includes(label))
    ) {
      return "high";
    }

    // Low impact indicators
    const lowImpactKeywords = [
      "typo",
      "comment",
      "docs",
      "readme",
      "minor",
      "cleanup",
      "lint",
    ];

    if (
      lowImpactKeywords.some((keyword) => text.includes(keyword)) ||
      labels.some((label) => ["minor", "docs", "cleanup"].includes(label))
    ) {
      return "low";
    }

    return "medium";
  }

  /**
   * Extract next steps from PR body and comments
   */
  private extractNextSteps(
    body: string,
    comments?: Array<GitHubComment>,
  ): Array<string> {
    const nextSteps: Array<string> = [];

    // Look for TODO, FIXME, Next steps in PR body
    const todoPattern = /(?:TODO|FIXME|Next steps?|Follow up):?\s*([^\n]+)/gi;
    let match;
    while ((match = todoPattern.exec(body)) !== null) {
      nextSteps.push(match[1].trim());
    }

    // Look for checkbox items that might be next steps
    const checkboxPattern = /- \[ \]\s*([^\n]+)/g;
    while ((match = checkboxPattern.exec(body)) !== null) {
      const item = match[1].trim();
      if (
        !item.toLowerCase().includes("test") &&
        !item.toLowerCase().includes("review")
      ) {
        nextSteps.push(item);
      }
    }

    // Extract from recent comments if available
    if (comments && comments.length > 0) {
      const recentComments = comments.slice(-3); // Last 3 comments
      for (const comment of recentComments) {
        const commentTodos = this.extractNextSteps(comment.body);
        nextSteps.push(...commentTodos);
      }
    }

    return [...new Set(nextSteps)]; // Remove duplicates
  }

  /**
   * Assess relevance to external communication (sales/marketing)
   */
  private assessExternalRelevance(
    title: string,
    description: string,
  ): string | null {
    const text = `${title} ${description}`.toLowerCase();

    const relevantKeywords = this.externalImpactKeywords.filter((keyword) =>
      text.includes(keyword)
    );

    if (relevantKeywords.length === 0) return null;

    // Generate relevance description
    if (
      relevantKeywords.some((k) => ["user", "customer", "client"].includes(k))
    ) {
      return "Direct customer-facing improvement";
    }

    if (
      relevantKeywords.some((k) => ["api", "interface", "public"].includes(k))
    ) {
      return "Public API or interface change";
    }

    if (relevantKeywords.some((k) => ["performance", "security"].includes(k))) {
      return "Performance or security enhancement";
    }

    if (relevantKeywords.some((k) => ["feature", "product"].includes(k))) {
      return "New product feature or capability";
    }

    return "Potentially relevant for external communication";
  }

  /**
   * Update category keywords (for customization)
   */
  updateCategoryKeywords(
    keywords: Partial<Record<WorkCategory, Array<string>>>,
  ): void {
    Object.assign(this.workCategoryKeywords, keywords);
  }

  /**
   * Detect major updates in PR
   */
  private detectMajorUpdates(
    title: string,
    description: string,
    pr: GitHubPR,
  ): Array<MajorUpdateFlag> {
    const text = `${title} ${description}`.toLowerCase();
    const labels = pr.labels.map((l) => l.name.toLowerCase());
    const flags: Array<MajorUpdateFlag> = [];

    for (const [flag, keywords] of Object.entries(this.majorUpdateKeywords)) {
      // Check text content
      if (keywords.some((keyword) => text.includes(keyword))) {
        flags.push(flag as MajorUpdateFlag);
        continue;
      }

      // Check labels
      if (
        labels.some((label) =>
          keywords.some((keyword) => label.includes(keyword))
        )
      ) {
        flags.push(flag as MajorUpdateFlag);
        continue;
      }

      // Special case for breaking changes
      if (flag === "breaking-change") {
        if (
          labels.includes("breaking") || labels.includes("major") ||
          text.includes("breaking change") ||
          text.includes("migration required")
        ) {
          flags.push("breaking-change");
        }
      }

      // Special case for performance (look for numbers/percentages)
      if (flag === "performance") {
        const perfIndicators = [
          /\d+%\s*(faster|slower|improvement)/,
          /\d+x\s*(faster|slower)/,
          /reduce.*\d+%/,
          /improve.*\d+%/,
          /\d+ms/,
          /\d+s\s*(faster|slower)/,
        ];
        if (perfIndicators.some((pattern) => pattern.test(text))) {
          flags.push("performance");
        }
      }
    }

    return flags;
  }

  /**
   * Assess blog worthiness using company context
   */
  private assessBlogWorthiness(
    title: string,
    description: string,
    companyContext: CompanyContext,
    majorFlags: Array<MajorUpdateFlag>,
  ): BlogWorthiness {
    const text = `${title} ${description}`.toLowerCase();

    // Check for novelty against company context
    const noveltyAssessment = this.assessNovelty(text, companyContext);
    const alignmentAssessment = this.assessCompanyAlignment(
      text,
      companyContext,
    );
    const contentType = this.suggestContentType(
      majorFlags,
      noveltyAssessment.isNovel,
    );

    return {
      isNovel: noveltyAssessment.isNovel,
      noveltyReason: noveltyAssessment.reason,
      companyAlignment: alignmentAssessment,
      suggestedContentType: contentType,
    };
  }

  /**
   * Assess if work represents novel approach
   */
  private assessNovelty(
    text: string,
    companyContext: CompanyContext,
  ): { isNovel: boolean; reason: string | null } {
    const noveltyIndicators = [
      "novel",
      "new approach",
      "innovative",
      "first time",
      "unique",
      "different from",
      "unlike",
      "alternative to",
      "custom",
      "proprietary",
    ];

    // Check for explicit novelty claims
    for (const indicator of noveltyIndicators) {
      if (text.includes(indicator)) {
        return {
          isNovel: true,
          reason: `Uses novelty indicator: "${indicator}"`,
        };
      }
    }

    // Check if it relates to core capabilities in a new way
    for (const capability of companyContext.coreCapabilities) {
      if (text.includes(capability.toLowerCase())) {
        // Look for innovation keywords near the capability
        const capabilityContext = this.extractContextAroundKeyword(
          text,
          capability.toLowerCase(),
          50,
        );
        const innovationKeywords = [
          "improve",
          "enhance",
          "optimize",
          "revolutionize",
          "transform",
        ];

        if (
          innovationKeywords.some((keyword) =>
            capabilityContext.includes(keyword)
          )
        ) {
          return {
            isNovel: true,
            reason: `Innovative approach to core capability: ${capability}`,
          };
        }
      }
    }

    // Check if it aligns with differentiators
    for (const differentiator of companyContext.differentiators) {
      const diffWords = differentiator.toLowerCase().split(" ");
      if (diffWords.some((word) => word.length > 4 && text.includes(word))) {
        return {
          isNovel: true,
          reason: `Aligns with company differentiator: ${
            differentiator.substring(0, 100)
          }...`,
        };
      }
    }

    return { isNovel: false, reason: null };
  }

  /**
   * Assess alignment with company strategy
   */
  private assessCompanyAlignment(
    text: string,
    companyContext: CompanyContext,
  ): string | null {
    const allContext =
      `${companyContext.vision} ${companyContext.strategy} ${companyContext.technicalPhilosophy}`
        .toLowerCase();

    // Extract key themes from company context
    const themeKeywords = this.extractKeyThemes(allContext);

    for (const theme of themeKeywords) {
      if (text.includes(theme) && theme.length > 4) {
        return `Aligns with company focus on ${theme}`;
      }
    }

    // Check specific alignment patterns
    if (
      companyContext.vision.toLowerCase().includes("reliability") &&
      (text.includes("reliable") || text.includes("reliability"))
    ) {
      return "Directly supports company vision of reliability";
    }

    if (
      companyContext.technicalPhilosophy.toLowerCase().includes("evaluation") &&
      (text.includes("eval") || text.includes("test") ||
        text.includes("measure"))
    ) {
      return "Supports technical philosophy around evaluation";
    }

    return null;
  }

  /**
   * Suggest content type based on analysis
   */
  private suggestContentType(
    majorFlags: Array<MajorUpdateFlag>,
    isNovel: boolean,
  ): BlogWorthiness["suggestedContentType"] {
    if (!isNovel && majorFlags.length === 0) {
      return null; // Not blog-worthy
    }

    // Novel approaches are good for explainers
    if (isNovel) {
      if (
        majorFlags.includes("core-functionality") ||
        majorFlags.includes("breaking-change")
      ) {
        return "technical-deep-dive";
      }
      return "explainer";
    }

    // Major features without novelty
    if (
      majorFlags.includes("core-functionality") ||
      majorFlags.includes("user-experience")
    ) {
      return "feature-announcement";
    }

    // Performance improvements
    if (majorFlags.includes("performance")) {
      return "case-study";
    }

    return "feature-announcement";
  }

  /**
   * Extract context around a keyword
   */
  private extractContextAroundKeyword(
    text: string,
    keyword: string,
    windowSize: number,
  ): string {
    const index = text.indexOf(keyword);
    if (index === -1) return "";

    const start = Math.max(0, index - windowSize);
    const end = Math.min(text.length, index + keyword.length + windowSize);

    return text.substring(start, end);
  }

  /**
   * Extract key themes from company context
   */
  private extractKeyThemes(text: string): Array<string> {
    const words = text.split(/\s+/);
    const wordCounts = new Map<string, number>();

    // Count significant words
    for (const word of words) {
      const clean = word.replace(/[^a-z]/g, "");
      if (clean.length > 4 && !this.isStopWord(clean)) {
        wordCounts.set(clean, (wordCounts.get(clean) || 0) + 1);
      }
    }

    // Return most frequent themes
    return Array.from(wordCounts.entries())
      .filter(([_, count]) => count > 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([word, _]) => word);
  }

  /**
   * Check if word is a stop word
   */
  private isStopWord(word: string): boolean {
    const stopWords = [
      "that",
      "with",
      "have",
      "this",
      "will",
      "from",
      "they",
      "know",
      "want",
      "been",
      "good",
      "much",
      "some",
      "time",
      "very",
      "when",
      "come",
      "here",
      "just",
      "like",
      "long",
      "make",
      "many",
      "over",
      "such",
      "take",
      "than",
      "them",
      "well",
      "work",
    ];
    return stopWords.includes(word);
  }

  /**
   * Update external impact keywords (for customization)
   */
  updateExternalImpactKeywords(keywords: Array<string>): void {
    this.externalImpactKeywords = keywords;
  }

  /**
   * Update major update keywords (for customization)
   */
  updateMajorUpdateKeywords(
    keywords: Partial<Record<MajorUpdateFlag, Array<string>>>,
  ): void {
    Object.assign(this.majorUpdateKeywords, keywords);
  }
}
