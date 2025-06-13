/**
 * Document Archiver
 * Handles saving and backing up team status documents with dated versions
 */

import { getLogger } from "packages/logger/logger.ts";
import type { TeamStatus } from "packages/team-status-analyzer/types.ts";

const logger = getLogger(import.meta);

export class DocumentArchiver {
  constructor(private baseDir: string = "/home/runner/workspace/memos/team") {}

  /**
   * Save team status document and create dated backup
   */
  async saveTeamStatus(content: string, status: TeamStatus): Promise<void> {
    // Ensure directory exists
    await this.ensureDirectoryExists();

    // Save current status
    const currentPath = `${this.baseDir}/team-status.md`;
    await Deno.writeTextFile(currentPath, content);

    // Create dated backup
    const dateSuffix = this.formatDateForFilename(status.generatedAt);
    const backupPath = `${this.baseDir}/${dateSuffix}-status.md`;
    await Deno.writeTextFile(backupPath, content);

    // Clean up old backups (keep last 30 days)
    await this.cleanupOldBackups();
  }

  /**
   * Get the current team status document
   */
  async getCurrentStatus(): Promise<string | null> {
    try {
      const currentPath = `${this.baseDir}/team-status.md`;
      return await Deno.readTextFile(currentPath);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        return null;
      }
      throw error;
    }
  }

  /**
   * List all archived status files
   */
  async listArchivedStatuses(): Promise<Array<string>> {
    try {
      const files: Array<string> = [];
      for await (const entry of Deno.readDir(this.baseDir)) {
        if (
          entry.isFile && entry.name.endsWith("-status.md") &&
          entry.name !== "team-status.md"
        ) {
          files.push(entry.name);
        }
      }
      return files.sort().reverse(); // Most recent first
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        return [];
      }
      throw error;
    }
  }

  /**
   * Get an archived status document by date
   */
  async getArchivedStatus(date: string): Promise<string | null> {
    try {
      const filename = date.endsWith("-status.md") ? date : `${date}-status.md`;
      const filePath = `${this.baseDir}/${filename}`;
      return await Deno.readTextFile(filePath);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Compare current status with previous version
   */
  async compareWithPrevious(): Promise<{
    current: string | null;
    previous: string | null;
    hasChanges: boolean;
  }> {
    const current = await this.getCurrentStatus();
    const archived = await this.listArchivedStatuses();
    const previous = archived.length > 0
      ? await this.getArchivedStatus(archived[0])
      : null;

    return {
      current,
      previous,
      hasChanges: current !== previous,
    };
  }

  /**
   * Ensure the team directory exists
   */
  private async ensureDirectoryExists(): Promise<void> {
    try {
      await Deno.mkdir(this.baseDir, { recursive: true });
    } catch (error) {
      if (!(error instanceof Deno.errors.AlreadyExists)) {
        throw error;
      }
    }
  }

  /**
   * Format date for filename (YYYY-MM-DD format)
   */
  private formatDateForFilename(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  /**
   * Clean up old backup files (keep last 30 days)
   */
  private async cleanupOldBackups(): Promise<void> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 30);
      const cutoffString = this.formatDateForFilename(cutoffDate);

      for await (const entry of Deno.readDir(this.baseDir)) {
        if (!entry.isFile || !entry.name.endsWith("-status.md")) continue;
        if (entry.name === "team-status.md") continue;

        // Extract date from filename (YYYY-MM-DD-status.md)
        const dateMatch = entry.name.match(/^(\d{4}-\d{2}-\d{2})-status\.md$/);
        if (!dateMatch) continue;

        const fileDate = dateMatch[1];
        if (fileDate < cutoffString) {
          const filePath = `${this.baseDir}/${entry.name}`;
          await Deno.remove(filePath);
        }
      }
    } catch (error) {
      // Non-critical error, log but don't fail
      logger.warn("Failed to cleanup old backups:", error);
    }
  }

  /**
   * Export team status data as JSON for external processing
   */
  async exportStatusAsJSON(status: TeamStatus): Promise<void> {
    const dateSuffix = this.formatDateForFilename(status.generatedAt);
    const jsonPath = `${this.baseDir}/${dateSuffix}-status.json`;

    const exportData = {
      ...status,
      exportedAt: new Date().toISOString(),
      version: "1.0",
    };

    await Deno.writeTextFile(jsonPath, JSON.stringify(exportData, null, 2));
  }

  /**
   * Get statistics about archived documents
   */
  async getArchiveStatistics(): Promise<{
    totalFiles: number;
    oldestFile: string | null;
    newestFile: string | null;
    totalSizeBytes: number;
  }> {
    const files = await this.listArchivedStatuses();
    let totalSize = 0;

    // Calculate total size
    for (const file of files) {
      try {
        const filePath = `${this.baseDir}/${file}`;
        const stat = await Deno.stat(filePath);
        totalSize += stat.size;
      } catch {
        // Skip files that can't be read
      }
    }

    return {
      totalFiles: files.length,
      oldestFile: files.length > 0 ? files[files.length - 1] : null,
      newestFile: files.length > 0 ? files[0] : null,
      totalSizeBytes: totalSize,
    };
  }
}
