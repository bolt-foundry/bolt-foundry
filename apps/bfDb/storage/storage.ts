import {
  bfCloseConnection,
  bfDeleteItem,
  bfGetItem,
  bfPutItem,
  bfQueryItemsUnified as bfQueryItems,
  type DbItem,
  type Props,
} from "apps/bfDb/bfDb.ts";
import type { BfGid } from "apps/bfDb/classes/BfNodeIds.ts";
import type { BfMetadataNode } from "apps/bfDb/coreModels/BfNode.ts";
import type { BfMetadataEdge } from "apps/bfDb/coreModels/BfEdge.ts";

export const storage = {
  async initialize() {},

  get<T extends Props>(bfOid: BfGid, bfGid: BfGid) {
    return bfGetItem<T>(bfOid, bfGid);
  },

  async put<T extends Props, M extends BfMetadataNode | BfMetadataEdge>(
    props: T,
    metadata: M,
  ) {
    await bfPutItem(props, metadata);
  },

  query<T extends Props>(
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
