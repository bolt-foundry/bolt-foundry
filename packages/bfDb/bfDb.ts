import { neon } from "@neon/serverless";
import type {
  ConnectionArguments,
  ConnectionInterface,
  EdgeInterface,
  PageInfoInterface,
} from "relay-runtime"; // Ensure this is correctly imported
import {
  BfBaseModelMetadata,
} from "packages/bfDb/classes/BfBaseModelMetadata.ts";
import {
  BfAnyid,
  BfCid,
  BfGid,
  BfOid,
  BfSid,
  BfTid,
} from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { getLogger } from "deps.ts";
import { BfDbError } from "packages/bfDb/classes/BfDbError.ts";

const logger = getLogger(import.meta);

type DbItem<T, TMetadata extends BfBaseModelMetadata> = {
  props: T;
  metadata: TMetadata;
};
const databaseUrl = Deno.env.get("BFDB_URL");
if (!databaseUrl) {
  throw new BfDbError("BFDB_URL is not set");
}
const sql = neon(databaseUrl);

type Props = Record<string, unknown>;
type Row<
  TProps = Props,
> = {
  props: TProps;
  bf_gid: BfGid;
  bf_sid: BfSid;
  bf_oid: BfOid;
  bf_tid: BfTid;
  bf_cid: BfCid;
  class_name: string;
  created_at: string;
  last_updated: string;
  sort_value: number;
};

export async function bfGetItem<
  TProps = Props,
  TMetadata extends BfBaseModelMetadata = BfBaseModelMetadata,
>(bfOid: BfOid, bfGid: BfAnyid): Promise<DbItem<TProps, TMetadata> | null> {
  try {
    logger.trace("bfGetItem", bfOid, bfGid);
    const rows =
      await sql`SELECT * FROM bfdb WHERE bf_oid = ${bfOid} AND bf_gid = ${bfGid}` as Row<
        TProps
      >[];

    if (rows.length === 0) {
      return null;
    }
    const firstRow = rows[0];
    const props: TProps = firstRow.props; // Assuming attributes stores the props
    // Extract metadata from the row, excluding props and parse attributes as needed
    logger.trace(firstRow);
    const metadata: TMetadata = {
      bfGid: firstRow.bf_gid,
      bfSid: firstRow.bf_sid,
      bfTid: firstRow.bf_tid,
      bfOid: firstRow.bf_oid,
      bfCid: firstRow.bf_cid,
      className: firstRow.class_name,
      createdAt: new Date(firstRow.created_at), // Convert timestamp to Date object
      lastUpdated: new Date(firstRow.last_updated), // Convert timestamp to Date object
    } as TMetadata;

    return { props, metadata };
  } catch (e) {
    logger.error(e);
    throw e;
  }
}

export async function bfGetItemByBfGid<
  TProps = Props,
  TMetadata extends BfBaseModelMetadata = BfBaseModelMetadata,
>(
  bfGid: string,
  className?: string,
): Promise<DbItem<TProps, TMetadata> | null> {
  try {
    logger.trace("bfGetItemByBfGid", { bfGid, className });
    let queryPromise;
    if (className) {
      queryPromise =
        sql`SELECT * FROM bfdb WHERE bf_gid = ${bfGid} AND class_name = ${className}`;
    } else {
      queryPromise = sql`SELECT * FROM bfdb WHERE bf_gid = ${bfGid}`;
    }
    const rows = await queryPromise as Row<TProps>[];
    if (rows.length === 0) {
      return null;
    }
    const firstRow = rows[0];
    const props = firstRow.props;
    logger.trace(props);
    // Extract metadata from the row, excluding props and parse attributes as needed
    const metadata: TMetadata = {
      bfGid: firstRow.bf_gid,
      bfSid: firstRow.bf_sid,
      bfOid: firstRow.bf_oid,
      bfCid: firstRow.bf_cid,
      bfTid: firstRow.bf_tid,
      className: firstRow.class_name,
      createdAt: new Date(firstRow.created_at), // Convert timestamp to Date object
      lastUpdated: new Date(firstRow.last_updated), // Convert timestamp to Date object
    } as TMetadata;
    return { props: props as TProps, metadata };
  } catch (e) {
    logger.error(e);
    throw e;
  }
}

export async function bfPutItem<
  TProps = Props,
  TMetadata extends BfBaseModelMetadata = BfBaseModelMetadata,
