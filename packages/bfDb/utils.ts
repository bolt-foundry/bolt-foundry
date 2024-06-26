import { BfCurrentViewerOmni } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { BfOrganization } from "packages/bfDb/models/BfOrganization.ts";
import { BfPerson } from "packages/bfDb/models/BfPerson.ts";
import { toBfGid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { getLogger } from "deps.ts";
import { neon } from "@neon/serverless";
import { BfDbError } from "packages/bfDb/classes/BfDbError.ts";

const logger = getLogger(import.meta);

const databaseUrl = Deno.env.get("BFDB_URL");
if (!databaseUrl) {
  throw new BfDbError("BFDB_URL is not set");
}
const sql = neon(databaseUrl);

export async function upsertBfDb() {
  const schemaUrl = new URL(import.meta.resolve("packages/bfDb/schema.sql"));
  logger.info(`Checking schema at ${schemaUrl.href}`);
  const sqlText = await Deno.readTextFile(schemaUrl);
  await sql(sqlText);

  // #TODO: Add indexes for columns probably when queries are slow

  logger.info("Schema upserted");
  const omniCv = BfCurrentViewerOmni.__DANGEROUS__create(import.meta);
  logger.info("Checking for omni account");
  if (!(await BfPerson.find(omniCv, toBfGid("omni_person")))) {
    logger.info("Creating omni person");
    await BfPerson.create(omniCv, {
      name: "Omni user",
    }, { bfGid: toBfGid("omni_person") });
  }
  logger.info("Checking for internal org");
  if (!(await BfOrganization.find(omniCv, toBfGid("bf_internal_org")))) {
    logger.info("Creating internal org");
    await BfOrganization.create(omniCv, {
      name: "Bolt Foundry internal",
      domainName: "boltfoundry.com",
    }, {
      bfGid: toBfGid("bf_internal_org"),
    });
  }
  logger.info("Schema and orgs upserted");
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
