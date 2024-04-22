import { neon } from "@neon/serverless";
import {
  BfBaseModelMetadata,
} from "packages/bfDb/classes/BfBaseModelMetadata.ts";
import {
  BfGid,
  BfOid,
  BfPid,
  BfPk,
  BfSk,
  BfSortValue,
} from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { getLogger } from "deps.ts";
import { BfModelErrorNotFound } from "packages/bfDb/classes/BfModelError.ts";
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
// const pool = new postgres.Pool(databaseUrl, DB_POOL_MAX_CONNECTIONS, true);

async function checkSchema() {
  const schemaUrl = new URL(import.meta.resolve("packages/bfDb/schema.sql"));
  const sqlText = await Deno.readTextFile(schemaUrl);
  // Execute table creation separately
  await sql(sqlText);
  // Index checks and creation
  const indexCheckAndCreateStatements = [
    {
      check: `SELECT to_regclass('public.idx_bfdb_pk');`,
      create: `CREATE INDEX IF NOT EXISTS idx_bfdb_pk ON bfdb (PK);`,
    },
    {
      check: `SELECT to_regclass('public.idx_bfdb_sk');`,
      create: `CREATE INDEX IF NOT EXISTS idx_bfdb_sk ON bfdb (SK);`,
    },
  ];

  for (const { check, create } of indexCheckAndCreateStatements) {
    const rows = await sql(check);
    if (!rows[0].to_regclass) {
      logger.debug(`Creating index: ${create}`);
      await sql(create);
    } else {
      logger.debug(`Index already exists, skipping creation.`);
    }
  }
}

await checkSchema();

type Props = Record<string, unknown>;
type Row<
  TProps = Props,
> = {
  props: TProps;
  bf_gid: BfGid;
  bf_pid: BfPid;
  bf_oid: BfOid;
  sort_value: BfSortValue;
  class_name: string;
  created_at: string;
  last_updated: string;
};

export async function bfGetItem<
  TProps = Props,
  TMetadata extends BfBaseModelMetadata = BfBaseModelMetadata,
>(pk: BfPk, sk: BfSk): Promise<DbItem<TProps, TMetadata>> {
  try {
    logger.info("bfGetItem", { pk, sk });
    const rows =
      await sql`SELECT * FROM bfdb WHERE PK = ${pk} AND SK = ${sk}` as Row<
        TProps
      >[];

    if (rows.length === 0) {
      throw new BfModelErrorNotFound();
    }
    const firstRow = rows[0];
    const props: TProps = firstRow.props; // Assuming attributes stores the props
    // Extract metadata from the row, excluding props and parse attributes as needed
    logger.debug(firstRow);
    const metadata: TMetadata = {
      bfGid: firstRow.bf_gid,
      bfPid: firstRow.bf_pid,
      bfOid: firstRow.bf_oid,
      className: firstRow.class_name,
      createdAt: new Date(firstRow.created_at), // Convert timestamp to Date object
      lastUpdated: new Date(firstRow.last_updated), // Convert timestamp to Date object
      sortValue: firstRow.sort_value,
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
>(bfGid: string, className?: string): Promise<DbItem<TProps, TMetadata>> {
  try {
    logger.info("bfGetItemByBfGid", { bfGid, className });
    let queryPromise;
    if (className) {
      queryPromise =
        sql`SELECT * FROM bfdb WHERE bf_gid = ${bfGid} AND class_name = ${className}`;
    } else {
      queryPromise = sql`SELECT * FROM bfdb WHERE bf_gid = ${bfGid}`;
    }
    const rows = await queryPromise as Row<TProps>[];
    if (rows.length === 0) {
      throw new BfModelErrorNotFound();
    }
    const firstRow = rows[0];
    const props = firstRow.props;
    logger.info(props);
    // Extract metadata from the row, excluding props and parse attributes as needed
    const metadata: TMetadata = {
      bfGid: firstRow.bf_gid,
      bfPid: firstRow.bf_pid,
      bfOid: firstRow.bf_oid,
      className: firstRow.class_name,
      createdAt: new Date(firstRow.created_at), // Convert timestamp to Date object
      lastUpdated: new Date(firstRow.last_updated), // Convert timestamp to Date object
      sortValue: firstRow.sort_value,
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
  pk: BfPk,
  sk: BfSk,
  itemProps: TProps,
  itemMetadata: TMetadata,
): Promise<void> {
  logger.debug("bfPutItem", { pk, sk, itemProps, itemMetadata });
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

    await sql`INSERT INTO bfdb(bf_gid, PK, SK, props, bf_pid, bf_oid, sort_value, class_name, created_at, last_updated)
                     VALUES(${itemMetadata.bfGid}, ${pk}, ${sk}, ${
      JSON.stringify(itemProps)
    }, ${itemMetadata.bfPid || null}, ${itemMetadata.bfOid || null}, ${
      itemMetadata.sortValue || null
    }, ${itemMetadata.className}, ${createdAtTimestamp}, ${lastUpdatedTimestamp})
                     ON CONFLICT (bf_gid) DO UPDATE SET
                       PK = EXCLUDED.PK,
                       SK = EXCLUDED.SK,
                       props = EXCLUDED.props,
                       bf_pid = EXCLUDED.bf_pid,
                       bf_oid = EXCLUDED.bf_oid,
                       sort_value = EXCLUDED.sort_value,
                       class_name = EXCLUDED.class_name,
                       created_at = EXCLUDED.created_at,
                       last_updated = CURRENT_TIMESTAMP;`;
    logger.info("bfPutItem: Item inserted/updated successfully.");
  } catch (e) {
    logger.error("Error in bfPutItem:", e);
    throw e;
  }
}

export async function bfQueryItems<
  TProps = Props,
  TMetadata extends BfBaseModelMetadata = BfBaseModelMetadata,
>(
  pk: BfPk,
  sk: BfSk,
  limit = 100,
  exclusiveStartKey?: string, // Assuming exclusiveStartKey is a string representation
): Promise<Array<DbItem<TProps, TMetadata>>> {
  logger.debug("bfQueryItems", { pk, sk, limit, exclusiveStartKey });
  try {
    const rows =
      await sql`SELECT * FROM bfdb WHERE PK = ${pk} AND SK LIKE ${sk} || '%' ORDER BY SK LIMIT ${limit}` as Row<
        TProps
      >[];
    const items = rows.map((row) => ({
      props: row.props,
      metadata: {
        bfGid: row.bf_gid,
        bfPid: row.bf_pid,
        bfOid: row.bf_oid,
        className: row.class_name,
        createdAt: new Date(row.created_at), // Convert timestamp to Date object
        lastUpdated: new Date(row.last_updated), // Convert timestamp to Date object
        sortValue: row.sort_value,
      } as TMetadata,
    })) as Array<DbItem<TProps, TMetadata>>;
    return items;
  } catch (e) {
    logger.error(e);
    throw e;
  }
}
