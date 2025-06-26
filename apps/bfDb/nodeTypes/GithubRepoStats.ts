import { GraphQLNode } from "@bfmono/apps/bfDb/classes/GraphQLNode.ts";
import { getLogger } from "@bolt-foundry/logger";

/**
 * GithubRepoStats node for querying GitHub repository statistics.
 * Caches star count and refreshes every 2 minutes.
 */
const logger = getLogger("GithubRepoStats");

export class GithubRepoStats extends GraphQLNode {
  private static _instance: GithubRepoStats | null = null;
  private static _stars: number = 0;
  private static _lastFetch: number = 0;
  private static _fetching: boolean = false;
  private static readonly CACHE_DURATION = 120_000; // 2 minutes in milliseconds
  private static readonly REPO_OWNER = "bolt-foundry";
  private static readonly REPO_NAME = "bolt-foundry";

  constructor() {
    super();
  }

  /**
   * Required id field from the Node interface.
   */
  override get id(): string {
    return `github-repo-stats-${GithubRepoStats.REPO_OWNER}-${GithubRepoStats.REPO_NAME}`;
  }

  /**
   * Number of GitHub stars for the repository.
   */
  get stars(): number {
    // Trigger background refresh if cache is stale
    const now = Date.now();
    if (
      now - GithubRepoStats._lastFetch > GithubRepoStats.CACHE_DURATION &&
      !GithubRepoStats._fetching
    ) {
      GithubRepoStats.fetchStars();
    }
    return GithubRepoStats._stars;
  }

  /**
   * Fetch star count from GitHub API in the background.
   */
  private static async fetchStars(): Promise<void> {
    if (GithubRepoStats._fetching) return;

    GithubRepoStats._fetching = true;

    try {
      const response = await fetch(
        `https://api.github.com/repos/${this.REPO_OWNER}/${this.REPO_NAME}`,
        {
          headers: {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "BoltFoundry-GraphQL",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        GithubRepoStats._stars = data.stargazers_count || 0;
        GithubRepoStats._lastFetch = Date.now();
      }
    } catch (error) {
      // Silently fail and keep using cached value
      logger.error("Failed to fetch GitHub stars:", error);
    } finally {
      GithubRepoStats._fetching = false;
    }
  }

  /**
   * Find the singleton instance of GithubRepoStats.
   */
  static override async findX(): Promise<GithubRepoStats> {
    if (!GithubRepoStats._instance) {
      GithubRepoStats._instance = new GithubRepoStats();

      // Fetch initial data if we don't have any
      if (GithubRepoStats._lastFetch === 0) {
        await GithubRepoStats.fetchStars();
      }
    }

    return GithubRepoStats._instance;
  }

  /**
   * GraphQL specification extending the Node interface with stars field.
   */
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .nonNull.id("id")
      .nonNull.int("stars")
  );
}
