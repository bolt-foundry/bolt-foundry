// =================================================
// Map‑backed adapter that fulfils DatabaseBackend / IBackendAdapter contract.
// All methods are **sync implementations** that _return_ `Promise.resolve(...)`.
// Added verbose debug‐level logging so tests & devs can trace behaviour.
// =================================================
import type {
  BfDbMetadata,
  DatabaseBackend,
} from "@bfmono/apps/bfDb/backend/DatabaseBackend.ts";
import type { DbItem, Props } from "@bfmono/apps/bfDb/bfDb.ts";
import type { BfEdgeMetadata } from "@bfmono/apps/bfDb/classes/BfNode.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

// Utility to stringify args only when logger is at debug/trace level
function dbg(obj: unknown) {
  try {
    return JSON.stringify(obj);
  } catch (_) {
    return String(obj);
  }
}

type StorageRow<TProps extends Props = Props> = DbItem<TProps>;

export class InMemoryAdapter implements DatabaseBackend {
  private store = new Map<string, StorageRow>();

  // ---- lifecycle ---------------------------------------------------------
  initialize(): Promise<void> {
    logger.debug(
      "InMemoryAdapter.initialize – clearing store (size %d)",
      this.store.size,
    );
    this.store.clear();
    return Promise.resolve();
  }

  close(): Promise<void> {
    logger.debug(
      "InMemoryAdapter.close – clearing store (size %d)",
      this.store.size,
    );
    this.store.clear();
    return Promise.resolve();
  }

  // ---- helpers -----------------------------------------------------------
  private rowMatches<TProps extends Props>(
    row: StorageRow<TProps>,
    meta: Partial<BfDbMetadata>,
    props?: Partial<TProps>,
  ): boolean {
    for (const [k, v] of Object.entries(meta)) {
      if (row.metadata[k as keyof BfDbMetadata] !== v) return false;
    }
    if (props) {
      for (const [k, v] of Object.entries(props)) {
        if (row.props[k as keyof TProps] !== v) return false;
      }
    }
    return true;
  }

  // ---- CRUD --------------------------------------------------------------
  getItem<TProps extends Props = Props>(
    bfOid: string,
    bfGid: string,
  ): Promise<DbItem<TProps> | null> {
    logger.debug("InMemoryAdapter.getItem(%s, %s)", bfOid, bfGid);
    const row = this.store.get(bfGid) as StorageRow<TProps> | undefined;
    const result = row && row.metadata.bfOid === bfOid ? row : null;
    logger.debug(" → %s", dbg(result));
    return Promise.resolve(result);
  }

  getItemByBfGid<TProps extends Props = Props>(
    bfGid: string,
  ): Promise<DbItem<TProps> | null> {
    logger.debug("InMemoryAdapter.getItemByBfGid(%s)", bfGid);
    const res = (this.store.get(bfGid) as StorageRow<TProps> | undefined) ??
      null;
    logger.debug(" → %s", dbg(res));
    return Promise.resolve(res);
  }

  getItemsByBfGid<TProps extends Props = Props>(
    bfGids: Array<string>,
  ): Promise<Array<DbItem<TProps>>> {
    logger.debug("InMemoryAdapter.getItemsByBfGid(%s)", dbg(bfGids));
    const rows = bfGids
      .map((id) => this.store.get(id) as StorageRow<TProps> | undefined)
      .filter(Boolean) as Array<StorageRow<TProps>>;
    logger.debug(" → %d rows", rows.length);
    return Promise.resolve(rows);
  }

  putItem<TProps extends Props>(
    itemProps: TProps,
    itemMetadata: BfDbMetadata,
  ): Promise<void> {
    logger.debug(
      "InMemoryAdapter.putItem meta=%s props=%s",
      dbg(itemMetadata),
      dbg(itemProps),
    );
    this.store.set(itemMetadata.bfGid, {
      props: itemProps,
      metadata: itemMetadata,
    });
    return Promise.resolve();
  }

  deleteItem(_bfOid: string, bfGid: string): Promise<void> {
    logger.debug("InMemoryAdapter.deleteItem(%s)", bfGid);
    this.store.delete(bfGid);
    return Promise.resolve();
  }

