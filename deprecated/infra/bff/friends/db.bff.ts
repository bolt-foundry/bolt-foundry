#! /usr/bin/env -S bff

import { register } from "@bfmono/infra/bff/bff.ts";
import {
  __DANGEROUSLY_DESTROY_THE_DATABASE__,
  cleanModelsExcept,
  upsertBfDb,
} from "@bfmono/apps/bfDb/bfDbUtils.ts";
import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";

export async function dbReset(): Promise<number> {
  if (getConfigurationVariable("BF_ENV") === "DEVELOPMENT") {
    await __DANGEROUSLY_DESTROY_THE_DATABASE__(
      "I KNOW THIS IS GOING TO DESTROY EVERYTHING AND I WANT TO DO THAT",
    );
    await upsertBfDb();
    return 0;
  }
  return 1337;
}

export async function dbClean(): Promise<number> {
  await cleanModelsExcept();
  return 0;
}

register("db:reset", "Resets the db, but only in development mode", dbReset);
register(
  "db:clean",
  "Deletes edges and nodes except for the default ones",
  dbClean,
);
