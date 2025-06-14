/**
 * Timestamp Tracker
 * Manages last check timestamps for incremental PR analysis
 */

import type { TimestampTracker } from "./types.ts";

export class FileTimestampTracker implements TimestampTracker {
  constructor(private filePath: string) {}

  /**
   * Get the last check timestamp from file
   */
  async getLastCheck(): Promise<Date | null> {
    try {
      const content = await Deno.readTextFile(this.filePath);
      const timestamp = content.trim();
      return timestamp ? new Date(timestamp) : null;
    } catch (error) {
      // File doesn't exist or can't be read - first run
      if (error instanceof Deno.errors.NotFound) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Set the last check timestamp to file
   */
  async setLastCheck(timestamp: Date): Promise<void> {
    // Ensure directory exists
    const dir = this.filePath.substring(0, this.filePath.lastIndexOf("/"));
    try {
      await Deno.mkdir(dir, { recursive: true });
    } catch (error) {
      // Directory might already exist
      if (!(error instanceof Deno.errors.AlreadyExists)) {
        throw error;
      }
    }

    await Deno.writeTextFile(this.filePath, timestamp.toISOString());
  }
}

/**
 * Create default timestamp tracker for team status
 */
export function createDefaultTimestampTracker(): TimestampTracker {
  return new FileTimestampTracker(
    "/home/runner/workspace/memos/team/.last-check-timestamp",
  );
}
