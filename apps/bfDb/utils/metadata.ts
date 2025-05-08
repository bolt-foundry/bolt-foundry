import { generateUUID } from "lib/generateUUID.ts";
import type { BfEdgeMetadata, BfMetadata } from "apps/bfDb/classes/BfNode.ts";
import type { CurrentViewer } from "apps/bfDb/classes/CurrentViewer.ts";
import type { BfGid } from "lib/types.ts";

/** Generate base node metadata */
export function generateNodeMetadata<T extends BfMetadata>(
  cv: CurrentViewer,
  className: string,
  partial: Partial<T> = {},
): T {
  return {
    bfGid: generateUUID() as BfGid,
    bfOid: cv.orgBfOid,
    className,
    sortValue: Date.now(),
    ...(partial as object),
  } as T;
}

/** Generate base edge metadata (node + source/target fields) */
export function generateEdgeMetadata<T extends BfEdgeMetadata>(
  cv: CurrentViewer,
  source: { metadata: { bfGid: string; className: string } },
  target: { metadata: { bfGid: string; className: string } },
  partial: Partial<T> = {},
): T {
  return {
    ...generateNodeMetadata(cv, "BfEdgeBase", partial),
    bfSid: source.metadata.bfGid,
    bfSClassName: source.metadata.className,
    bfTid: target.metadata.bfGid,
    bfTClassName: target.metadata.className,
  } as T;
}
