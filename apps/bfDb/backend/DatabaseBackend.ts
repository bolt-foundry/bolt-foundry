import type { BfGid } from "@bfmono/lib/types.ts";
import type {
  BfEdgeMetadata,
  BfNodeMetadata,
} from "@bfmono/apps/bfDb/classes/BfNode.ts";
import type { DbItem, Props } from "@bfmono/apps/bfDb/bfDb.ts";

export type BfDbMetadata = BfNodeMetadata & Partial<BfEdgeMetadata>;

export interface DatabaseBackend {
  initialize(): Promise<void>;
  getItem<TProps extends Props = Props>(
    bfOid: BfGid,
    bfGid: BfGid,
  ): Promise<DbItem<TProps> | null>;
  getItemByBfGid<TProps extends Props = Props>(
    bfGid: string,
    className?: string,
  ): Promise<DbItem<TProps> | null>;
  getItemsByBfGid<TProps extends Props = Props>(
    bfGids: Array<string>,
    className?: string,
  ): Promise<Array<DbItem<TProps>>>;
  putItem<TProps extends Props = Props>(
    itemProps: TProps,
    itemMetadata: BfNodeMetadata | BfEdgeMetadata,
    sortValue?: number,
  ): Promise<void>;
  queryItems<TProps extends Props = Props>(
    metadataToQuery: Partial<BfNodeMetadata | BfEdgeMetadata>,
    propsToQuery?: Partial<TProps>,
    bfGids?: Array<string>,
    orderDirection?: "ASC" | "DESC",
    orderBy?: string,
  ): Promise<Array<DbItem<TProps>>>;
  queryItemsWithSizeLimit<TProps extends Props = Props>(
    metadataToQuery: Partial<BfNodeMetadata | BfEdgeMetadata>,
    propsToQuery?: Partial<TProps>,
    bfGids?: Array<string>,
    orderDirection?: "ASC" | "DESC",
    orderBy?: string,
    cursorValue?: number | string,
    maxSizeBytes?: number,
    batchSize?: number,
  ): Promise<Array<DbItem<TProps>>>;
  queryAncestorsByClassName<TProps extends Props = Props>(
    bfOid: string,
    targetBfGid: string,
    sourceBfClassName: string,
    depth?: number,
  ): Promise<Array<DbItem<TProps>>>;
  queryDescendantsByClassName<TProps extends Props = Props>(
    bfOid: string,
    sourceBfGid: string,
    targetBfClassName: string,
    depth?: number,
  ): Promise<Array<DbItem<TProps>>>;
  deleteItem(bfOid: BfGid, bfGid: BfGid): Promise<void>;
  close(): Promise<void>;
}