>(
  itemProps: TProps,
  itemMetadata: TMetadata,
): Promise<void> {
  logger.trace({ itemProps, itemMetadata });

  const sortValue = Date.now(); // Set the sort_value as the current timestamp in milliseconds

  try {
    let createdAtTimestamp, lastUpdatedTimestamp;

    if (itemMetadata.createdAt instanceof Date) {
      createdAtTimestamp = itemMetadata.createdAt.toISOString();
    } else if (typeof itemMetadata.createdAt === "number") {
      createdAtTimestamp = new Date(itemMetadata.createdAt).toISOString();
    }

    if (itemMetadata.lastUpdated instanceof Date) {
      lastUpdatedTimestamp = itemMetadata.lastUpdated.toISOString();
    } else if (typeof itemMetadata.lastUpdated === "number") {
      lastUpdatedTimestamp = new Date(itemMetadata.lastUpdated).toISOString();
    }

    // Insert or Update with conditional sort_value
    await sql`
    INSERT INTO bfdb(bf_gid, bf_oid, bf_cid, bf_sid, bf_tid, class_name, created_at, last_updated, props, sort_value)
    VALUES(${itemMetadata.bfGid}, ${itemMetadata.bfOid}, ${itemMetadata.bfCid}, ${
      itemMetadata.bfSid || null
    }, ${itemMetadata.bfTid}, ${itemMetadata.className}, ${createdAtTimestamp}, ${lastUpdatedTimestamp}, ${
      JSON.stringify(itemProps)
    }, ${sortValue}) 
    ON CONFLICT (bf_gid) DO UPDATE SET
      bf_oid = EXCLUDED.bf_oid,
      bf_cid = EXCLUDED.bf_cid,
      bf_sid = EXCLUDED.bf_sid,
      bf_tid = EXCLUDED.bf_tid,
      class_name = EXCLUDED.class_name,
      created_at = EXCLUDED.created_at,
      last_updated = CURRENT_TIMESTAMP,
      props = EXCLUDED.props,
      sort_value = CASE WHEN bfdb.created_at IS NULL THEN EXCLUDED.sort_value ELSE bfdb.sort_value END;`; // Update sort_value only if it's a new record

    logger.trace(
      `bfPutItem: Successfully inserted or updated item with ${
        JSON.stringify(itemMetadata)
      }`,
    );
  } catch (e) {
    logger.error("Error in bfPutItem:", e);
    logger.trace(e);
    throw e;
  }
}

const VALID_METADATA_COLUMN_NAMES = [
  "bf_gid",
  "bf_oid",
  "bf_cid",
  "bf_sid",
  "bf_tid",
  "class_name",
  "sort_value",
];

export async function bfQueryItems<
  TProps = Props,
  TMetadata extends BfBaseModelMetadata = BfBaseModelMetadata,
>(
  metadataToQuery: Partial<TMetadata>,
  propsToQuery: Partial<TProps> = {},
  orderDirection: "ASC" | "DESC" = "ASC", // Default to ascending order
  orderBy: keyof Row = "sort_value", // Default to sort by sort_value
): Promise<Array<DbItem<TProps, BfBaseModelMetadata>>> {
  logger.trace({ metadataToQuery, propsToQuery, orderBy, orderDirection });
  const metadataConditions: string[] = [];
  const propsConditions: string[] = [];
  const variables = [];

  for (const [originalKey, value] of Object.entries(metadataToQuery)) {
    // convert key from camelCase to snake_case
    const key = originalKey.replace(/([a-z])([A-Z])/g, "$1_$2" as const);
    if (VALID_METADATA_COLUMN_NAMES.includes(key.toLowerCase())) {
      variables.push(value);
      const valuePosition = variables.length;
      metadataConditions.push(`${key} = $${valuePosition}`);
    }
  }

  for (const [key, value] of Object.entries(propsToQuery)) {
    variables.push(key);
    const keyPosition = variables.length;
    variables.push(value);
    const valuePosition = variables.length;
    propsConditions.push(`props->>$${keyPosition} = $${valuePosition}`);
  }

  const allConditions = [...metadataConditions, ...propsConditions].filter(Boolean).join(" AND ");
  const queryConditions = allConditions ? allConditions : "1=1";
  const query =
    `SELECT * FROM bfdb WHERE ${queryConditions} ORDER BY ${orderBy} ${orderDirection}`;

  try {
    logger.trace("Executing query", query, variables);
    const rows = await sql(query, variables) as Row<TProps>[];
    const items = rows.map((row) => ({
      props: row.props,
      metadata: {
        bfGid: row.bf_gid,
        bfSid: row.bf_sid,
        bfOid: row.bf_oid,
        bfTid: row.bf_tid,
        bfCid: row.bf_cid,
        className: row.class_name,
        createdAt: new Date(row.created_at), // Convert timestamp to Date object
        lastUpdated: new Date(row.last_updated), // Convert timestamp to Date object
        sortValue: row.sort_value,
      },
    }));
    return items;
  } catch (e) {
    logger.error(e);
    throw e;
  }
}

