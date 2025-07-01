// import { IBfCurrentViewerInternalAdminOmni } from "apps/bfDb/classes/BfCurrentViewer.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { neon } from "@neondatabase/serverless";
import { BfErrorDb } from "@bfmono/apps/bfDb/classes/BfErrorDb.ts";
import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";

const logger = getLogger(import.meta);

export const BF_INTERNAL_ORG_NAME = "bf_internal_org";

export async function upsertBfDb() {
  const databaseUrl = getConfigurationVariable("DATABASE_URL") ??
    getConfigurationVariable("DATABASE_URL");
  if (!databaseUrl) {
    throw new BfErrorDb("DATABASE_URL is not set");
  }
  const sql = neon(databaseUrl);
  await sql`
  CREATE TABLE IF NOT EXISTS bfdb (
    class_name VARCHAR(255),
    bf_gid VARCHAR(255) PRIMARY KEY,
    last_updated TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    bf_oid VARCHAR(255) NOT NULL,
    bf_cid VARCHAR(255) NOT NULL,
    bf_s_class_name VARCHAR(255),
    bf_sid VARCHAR(255),
    bf_t_class_name VARCHAR(255),
    bf_tid VARCHAR(255),
    sort_value BIGINT NOT NULL,
    props JSONB NOT NULL
  );
  `;
  await sql`
  CREATE OR REPLACE FUNCTION notify_item_change() RETURNS TRIGGER AS $$
  BEGIN
    PERFORM pg_notify(
      'item_changes',
      json_build_object(
        'operation', TG_OP,
        'bf_gid', NEW.bf_gid,
        'bf_oid', NEW.bf_oid,
        'bf_sid', NEW.bf_sid,
        'bf_tid', NEW.bf_tid,
        'bf_s_class_name', NEW.bf_s_class_name,
        'bf_t_class_name', NEW.bf_t_class_name,
        'sort_value', NEW.sort_value
      )::text
    );
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
  `;
  await sql`
  CREATE TRIGGER item_change_trigger
  AFTER INSERT OR UPDATE OR DELETE ON bfdb
  FOR EACH ROW EXECUTE FUNCTION notify_item_change();
  `;
  logger.info("Schema upserted");
  const indexes = [
    "sort_value",
    "bf_gid",
    "bf_oid",
    "bf_cid",
    "bf_s_class_name",
    "bf_sid",
    "bf_t_class_name",
    "bf_tid",
    "class_name",
  ];
  for (const index of indexes) {
    await sql(`CREATE INDEX IF NOT EXISTS idx_${index} ON bfdb(${index})`);
  }
  logger.info("Indexes upserted", indexes);

  // const omniCv = IBfCurrentViewerInternalAdminOmni.__DANGEROUS__create(
  //   import.meta,
  // );
  // logger.info("Checking for omni account");
  // const { BfPerson } = await import("apps/bfDb/models/BfPerson.ts");
  // if (!(await BfPerson.find(omniCv, toBfGid("omni_person")))) {
  //   logger.info("Creating omni person");
  //   await BfPerson.__DANGEROUS__createUnattached(omniCv, {
  //     name: "Omni user",
  //   }, { bfGid: toBfGid("omni_person"), bfOid: toBfOid("omni_person") });
  // }
  // logger.info("Checking for internal org");
  // const { BfOrganization } = await import(
  //   "apps/bfDb/models/BfOrganization.ts"
  // );
  // if (!(await BfOrganization.find(omniCv, toBfOid(BF_INTERNAL_ORG_NAME)))) {
  //   logger.info("Creating internal org");
  //   await BfOrganization.__DANGEROUS__createUnattached(omniCv, {
  //     name: "Bolt Foundry internal",
  //     domainName: "contentfoundry.com",
  //   }, {
  //     bfGid: toBfGid(BF_INTERNAL_ORG_NAME),
  //     bfOid: toBfOid(BF_INTERNAL_ORG_NAME),
  //   });
  // }
  // logger.info("Schema, indexes, and orgs upserted");
}

