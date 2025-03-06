// In packages/bfDb/utils/pathUtils.ts

import { type BfGid, toBfGid } from "packages/bfDb/classes/BfNodeIds.ts";
import { toFileUrl, fromFileUrl, join } from "@std/path";

/**
 * Converts a file path to a BfGid with file:// scheme
 * Automatically handles relative paths by converting to absolute
 */
export function pathToBfGid(path: string): BfGid {
  // Convert relative paths to absolute paths
  const absolutePath = path.startsWith("/") ? path : join(Deno.cwd(), path);
  const url = toFileUrl(absolutePath).href;
  return toBfGid(url);
}

/**
 * Extracts the file path from a file:// scheme BfGid
 */
export function bfGidToPath(id: BfGid): string {
  return fromFileUrl(id.toString());
}