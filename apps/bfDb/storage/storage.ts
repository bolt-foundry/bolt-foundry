// apps/bfDb/storage/storage.ts
// ---------------------------------------------------------------------------
// Unified storage façade that delegates **all** operations to the active
// backend adapter retrieved from `AdapterRegistry`.  A default adapter is
// auto‑registered (via `registerDefaultAdapter`) if nothing is present.
// ---------------------------------------------------------------------------

import { AdapterRegistry } from "./AdapterRegistry.ts";
import { registerDefaultAdapter } from "./registerDefaultAdapter.ts";

import type { BfGid } from "apps/bfDb/classes/BfNodeIds.ts";
import type { DbItem, Props } from "apps/bfDb/bfDb.ts";
import type { BfMetadataNode } from "apps/bfDb/coreModels/BfNode.ts";
import type { BfMetadataEdge } from "apps/bfDb/coreModels/BfEdge.ts";

/**
 * Ensures an adapter is available and returns it.
 * `registerDefaultAdapter()` is idempotent and fast, so calling on every
 * access keeps the API simple while retaining testability.
 */
function adapter() {
  registerDefaultAdapter();
  return AdapterRegistry.get();
}

export const storage = {
  // ---- lifecycle -------------------------------------------------------
  initialize() {
    return Promise.resolve(adapter().initialize());
  },

  close() {
    return Promise.resolve(adapter().close());
  },

  // ---- CRUD ------------------------------------------------------------
  get<T extends Props>(bfOid: BfGid, bfGid: BfGid) {
    return adapter().getItem<T>(bfOid, bfGid);
  },

  async put<T extends Props, M extends BfMetadataNode | BfMetadataEdge>(
    props: T,
    metadata: M,
  ) {
    await adapter().putItem<T>(props, metadata);
  },

  query<T extends Props>(
    metadata: Record<string, unknown>,
    props: Partial<T> = {},
    bfGids?: BfGid[],
    order: "ASC" | "DESC" = "ASC",
    orderBy?: string,
    // legacy `options` arg retained for backward‑compat but ignored here
    _options: Record<string, unknown> = {},
  ): Promise<DbItem<T>[]> {
    // Current DatabaseBackend interface ignores order/orderBy; we pass them so
    // the signature is future‑proof once those params are respected.
    return adapter().queryItems<T>(
      metadata,
      props,
      bfGids?.map(String),
      order,
      orderBy,
    );
  },

  async delete(bfOid: BfGid, bfGid: BfGid) {
    await adapter().deleteItem(bfOid, bfGid);
  },
} as const;