const CONFIRMATION_STRING =
  "I KNOW THIS IS GOING TO DESTROY EVERYTHING AND I WANT TO DO THAT";
export async function __DANGEROUSLY_DESTROY_THE_DATABASE__(
  confirmation: string,
) {
  const databaseUrl = getConfigurationVariable("DATABASE_URL") ??
    getConfigurationVariable("DATABASE_URL");
  if (!databaseUrl) {
    throw new BfErrorDb("DATABASE_URL is not set");
  }
  const sql = neon(databaseUrl);
  if (confirmation !== CONFIRMATION_STRING) {
    throw new BfErrorDb("You must confirm the deletion of the database");
  }
  await sql`DROP TABLE IF EXISTS bfdb`;
  logger.warn("Database destroyed");
}

export async function cleanModels(modelNames: Array<string>, dryRun = true) {
  const databaseUrl = getConfigurationVariable("DATABASE_URL") ??
    getConfigurationVariable("DATABASE_URL");
  if (!databaseUrl) {
    throw new BfErrorDb("DATABASE_URL is not set");
  }
  const sql = neon(databaseUrl);
  if (dryRun) {
    logger.warn("Dry run of cleaning models.");
  }
  const classNames = modelNames.map((name) => `'${name}'`).join(", ");
  const [{ count }] = await sql`
  WITH class_names AS (
    SELECT unnest(ARRAY[${classNames}]) AS name
  )
  SELECT COUNT(*) FROM bfdb
  WHERE class_name IN (SELECT name FROM class_names)
   OR bf_s_class_name IN (SELECT name FROM class_names)
   OR bf_t_class_name IN (SELECT name FROM class_names);
   `;

  logger.warn(
    `Removing ${classNames} model classes from ${count} nodes and edges`,
  );
  if (dryRun) {
    logger.warn("Skipping remove, dry run only.");
    return;
  }
  await sql`
  WITH class_names AS (
    SELECT unnest(ARRAY[${classNames}]) AS name
  )
  DELETE FROM bfdb
  WHERE class_name IN (SELECT name FROM class_names)
   OR bf_s_class_name IN (SELECT name FROM class_names)
   OR bf_t_class_name IN (SELECT name FROM class_names);
  `;

  logger.warn(
    `Removed ${classNames} model classes from nodes and edges`,
  );
}

export async function cleanModelsExcept(
  modelNames = ["BfPerson", "BfAccount", "BfOrganization", "BfGoogleAuth"],
) {
  const dryRun = false;
  const databaseUrl = getConfigurationVariable("DATABASE_URL") ??
    getConfigurationVariable("DATABASE_URL");
  if (!databaseUrl) {
    throw new BfErrorDb("DATABASE_URL is not set");
  }

  const sql = neon(databaseUrl);

  if (dryRun) {
    logger.warn("Dry run of cleaning all models except specified ones.");
  }

  // Pass modelNames as a parameterized array directly
  const rows = await sql`
  WITH class_names AS (
    SELECT unnest(${modelNames}::text[]) AS name
  )
  SELECT * FROM bfdb
  WHERE class_name NOT IN (SELECT name FROM class_names)
    AND bf_t_class_name NOT IN (SELECT name FROM class_names);
  `;

  logger.warn(
    `Removing all model classes except ${
      modelNames.map((n) => `'${n}'`).join(", ")
    } from ${rows.length} nodes and edges from database ${
      databaseUrl.split("@")[1]
    }`,
  );

  if (dryRun) {
    logger.warn("Skipping remove, dry run only. Would have removed", rows);
    return;
  }

  await sql`
  WITH class_names AS (
    SELECT unnest(${modelNames}::text[]) AS name
  )
  DELETE FROM bfdb
  WHERE class_name NOT IN (SELECT name FROM class_names)
    AND bf_t_class_name NOT IN (SELECT name FROM class_names);
  `;

  logger.warn(
    `Removed all model classes except ${
      modelNames.map((n) => `'${n}'`).join(", ")
    } from nodes and edges`,
  );
}
