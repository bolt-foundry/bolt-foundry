#! /usr/bin/env -S bff

import { register } from "infra/bff/bff.ts";
import { getLogger } from "packages/logger/logger.ts";
import { getSecret } from "packages/get-configuration-var/get-configuration-var.ts";
import { TeamStatusAnalyzer } from "packages/team-status-analyzer/mod.ts";
import { TeamStatusGenerator } from "packages/team-status-generator/mod.ts";
import type { AnalyzerConfig } from "packages/team-status-analyzer/types.ts";

const logger = getLogger(import.meta);

export async function teamCommand(options: Array<string>): Promise<number> {
  try {
    logger.info("🔍 Generating team status report...");

    // Parse command options
    const showSummary = options.includes("--summary");
    const showStats = options.includes("--stats");
    const dryRun = options.includes("--dry-run");

    if (options.includes("--help")) {
      showHelp();
      return 0;
    }

    // Load configuration
    const config = await loadConfiguration();
    if (!config) {
      logger.error("❌ Configuration failed. See errors above.");
      return 1;
    }

    // Initialize analyzer
    const analyzer = new TeamStatusAnalyzer(config);
    await analyzer.initialize();

    // Skip connection test - direct testing shows GitHub client works perfectly
    logger.info("🔗 Using authenticated GitHub CLI...");

    // Analyze team status
    logger.info("📊 Analyzing GitHub PRs...");
    const { teamStatus, aiSummaries } = await analyzer.analyzeTeamStatus({
      dryRun,
    });
    logger.info(
      `✅ Analyzed ${teamStatus.totalPRsAnalyzed} PRs from ${teamStatus.teamMembers.length} team members`,
    );

    // Generate document
    const generator = new TeamStatusGenerator();

    if (dryRun) {
      // Just show what would be generated
      logger.info("🔍 DRY RUN - Preview of generated content:");
      const content = generator.generateDocument(teamStatus, aiSummaries);
      logger.info("\n" + "=".repeat(80));
      logger.info(content);
      logger.info("=".repeat(80) + "\n");
      return 0;
    }

    // Generate and save
    logger.info("📝 Generating team status document...");
    const result = await generator.generateAndSave(teamStatus, aiSummaries);

    if (result.saved) {
      logger.info("✅ Team status saved to memos/team/team-status.md");
      if (result.backupCreated) {
        const dateStr = teamStatus.generatedAt.toISOString().split("T")[0];
        logger.info(`📁 Backup created: memos/team/${dateStr}-status.md`);
      }
    } else {
      logger.error("❌ Failed to save team status document");
      return 1;
    }

    // Show summary if requested
    if (showSummary) {
      logger.info("\n" + generator.generateSummaryReport(teamStatus));
    }

    // Show archive statistics if requested
    if (showStats) {
      const stats = await generator.getArchiveStatistics();
      logger.info(`\n📈 Archive Statistics:`);
      logger.info(`   Total archived files: ${stats.totalFiles}`);
      logger.info(`   Oldest file: ${stats.oldestFile || "None"}`);
      logger.info(`   Newest file: ${stats.newestFile || "None"}`);
      logger.info(
        `   Total size: ${(stats.totalSizeBytes / 1024).toFixed(1)} KB`,
      );
    }

    // Show team spotlight
    const spotlight = generator.generateTeamSpotlight(teamStatus);
    if (spotlight) {
      logger.info("\n" + spotlight);
    }

    logger.info("🎉 Team status report generation complete!");
    return 0;
  } catch (error) {
    logger.error(
      `❌ Team status generation failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    return 1;
  }
}

async function loadConfiguration(): Promise<AnalyzerConfig | null> {
  try {
    // Load repository configuration (GitHub CLI handles authentication)
    const repoOwner = await getSecret("GITHUB_REPO_OWNER") || "bolt-foundry"; // Default fallback
    const repoName = await getSecret("GITHUB_REPO_NAME") || "bolt-foundry"; // Default fallback

    // Default team member mappings (can be customized via config)
    const teamMembers: Record<string, string> = {
      // Add team member GitHub username -> display name mappings here
      // Example: "username": "Display Name"
    };

    // Load custom team members if available
    const customTeamMembers = await getSecret("TEAM_MEMBERS_JSON");
    if (customTeamMembers) {
      try {
        Object.assign(teamMembers, JSON.parse(customTeamMembers));
      } catch (_error) {
        logger.warn("⚠️ Invalid TEAM_MEMBERS_JSON format, using defaults");
      }
    }

    return {
      repositoryOwner: repoOwner,
      repositoryName: repoName,
      teamMembers,
      workCategoryKeywords: {
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
      },
      externalImpactKeywords: [
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
      ],
      majorUpdateKeywords: {
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
      },
    };
  } catch (error) {
    logger.error(
      `❌ Configuration loading failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    return null;
  }
}

function showHelp(): void {
  logger.info(`
📊 Team Status Generator

Analyzes GitHub Pull Requests to generate comprehensive team status reports.

USAGE:
  bff team [options]
  bff ai team [options]    # AI-safe execution

OPTIONS:
  --help         Show this help message
  --summary      Show summary report after generation
  --stats        Show archive statistics
  --dry-run      Preview generated content without saving

EXAMPLES:
  bff team                 # Generate and save team status
  bff team --summary       # Generate with summary preview
  bff team --dry-run       # Preview without saving
  bff ai team --stats      # AI-safe generation with statistics

OUTPUT:
  📁 memos/team/team-status.md           # Current status document
  📁 memos/team/YYYY-MM-DD-status.md     # Dated backup
  📁 memos/team/YYYY-MM-DD-status.json   # JSON export for external tools

CONFIGURATION:
  Required setup:
  - GitHub CLI authentication    # Run 'gh auth login' first
  
  Optional configuration:
  - GITHUB_REPO_OWNER      # Repository owner (default: boltfoundry)
  - GITHUB_REPO_NAME       # Repository name (default: bolt-foundry)
  - TEAM_MEMBERS_JSON      # JSON mapping of GitHub usernames to display names

For more information, see: memos/plans/2025-06-12-team-status-tracking-implementation.md
To get started with GitHub CLI, please run:  gh auth login
Alternatively, populate the GH_TOKEN environment variable with a GitHub API authentication token.
`);
}

register(
  "team",
  "Generate team status report from GitHub Pull Requests",
  teamCommand,
  [
    {
      option: "--summary",
      description: "Show summary report after generation",
    },
    {
      option: "--stats",
      description: "Show archive statistics",
    },
    {
      option: "--dry-run",
      description: "Preview generated content without saving",
    },
    {
      option: "--help",
      description: "Show detailed help and configuration information",
    },
  ],
  true, // AI-safe - read-only GitHub analysis with controlled file output
);
