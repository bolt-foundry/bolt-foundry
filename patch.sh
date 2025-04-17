#!/usr/bin/env bash
# scripts/add-storage-facade.sh
set -euo pipefail

echo "▶  Creating storage façade…"
mkdir -p apps/bfDb/storage

cat > apps/bfDb/storage/storage.ts <<'TS'
// Temporary façade that forwards to the existing bfDb helpers.
// Swap this out for a real adapter later.

import {
  bfGetItem,
  bfPutItem,
  bfQueryItemsUnified as bfQueryItems,
  bfDeleteItem,
  bfCloseConnection,
  type Props,
  type DbItem,
} from "apps/bfDb/bfDb.ts";
import type { BfGid } from "apps/bfDb/classes/BfNodeIds.ts";

export const storage = {
  async initialize() {},

  async get<T extends Props>(bfOid: BfGid, bfGid: BfGid) {
    return bfGetItem<T>(bfOid, bfGid);
  },

  async put<T extends Props>(props: T, metadata: Record<string, unknown>) {
    await bfPutItem(props, metadata);
  },

  async query<T extends Props>(
    metadata: Record<string, unknown>,
    props: Partial<T> = {},
    bfGids?: BfGid[],
    order: "ASC" | "DESC" = "ASC",
    orderBy: string | null = null,
    options: Record<string, unknown> = {},
  ): Promise<DbItem<T>[]> {
    // deno‑lint‑ignore no-explicit-any
    // @ts-ignore — keep legacy signature intact for now
    return bfQueryItems(metadata, props, bfGids, order, orderBy, options);
  },

  async delete(bfOid: BfGid, bfGid: BfGid) {
    await bfDeleteItem(bfOid, bfGid);
  },

  async close() {
    await bfCloseConnection();
  },
} as const;
TS

echo "▶  Patching BfNode.ts to use the façade…"
sed -i '
  s#import { bfGetItem, bfPutItem, bfQueryItemsUnified } from "apps/bfDb/bfDb.ts"#import { storage } from "apps/bfDb/storage/storage.ts"#;
  s/bfGetItem(/storage.get(/g;
  s/bfPutItem(/storage.put(/g;
  s/bfQueryItemsUnified(/storage.query(/g;
' apps/bfDb/coreModels/BfNode.ts

echo "✅  storage.ts created and BfNode.ts updated."
echo "Run your tests to confirm everything still passes:"
echo "    deno task test"
