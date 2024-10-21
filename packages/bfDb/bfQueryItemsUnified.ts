import {
  DbItem,
  defaultClause,
  logger,
  Props,
  Row,
  sql,
  VALID_METADATA_COLUMN_NAMES,
} from "./bfDb";
import type { BfBaseModelMetadata } from "./classes/BfBaseModelMetadata";

export async function bfQueryItemsUnified<
  TProps = Props,
  TMetadata extends BfBaseModelMetadata = BfBaseModelMetadata,
>(
  metadataToQuery: Partial<TMetadata>,
  propsToQuery: Partial<TProps> = {},
  bfGids?: Array<string>,
  orderDirection: "ASC" | "DESC" = "ASC",
  orderBy: keyof Row = "sort_value",
  options: {
    useSizeLimit?: boolean;
    cursorValue?: number | string;
    maxSizeBytes?: number;
    batchSize?: number;
    totalLimit?: number;
    countOnly?: boolean;
  } = {},
): Promise<Array<DbItem<TProps, BfBaseModelMetadata>>> {
  const {
    useSizeLimit = false,
    cursorValue,
    maxSizeBytes = 10 * 1024 * 1024, // 10MB in bytes
    batchSize = 4,
    totalLimit,
    countOnly = false,
  } = options;

  logger.debug({
    metadataToQuery,
    propsToQuery,
    bfGids,
    orderDirection,
    orderBy,
    useSizeLimit,
    cursorValue,
    maxSizeBytes,
    batchSize,
  });

  const metadataConditions: string[] = [];
  const propsConditions: string[] = [];
  const specificIdConditions: string[] = [];
  const variables: unknown[] = [];

  // Process metadata conditions
  for (const [originalKey, value] of Object.entries(metadataToQuery)) {
    const key = originalKey.replace(/([a-z])([A-Z])/g, "$1_$2").replace(
      /([A-Z])(?=[A-Z])/g,
      "$1_",
    ).toLowerCase();
    if (VALID_METADATA_COLUMN_NAMES.includes(key)) {
      variables.push(value);
      metadataConditions.push(`${key} = $${variables.length}`);
    } else {
      logger.warn(`Invalid metadata column name`, originalKey, key);
    }
  }

  // Process props conditions
  for (const [key, value] of Object.entries(propsToQuery)) {
    variables.push(key);
    variables.push(value);
    propsConditions.push(
      `props->>$${variables.length - 1} = $${variables.length}`,
    );
  }

  // Process bfGids
  if (bfGids && bfGids.length > 0) {
    const bfGidConditions = bfGids.map((bfGid) => {
      variables.push(bfGid);
      return `bf_gid = $${variables.length}`;
    });
    specificIdConditions.push(`(${bfGidConditions.join(" OR ")})`);
  }

  if (metadataConditions.length === 0) metadataConditions.push(defaultClause);
  if (propsConditions.length === 0) propsConditions.push(defaultClause);
  if (specificIdConditions.length === 0) {
    specificIdConditions.push(defaultClause);
  }

  if (countOnly) {
    const allConditions = [
      ...metadataConditions,
      ...propsConditions,
      ...specificIdConditions,
    ].filter(Boolean).join(" AND ");
    const query = await sql(
      `SELECT COUNT(*) FROM bfdb WHERE ${allConditions}`,
      variables,
    );
    return parseInt(query[0].count);
  }

  const buildQuery = (offset: number) => {
    const allConditions = [
      ...metadataConditions,
      ...propsConditions,
      ...specificIdConditions,
    ].filter(Boolean).join(" AND ");

    return `
      SELECT *
      FROM bfdb
      WHERE ${allConditions}
      ORDER BY ${orderBy} ${orderDirection}
      LIMIT ${batchSize} OFFSET ${offset}
    `;
  };

  const allItems: Array<DbItem<TProps, BfBaseModelMetadata>> = [];
  let offset = 0;
  let totalSize = 0;
  let itemCount = 0;

  while (true) {
    const query = buildQuery(offset);
    try {
      logger.debug("Executing query", query, variables);
      const rows = await sql(query, variables) as Row<TProps>[];

      if (rows.length === 0) break; // No more results

      for (const row of rows) {
        if (totalLimit && itemCount >= totalLimit) {
          return allItems; // Exit if we've reached the total limit
        }
        const item = {
          props: row.props,
          metadata: {
            bfGid: row.bf_gid,
            bfSid: row.bf_sid,
            bfOid: row.bf_oid,
            bfTid: row.bf_tid,
            bfCid: row.bf_cid,
            bfTClassName: row.bf_t_class_name,
            bfSClassName: row.bf_s_class_name,
            className: row.class_name,
            createdAt: new Date(row.created_at),
            lastUpdated: new Date(row.last_updated),
            sortValue: row.sort_value,
          },
        };

        if (useSizeLimit) {
          const itemSize = JSON.stringify(item).length;
          if (totalSize + itemSize > maxSizeBytes) return allItems;
          totalSize += itemSize;
        }

        allItems.push(item);
        itemCount++;
      }

      offset += batchSize;

      if (rows.length < batchSize) break; // Last batch
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  return allItems;
}
