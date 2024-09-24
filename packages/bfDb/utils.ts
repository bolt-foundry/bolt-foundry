import { IBfCurrentViewerInternalAdminOmni } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { BfOrganization } from "packages/bfDb/models/BfOrganization.ts";
import { BfPerson } from "packages/bfDb/models/BfPerson.ts";
import { toBfGid, toBfOid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { getLogger } from "deps.ts";
import { neon } from "@neon/serverless";
import { BfDbError } from "packages/bfDb/classes/BfDbError.ts";

const logger = getLogger(import.meta);

export const BF_INTERNAL_ORG_NAME = "bf_internal_org";

const databaseUrl = Deno.env.get("BFDB_URL");
if (!databaseUrl) {
  throw new BfDbError("BFDB_URL is not set");
}
const sql = neon(databaseUrl);

export async function upsertBfDb() {
  await sql`
  CREATE TABLE IF NOT EXISTS bfDb (
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
    await sql(`CREATE INDEX IF NOT EXISTS idx_${index} ON bfDb(${index})`);
  }
  logger.info("Indexes upserted", indexes);

  const omniCv = IBfCurrentViewerInternalAdminOmni.__DANGEROUS__create(
    import.meta,
  );
  logger.info("Checking for omni account");
  if (!(await BfPerson.find(omniCv, toBfGid("omni_person")))) {
    logger.info("Creating omni person");
    await BfPerson.__DANGEROUS__createUnattached(omniCv, {
      name: "Omni user",
    }, { bfGid: toBfGid("omni_person"), bfOid: toBfOid("omni_person") });
  }
  logger.info("Checking for internal org");
  if (!(await BfOrganization.find(omniCv, toBfOid(BF_INTERNAL_ORG_NAME)))) {
    logger.info("Creating internal org");
    await BfOrganization.__DANGEROUS__createUnattached(omniCv, {
      name: "Bolt Foundry internal",
      domainName: "boltfoundry.com",
    }, {
      bfGid: toBfGid(BF_INTERNAL_ORG_NAME),
      bfOid: toBfOid(BF_INTERNAL_ORG_NAME),
    });
  }
  logger.info("Schema, indexes, and orgs upserted");
}

const CONFIRMATION_STRING =
  "I KNOW THIS IS GOING TO DESTROY EVERYTHING AND I WANT TO DO THAT";
export async function __DANGEROUSLY_DESTROY_THE_DATABASE__(
  confirmation: string,
) {
  if (confirmation !== CONFIRMATION_STRING) {
    throw new BfDbError("You must confirm the deletion of the database");
  }
  await sql`DROP TABLE IF EXISTS bfDb`;
  logger.warn("Database destroyed");
}

export async function cleanModels(modelNames: Array<string>, dryRun = true) {
  if (dryRun) {
    logger.warn("Dry run of cleaning models.")
  }
  const classNames = modelNames.map(name => `'${name}'`).join(', ');
  const [{count}] = await sql`
  WITH class_names AS (
    SELECT unnest(ARRAY[${classNames}]) AS name
  )
  SELECT COUNT(*) FROM bfdb
  WHERE class_name IN (SELECT name FROM class_names)
   OR bf_s_class_name IN (SELECT name FROM class_names)
   OR bf_t_class_name IN (SELECT name FROM class_names);
   `;

  logger.warn(`Removing ${modelNames.join(", ")} model classes from ${count} nodes and edges`)
  if (dryRun) {
    logger.warn("Skipping remove, dry run only.")
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

  logger.warn(`Removed ${modelNames.join(", ")} model classes from nodes and edges`)

}