  queryItems<TProps extends Props = Props>(
    metadataToQuery: Partial<BfDbMetadata>,
    propsToQuery: Partial<TProps> = {},
    bfGids?: Array<string>,
  ): Promise<Array<DbItem<TProps>>> {
    logger.debug(
      "InMemoryAdapter.queryItems meta=%s props=%s ids=%s",
      dbg(metadataToQuery),
      dbg(propsToQuery),
      dbg(bfGids),
    );
    let rows = Array.from(this.store.values()) as Array<StorageRow<TProps>>;
    if (bfGids?.length) {
      rows = rows.filter((r) => bfGids.includes(r.metadata.bfGid));
    }
    const result = rows.filter((r) =>
      this.rowMatches(r, metadataToQuery, propsToQuery)
    );
    logger.debug(" → %d rows", result.length);
    return Promise.resolve(result);
  }

  // Shallow aliases for interface completeness ----------------------------
  queryItemsWithSizeLimit = this.queryItems;

  queryAncestorsByClassName<TProps extends Props = Props>(
    bfOid: string,
    targetBfGid: string,
    sourceBfClassName: string,
    depth: number = 10,
  ): Promise<Array<DbItem<TProps>>> {
    const results: Array<DbItem<TProps>> = [];
    const processed = new Set<string>();

    // Find direct ancestors
    let currentTargets = [targetBfGid];
    let currentDepth = 0;

    while (currentDepth < depth && currentTargets.length > 0) {
      const nextTargets: Array<string> = [];

      for (const currentTarget of currentTargets) {
        // Find edges where current target is the target (bf_tid)
        const edges = Array.from(this.store.values()).filter((row) =>
          row.metadata.bfOid === bfOid &&
          "bfTid" in row.metadata &&
          (row.metadata as BfEdgeMetadata).bfTid === currentTarget
        );

        // Get the source nodes from these edges
        for (const edge of edges) {
          const sourceBfGid = (edge.metadata as BfEdgeMetadata).bfSid;
          const edgeSourceClassName =
            (edge.metadata as BfEdgeMetadata).bfSClassName;

          if (!processed.has(sourceBfGid)) {
            // Add to next targets for recursive search regardless of class
            nextTargets.push(sourceBfGid);
            processed.add(sourceBfGid);

            // If this source matches our target class, add to results
            if (edgeSourceClassName === sourceBfClassName) {
              // Find the actual source node
              const sourceNode = this.store.get(sourceBfGid);
              if (
                sourceNode &&
                sourceNode.metadata.className === sourceBfClassName
              ) {
                results.push(sourceNode as DbItem<TProps>);
              }
            }
          }
        }
      }

      currentTargets = nextTargets;
      currentDepth++;
    }

    return Promise.resolve(results);
  }

  queryDescendantsByClassName<TProps extends Props = Props>(
    bfOid: string,
    sourceBfGid: string,
    targetBfClassName: string,
    depth: number = 10,
  ): Promise<Array<DbItem<TProps>>> {
    const results: Array<DbItem<TProps>> = [];
    const processed = new Set<string>();

    // Find direct descendants
    let currentSources = [sourceBfGid];
    let currentDepth = 0;

    while (currentDepth < depth && currentSources.length > 0) {
      const nextSources: Array<string> = [];

      for (const currentSource of currentSources) {
        // Find edges where current source is the source (bf_sid)
        const edges = Array.from(this.store.values()).filter((row) =>
          row.metadata.bfOid === bfOid &&
          "bfSid" in row.metadata &&
          (row.metadata as BfEdgeMetadata).bfSid === currentSource
        );

        // Get the target nodes from these edges
        for (const edge of edges) {
          const targetBfGid = (edge.metadata as BfEdgeMetadata).bfTid;
          const edgeTargetClassName =
            (edge.metadata as BfEdgeMetadata).bfTClassName;

          if (!processed.has(targetBfGid)) {
            // Add to next sources for recursive search regardless of class
            nextSources.push(targetBfGid);
            processed.add(targetBfGid);

            // If this target matches our target class, add to results
            if (edgeTargetClassName === targetBfClassName) {
              // Find the actual target node
              const targetNode = this.store.get(targetBfGid);
              if (
                targetNode &&
                targetNode.metadata.className === targetBfClassName
              ) {
                results.push(targetNode as DbItem<TProps>);
              }
            }
          }
        }
      }

      currentSources = nextSources;
      currentDepth++;
    }

    return Promise.resolve(results);
  }
}
