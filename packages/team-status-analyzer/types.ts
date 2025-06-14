/**
 * Team Status Analyzer Types
 * Core TypeScript interfaces for GitHub PR analysis and team status generation
 */

// GitHub API types
export interface GitHubPR {
  number: number;
  title: string;
  body: string | null;
  user: {
    login: string;
  };
  created_at: string;
  updated_at: string;
  merged_at: string | null;
  state: "open" | "closed";
  draft: boolean;
  labels: Array<{
    name: string;
    color: string;
  }>;
  head: {
    sha: string;
  };
  base: {
    ref: string;
  };
}

export interface GitHubComment {
  body: string;
  user: {
    login: string;
  };
  created_at: string;
}

// Analysis types
export interface WorkItem {
  prNumber: number;
  title: string;
  description: string;
  category: WorkCategory;
  impact: ImpactLevel;
  author: string;
  createdAt: Date;
  mergedAt: Date | null;
  nextSteps: Array<string>;
  externalRelevance: string | null;
  majorUpdateFlags: Array<MajorUpdateFlag>;
  blogWorthiness: BlogWorthiness | null;
}

export interface TeamMemberActivity {
  username: string;
  displayName?: string;
  currentFocus: string;
  recentWork: Array<WorkItem>;
  nextSteps: Array<string>;
  externalImpact: Array<string>;
  totalPRs: number;
}

export interface TeamStatus {
  generatedAt: Date;
  periodStart: Date;
  periodEnd: Date;
  totalPRsAnalyzed: number;
  teamMembers: Array<TeamMemberActivity>;
  workCategorySummary: Record<WorkCategory, number>;
  upcomingPriorities: Array<string>;
  blogWorthyHighlights: Array<string>;
  majorUpdatesOverview: Array<string>;
}

export type WorkCategory =
  | "feature"
  | "bugfix"
  | "refactor"
  | "documentation"
  | "infrastructure"
  | "testing"
  | "other";

export type ImpactLevel =
  | "high" // Major features, breaking changes, customer-facing
  | "medium" // Important improvements, significant fixes
  | "low"; // Minor fixes, internal improvements

// Major update detection types
export type MajorUpdateFlag =
  | "core-functionality" // Changes to core product functionality
  | "breaking-change" // Breaking changes or significant refactors
  | "performance" // Performance improvements
  | "security" // Security fixes
  | "user-experience" // Changes that affect user experience
  | "infrastructure" // Infrastructure changes
  | "integration" // New integrations or dependencies
  | "api-change"; // API modifications

export interface BlogWorthiness {
  isNovel: boolean;
  noveltyReason: string | null;
  companyAlignment: string | null;
  suggestedContentType:
    | "explainer"
    | "case-study"
    | "feature-announcement"
    | "technical-deep-dive"
    | null;
}

// Company context types
export interface CompanyContext {
  vision: string;
  strategy: string;
  productRoadmap: string;
  technicalPhilosophy: string;
  coreCapabilities: Array<string>;
  differentiators: Array<string>;
  lastUpdated: Date;
}

export interface DocumentSource {
  path: string;
  content: string;
  lastModified: Date;
  type: "vision" | "strategy" | "roadmap" | "philosophy" | "guide" | "other";
}

// Configuration types
export interface AnalyzerConfig {
  repositoryOwner: string;
  repositoryName: string;
  teamMembers: Record<string, string>; // username -> display name
  workCategoryKeywords: Record<WorkCategory, Array<string>>;
  externalImpactKeywords: Array<string>;
  majorUpdateKeywords: Record<MajorUpdateFlag, Array<string>>;
  lastCheckTimestamp?: Date;
}

// Utility types
export interface TimestampTracker {
  setLastCheck(timestamp: Date): Promise<void>;
  getLastCheck(): Promise<Date | null>;
}

export interface PRFilter {
  since?: Date;
  until?: Date;
  author?: string;
  state?: "open" | "closed" | "all";
  includeComments?: boolean;
}