export async function bfQueryItemsForGraphQLConnection<
  TProps = Props,
  TMetadata extends BfBaseModelMetadata = BfBaseModelMetadata,
>(
  metadata: Partial<TMetadata>,
  props: Partial<TProps> = {},
  connectionArgs: ConnectionArguments,
): Promise<ConnectionInterface<DbItem<TProps, TMetadata>>> {
  logger.trace({ metadata, props, connectionArgs });
  const { first, after, last, before } = connectionArgs;
  const metadataConditions: string[] = [];
  const propsConditions: string[] = [];
  const variables: unknown[] = [];
  let limitClause = "";
  let orderClause = "ORDER BY sort_value ASC";
  let cursorCondition = "";

  if (first !== undefined || last !== undefined) {
    // Handle forward pagination
    if (first !== undefined) {
      limitClause = `LIMIT ${first + 1}`; // Fetch one extra for next page check
      if (after) {
        const afterSortValue = cursorToSortValue(after);
        cursorCondition = `AND sort_value > ${afterSortValue}`;
      }
    } else if (last !== undefined) {
      // Handle backward pagination
      limitClause = `LIMIT ${last + 1}`; // Fetch one extra for previous page check
      orderClause = "ORDER BY sort_value DESC";
      if (before) {
        const beforeSortValue = cursorToSortValue(before);
        cursorCondition = `AND sort_value < ${beforeSortValue}`;
      }
    }
  }
  for (const [originalKey, value] of Object.entries(metadata)) {
    // convert key from camelCase to snake_case
    const key = originalKey.replace(/([a-z])([A-Z])/g, "$1_$2" as const);
    if (VALID_METADATA_COLUMN_NAMES.includes(key.toLowerCase())) {
      variables.push(value);
      const valuePosition = variables.length;
      metadataConditions.push(`${key} = $${valuePosition}`);
    }
  }
  for (const [_, value] of Object.entries(props)) {
    variables.push(value);
    const valuePosition = variables.length;
    propsConditions.push(`props->>$${valuePosition} = $${variables.length}`);
  }
  const allConditions = [...metadataConditions, ...propsConditions, cursorCondition].filter(Boolean).join(" AND ");
  const queryConditions = allConditions ? allConditions : "1=1";
  const query = `SELECT * FROM bfdb WHERE ${queryConditions} ${orderClause} ${limitClause}`;

  try {
    logger.trace("Executing query", query, variables);
    const rows = await sql(query, variables) as Row<TProps>[];
    // Reverse rows if performing backward pagination to maintain correct order
    if (orderClause === "ORDER BY sort_value DESC") {
      rows.reverse();
    }
    const edges: EdgeInterface<DbItem<TProps, TMetadata>>[] = rows.map(
      (row) => {
        const cursor = sortValueToCursor(row.sort_value);
        return {
          cursor,
          node: {
            props: row.props,
            metadata: {
              bfGid: row.bf_gid,
              bfSid: row.bf_sid,
              bfOid: row.bf_oid,
              bfTid: row.bf_tid,
              bfCid: row.bf_cid,
              className: row.class_name,
              createdAt: new Date(row.created_at),
              lastUpdated: new Date(row.last_updated),
              sortValue: row.sort_value,
            },
          },
        };
      },
    );
    const pageInfo: PageInfoInterface = {
      startCursor: edges.length > 0 ? edges[0].cursor : null,
      endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
      hasNextPage: edges.length > first,
      hasPreviousPage: !!before && edges.length > last,
    };
    // Adjust edges to remove the extra fetched row for pagination.
    if (first !== undefined && edges.length > first) {
      edges.pop();
    } else if (last !== undefined && edges.length > last) {
      edges.shift();
    }
    const totalCount = await sql`SELECT COUNT(*) FROM bfdb WHERE ${queryConditions}`;
    return {
      edges,
      pageInfo,
      totalCount: parseInt(totalCount[0].count, 10),
    };
  } catch (e) {
    logger.error(e);
    throw e;
  }
}

function sortValueToCursor(sortValue: number): string {
  return Buffer.from(sortValue.toString()).toString("base64");
}
function cursorToSortValue(cursor: string): number {
  return parseInt(Buffer.from(cursor, "base64").toString("ascii"), 10);
}
