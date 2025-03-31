// In apps/bfDb/utils/pathUtils.ts

import { type BfGid, toBfGid } from "apps/bfDb/classes/BfNodeIds.ts";

/**
 * Converts a file path to a BfGid with file:// scheme
 * Automatically handles relative paths by converting to absolute
 */
export function pathToBfGid(path: string): BfGid {
  // Convert absolute paths to bf://$RELATIVEPATH

  return toBfGid(path.replace(Deno.cwd(), "bf://"));
}

/**
 * Extracts the file path from a file:// scheme BfGid
 */
export function bfGidToPath(id: BfGid): string {
  return id.toString();
}
