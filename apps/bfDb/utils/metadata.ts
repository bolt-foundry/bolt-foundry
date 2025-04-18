import { toBfGid } from "apps/bfDb/classes/BfNodeIds.ts";
import { generateUUID } from "lib/generateUUID.ts";
import type { BfCurrentViewer } from "apps/bfDb/classes/BfCurrentViewer.ts";
import type { BfMetadataBase } from "apps/bfDb/classes/BfNodeBase.ts";
import type { BfMetadataEdgeBase } from "apps/bfDb/classes/BfEdgeBase.ts";

/** Generate base node metadata */
export function generateNodeMetadata<T extends BfMetadataBase>(
  cv: BfCurrentViewer,
  className: string,
  partial: Partial<T> = {},
): T {
  return {
    bfGid: toBfGid(generateUUID()),
    bfOid: cv.bfOid,
    className,
    sortValue: Date.now(),
    ...(partial as object),
  } as T;
}

/** Generate base edge metadata (node + source/target fields) */
export function generateEdgeMetadata<T extends BfMetadataEdgeBase>(
  cv: BfCurrentViewer,
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
