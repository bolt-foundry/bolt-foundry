// In packages/bfDb/utils/pathUtils.ts

import { type BfGid, toBfGid } from "packages/bfDb/classes/BfNodeIds.ts";
import { fromFileUrl} from "@std/path";

/**
 * Converts a file path to a BfGid with file:// scheme
 * Automatically handles relative paths by converting to absolute
 */
export function pathToBfGid(path: string): BfGid {
  // Convert relative paths to absolute paths
  return toBfGid(path);
}

/**
 * Extracts the file path from a file:// scheme BfGid
 */
export function bfGidToPath(id: BfGid): string {
  return id.toString();
}