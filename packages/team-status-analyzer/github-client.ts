/**
 * GitHub API Client
 * Uses GitHub CLI (gh) for authentication, following BFF patterns
 */

import type { GitHubComment, GitHubPR, PRFilter } from "./types.ts";

export class GitHubClient {
  constructor(
    private owner: string,
    private repo: string,
  ) {}

  /**
   * Check GitHub CLI authentication
   */
  async initialize(): Promise<void> {
    const authProcess = new Deno.Command("gh", {
      args: ["auth", "status"],
      stdout: "piped",
      stderr: "piped",
    });

    const { code, stderr } = await authProcess.output();
    if (code !== 0) {
      const errorMessage = new TextDecoder().decode(stderr);
      throw new Error(
        `GitHub CLI not authenticated. ${errorMessage}\n\nTo authenticate, run: gh auth login`,
      );
    }
  }

  /**
   * Make authenticated request using GitHub CLI
   */
  private async request<T>(endpoint: string): Promise<T> {
    const process = new Deno.Command("gh", {
      args: ["api", endpoint],
      stdout: "piped",
      stderr: "piped",
    });

    const { code, stdout, stderr } = await process.output();

    if (code !== 0) {
      const error = new TextDecoder().decode(stderr);
      throw new Error(`GitHub CLI error (${code}): ${error}`);
    }

    const output = new TextDecoder().decode(stdout);
    return JSON.parse(output);
  }

  /**
   * Fetch pull requests with optional filtering
   */
  async fetchPRs(filter: PRFilter = {}): Promise<Array<GitHubPR>> {
    const params = new URLSearchParams({
      state: filter.state || "all",
      sort: "updated",
      direction: "desc",
      per_page: "100", // GitHub API max
    });

    const endpoint = `repos/${this.owner}/${this.repo}/pulls?${params}`;

    const allPRs: Array<GitHubPR> = [];
    let page = 1;

    while (true) {
      const paginatedEndpoint = `${endpoint}&page=${page}`;
      const prs = await this.request<Array<GitHubPR>>(paginatedEndpoint);

      if (prs.length === 0) break;

      // Filter by date if specified
      const filteredPRs = this.filterPRsByDate(prs, filter);
      allPRs.push(...filteredPRs);

      // If we got fewer PRs than requested, we've reached the end
      if (prs.length < 100) break;

      // If all PRs in this batch are older than our filter, stop
      if (filter.since && this.allPRsOlderThan(prs, filter.since)) break;

      page++;
    }

    return allPRs;
  }

  /**
   * Fetch comments for a specific PR
   */
  fetchPRComments(prNumber: number): Promise<Array<GitHubComment>> {
    const endpoint =
      `repos/${this.owner}/${this.repo}/issues/${prNumber}/comments`;
    return this.request<Array<GitHubComment>>(endpoint);
  }

  /**
   * Filter PRs by date range
   */
  private filterPRsByDate(
    prs: Array<GitHubPR>,
    filter: PRFilter,
  ): Array<GitHubPR> {
    return prs.filter((pr) => {
      const updatedAt = new Date(pr.updated_at);

      if (filter.since && updatedAt < filter.since) return false;
      if (filter.until && updatedAt > filter.until) return false;
      if (filter.author && pr.user.login !== filter.author) return false;

      return true;
    });
  }

  /**
   * Check if all PRs in a batch are older than the since date
   */
  private allPRsOlderThan(prs: Array<GitHubPR>, since: Date): boolean {
    return prs.every((pr) => new Date(pr.updated_at) < since);
  }

  /**
   * Get repository information
   */
  getRepoInfo() {
    const endpoint = `repos/${this.owner}/${this.repo}`;
    return this.request(endpoint);
  }

  /**
   * Test API connection and permissions
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.getRepoInfo();
      return true;
    } catch (_error) {
      // GitHub API connection test failed (error logged elsewhere)
      return false;
    }
  }
}
